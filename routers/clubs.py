from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.session import get_db
from utils.auth import get_current_user
from models import User, ClubDetails, ClubTransactionDetails
from schemas.clubs import club_details, club_transaction_details
from typing import List

router = APIRouter(tags=["Club"], prefix="/club")

# -------------------Club APIs -------------------->

@router.post("/clubs")
async def create_clubs(
    request:club_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_club = ClubDetails(
        clubName = request.clubName,
        vehicleNumber = request.vehicleNumber,
        storeNumber = request.storeNumber,
        vehicleType = request.vehicleType,
        cronJobDate = request.cronJobDate,
        cronJobStatus = request.cronJobStatus,
        user_id=current_user.get("id"),
        headOfficeID=current_user.get("association").get("headOfficeID"),
        branchID=current_user.get("association").get("branchID"),
        level=current_user.get("association").get("level")
    )
    # Add the new Club to the database
    db.add(new_club)
    db.commit()
   
    return {"message": "Club created successfully"}


@router.put("/clubUpdate/{club_id}")
async def place_update(
    club_id: int,
    request:club_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    # Retrieve the club from the database
    new_data = db.query(ClubDetails).filter(ClubDetails.id == club_id).first()

    if new_data is None:
        raise HTTPException(status_code=404, detail="Club not found")

    # Update the club fields
    new_data.clubName = request.clubName
    new_data.vehicleNumber = request.vehicleNumber
    new_data.storeNumber = request.storeNumber
    new_data.vehicleType = request.vehicleType
    new_data.cronJobDate = request.cronJobDate
    new_data.cronJobStatus = request.cronJobStatus
    new_data.user_id=current_user.get("id")
    new_data.headOfficeID = current_user.get("association").get("headOfficeID")
    new_data.branchID = current_user.get("association").get("branchID")
    new_data.level = current_user.get("association").get("level")

    # Commit the changes to the database
    db.commit()
    db.refresh(new_data)

    return {"message":"Club Edited Successfully"}

@router.get("/clubs")
async def get_clubs(
    club_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_club = db.query(ClubDetails).filter(
        ClubDetails.id == club_id,
        ClubDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not new_club:
        raise HTTPException(status_code=404, detail="Clubs not found")

    return new_club
    
@router.get("/clubsAll")
async def clubs_getAll(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user
                                 )):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    clubs = db.query(ClubDetails).filter(
        ClubDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    return clubs
    
@router.delete("/clubs/{club_id}")
async def delete_club(
    club_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    clubs = db.query(ClubDetails).filter(
        ClubDetails.id == club_id,
        ClubDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not clubs:
        raise HTTPException(status_code=404, detail="Club not found")

    db.delete(clubs)
    db.commit()

    return {"message": "Club deleted successfully"}

@router.delete("/clubsMultiple")
async def delete_clubs(
    club_ids: List[int],
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    clubs = db.query(ClubDetails).filter(
        ClubDetails.id.in_(club_ids),
        ClubDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not clubs:
        raise HTTPException(status_code=404, detail="Clubs not found")

    for club in clubs:
        db.delete(club)
    db.commit()

    return {"message": "Clubs deleted successfully"}

@router.delete("/clubsAll")
async def delete_all_clubs(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    clubs = db.query(ClubDetails).filter(
        ClubDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not clubs:
        raise HTTPException(status_code=404, detail="No clubs found for the user's branch")

    for club in clubs:
        db.delete(club)
    db.commit()

    return {"message": "All clubs deleted successfully"}

# ------------ Club Transaction APIs ------------ 


@router.post("/club_transaction")
async def create_club_transaction(
    request:club_transaction_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_club_transaction = ClubTransactionDetails(
        club_id = request.club_id,
        transaction_id = request.transaction_id,
        amount = request.amount,
        gracePeriod = request.gracePeriod,
        cronJobDate = request.cronJobDate,
        cronJobStatus = request.cronJobStatus,
        user_id=current_user.get("id"),
        headOfficeID=current_user.get("association").get("headOfficeID"),
        branchID=current_user.get("association").get("branchID"),
        level=current_user.get("association").get("level")
    )
    # Add the new Club Transaction to the database
    db.add(new_club_transaction)
    db.commit()
   
    return {"message": "Club transaction created successfully"}


@router.put("/clubTransactionUpdate/{clubTrans_id}")
async def club_transaction_update(
    clubTrans_id: int,
    request:club_transaction_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    # Retrieve the club transaction from the database
    new_data = db.query(ClubTransactionDetails).filter(ClubTransactionDetails.id == clubTrans_id).first()

    if new_data is None:
        raise HTTPException(status_code=404, detail="Club transaction not found")

    # Update the club transaction fields
    new_data.club_id = request.club_id
    new_data.transaction_id = request.transaction_id
    new_data.amount = request.amount
    new_data.gracePeriod = request.gracePeriod
    new_data.cronJobDate = request.cronJobDate
    new_data.cronJobStatus = request.cronJobStatus
    new_data.user_id=current_user.get("id")
    new_data.headOfficeID = current_user.get("association").get("headOfficeID")
    new_data.branchID = current_user.get("association").get("branchID")
    new_data.level = current_user.get("association").get("level")

    # Commit the changes to the database
    db.commit()
    db.refresh(new_data)

    return {"message":"Club transaction Edited Successfully"}

@router.get("/clubTransaction")
async def get_club_transaction(
    club_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_club_trans = db.query(ClubTransactionDetails).filter(
        ClubTransactionDetails.id == club_id,
        ClubTransactionDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not new_club_trans:
        raise HTTPException(status_code=404, detail="Club transaction not found")

    return new_club_trans
    
@router.get("/clubTransactionAll")
async def club_transaction_getAll(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user
                                 )):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    club_transaction = db.query(ClubTransactionDetails).filter(
        ClubTransactionDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    return club_transaction
    
@router.delete("/clubTransaction/{clubTrans_id}")
async def delete_club_transaction(
    clubTrans_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    club_transaction = db.query(ClubTransactionDetails).filter(
        ClubTransactionDetails.id == clubTrans_id,
        ClubTransactionDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not club_transaction:
        raise HTTPException(status_code=404, detail="Club transaction not found")

    db.delete(club_transaction)
    db.commit()

    return {"message": "Club transaction deleted successfully"}

@router.delete("/clubTransactionMultiple")
async def delete_club_transaction(
    clubTrans_ids: List[int],
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    clubTrans = db.query(ClubTransactionDetails).filter(
        ClubTransactionDetails.id.in_(clubTrans_ids),
        ClubTransactionDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not clubTrans:
        raise HTTPException(status_code=404, detail="Club transaction not found")

    for club in clubTrans:
        db.delete(club)
    db.commit()

    return {"message": "Clubs transaction deleted successfully"}

@router.delete("/clubTransAll")
async def delete_all_club_trans(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    clubs = db.query(ClubTransactionDetails).filter(
        ClubTransactionDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not clubs:
        raise HTTPException(status_code=404, detail="No clubs transaction found for the user's branch")

    for club in clubs:
        db.delete(club)
    db.commit()

    return {"message": "All clubs transaction deleted successfully"}