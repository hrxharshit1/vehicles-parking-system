from pydantic import BaseModel
from typing import Optional


class category_details(BaseModel):
    place_id: int = None
    type: str = None
    description: Optional[str] = None
    limitCount: int = None
    status: int = None

class category_wise_slots(BaseModel):
    place_id: int = None
    floor_id: int = None
    category_id: int = None
    slotName: str = None
    slotID: int = None
    identity: str = None
    remarks: str = None
    status: int = None