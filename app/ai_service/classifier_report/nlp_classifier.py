"""
Author: Trần Tuấn Anh
Created at: 2025-11-27
Updated at: 2025-11-30
Description: NLP classifier for CitizenReport entities using vector embeddings.
             Supports both vector embeddings (primary) and rule-based (fallback).
"""

import sys
from pathlib import Path
from typing import Dict, Optional, Any

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Add project root to path for imports
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

from scripts.ai.ai_config import (
    get_category_descriptions,
    get_priority_keywords,
    get_priority_defaults,
    get_model_config,
    get_thresholds
)

# Try to import sentence-transformers (optional, for vector embeddings)
try:
    from sentence_transformers import SentenceTransformer
    import numpy as np
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except (ImportError, RuntimeError, Exception) as e:
    # Catch all exceptions (ImportError, RuntimeError from torchvision, etc.)
    SENTENCE_TRANSFORMERS_AVAILABLE = False
    np = None  # Placeholder for type hints


class VectorClassifier:
    """Vector embeddings-based classifier using sentence transformers."""
    
    def __init__(self):
        self.model: Optional[Any] = None
        self.category_embeddings: Optional[Dict[str, Any]] = None
        self._initialized = False
    
    def _ensure_initialized(self):
        """Lazy load model and pre-compute category embeddings."""
        if self._initialized:
            return
        
        if not SENTENCE_TRANSFORMERS_AVAILABLE:
            raise ImportError(
                "sentence-transformers not available. "
                "Install with: pip install sentence-transformers torch"
            )
        
        # Load model
        model_config = get_model_config()
        self.model = SentenceTransformer(
            model_config["name"],
            cache_folder=model_config.get("cache_dir")
        )
        
        # Pre-compute category embeddings
        self.category_embeddings = self._compute_category_embeddings()
        self._initialized = True
    
    def _compute_category_embeddings(self) -> Dict[str, Any]:
        """Pre-compute embeddings for all categories."""
        descriptions = get_category_descriptions()
        embeddings = {}
        
        for category, description in descriptions.items():
            embedding = self.model.encode(description, normalize_embeddings=True)
            embeddings[category] = embedding
        
        return embeddings
    
    def classify_report(self, title: str, description: str) -> Dict[str, any]:
        """
        Classify report using vector embeddings.
        
        Args:
            title: Report title
            description: Report description
            
        Returns:
            Dictionary with 'category' and 'confidence' keys
        """
        self._ensure_initialized()
        
        # Combine title and description
        text = f"{title} {description}".strip()
        
        if not text:
            return {"category": "unknown", "confidence": 0.0}
        
        # Embed report text
        report_embedding = self.model.encode(text, normalize_embeddings=True)
        
        # Compute cosine similarity with each category
        similarities = {}
        for category, cat_embedding in self.category_embeddings.items():
            # Cosine similarity = dot product (since embeddings are normalized)
            similarity = float(np.dot(report_embedding, cat_embedding))
            similarities[category] = similarity
        
        # Get best match
        if not similarities:
            return {"category": "unknown", "confidence": 0.0}
        
        best_category = max(similarities, key=similarities.get)
        confidence = similarities[best_category]
        
        # Check threshold
        thresholds = get_thresholds()
        min_confidence = thresholds.get("min_confidence", 0.6)
        
        if confidence < min_confidence:
            return {"category": "unknown", "confidence": round(confidence, 2)}
        
        return {
            "category": best_category,
            "confidence": round(confidence, 2)
        }


def classify_report_legacy(title: str, description: str) -> Dict[str, any]:
    """
    Legacy rule-based classification (fallback).
    
    Args:
        title: Report title
        description: Report description
        
    Returns:
        Dictionary with 'category' and 'confidence' keys
    """
    # Load category descriptions to get all categories
    categories = get_category_descriptions()
    
    # Create keyword mapping from config (for backward compatibility)
    # Note: This is a simplified version, actual keywords are in descriptions
    text_to_analyze = f"{title.lower()} {description.lower()}"
    
    scores = {category: 0 for category in categories}
    
    # Simple keyword matching (legacy approach)
    category_keywords = {
        "streetlight_broken": ["đèn", "hỏng", "không sáng", "chập chờn", "tối"],
        "waste_dump": ["rác", "bẩn", "ô nhiễm", "xả rác", "bốc mùi"],
        "road_damage": ["ổ gà", "đường hỏng", "sụt lún", "nứt", "hư hỏng"],
        "flooding": ["ngập", "úng", "nước", "thoát nước"],
        "infrastructure_damage": ["nắp cống", "cống", "vỡ", "hở", "cáp", "dây điện"]
    }
    
    for category, keywords in category_keywords.items():
        for keyword in keywords:
            if keyword in text_to_analyze:
                scores[category] += 1
    
    # Choose category with highest score
    if not any(scores.values()):
        return {"category": "unknown", "confidence": 0.0}
    
    best_category = max(scores, key=scores.get)
    total_keywords_found = scores[best_category]
    
    # Simple confidence calculation
    confidence = min(1.0, total_keywords_found / 3.0)
    
    return {"category": best_category, "confidence": round(confidence, 2)}


def classify_report(title: str, description: str) -> Dict[str, any]:
    """
    Main classification function with automatic fallback.
    
    Tries vector embeddings first, falls back to rule-based if:
    - sentence-transformers not available
    - Model initialization fails
    - Confidence below threshold
    
    Args:
        title: Report title
        description: Report description
        
    Returns:
        Dictionary with 'category' and 'confidence' keys
    """
    # Try vector embeddings first
    if SENTENCE_TRANSFORMERS_AVAILABLE:
        try:
            classifier = VectorClassifier()
            result = classifier.classify_report(title, description)
            
            # Check if we should fallback to legacy
            thresholds = get_thresholds()
            if thresholds.get("fallback_to_legacy", True):
                # If confidence is too low, try legacy
                if result["confidence"] < thresholds.get("min_confidence", 0.6):
                    legacy_result = classify_report_legacy(title, description)
                    # Use legacy if it has higher confidence
                    if legacy_result["confidence"] > result["confidence"]:
                        return legacy_result
            
            return result
        except Exception:
            # Fallback to legacy on any error
            pass
    
    # Fallback to legacy rule-based
    return classify_report_legacy(title, description)


def determine_priority(category: str, description: str) -> str:
    """
    Determine priority based on category and keywords (from config).
    
    Args:
        category: Report category
        description: Report description
        
    Returns:
        Priority level: "high", "medium", or "low"
    """
    priority_keywords = get_priority_keywords()
    priority_defaults = get_priority_defaults()
    text = description.lower()
    
    # Check high priority keywords
    for keyword in priority_keywords["high"]:
        if keyword in text:
            return "high"
    
    # Check medium priority keywords
    for keyword in priority_keywords["medium"]:
        if keyword in text:
            return "medium"
    
    # Default priority by category (from config)
    return priority_defaults.get(category, "low")
