from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.session import get_db
from utils.auth import get_current_user
from models import User, MigrationDetails
from schemas.place import migration_details
from typing import List

router = APIRouter(tags=["Migration"], prefix="/migration")

# -------------------Migration APIs -------------------->

@router.post("/migrations")
async def create_migrations(
    request:migration_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_migrations = MigrationDetails(
        migration = request.migration,
        batch = request.batch,
        user_id=current_user.get("id"),
        headOfficeID=current_user.get("association").get("headOfficeID"),
        branchID=current_user.get("association").get("branchID"),
        level=current_user.get("association").get("level")
    )
    # Add the new migrations to the database
    db.add(new_migrations)
    db.commit()
   
    return {"message": "Migration created successfully"}


@router.put("/migrationUpdate/{migration_id}")
async def migration_update(
    migration_id: int,
    request:migration_details,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    # Retrieve the migration from the database
    new_data = db.query(MigrationDetails).filter(MigrationDetails.id == migration_id).first()

    if new_data is None:
        raise HTTPException(status_code=404, detail="Migration not found")

    # Update the migration fields
    new_data.migration = request.migration
    new_data.batch = request.batch
    new_data.user_id=current_user.get("id")
    new_data.headOfficeID = current_user.get("association").get("headOfficeID")
    new_data.branchID = current_user.get("association").get("branchID")
    new_data.level = current_user.get("association").get("level")

    # Commit the changes to the database
    db.commit()
    db.refresh(new_data)

    return {"message":"Migration Edited Successfully"}

@router.get("/migrations")
async def get_migration(
    migration_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    new_migration = db.query(MigrationDetails).filter(
        MigrationDetails.id == migration_id,
        MigrationDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not new_migration:
        raise HTTPException(status_code=404, detail="Migration not found")

    return new_migration
    
@router.get("/migrationsAll")
async def migrations_getAll(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user
                                 )):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    migrations = db.query(MigrationDetails).filter(
        MigrationDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    return migrations
    
@router.delete("/migrations/{migration_id}")
async def delete_migration(
    migration_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    migration = db.query(MigrationDetails).filter(
        MigrationDetails.id == migration_id,
        MigrationDetails.branchID == current_user.get("association").get("branchID")
    ).first()

    if not migration:
        raise HTTPException(status_code=404, detail="Migration not found")

    db.delete(migration)
    db.commit()

    return {"message": "Migration deleted successfully"}

@router.delete("/migrationsMultiple")
async def delete_migrations(
    migration_ids: List[int],
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    migrations = db.query(MigrationDetails).filter(
        MigrationDetails.id.in_(migration_ids),
        MigrationDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not migrations:
        raise HTTPException(status_code=404, detail="Migrationes not found")

    for data in migrations:
        db.delete(data)
    db.commit()

    return {"message": "Migrationes deleted successfully"}

@router.delete("/migrationsAll")
async def delete_all_migrations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    migrations = db.query(MigrationDetails).filter(
        MigrationDetails.branchID == current_user.get("association").get("branchID")
    ).all()

    if not migrations:
        raise HTTPException(status_code=404, detail="No migrations found for the user's branch")

    for migration in migrations:
        db.delete(migration)
    db.commit()

    return {"message": "All migrations deleted successfully"}