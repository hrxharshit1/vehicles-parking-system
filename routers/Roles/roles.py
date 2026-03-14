from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.session import get_db
from utils.auth import get_current_user
from models import User, RoleDetails
from schemas.roles import role_details
from typing import List

router = APIRouter(tags=["Roles"], prefix="/roles")

# -------------------Role APIs -------------------->

@router.post("/roles")
async def create_roles(
    request:role_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_role = RoleDetails(
        roleName = request.roleName,
        description = request.description,
        user_id = current_user.get("id"),
        headOfficeID=current_user.get("association").get("headOfficeID"),
        branchID=current_user.get("association").get("branchID"),
        level=current_user.get("association").get("level")
    )
    # Add the new role to the database
    db.add(new_role)
    db.commit()
   
    return {"message": "Role created successfully"}


@router.put("/roleUpdate/{role_id}")
async def role_update(
    role_id: int,
    request:role_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    # Retrieve the role from the database
    new_data = db.query(RoleDetails).filter(RoleDetails.id == role_id).first()

    if new_data is None:
        raise HTTPException(status_code=404, detail="Role not found")

    # Update the role fields
    new_data.roleName = request.roleName
    new_data.description = request.description
    new_data.user_id = current_user.get("id"),
    new_data.headOfficeID = current_user.get("association").get("headOfficeID")
    new_data.branchID = current_user.get("association").get("branchID")
    new_data.level = current_user.get("association").get("level")

    # Commit the changes to the database
    db.commit()
    db.refresh(new_data)

    return {"message":"Role Edited Successfully"}

@router.get("/role")
async def get_role(
    role_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_role = db.query(RoleDetails).filter(
        RoleDetails.id == role_id,
        RoleDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not new_role:
        raise HTTPException(status_code=404, detail="Role not found")

    return new_role
    
@router.get("/rolesAll")
async def roles_getAll(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user
                                 )):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    roles = db.query(RoleDetails).filter(
        RoleDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    return roles
    
@router.delete("/roles/{role_id}")
async def delete_role(
    role_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    role = db.query(RoleDetails).filter(
        RoleDetails.id == role_id,
        RoleDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    db.delete(role)
    db.commit()

    return {"message": "Role deleted successfully"}

@router.delete("/rolesMultiple")
async def delete_roles(
    role_ids: List[int],
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    roles = db.query(RoleDetails).filter(
        RoleDetails.id.in_(role_ids),
        RoleDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not roles:
        raise HTTPException(status_code=404, detail="Roles not found")

    for role in roles:
        db.delete(role)
    db.commit()

    return {"message": "Roles deleted successfully"}

@router.delete("/rolesAll")
async def delete_all_roles(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    roles = db.query(RoleDetails).filter(
        RoleDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not roles:
        raise HTTPException(status_code=404, detail="No roles found for the user's branch")

    for role in roles:
        db.delete(role)
    db.commit()

    return {"message": "All roles deleted successfully"}