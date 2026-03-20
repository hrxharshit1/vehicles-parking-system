from pydantic import BaseModel
from datetime import date


class tariff_details(BaseModel):
    place_id: int = None
    tariffName: str = None
    startDate: date = None
    endDate: date = None
    minAmount: float = None
    parHour: float = None
    status: int = None
