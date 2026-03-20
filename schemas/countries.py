from pydantic import BaseModel

class countries(BaseModel):
    countryName:str = None
    countryCode: str = None
    status: int = None