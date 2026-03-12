from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.session import get_db
from utils.auth import get_current_user
from models import User, VehicleAmountDetails
from schemas.vehicleAmounts import vehicle_amounts_details
from typing import List

router = APIRouter(tags=["Vehicle Amount"], prefix="/vehicleamount")

# -------------------Vehicle Amount APIs -------------------->

@router.post("/vehicleAmount")
async def create_vehicle_amount(
    request:vehicle_amounts_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_data = VehicleAmountDetails(
        rateName = request.rateName,
        vehicleCategory = request.vehicleCategory,
        type = request.type,
        category = request.category,
        rate = request.rate,
        setTime = request.setTime,
        status = request.status,
        user_id=current_user.get("id"),
        headOfficeID=current_user.get("association").get("headOfficeID"),
        branchID=current_user.get("association").get("branchID"),
        level=current_user.get("association").get("level")
    )
    # Add the new vehicle amount to the database
    db.add(new_data)
    db.commit()
   
    return {"message": "Vehicle amount created successfully"}


@router.put("/vehicleAmount")
async def vehicle_amount_update(
    vehicle_id: int,
    request:vehicle_amounts_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    # Retrieve the Vehicle amount from the database
    new_data = db.query(VehicleAmountDetails).filter(VehicleAmountDetails.id == vehicle_id).first()

    if new_data is None:
        raise HTTPException(status_code=404, detail="Vehicle amount not found")

    # Update the Vehicle amount fields
    new_data.rateName = request.rateName
    new_data.vehicleCategory = request.vehicleCategory
    new_data.type = request.type
    new_data.category = request.category
    new_data.rate = request.rate
    new_data.setTime = request.setTime
    new_data.status = request.status
    new_data.user_id=current_user.get("id")
    new_data.headOfficeID = current_user.get("association").get("headOfficeID")
    new_data.branchID = current_user.get("association").get("branchID")
    new_data.level = current_user.get("association").get("level")

    # Commit the changes to the database
    db.commit()
    db.refresh(new_data)

    return {"message":"Vehicle amount Edited Successfully"}

@router.get("/vehicleAmount")
async def get_vehicle_amount(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_data = db.query(VehicleAmountDetails).filter(
        VehicleAmountDetails.id == vehicle_id,
        VehicleAmountDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not new_data:
        raise HTTPException(status_code=404, detail="Vehicle amount not found")

    return new_data
    
@router.get("/vehicleAmountAll")
async def vehicles_amount_getAll(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user
                                 )):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_data = db.query(VehicleAmountDetails).filter(
        VehicleAmountDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    return new_data
    
@router.delete("/vehicleAmount/{vehicle_id}")
async def delete_vehicle_amount(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_data = db.query(VehicleAmountDetails).filter(
        VehicleAmountDetails.id == vehicle_id,
        VehicleAmountDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not new_data:
        raise HTTPException(status_code=404, detail="Vehicle amount not found")

    db.delete(new_data)
    db.commit()

    return {"message": "Vehicle amount deleted successfully"}

@router.delete("/vehiclesAmountMultiple")
async def delete_vehicles_amount(
    vehicle_ids: List[int],
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_data = db.query(VehicleAmountDetails).filter(
        VehicleAmountDetails.id.in_(vehicle_ids),
        VehicleAmountDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not new_data:
        raise HTTPException(status_code=404, detail="Vehicle amount not found")

    for data in new_data:
        db.delete(data)
    db.commit()

    return {"message": "Vehicle amount deleted successfully"}

@router.delete("/vehicleAmountAll")
async def delete_all_places(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_data = db.query(VehicleAmountDetails).filter(
        VehicleAmountDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not new_data:
        raise HTTPException(status_code=404, detail="No vehicle amounts found for the user's branch")

    for data in new_data:
        db.delete(data)
    db.commit()

    return {"message": "All vehicle amounts deleted successfully"}