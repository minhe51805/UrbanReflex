"""
Author: Trần Tuấn Anh
Created at: 2025-11-27
Updated at: 2025-12-01
Description: NLP classifier for CitizenReport entities using vector embeddings.
             Supports both vector embeddings (primary) and rule-based (fallback).
             Optimized for Vietnamese text processing with PhoBERT-based embeddings.
"""

import logging
from typing import Dict, Optional, Any, List

from app.ai_service.classifier_report.ai_config import (
    get_category_descriptions,
    get_priority_keywords,
    get_priority_defaults,
    get_model_config,
    get_thresholds
)

# Configure logging
logger = logging.getLogger(__name__)

# Try to import sentence-transformers (optional, for vector embeddings)
try:
    from sentence_transformers import SentenceTransformer
    import numpy as np
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except (ImportError, RuntimeError, Exception) as e:
    # Catch all exceptions (ImportError, RuntimeError from torchvision, etc.)
    SENTENCE_TRANSFORMERS_AVAILABLE = False
    np = None  # Placeholder for type hints
    logger.warning(f"sentence-transformers not available: {str(e)}")


class VectorClassifier:
    """Vector embeddings-based classifier using sentence transformers."""
    
    def __init__(self):
        self.model: Optional[Any] = None
        self.category_embeddings: Optional[Dict[str, Any]] = None
        self._initialized = False
        self._fallback_model = None
    
    def _ensure_initialized(self):
        """Lazy load model and pre-compute category embeddings."""
        if self._initialized:
            return
        
        if not SENTENCE_TRANSFORMERS_AVAILABLE:
            raise ImportError(
                "sentence-transformers not available. "
                "Install with: pip install sentence-transformers torch"
            )
        
        try:
            # Load model configuration
            model_config = get_model_config()
            model_name = model_config["name"]
            cache_dir = model_config.get("cache_dir")
            
            # Try to load the primary Vietnamese model
            try:
                logger.info(f"Loading Vietnamese model: {model_name}")
                self.model = SentenceTransformer(
                    model_name,
                    cache_folder=cache_dir
                )
                logger.info("Successfully loaded Vietnamese model")
            except Exception as e:
                # Fallback to multilingual model if Vietnamese model fails
                logger.warning(f"Failed to load Vietnamese model: {str(e)}")
                fallback_model = model_config.get("fallback", "paraphrase-multilingual-MiniLM-L12-v2")
                logger.info(f"Loading fallback model: {fallback_model}")
                self.model = SentenceTransformer(
                    fallback_model,
                    cache_folder=cache_dir
                )
                self._fallback_model = True
                logger.info("Successfully loaded fallback model")
            
            # Pre-compute category embeddings
            self.category_embeddings = self._compute_category_embeddings()
            self._initialized = True
            
        except Exception as e:
            logger.error(f"Failed to initialize VectorClassifier: {str(e)}")
            raise
    
    def _compute_category_embeddings(self) -> Dict[str, Any]:
        """Pre-compute embeddings for all categories."""
        descriptions = get_category_descriptions()
        embeddings = {}
        
        try:
            for category, description in descriptions.items():
                # Add Vietnamese-specific preprocessing for better embeddings
                processed_desc = self._preprocess_vietnamese_text(description)
                embedding = self.model.encode(processed_desc, normalize_embeddings=True)
                embeddings[category] = embedding
                logger.debug(f"Computed embedding for category: {category}")
            
            logger.info(f"Successfully computed embeddings for {len(embeddings)} categories")
            return embeddings
        except Exception as e:
            logger.error(f"Failed to compute category embeddings: {str(e)}")
            raise
    
    def _preprocess_vietnamese_text(self, text: str) -> str:
        """
        Preprocess Vietnamese text for better embedding results.
        
        Args:
            text: Input text to preprocess
            
        Returns:
            Preprocessed text
        """
        # Basic Vietnamese text preprocessing
        # Normalize common Vietnamese text issues
        text = text.strip()
        
        # Add context-specific terms for better classification
        context_terms = {
            "báo cáo", "vấn đề", "thông báo", "yêu cầu", "phản ánh"
        }
        
        # If text is short, add context
        if len(text.split()) < 5:
            text = f"báo cáo về {text}"
        
        return text
    
    def classify_report(self, title: str, description: str) -> Dict[str, any]:
        """
        Classify report using vector embeddings.
        
        Args:
            title: Report title
            description: Report description
            
        Returns:
            Dictionary with 'category' and 'confidence' keys
        """
        try:
            self._ensure_initialized()
            
            # Combine title and description
            text = f"{title} {description}".strip()
            
            if not text:
                logger.warning("Empty text provided for classification")
                return {"category": "unknown", "confidence": 0.0}
            
            # Preprocess text for Vietnamese
            processed_text = self._preprocess_vietnamese_text(text)
            
            # Embed report text
            report_embedding = self.model.encode(processed_text, normalize_embeddings=True)
            
            # Compute cosine similarity with each category
            similarities = {}
            for category, cat_embedding in self.category_embeddings.items():
                # Cosine similarity = dot product (since embeddings are normalized)
                similarity = float(np.dot(report_embedding, cat_embedding))
                similarities[category] = similarity
            
            # Get best match
            if not similarities:
                logger.warning("No similarities computed")
                return {"category": "unknown", "confidence": 0.0}
            
            best_category = max(similarities, key=similarities.get)
            confidence = similarities[best_category]
            
            # Check threshold
            thresholds = get_thresholds()
            min_confidence = thresholds.get("min_confidence", 0.6)
            
            # Adjust confidence based on model used
            if self._fallback_model:
                # Slightly lower threshold for fallback model
                min_confidence *= 0.9
            
            if confidence < min_confidence:
                logger.info(f"Low confidence ({confidence:.2f}) below threshold ({min_confidence:.2f})")
                return {"category": "unknown", "confidence": round(confidence, 2)}
            
            logger.info(f"Classified as '{best_category}' with confidence {confidence:.2f}")
            return {
                "category": best_category,
                "confidence": round(confidence, 2)
            }
            
        except Exception as e:
            logger.error(f"Error in classify_report: {str(e)}")
            return {"category": "unknown", "confidence": 0.0}


def classify_report_legacy(title: str, description: str) -> Dict[str, any]:
    """
    Legacy rule-based classification (fallback).
    
    Args:
        title: Report title
        description: Report description
        
    Returns:
        Dictionary with 'category' and 'confidence' keys
    """
    try:
        # Load category descriptions to get all categories
        categories = get_category_descriptions()
        
        # Create keyword mapping from config (for backward compatibility)
        # Note: This is a simplified version, actual keywords are in descriptions
        text_to_analyze = f"{title.lower()} {description.lower()}"
        
        scores = {category: 0 for category in categories}
        
        # Enhanced Vietnamese keyword matching
        category_keywords = {
            "streetlight_broken": ["đèn", "hỏng", "không sáng", "chập chờn", "tối", "chiếu sáng", "bóng đèn"],
            "waste_dump": ["rác", "bẩn", "ô nhiễm", "xả rác", "bốc mùi", "thải rác", "đống rác"],
            "road_damage": ["ổ gà", "đường hỏng", "sụt lún", "nứt", "hư hỏng", "mặt đường", "lún"],
            "flooding": ["ngập", "úng", "nước", "thoát nước", "ngập lụt", "đọng nước", "tràn"],
            "infrastructure_damage": ["nắp cống", "cống", "vỡ", "hở", "cáp", "dây điện", "hạ tầng"]
        }
        
        # Count keyword matches with weights
        for category, keywords in category_keywords.items():
            for keyword in keywords:
                if keyword in text_to_analyze:
                    # Weight exact matches higher
                    if text_to_analyze.count(keyword) > 1:
                        scores[category] += 1.5
                    else:
                        scores[category] += 1
        
        # Choose category with highest score
        if not any(scores.values()):
            logger.info("No keywords matched in legacy classification")
            return {"category": "unknown", "confidence": 0.0}
        
        best_category = max(scores, key=scores.get)
        total_keywords_found = scores[best_category]
        
        # Improved confidence calculation
        max_possible_score = max(len(keywords) for keywords in category_keywords.values())
        confidence = min(1.0, total_keywords_found / max_possible_score)
        
        logger.info(f"Legacy classification: {best_category} (confidence: {confidence:.2f})")
        return {"category": best_category, "confidence": round(confidence, 2)}
        
    except Exception as e:
        logger.error(f"Error in legacy classification: {str(e)}")
        return {"category": "unknown", "confidence": 0.0}


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
    try:
        # Try vector embeddings first
        if SENTENCE_TRANSFORMERS_AVAILABLE:
            try:
                classifier = VectorClassifier()
                result = classifier.classify_report(title, description)
                
                # Check if we should fallback to legacy
                thresholds = get_thresholds()
                if thresholds.get("fallback_to_legacy", True):
                    # If confidence is too low, try legacy
                    min_confidence = thresholds.get("min_confidence", 0.6)
                    if result["confidence"] < min_confidence:
                        logger.info(f"Vector confidence ({result['confidence']}) below threshold ({min_confidence}), trying legacy")
                        legacy_result = classify_report_legacy(title, description)
                        # Use legacy if it has higher confidence
                        if legacy_result["confidence"] > result["confidence"]:
                            logger.info("Using legacy classification result")
                            return legacy_result
                
                logger.info(f"Using vector classification: {result['category']} (confidence: {result['confidence']})")
                return result
                
            except Exception as e:
                logger.warning(f"Vector classification failed: {str(e)}, falling back to legacy")
                # Fallback to legacy on any error
                pass
        
        # Fallback to legacy rule-based
        logger.info("Using legacy rule-based classification")
        return classify_report_legacy(title, description)
        
    except Exception as e:
        logger.error(f"Error in classify_report: {str(e)}")
        return {"category": "unknown", "confidence": 0.0}


def determine_priority(category: str, description: str) -> str:
    """
    Determine priority based on category and keywords (from config).
    
    Args:
        category: Report category
        description: Report description
        
    Returns:
        Priority level: "high", "medium", or "low"
    """
    try:
        priority_keywords = get_priority_keywords()
        priority_defaults = get_priority_defaults()
        text = description.lower()
        
        # Check high priority keywords
        for keyword in priority_keywords["high"]:
            if keyword in text:
                logger.info(f"High priority keyword found: {keyword}")
                return "high"
        
        # Check medium priority keywords
        for keyword in priority_keywords["medium"]:
            if keyword in text:
                logger.info(f"Medium priority keyword found: {keyword}")
                return "medium"
        
        # Default priority by category (from config)
        default_priority = priority_defaults.get(category, "low")
        logger.info(f"Using default priority for {category}: {default_priority}")
        return default_priority
        
    except Exception as e:
        logger.error(f"Error determining priority: {str(e)}")
        return "low"
