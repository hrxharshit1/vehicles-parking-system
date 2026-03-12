from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.session import get_db
from utils.auth import get_current_user
from models import User, TariffDetails
from schemas.tariff import tariff_details
from typing import List

router = APIRouter(tags=["Tariff"], prefix="/tariff")

# -------------------Tariff APIs -------------------->

@router.post("/tariff")
async def create_tariff(
    request:tariff_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_tariff = TariffDetails(
        place_id = request.place_id,
        tariffName = request.tariffName,
        startDate = request.startDate,
        endDate = request.endDate,
        minAmount = request.minAmount,
        parHour = request.parHour,
        status = request.status,
        user_id = current_user.get("id"),
        headOfficeID=current_user.get("association").get("headOfficeID"),
        branchID=current_user.get("association").get("branchID"),
        level=current_user.get("association").get("level")
    )
    # Add the new tariff to the database
    db.add(new_tariff)
    db.commit()
   
    return {"message": "Tariff created successfully"}


@router.put("/tariffUpdate/{tariff_id}")
async def tariff_update(
    tariffe_id: int,
    request:tariff_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    # Retrieve the tariff from the database
    new_data = db.query(TariffDetails).filter(TariffDetails.id == tariffe_id).first()

    if new_data is None:
        raise HTTPException(status_code=404, detail="Tariff not found")

    # Update the tariff fields
    new_data.place_id = request.place_id
    new_data.tariffName = request.tariffName
    new_data.startDate = request.startDate
    new_data.endDate = request.endDate
    new_data.minAmount = request.minAmount
    new_data.parHour = request.parHour
    new_data.status = request.status
    new_data.user_id = current_user.get("id"),
    new_data.headOfficeID = current_user.get("association").get("headOfficeID")
    new_data.branchID = current_user.get("association").get("branchID")
    new_data.level = current_user.get("association").get("level")

    # Commit the changes to the database
    db.commit()
    db.refresh(new_data)

    return {"message":"Tariff Edited Successfully"}

@router.get("/tariff")
async def get_tariff(
    tariff_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_tariff = db.query(TariffDetails).filter(
        TariffDetails.id == tariff_id,
        TariffDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not new_tariff:
        raise HTTPException(status_code=404, detail="Tariff not found")

    return new_tariff
    
@router.get("/tariffsAll")
async def tariffs_getAll(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user
                                 )):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    tariffs = db.query(TariffDetails).filter(
        TariffDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    return tariffs
    
@router.delete("/tariffs/{tariff_id}")
async def delete_tariff(
    tariff_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    tariff_data = db.query(TariffDetails).filter(
        TariffDetails.id == tariff_id,
        TariffDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not tariff_data:
        raise HTTPException(status_code=404, detail="Tariff not found")

    db.delete(tariff_data)
    db.commit()

    return {"message": "Tariff deleted successfully"}

@router.delete("/tariffsMultiple")
async def delete_tariffs(
    tariff_ids: List[int],
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    tariffs = db.query(TariffDetails).filter(
        TariffDetails.id.in_(tariff_ids),
        TariffDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not tariffs:
        raise HTTPException(status_code=404, detail="Tariffs not found")

    for data in tariffs:
        db.delete(data)
    db.commit()

    return {"message": "Tariffs deleted successfully"}

@router.delete("/tariffsAll")
async def delete_all_tariffs(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    Tariffs = db.query(TariffDetails).filter(
        TariffDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not Tariffs:
        raise HTTPException(status_code=404, detail="No Tariffs found for the user's branch")

    for tariff in Tariffs:
        db.delete(tariff)
    db.commit()

    return {"message": "All Tariffs deleted successfully"}