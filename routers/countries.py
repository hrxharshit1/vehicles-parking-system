from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.session import get_db
from utils.auth import get_current_user
from models import User, CountryDetails
from schemas.countries import countries
from typing import List

router = APIRouter(tags=["Country"], prefix="/country")

# -------------------Country APIs -------------------->

@router.post("/country")
async def create_country(
    request:countries,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_country = CountryDetails(
        countryName = request.countryName,
        countryCode = request.countryCode,
        status = request.status,
        user_id=current_user.get("id"),
        headOfficeID=current_user.get("association").get("headOfficeID"),
        branchID=current_user.get("association").get("branchID"),
        level=current_user.get("association").get("level")
    )
    # Add the new country to the database
    db.add(new_country)
    db.commit()
   
    return {"message": "Country created successfully"}


@router.put("/countryUpdate/{country_id}")
async def country_update(
    country_id: int,
    request:countries,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    # Retrieve the country from the database
    new_data = db.query(CountryDetails).filter(CountryDetails.id == country_id).first()

    if new_data is None:
        raise HTTPException(status_code=404, detail="Country not found")

    # Update the country fields
    new_data.countryName = request.countryName
    new_data.countryCode = request.countryCode
    new_data.status = request.status
    new_datauser_id=current_user.get("id")
    new_data.headOfficeID = current_user.get("association").get("headOfficeID")
    new_data.branchID = current_user.get("association").get("branchID")
    new_data.level = current_user.get("association").get("level")

    # Commit the changes to the database
    db.commit()
    db.refresh(new_data)

    return {"message":"Country Edited Successfully"}

@router.get("/country")
async def get_country(
    country_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_country = db.query(CountryDetails).filter(
        CountryDetails.id == country_id,
        CountryDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not new_country:
        raise HTTPException(status_code=404, detail="Country not found")

    return new_country
    
@router.get("/countriesAll")
async def countries_getAll(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user
                                 )):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    countries = db.query(CountryDetails).filter(
        CountryDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    return countries
    
@router.delete("/countries/{country_id}")
async def delete_country(
    country_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    country = db.query(CountryDetails).filter(
        CountryDetails.id == country_id,
        CountryDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not country:
        raise HTTPException(status_code=404, detail="Country not found")

    db.delete(country)
    db.commit()

    return {"message": "Country deleted successfully"}

@router.delete("/countriesMultiple")
async def delete_countries(
    country_ids: List[int],
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    countries = db.query(CountryDetails).filter(
        CountryDetails.id.in_(country_ids),
        CountryDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not countries:
        raise HTTPException(status_code=404, detail="Countries not found")

    for country in countries:
        db.delete(country)
    db.commit()

    return {"message": "Countries deleted successfully"}

@router.delete("/countriesAll")
async def delete_all_countries(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    countries = db.query(CountryDetails).filter(
        CountryDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not countries:
        raise HTTPException(status_code=404, detail="No countries found for the user's branch")

    for country in countries:
        db.delete(country)
    db.commit()

    return {"message": "All countries deleted successfully"}