from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.session import get_db
from utils.auth import get_current_user
from models import User, PlaceDetails
from schemas.place import place_details
from typing import List

router = APIRouter(tags=["Place"], prefix="/place")

# -------------------Place APIs -------------------->

@router.post("/place")
async def create_place(
    request:place_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_place = PlaceDetails(
        placeName = request.placeName,
        description = request.description,
        status = request.status,
        user_id=current_user.get("id"),
        headOfficeID=current_user.get("association").get("headOfficeID"),
        branchID=current_user.get("association").get("branchID"),
        level=current_user.get("association").get("level")
    )
    # Add the new place to the database
    db.add(new_place)
    db.commit()
   
    return {"message": "Place created successfully"}


@router.put("/placeUpdate/{place_id}")
async def place_update(
    place_id: int,
    request:place_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    # Retrieve the place from the database
    new_data = db.query(PlaceDetails).filter(PlaceDetails.id == place_id).first()

    if new_data is None:
        raise HTTPException(status_code=404, detail="Place not found")

    # Update the place fields
    new_data.placeName = request.placeName
    new_data.description = request.description
    new_data.status = request.status
    new_data.user_id=current_user.get("id")
    new_data.headOfficeID = current_user.get("association").get("headOfficeID")
    new_data.branchID = current_user.get("association").get("branchID")
    new_data.level = current_user.get("association").get("level")

    # Commit the changes to the database
    db.commit()
    db.refresh(new_data)

    return {"message":"Place Edited Successfully"}

@router.get("/place")
async def get_place(
    place_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_place = db.query(PlaceDetails).filter(
        PlaceDetails.id == place_id,
        PlaceDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not new_place:
        raise HTTPException(status_code=404, detail="Place not found")

    return new_place
    
@router.get("/placesAll")
async def places_getAll(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user
                                 )):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    places = db.query(PlaceDetails).filter(
        PlaceDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    return places
    
@router.delete("/places/{place_id}")
async def delete_place(
    place_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    place = db.query(PlaceDetails).filter(
        PlaceDetails.id == place_id,
        PlaceDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not place:
        raise HTTPException(status_code=404, detail="Place not found")

    db.delete(place)
    db.commit()

    return {"message": "Place deleted successfully"}

@router.delete("/placesMultiple")
async def delete_places(
    place_ids: List[int],
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    places = db.query(PlaceDetails).filter(
        PlaceDetails.id.in_(place_ids),
        PlaceDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not places:
        raise HTTPException(status_code=404, detail="Places not found")

    for place in places:
        db.delete(place)
    db.commit()

    return {"message": "Places deleted successfully"}

@router.delete("/placesAll")
async def delete_all_places(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    places = db.query(PlaceDetails).filter(
        PlaceDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not places:
        raise HTTPException(status_code=404, detail="No places found for the user's branch")

    for place in places:
        db.delete(place)
    db.commit()

    return {"message": "All places deleted successfully"}