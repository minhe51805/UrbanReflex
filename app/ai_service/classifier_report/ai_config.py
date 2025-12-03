"""
Author: Trần Tuấn Anh
Created at: 2025-11-27
Updated at: 2025-12-03
Description: Configuration loader for AI classifier modules.
"""

import json
from pathlib import Path
from typing import Dict, Any, List

# Path to config files (same directory)
CLASSIFIER_CONFIG_FILE = Path(__file__).parent / "classifier_config.json"
PRIORITIZER_CONFIG_FILE = Path(__file__).parent / "prioritizer_config.json"


def load_ai_config() -> Dict[str, Any]:
    """Loads AI classifier configuration from JSON file."""
    with open(CLASSIFIER_CONFIG_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def load_prioritizer_config() -> Dict[str, Any]:
    """Loads prioritizer configuration from JSON file."""
    with open(PRIORITIZER_CONFIG_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def get_category_descriptions() -> Dict[str, str]:
    """Returns category descriptions for vector embeddings."""
    config = load_ai_config()
    return {
        cat_id: cat_data["description"]
        for cat_id, cat_data in config["categories"].items()
    }


def get_priority_keywords() -> Dict[str, List[str]]:
    """Returns priority keywords for rule-based priority detection."""
    config = load_ai_config()
    return config["priority"]["keywords"]


def get_priority_defaults() -> Dict[str, str]:
    """Returns default priority by category."""
    config = load_ai_config()
    return config["priority"]["default_by_category"]


def get_model_config() -> Dict[str, str]:
    """Returns model configuration."""
    config = load_ai_config()
    return config["model"]


def get_thresholds() -> Dict[str, Any]:
    """Returns classification thresholds."""
    config = load_ai_config()
    return config["thresholds"]


# Prioritizer config functions
def get_category_weights() -> Dict[str, float]:
    """Returns category weights for POI prioritization."""
    config = load_prioritizer_config()
    return config["category_weights"]


def get_time_zones() -> Dict[str, Any]:
    """Returns time zones configuration."""
    config = load_prioritizer_config()
    return config["time_zones"]


def get_context_multipliers() -> Dict[str, float]:
    """Returns context multipliers (report_category+poi_category)."""
    config = load_prioritizer_config()
    return config["context_multipliers"]


def get_distance_decay_config() -> Dict[str, Any]:
    """Returns distance decay parameters."""
    config = load_prioritizer_config()
    return config["distance_decay"]


def get_priority_thresholds() -> Dict[str, float]:
    """Returns priority thresholds for scoring."""
    config = load_prioritizer_config()
    return config["priority_thresholds"]


def get_timezone() -> str:
    """Returns timezone for time-aware calculations."""
    config = load_prioritizer_config()
    return config.get("timezone", "Asia/Ho_Chi_Minh")
