from bson import ObjectId
from typing import Any, Dict


def serialize_doc(doc: Dict[str, Any]):
    """Convert MongoDB document to JSON-friendly dict.

    - Converts any ObjectId values to string.
    - Removes secrets like `hashed_password`.
    """
    if not doc:
        return None

    out = {}
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            out[k] = str(v)
        else:
            out[k] = v

    # Remove sensitive fields
    out.pop("hashed_password", None)
    return out
