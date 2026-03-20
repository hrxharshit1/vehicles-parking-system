from pydantic import BaseModel
from datetime import date

class club_details(BaseModel):
    clubName: str = None
    vehicleNumber: int = None
    storeNumber: int = None
    vehicleType: int = None
    cronJobDate: date = None
    cronJobStatus: int = None

class club_transaction_details(BaseModel):
    club_id: int = None
    transaction_id: int = None
    amount: float = None
    gracePeriod: int = None
    cronJobDate: date = None
    cronJobStatus: int = None
    