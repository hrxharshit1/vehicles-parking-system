from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, Union

class parking_details(BaseModel):
    slotId: Optional[int] = None
    barcode: Optional[int] = None
    vehicle_no: Optional[str] = None
    club_type: Optional[str] = None
    rfid_no: Optional[str] = None
    driver_name: Optional[str] = None
    driver_mobile: Optional[str] = None
    inTime: Optional[Union[date, datetime, str]] = None
    outTime: Optional[Union[date, datetime, str]] = None
    exitFloorId: Optional[int] = None
    amount: Optional[float] = None
    isPaid: Optional[float] = None
    paid: Optional[float] = None
