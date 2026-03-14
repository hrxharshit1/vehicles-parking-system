from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.session import get_db
from utils.auth import get_current_user
from models import User, UserPermission
from schemas.users import Permission_User
from utils.hashing import Hasher

router = APIRouter(prefix="/subuser", tags=["SubUser"])


@router.post("/subuser")
def post_subuser(
    request: Permission_User,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lev = current_user.get("association").get("level")
    if lev > 2:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail="Users with level higher than 2 are not allowed to create subusers"
        )

    permissions = current_user.get("permission", {})
    if not permissions.get("places", True):
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail="You are not allowed to create sub user"
        )

    user_email_check = db.query(User).filter(
        User.email == request.userName, User.status == True
    ).first()

    if user_email_check:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User with the Username: {request.userName} already exists"
        )

    parent_user = db.query(User).filter(User.id == current_user.get("id")).first()

    user = User(
        email=request.userName,
        password=Hasher.get_password_hash(request.password),
        branchName=parent_user.branchName,
        headOfficeID=current_user.get("association").get("headOfficeID"),
        branchID=current_user.get("association").get("branchID"),
        level=lev + 1,
        verified=True,
        status=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    permission = UserPermission(
        designation=request.designation,
        places=request.places,
        floors=request.floors,
        category=request.category,
        categoryWiseSlots=request.categoryWiseSlots,
        clubs=request.clubs,
        clubTransaction=request.clubTransaction,
        rfdVehicles=request.rfdVehicles,
        tariff=request.tariff,
        migrations=request.migrations,
        countries=request.countries,
        language=request.language,
        parking=request.parking,
        roles=request.roles,
        roleUser=request.roleUser,
        vehicleAmount=request.vehicleAmount,
        passwordReset=request.passwordReset,
        user_id=user.id
    )
    db.add(permission)
    db.commit()
    return {"message": "Subuser created successfully"}


@router.get("/subuserAll")
def get_subuser_permissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(
        User.id,
        User.email,
        UserPermission.designation,
        UserPermission.places,
        UserPermission.floors,
        UserPermission.category,
        UserPermission.categoryWiseSlots,
        UserPermission.clubs,
        UserPermission.clubTransaction,
        UserPermission.rfdVehicles,
        UserPermission.tariff,
        UserPermission.migrations,
        UserPermission.countries,
        UserPermission.language,
        UserPermission.roles,
        UserPermission.roleUser,
        UserPermission.vehicleAmount,
        UserPermission.passwordReset,
        UserPermission.parking,
    ).join(UserPermission, User.id == UserPermission.user_id)\
     .filter(User.level > current_user.get("association").get("level"))\
     .filter(User.status == True)

    if current_user.get("association").get("level") == 1:
        query = query.filter(User.branchID == current_user.get("association").get("branchID"))
    else:
        query = query.filter(User.branchID == current_user.get("id"))

    return query.all()


@router.get("/subuser")
def get_subuser_by_id(
    ID: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(
        User.id,
        User.email,
        UserPermission.designation,
        UserPermission.places,
        UserPermission.floors,
        UserPermission.category,
        UserPermission.categoryWiseSlots,
        UserPermission.clubs,
        UserPermission.clubTransaction,
        UserPermission.rfdVehicles,
        UserPermission.tariff,
        UserPermission.migrations,
        UserPermission.countries,
        UserPermission.language,
        UserPermission.roles,
        UserPermission.roleUser,
        UserPermission.vehicleAmount,
        UserPermission.passwordReset,
    ).join(UserPermission, User.id == UserPermission.user_id)\
     .filter(User.status == True)\
     .filter(User.id == ID)

    if current_user.get("association").get("level") == 1:
        query = query.filter(User.branchID == current_user.get("association").get("branchID"))
    else:
        query = query.filter(User.branchID == current_user.get("id"))

    return query.first()


@router.put("/subuser")
def edit_subuser(
    ID: int,
    request: Permission_User,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.get("permission").get("places"):
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail="You are not allowed to update sub user"
        )

    user_query = db.query(User).filter(User.status == True, User.id == ID)

    if current_user.get("association").get("level") == 1:
        user_query = user_query.filter(User.branchID == current_user.get("association").get("branchID"))
    else:
        user_query = user_query.filter(User.branchID == current_user.get("id"))

    user_instance = user_query.first()
    if not user_instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if request.userName:
        user_query.update({User.email: request.userName})
    if request.password:
        user_query.update({User.password: Hasher.get_password_hash(request.password)})

    db.commit()

    db.query(UserPermission).filter(UserPermission.user_id == ID).update({
        UserPermission.designation: request.designation,
        UserPermission.places: request.places,
        UserPermission.floors: request.floors,
        UserPermission.category: request.category,
        UserPermission.categoryWiseSlots: request.categoryWiseSlots,
        UserPermission.clubs: request.clubs,
        UserPermission.clubTransaction: request.clubTransaction,
        UserPermission.rfdVehicles: request.rfdVehicles,
        UserPermission.tariff: request.tariff,
        UserPermission.migrations: request.migrations,
        UserPermission.countries: request.countries,
        UserPermission.language: request.language,
        UserPermission.roles: request.roles,
        UserPermission.roleUser: request.roleUser,
        UserPermission.vehicleAmount: request.vehicleAmount,
        UserPermission.passwordReset: request.passwordReset,
    })
    db.commit()
    return {"message": "SubUser information updated successfully"}


@router.delete("/subuser")
def delete_subuser(
    ID: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.get("permission").get("places"):
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail="You are not allowed to delete sub user"
        )

    user_to_delete = db.query(User).filter(User.id == ID).first()
    if not user_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Checking if the current user is authorized to delete (stubbed to branchID check if masterID missing)
    if user_to_delete.branchID != current_user.get("association").get("branchID"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to delete this subuser"
        )

    db.query(User).filter(User.id == ID).update({User.status: False})
    db.commit()
    return {"message": "SubUser deleted successfully!"}


@router.get("/userpermissions")
def get_all_user_permissions(db: Session = Depends(get_db)):
    user_permissions = db.query(UserPermission).all()
    if not user_permissions:
        raise HTTPException(status_code=404, detail="No UserPermissions found")
    return user_permissions
