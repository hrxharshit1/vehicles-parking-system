from pydantic import BaseModel,EmailStr, validator
from typing import Optional
class UserCreate(BaseModel):
    companyName: Optional[str] = None
    email : EmailStr
    mobile: int
    password : str
    verified: bool
    customerName: str
    gstNo: Optional[str] = None


class pass_reset(BaseModel):
    email: EmailStr
    otp : int
    password: str


class Permission_User(BaseModel):
    userName: str = None
    password: str = None  
    designation: str = None
    places: bool = None
    floors: bool = None
    category: bool = None
    categoryWiseSlots: bool = None
    clubs: bool = None
    clubTransaction: bool = None
    rfdVehicles: bool = None
    parking: bool = None
    tariff: bool = None
    migrations: bool = None
    countries: bool = None
    language: bool = None
    roles: bool = None
    roleUser: bool = None
    vehicleAmount: bool = None
    passwordReset: bool = None
    teamManagement: bool = None