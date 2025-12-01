"""
Author: Trần Tuấn Anh
Created at: 2025-12-01
Updated at: 2025-12-01
Description: Router for CitizenReport entities with AI classification and POI prioritization.
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status, Depends
import logging
import httpx

from app.ai_service.classifier_report.nlp_classifier import classify_report, determine_priority
from app.ai_service.classifier_report.prioritizer import check_poi_proximity

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/citizen-reports", tags=["citizen-reports"])

# Orion-LD configuration
ORION_LD_URL = "http://103.178.233.233:1026/ngsi-ld/v1"


@router.post("/classify/{entity_id}")
async def classify_citizen_report(
    entity_id: str
):
    """
    Classify and prioritize an existing CitizenReport entity.
    
    This endpoint:
    1. Receives an NGSI-LD entity ID
    2. Retrieves the entity data from Orion-LD
    3. Processes it through NLP classifier to determine category
    4. Applies POI-based priority adjustment
    5. Updates the entity with AI results via Orion-LD API
    6. Returns the updated entity
    
    Args:
        entity_id: The NGSI-LD entity ID to process
        
    Returns:
        Updated CitizenReport entity with AI classification
    """
    try:
        logger.info(f"Processing classification for entity: {entity_id}")
        
        # Step 1: Get existing entity from Orion-LD
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{ORION_LD_URL}/entities/{entity_id}",
                headers={"Accept": "application/ld+json"}
            )
            
            if response.status_code == 404:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"CitizenReport entity not found: {entity_id}"
                )
            elif response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to retrieve entity from Orion-LD: {response.text}"
                )
            
            entity = response.json()
        
        # Extract title and description from NGSI-LD structure
        title = entity.get("title", {}).get("value", "")
        description = entity.get("description", {}).get("value", "")
        
        if not title or not description:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Entity missing required title or description"
            )
        
        # Step 2: NLP Classification
        classification = classify_report(title, description)
        category = classification["category"]
        confidence = classification["confidence"]
        
        # Step 3: NLP Priority
        nlp_priority = determine_priority(category, description)
        
        # Step 4: POI-based Priority
        location = entity.get("location", {}).get("value", {})
        if location:
            poi_check = check_poi_proximity(location, category)
        else:
            poi_check = {"is_sensitive": False, "reason": "No location data"}
        
        # Step 5: Determine Final Priority and Severity
        final_priority = nlp_priority
        severity = "low" if final_priority == "low" else "medium" if final_priority == "medium" else "high"
        
        # Step 6: Prepare update data for Orion-LD
        now = datetime.utcnow()
        update_data = {
            "category": {
                "type": "Property",
                "value": category
            },
            "categoryConfidence": {
                "type": "Property",
                "value": confidence
            },
            "priority": {
                "type": "Property",
                "value": final_priority
            },
            "severity": {
                "type": "Property",
                "value": severity
            },
            "status": {
                "type": "Property",
                "value": "auto_classified"
            },
            "dateModified": {
                "type": "Property",
                "value": {
                    "@type": "DateTime",
                    "@value": now.isoformat() + "Z"
                }
            },
            "autoPriorityReason": {
                "type": "Property",
                "value": poi_check.get("reason", "NLP-based priority")
            },
            "aiProcessedAt": {
                "type": "Property",
                "value": {
                    "@type": "DateTime",
                    "@value": now.isoformat() + "Z"
                }
            },
            "aiConfidence": {
                "type": "Property",
                "value": confidence
            }
        }
        
        # Step 7: Update entity in Orion-LD
        async with httpx.AsyncClient() as client:
            response = await client.patch(
                f"{ORION_LD_URL}/entities/{entity_id}/attrs",
                json=update_data,
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            )
            
            if response.status_code != 204:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to update entity in Orion-LD: {response.text}"
                )
        
        logger.info(f"Successfully classified entity {entity_id}")
        logger.info(f"Category: {category} (confidence: {confidence})")
        logger.info(f"NLP Priority: {nlp_priority}")
        logger.info(f"POI Check: {poi_check}")
        logger.info(f"Final Priority: {final_priority}")
        
        # Step 8: Get updated entity from Orion-LD
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{ORION_LD_URL}/entities/{entity_id}",
                headers={"Accept": "application/ld+json"}
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to retrieve updated entity: {response.text}"
                )
            
            updated_entity = response.json()
        
        return updated_entity
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error classifying citizen report: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to classify citizen report: {str(e)}"
        )