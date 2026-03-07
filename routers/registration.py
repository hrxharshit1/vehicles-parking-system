from fastapi import APIRouter, status, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from core.session import get_db
from schemas.users import UserCreate, pass_reset
from models import User, password_reset, UserPermission,OTP
from utils.hashing import Hasher
from utils.auth import get_current_user, prepare_auth_data
from utils.sendOTP import sendOTPemail, sendOTPmobile, otp_generator, sendConfirmInfo, sendRegistrationMail
from utils.auth import create_access_token
from datetime import datetime

router = APIRouter(tags=["Users"])

# Store entry into the database
@router.post("/register", status_code=status.HTTP_201_CREATED)
def registration(
    request: UserCreate, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)):
    print(request)

    user_email_check = db.query(User).filter(User.email == request.email.lower())
    if user_email_check.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with the Email ID: {request.email} already exists"
        )
    
    user_mobile_check = db.query(User).filter(User.mobile == request.mobile)
    if user_mobile_check.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with the Mobile No.: {request.mobile} already exists"
        )
    
    user = User(
        customerName=request.customerName,
        companyName=request.companyName,
        gstNo=request.gstNo,
        email=request.email.lower(),
        mobile=request.mobile,
        verified=request.verified,
        password=Hasher.get_password_hash(request.password),
        branchName="Head Office",
        status=True
    )

    db.add(user)
    db.flush()
    userID = user.id
    db.query(User
    ).filter(User.id == userID
    ).update({
        "headOfficeID": userID,
        "branchID": userID,
        "level": 1
    })


    user_permission = UserPermission(
        user_id=userID
    )
    db.add(user_permission)
    db.commit()
    db.refresh(user_permission)

    # sendRegistrationMail(request.email, request.mobile, background_tasks)

    access_token = create_access_token(data = prepare_auth_data(db=db, id=user.id), EXPIRY=60)

    return {"message": "User Created Successfully!!!", "access_token": access_token, "token_type": "bearer"}

# Get user detail
@router.get("/get-curruser", status_code=status.HTTP_200_OK)
def get_curr_user(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)):

    user = db.query(User
        ).filter(User.id == current_user.get("id")
        ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not exists"
        )
    
    access_token = create_access_token(
        data=prepare_auth_data(db=db, id=user.id), EXPIRY=60)

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/forget", status_code=status.HTTP_200_OK)
def forgetPassword(
    inp: str, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)):

    # Identify user by email or mobile
    if "@" in inp:
        user = db.query(User).filter(User.email == inp.lower()).first()
    else:
        user = db.query(User).filter(User.mobile == int(inp)).first()

    if not user:
        raise HTTPException(status_code=404, detail="User does not exist")
    
    if not user.status:
        raise HTTPException(status_code=406, detail="User Inactive")

    # Generate OTPs
    email_otp = otp_generator()
    mobile_otp = otp_generator()
    message = "Password reset request"

    # Send OTP
    sendOTPemail(email_otp, user.email, message, background_tasks)
    sendOTPmobile(mobile_otp, user.mobile, message, background_tasks)

    # Check if OTP record exists
    otp_record = db.query(OTP).filter(OTP.user_id == user.id).first()
    
    if otp_record:
        otp_record.otp_email = email_otp
        otp_record.otp_mobile = mobile_otp
        otp_record.email_verified = False
        otp_record.mobile_verified = False
        otp_record.email_otp_created = datetime.now()
        otp_record.mobile_otp_created = datetime.now()
    else:
        db.add(OTP(
            user_id=user.id,
            otp_email=email_otp,
            otp_mobile=mobile_otp,
            email_otp_created=datetime.now(),
            mobile_otp_created=datetime.now()
        ))

    db.commit()

    return {"message": "OTP sent to your email and mobile for password reset."}

@router.get("/getEmail")
def getEmail(user_id: int, db: Session = Depends(get_db)):
    otp_record = db.query(OTP).filter(OTP.user_id == user_id).first()
    user = db.query(User).filter(User.id == user_id).first()

    if not otp_record or not user:
        raise HTTPException(status_code=404, detail="No data found")

    return {"email": user.email}

@router.put("/changePass", status_code=status.HTTP_200_OK)
def changePassword(
    request: pass_reset,  # Needs fields: email, otp, password
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == request.email.lower()).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp_record = db.query(OTP).filter(OTP.user_id == user.id).first()

    if not otp_record or otp_record.otp_email != request.otp:
        raise HTTPException(status_code=406, detail="Incorrect OTP")

    # Password update
    user.password = Hasher.get_password_hash(request.password)
    otp_record.email_verified = True

    # Optionally update othersPassReset or track reset
    otp_record.othersOTP = Hasher.get_password_hash(request.password)

    mess = "Your new password is:"
    sendConfirmInfo(request.password, request.email, mess, background_tasks)

    db.commit()

    return {"message": "Password updated successfully"}


@router.get("/subUserAll")
async def sub_useres_getAll(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user
                                 )):
    if not current_user.get("association") or not current_user.get("association").get("branchID"):
        raise HTTPException(status_code=403, detail="User association data not found")

    useres = db.query(User).filter(
        User.branchID == current_user.get("association").get("branchID")
    ).all()

    return useres
