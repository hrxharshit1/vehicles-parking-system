from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.session import get_db
from utils.auth import get_current_user
from models import User, FloorDetails
from schemas.place import floor_details
from typing import List

router = APIRouter(tags=["Floor"], prefix="/floor")

# -------------------Floor APIs -------------------->

@router.post("/floor")
async def create_floor(
    request:floor_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_floor = FloorDetails(
        place_id = request.place_id,
        floorName = request.floorName,
        floorLevel = request.floorLevel,
        remarks = request.remarks,
        status = request.status,
        user_id=current_user.get("id"),
        headOfficeID=current_user.get("association").get("headOfficeID"),
        branchID=current_user.get("association").get("branchID"),
        level=current_user.get("association").get("level")
    )
    # Add the new floor to the database
    db.add(new_floor)
    db.commit()
   
    return {"message": "Floor created successfully"}


@router.put("/floorUpdate/{floor_id}")
async def floor_update(
    floor_id: int,
    request:floor_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    # Retrieve the floor from the database
    new_data = db.query(FloorDetails).filter(FloorDetails.id == floor_id).first()

    if new_data is None:
        raise HTTPException(status_code=404, detail="Floor not found")

    # Update the floor fields
    new_data.place_id = request.place_id
    new_data.floorName = request.floorName
    new_data.floorLevel = request.floorLevel
    new_data.remarks = request.remarks
    new_data.status = request.status
    new_data.user_id=current_user.get("id")
    new_data.headOfficeID = current_user.get("association").get("headOfficeID")
    new_data.branchID = current_user.get("association").get("branchID")
    new_data.level = current_user.get("association").get("level")

    # Commit the changes to the database
    db.commit()
    db.refresh(new_data)

    return {"message":"Floor Edited Successfully"}

@router.get("/floor")
async def get_floor(
    floor_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_floor = db.query(FloorDetails).filter(
        FloorDetails.id == floor_id,
        FloorDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not new_floor:
        raise HTTPException(status_code=404, detail="Floor not found")

    return new_floor
    
@router.get("/floorsAll")
async def floors_getAll(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user
                                 )):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    floors = db.query(FloorDetails).filter(
        FloorDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    return floors
    
@router.delete("/floors/{floor_id}")
async def delete_floor(
    floor_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    floor = db.query(FloorDetails).filter(
        FloorDetails.id == floor_id,
        FloorDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not floor:
        raise HTTPException(status_code=404, detail="Floor not found")

    db.delete(floor)
    db.commit()

    return {"message": "Floor deleted successfully"}

@router.delete("/floorsMultiple")
async def delete_floors(
    floor_ids: List[int],
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    floors = db.query(FloorDetails).filter(
        FloorDetails.id.in_(floor_ids),
        FloorDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not floors:
        raise HTTPException(status_code=404, detail="Floors not found")

    for floor in floors:
        db.delete(floor)
    db.commit()

    return {"message": "Floors deleted successfully"}

@router.delete("/floorsAll")
async def delete_all_floors(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    floors = db.query(FloorDetails).filter(
        FloorDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not floors:
        raise HTTPException(status_code=404, detail="No floors found for the user's branch")

    for floor in floors:
        db.delete(floor)
    db.commit()

    return {"message": "All floors deleted successfully"}