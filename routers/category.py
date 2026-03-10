from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.session import get_db
from utils.auth import get_current_user
from models import User, CategoryDetails, CategoryWiseSlots

from schemas.category import category_details, category_wise_slots
from typing import List

router = APIRouter(tags=["Category"], prefix="/category")

# -------------------Categories -------------------->


@router.post("/category")
async def create_category(
    request:category_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")


    # Create a new category instance
    new_category = CategoryDetails(
        place_id = request.place_id,
        type= request.type,
        description = request.description,
        limitCount = request.limitCount,
        status = request.status,
        user_id=current_user.get("id"),
        created_by=current_user.get("id"),  
        modified_by=current_user.get("id"),
        headOfficeID=current_user.get("association").get("headOfficeID"),
        branchID=current_user.get("association").get("branchID"),
        level=current_user.get("association").get("level")
    )
    # Add the new category to the database
    db.add(new_category)
    db.commit()

    return {"message": "Category created successfully"}


@router.put("/categoriesUpdate/{cat_id}")
async def categories_update(
    cat_id: int,
    request:category_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    # Retrieve the category from the database
    new_data = db.query(CategoryDetails).filter(CategoryDetails.id == cat_id).first()

    if new_data is None:
        raise HTTPException(status_code=404, detail="Category not found")

    # Update the category fields
    new_data.place_id = request.place_id
    new_data.type = request.type
    new_data.description  = request.description
    new_data.limitCount = request.limitCount
    new_data.status = request.status
    new_data.user_id=current_user.get("id")
    new_data.created_by=current_user.get("id") 
    new_data.modified_by=current_user.get("id")
    new_data.headOfficeID = current_user.get("association").get("headOfficeID")
    new_data.branchID = current_user.get("association").get("branchID")
    new_data.level = current_user.get("association").get("level")

    # Commit the changes to the database
    db.commit()
    db.refresh(new_data)

    return {"message":"Category Edited Successfully"}

@router.get("/categories")
async def get_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    category = db.query(CategoryDetails).filter(
        CategoryDetails.id == category_id,
        CategoryDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    return category
    
@router.get("/categoriesAll")
async def categories_getAll(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user
                                 )):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    categories = db.query(CategoryDetails).filter(
        CategoryDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    return categories
    
@router.delete("/categories/{category_id}")
async def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    category = db.query(CategoryDetails).filter(
        CategoryDetails.id == category_id,
        CategoryDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(category)
    db.commit()

    return {"message": "Category deleted successfully"}

@router.delete("/categoriesMultiple")
async def delete_categories(
    category_ids: List[int],
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    categories = db.query(CategoryDetails).filter(
        CategoryDetails.id.in_(category_ids),
        CategoryDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not categories:
        raise HTTPException(status_code=404, detail="Categories not found")

    for category in categories:
        db.delete(category)
    db.commit()

    return {"message": "Categories deleted successfully"}

@router.delete("/categoriesAll")
async def delete_all_categories(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    categories = db.query(CategoryDetails).filter(
        CategoryDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not categories:
        raise HTTPException(status_code=404, detail="No categories found for the user's branch")

    for category in categories:
        db.delete(category)
    db.commit()

    return {"message": "All categories deleted successfully"}


# Category Wise Slots 

@router.post("/categoryWiseSlots")
async def create_category_wise_slots(
    request:category_wise_slots,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")


    # Create a new category wise slots instance
    new_category = CategoryWiseSlots(
        place_id = request.place_id,
        floor_id = request.floor_id,
        category_id = request.category_id,
        slotName = request.slotName,
        slotID = request.slotID,
        identity = request.identity,
        remarks = request.remarks,
        status = request.status,
        user_id=current_user.get("id"),
        created_id=current_user.get("id"),  
        updated_id=current_user.get("id"),
        created_by=current_user.get("id"),  
        updated_by=current_user.get("id"),
        headOfficeID=current_user.get("association").get("headOfficeID"),
        branchID=current_user.get("association").get("branchID"),
        level=current_user.get("association").get("level")
    )
    # Add the new category wise slots to the database
    db.add(new_category)
    db.commit()

    return {"message": "Category wise slots created successfully"}


@router.put("/categorywiseslotsUpdate/{cat_id}")
async def category_wise_slots_update(
    cat_id: int,
    request:category_wise_slots,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    # Retrieve the category wise slots from the database
    new_data = db.query(CategoryWiseSlots).filter(CategoryWiseSlots.id == cat_id).first()

    if new_data is None:
        raise HTTPException(status_code=404, detail="Category wise slots not found")

    # Update the category wise slots fields
    new_data.place_id = request.place_id
    new_data.floor_id = request.floor_id
    new_data.category_id  = request.category_id
    new_data.slotName = request.slotName
    new_data.slotID = request.slotID
    new_data.identity = request.identity
    new_data.remarks = request.remarks
    new_data.status = request.status
    new_data.user_id=current_user.get("id")
    new_data.created_id=current_user.get("id") 
    new_data.updated_id=current_user.get("id")
    new_data.created_by=current_user.get("id")  
    new_data.updated_by=current_user.get("id")
    new_data.headOfficeID = current_user.get("association").get("headOfficeID")
    new_data.branchID = current_user.get("association").get("branchID")
    new_data.level = current_user.get("association").get("level")

    # Commit the changes to the database
    db.commit()
    db.refresh(new_data)

    return {"message":"Category wise slots Edited Successfully"}

@router.get("/categoryWiseSlots")
async def get_category_wise_slots(
    catslot_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    category_wise_slots = db.query(CategoryWiseSlots).filter(
        CategoryWiseSlots.id == catslot_id,
        CategoryWiseSlots.branchID == current_user.get("association").get("branchID")
    ).first()

    if not category_wise_slots:
        raise HTTPException(status_code=404, detail="Category wise slots not found")

    return category_wise_slots
    
@router.get("/categoryWiseSlotsAll")
async def category_wise_slots_getAll(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user
                                 )):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    category_wise_slots = db.query(CategoryWiseSlots).filter(
        CategoryWiseSlots.branchID == current_user.get("association").get("branchID")
    ).all()

    return category_wise_slots
    
@router.delete("/categoryWiseSlots/{catSlots_id}")
async def delete_category(
    catSlots_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    category_wise_slots = db.query(CategoryWiseSlots).filter(
        CategoryWiseSlots.id == catSlots_id,
        CategoryWiseSlots.branchID == current_user.get("association").get("branchID")
    ).first()

    if not category_wise_slots:
        raise HTTPException(status_code=404, detail="Category wise slots not found")

    db.delete(category_wise_slots)
    db.commit()

    return {"message": "Category wise slots deleted successfully"}

@router.delete("/categoriesSlotsMultiple")
async def delete_category_wise_slots(
    categorySlots_ids: List[int],
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    category_wise_slots = db.query(CategoryWiseSlots).filter(
        CategoryWiseSlots.id.in_(categorySlots_ids),
        CategoryWiseSlots.branchID == current_user.get("association").get("branchID")
    ).all()

    if not category_wise_slots:
        raise HTTPException(status_code=404, detail="Category wise slots not found")

    for category in category_wise_slots:
        db.delete(category)
    db.commit()

    return {"message": "Category wise slots deleted successfully"}

@router.delete("/categoryWiseSlotAll")
async def delete_all_category_wise_slot(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    category_wise_slots = db.query(CategoryWiseSlots).filter(
        CategoryWiseSlots.branchID == current_user.get("association").get("branchID")
    ).all()

    if not category_wise_slots:
        raise HTTPException(status_code=404, detail="No category wise slots found for the user's branch")

    for category in category_wise_slots:
        db.delete(category)
    db.commit()

    return {"message": "All category wise slots deleted successfully"}