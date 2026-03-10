from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.session import get_db
from utils.auth import get_current_user
from models import User, ParkingDetails, CategoryWiseSlots
from schemas.parking import parking_details
from typing import List

router = APIRouter(tags=["Parking"], prefix="/parking")


@router.post("/parking")
async def create_parking(
    request: parking_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    # Lookup CategoryWiseSlots by slotID
    slot_data = db.query(CategoryWiseSlots).filter(CategoryWiseSlots.slotID == request.slotId).first()
    if not slot_data:
        print(f"Error: SlotID {request.slotId} not found in CategoryWiseSlots")
        raise HTTPException(status_code=404, detail=f"SlotID {request.slotId} not found in CategoryWiseSlots")

    # Autofill place_id, slot_id, category_id from CategoryWiseSlots
    new_parking = ParkingDetails(
        place_id=slot_data.place_id,
        slot_id=slot_data.id, 
        slotId=slot_data.slotID,
        category_id=slot_data.category_id,
        barcode=request.barcode,
        vehicle_no=request.vehicle_no,
        club_type=request.club_type,
        rfid_no=request.rfid_no,
        driver_name=request.driver_name,
        driver_mobile=request.driver_mobile,
        inTime=request.inTime,
        outTime=request.outTime,
        exitFloorId=request.exitFloorId,
        amount=request.amount,
        isPaid=request.isPaid,
        paid=request.paid,
        user_id=current_user.get("id"),
        headOfficeID=current_user.get("association").get("headOfficeID"),
        branchID=current_user.get("association").get("branchID"),
        level=current_user.get("association").get("level")
    )

    db.add(new_parking)
    db.commit()
    db.refresh(new_parking)

    return {"message": "Parking created successfully"}



@router.put("/parkingUpdate/{parking_id}")
async def parking_update(
    parking_id: int,
    request:parking_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    # Retrieve the parking from the database
    new_data = db.query(ParkingDetails).filter(ParkingDetails.id == parking_id).first()

    if new_data is None:
        raise HTTPException(status_code=404, detail="Parking not found")

    # Update the parking fields
    new_data.place_id = request.place_id
    new_data.slot_id = request.slot_id
    new_data.slotID = request.slotID
    new_data.category_id = request.category_id
    new_data.barcode = request.barcode
    new_data.vehicle_no = request.vehicle_no
    new_data.club_type = request.club_type
    new_data.rfid_no = request.rfid_no
    new_data.driver_name = request.driver_name
    new_data.driver_mobile = request.driver_mobile
    new_data.inTime = request.inTime
    new_data.outTime = request.outTime
    new_data.exitFloorId = request.exitFloorId
    new_data.amount = request.amount
    new_data.isPaid = request.isPaid
    new_data.paid = request.paid
    new_data.user_id=current_user.get("id")
    new_data.headOfficeID = current_user.get("association").get("headOfficeID")
    new_data.branchID = current_user.get("association").get("branchID")
    new_data.level = current_user.get("association").get("level")

    # Commit the changes to the database
    db.commit()
    db.refresh(new_data)

    return {"message":"Parking Edited Successfully"}

@router.get("/parking")
async def get_parking(
    parking_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_parking = db.query(ParkingDetails).filter(
        ParkingDetails.id == parking_id,
        ParkingDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not new_parking:
        raise HTTPException(status_code=404, detail="Parking not found")

    return new_parking
    
@router.get("/parkingAll")
async def parking_getAll(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user
                                 )):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_parking = db.query(ParkingDetails).filter(
        ParkingDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    return new_parking
    
@router.delete("/parking/{parking_id}")
async def delete_place(
    parking_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_parking = db.query(ParkingDetails).filter(
        ParkingDetails.id == parking_id,
        ParkingDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not new_parking:
        raise HTTPException(status_code=404, detail="Parking not found")

    db.delete(new_parking)
    db.commit()

    return {"message": "Parking deleted successfully"}

@router.delete("/parkingMultiple")
async def delete_parking(
    parking_ids: List[int],
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_parking = db.query(ParkingDetails).filter(
        ParkingDetails.id.in_(parking_ids),
        ParkingDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not new_parking:
        raise HTTPException(status_code=404, detail="Parking not found")

    for data in new_parking:
        db.delete(data)
    db.commit()

    return {"message": "Parking deleted successfully"}

@router.delete("/parkingAll")
async def delete_all_parking(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_parking = db.query(ParkingDetails).filter(
        ParkingDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not new_parking:
        raise HTTPException(status_code=404, detail="No parking found for the user's branch")

    for data in new_parking:
        db.delete(data)
    db.commit()

    return {"message": "All parking deleted successfully"}