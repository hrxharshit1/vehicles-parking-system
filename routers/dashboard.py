from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, datetime
from typing import List

from core.session import get_db
from models import ParkingDetails, User, CategoryDetails
from schemas.dashboard import DashboardSummary, ParkingActivity
from utils.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        # Total vehicles currently parked (status=1 for active)
        total_parked = db.query(ParkingDetails).filter(ParkingDetails.status == 1).count()

        # Total earnings today
        today = date.today()
        total_earnings_today = db.query(func.sum(ParkingDetails.amount)).filter(
            func.date(ParkingDetails.inTime) == today
        ).scalar()
        if total_earnings_today is None:
            total_earnings_today = 0.0

        # Total available slots (Capacity - Occupied)
        total_capacity = db.query(func.sum(CategoryDetails.limitCount)).scalar()
        if total_capacity is None:
            total_capacity = 100
        
        recent_activities = db.query(ParkingDetails).order_by(ParkingDetails.inTime.desc()).limit(5).all()

        recent_activities_data = []
        for activity in recent_activities:
            recent_activities_data.append({
                "id": activity.id,
                "vehicle_no": activity.vehicle_no,
                "inTime": activity.inTime.isoformat() if hasattr(activity.inTime, "isoformat") else str(activity.inTime),
                "status": activity.status if activity.status is not None else 1
            })
        
        dashboard_data = {
            "total_parked": total_parked,
            "total_earnings_today": float(total_earnings_today),
            "available_slots": int(max(0, total_capacity - total_parked)),
            "recent_activities": recent_activities_data
        }

        return dashboard_data
    except Exception as e:
        print(f"DASHBOARD_ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

