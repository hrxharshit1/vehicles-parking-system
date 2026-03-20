from pydantic import BaseModel
from typing import Optional
  
class place_details(BaseModel):
    placeName: str = None
    description: Optional[str] = None
    status: int = None

class floor_details(BaseModel):
    place_id: int = None
    floorName: str = None
    floorLevel: int = None
    remarks: str = None
    status: int = None
        
class migration_details(BaseModel):
    migration: str = None
    batch: int = None        