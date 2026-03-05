from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from models import User, UserPermission
from utils.dropdowns import perm

import os
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_jwt_secret_key_here")
ALGORITHM = "HS256"


# To create JWT Token
def create_access_token(data: dict, EXPIRY=None):
    to_encode = data.copy()
    if EXPIRY:  
        expire = datetime.utcnow() + timedelta(days=EXPIRY)
        to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate token",
        )


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


def get_current_user(token: str = Depends(oauth2_scheme)):
    return decode_token(token)


def prepare_auth_data(db, id):
    user = db.query(User).filter(User.id == id).first()
    if user is None:
        raise ValueError(f"User with id {id} not found.")

    subscription_end = db.query(User).filter(User.id == user.headOfficeID).first()
    # subscription_end might be None, so we handle it carefully

    user_permission = db.query(UserPermission).filter(
        UserPermission.user_id == user.id).first()

    # Make sure user_permission isn't None before accessing its attributes
    permission_data = {k: getattr(user_permission, k) for k in perm} if user_permission else {}

    return {
        "id": user.id,
        "association": {k: getattr(user, k) for k in ["headOfficeID", "branchID", "level"]},
        "permission": permission_data,
        "subscription_end": (
            subscription_end.subscription_end.strftime("%Y-%m-%d")
            if subscription_end and subscription_end.subscription_end
            else ''
        ),
        "email": user.email,
        "mobile": user.mobile,
        "verified": user.verified,
        "created": user.created.strftime("%Y-%m-%d") if user.created else ''
    }
