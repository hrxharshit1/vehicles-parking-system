from pydantic import BaseModel
from datetime import date, datetime
from typing import List, Optional

class ParkingActivity(BaseModel):
    id: int
    vehicle_no: str
    inTime: date
    status: Optional[int] = 1

class DashboardSummary(BaseModel):
    total_parked: int
    total_earnings_today: float
    available_slots: int
    recent_activities: List[ParkingActivity]
