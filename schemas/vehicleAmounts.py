from pydantic import BaseModel

class vehicle_amounts_details(BaseModel):
    rateName:str = None
    vehicleCategory: str = None
    type: str = None
    category: str = None
    rate: float = None
    setTime: str = None
    status: int = None