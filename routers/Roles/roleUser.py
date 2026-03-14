from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.session import get_db
from utils.auth import get_current_user
from models import User, RoleUserDetails
from schemas.roles import role_user_details
from typing import List

router = APIRouter(tags=["Roles"], prefix="/roles")

# -------------------Role User APIs -------------------->

@router.post("/roleUser")
async def create_role_user(
    request:role_user_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_role_user = RoleUserDetails(
        role_id = request.role_id,
        user_id=current_user.get("id"),
        headOfficeID=current_user.get("association").get("headOfficeID"),
        branchID=current_user.get("association").get("branchID"),
        level=current_user.get("association").get("level")
    )
    # Add the new role user to the database
    db.add(new_role_user)
    db.commit()
   
    return {"message": "Role user created successfully"}


@router.put("/roleUpdate/{role_user_id}")
async def role_user_update(
    role_user_id: int,
    request:role_user_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    # Retrieve the role user from the database
    new_data = db.query(RoleUserDetails).filter(RoleUserDetails.id == role_user_id).first()

    if new_data is None:
        raise HTTPException(status_code=404, detail="Role user not found")

    # Update the role user fields
    new_data.role_id = request.role_id
    new_data.user_id=current_user.get("id")
    new_data.headOfficeID = current_user.get("association").get("headOfficeID")
    new_data.branchID = current_user.get("association").get("branchID")
    new_data.level = current_user.get("association").get("level")

    # Commit the changes to the database
    db.commit()
    db.refresh(new_data)

    return {"message":"Role user Edited Successfully"}

@router.get("/roleUser")
async def get_role_user(
    role_user_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_role_user = db.query(RoleUserDetails).filter(
        RoleUserDetails.id == role_user_id,
        RoleUserDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not new_role_user:
        raise HTTPException(status_code=404, detail="Role user not found")

    return new_role_user
    
@router.get("/roleUserAll")
async def role_user_getAll(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user
                                 )):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    role_user = db.query(RoleUserDetails).filter(
        RoleUserDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    return role_user
    
@router.delete("/roleUser/{role_user_id}")
async def delete_role(
    role_user_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    role_user = db.query(RoleUserDetails).filter(
        RoleUserDetails.id == role_user_id,
        RoleUserDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not role_user:
        raise HTTPException(status_code=404, detail="Role user not found")

    db.delete(role_user)
    db.commit()

    return {"message": "Role user deleted successfully"}

@router.delete("/roleUserMultiple")
async def delete_role_user(
    role_user_ids: List[int],
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    role_user = db.query(RoleUserDetails).filter(
        RoleUserDetails.id.in_(role_user_ids),
        RoleUserDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not role_user:
        raise HTTPException(status_code=404, detail="Role user not found")

    for role in role_user:
        db.delete(role)
    db.commit()

    return {"message": "Role user deleted successfully"}

@router.delete("/roleUserAll")
async def delete_all_role_user(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    role_user = db.query(RoleUserDetails).filter(
        RoleUserDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not role_user:
        raise HTTPException(status_code=404, detail="No role user found for the user's branch")

    for role in role_user:
        db.delete(role)
    db.commit()

    return {"message": "All role user deleted successfully"}