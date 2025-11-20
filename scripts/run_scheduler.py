"""
Author: Hồ Viết Hiệp
Created at: 2025-11-19
Updated at: 2025-11-19
Description: APScheduler service that runs fetch → transform → seed pipelines
             for WeatherObserved and AirQualityObserved in Orion-LD.
"""

import logging
import subprocess
import sys
from datetime import datetime
from pathlib import Path

from apscheduler.schedulers.blocking import BlockingScheduler


BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

from scripts.seed_data import MODE_UPSERT  # noqa: E402

PYTHON_EXECUTABLE = sys.executable

# Interval cấu hình (phút)
WEATHER_INTERVAL_MIN = 15
AQI_INTERVAL_MIN = 60


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)


def run_step(step_name, command):
    """Execute single CLI step and log result."""
    logging.info("Bắt đầu bước [%s]: %s", step_name, " ".join(command))
    
    result = subprocess.run(
        command,
        cwd=BASE_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    if result.stdout:
        logging.info("[%s][stdout]\n%s", step_name, result.stdout.strip())
    
    if result.returncode != 0:
        logging.error(
            "[%s] thất bại (code=%s)\n%s",
            step_name,
            result.returncode,
            result.stderr.strip()
        )
        return False
    
    logging.info("[%s] hoàn thành", step_name)
    return True


def execute_pipeline(pipeline_name, steps):
    """Run sequential steps for a specific data pipeline."""
    logging.info("=== Pipeline %s bắt đầu ===", pipeline_name)
    start_time = datetime.utcnow()
    
    for step in steps:
        if not run_step(step["name"], step["command"]):
            logging.error("Pipeline %s dừng do lỗi ở bước %s", pipeline_name, step["name"])
            return
    
    duration = (datetime.utcnow() - start_time).total_seconds()
    logging.info("=== Pipeline %s hoàn tất trong %.1f giây ===", pipeline_name, duration)


def weather_pipeline():
    """WeatherObserved current + forecast (15 phút)."""
    steps = [
        {
            "name": "weather_fetch",
            "command": [PYTHON_EXECUTABLE, "scripts/fetch_weather_owm.py"]
        },
        {
            "name": "weather_transform",
            "command": [PYTHON_EXECUTABLE, "scripts/transform_weather.py"]
        },
        {
            "name": "weather_seed",
            "command": [
                PYTHON_EXECUTABLE,
                "scripts/seed_data.py",
                "--mode", MODE_UPSERT,
                "--types", "WeatherObserved"
            ]
        }
    ]
    execute_pipeline("WeatherObserved", steps)


def aqi_pipeline():
    """AirQualityObserved (60 phút)."""
    steps = [
        {
            "name": "aqi_fetch",
            "command": [PYTHON_EXECUTABLE, "scripts/fetch_aqi_openaq.py"]
        },
        {
            "name": "aqi_transform",
            "command": [PYTHON_EXECUTABLE, "scripts/transform_aqi.py"]
        },
        {
            "name": "aqi_seed",
            "command": [
                PYTHON_EXECUTABLE,
                "scripts/seed_data.py",
                "--mode", MODE_UPSERT,
                "--types", "AirQualityObserved"
            ]
        }
    ]
    execute_pipeline("AirQualityObserved", steps)


def main():
    logging.info("Khởi động APScheduler cho UrbanReflex")
    
    scheduler = BlockingScheduler()
    scheduler.add_job(weather_pipeline, "interval", minutes=WEATHER_INTERVAL_MIN, id="weather_pipeline")
    scheduler.add_job(aqi_pipeline, "interval", minutes=AQI_INTERVAL_MIN, id="aqi_pipeline")
    
    # Chạy ngay lần đầu để không phải chờ interval đầu tiên
    weather_pipeline()
    aqi_pipeline()
    
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        logging.info("Scheduler dừng lại.")


if __name__ == "__main__":
    main()

