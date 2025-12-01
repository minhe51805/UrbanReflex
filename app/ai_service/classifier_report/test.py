"""
Author: Trần Tuấn Anh
Created at: 2025-12-01
Updated at: 2025-12-01
Description: Main AI service to process CitizenReport entities.
"""

from app.ai_service.classifier_report.nlp_classifier import classify_report, determine_priority
from app.ai_service.classifier_report.prioritizer import check_poi_proximity

def process_report(report: dict) -> dict:
    """
    Processes a single CitizenReport entity through the AI pipeline.
    
    Args:
        report: The CitizenReport entity as a dictionary.
        
    Returns:
        A dictionary containing the enriched data to be patched to Orion-LD.
    """
    title = report.get("title", "")
    description = report.get("description", "")

    # 1. NLP Classification (with automatic fallback: vector embeddings → rule-based)
    classification = classify_report(title, description)
    category = classification["category"]
    category_confidence = classification["confidence"]

    # 2. NLP-based Priority
    nlp_priority = determine_priority(category, description)

    # 3. POI-based Priority (with weighted distance decay algorithm)
    location = report.get("location", {}).get("value")
    poi_check = check_poi_proximity(location, category)

    # 4. Determine Final Priority and Reason
    final_priority = nlp_priority
    reasons = []

    if nlp_priority == "high":
        reasons.append("High priority keywords found in description.")
    
    # Use new scoring system
    if poi_check["is_sensitive"]:
        poi_boost = poi_check["priority_boost"]
        poi_score = poi_check["score"]
        
        # Upgrade priority based on POI score
        if poi_boost == "high":
            final_priority = "high"
            reasons.append(f"{poi_check['reason']}")
        elif poi_boost == "medium" and final_priority == "low":
            final_priority = "medium"
            reasons.append(f"{poi_check['reason']}")
        elif poi_score > 0.3:  # Even if boost is "none", if score > 0.3, mention it
            reasons.append(f"Near sensitive area (score: {poi_score:.2f})")

    if not reasons:
        reasons.append("Default priority based on category.")

    # 5. Construct the update payload
    status_value = "auto_classified"
    if category == "unknown":
        status_value = "needs_manual_review"

    update_payload = {
        "category": {
            "type": "Property",
            "value": category,
            "metadata": {
                "confidence": {
                    "type": "Property",
                    "value": category_confidence
                }
            }
        },
        "priority": {
            "type": "Property",
            "value": final_priority
        },
        "autoPriorityReason": {
            "type": "Property",
            "value": " ".join(reasons)
        },
        "status": {
            "type": "Property",
            "value": status_value
        }
    }

    return update_payload