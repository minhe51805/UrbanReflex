"""
Author: Trần Tuấn Anh
Created at: 2025-11-27
Updated at: 2025-11-30
Description: Configuration loader for AI classifier modules.
"""

import json
from pathlib import Path
from typing import Dict, Any, List

# Path to config file (same directory)
CONFIG_FILE = Path(__file__).parent / "classifier_config.json"


def load_ai_config() -> Dict[str, Any]:
    """Loads AI classifier configuration from JSON file."""
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
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

