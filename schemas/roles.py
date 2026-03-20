from pydantic import BaseModel


class role_details(BaseModel):
    roleName: str = None
    description: str = None

class role_user_details(BaseModel):
    role_id: int = None    