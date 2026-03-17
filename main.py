from fastapi import FastAPI, Depends
from core.config import XpertsTax_config
from core.session import engine
from models import Base, User
from routers import registration, login, place, floor, clubs, countries, migration, parking, tariff, subuser, category, vehicleAmounts, dashboard
from routers.Roles import roles, roleUser

import os
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware


os.makedirs("files", exist_ok=True)


# Creating database
Base.metadata.create_all(bind=engine)

# Creating app instance
app = FastAPI(title=XpertsTax_config.PROJECT_NAME,
              version=XpertsTax_config.PROJECT_VERSION)


# Including the user API
app.include_router(registration.router)
app.include_router(login.router)   
app.include_router(place.router)
app.include_router(floor.router)
app.include_router(category.router)
app.include_router(clubs.router)
app.include_router(countries.router)
app.include_router(migration.router)
app.include_router(parking.router)
app.include_router(tariff.router)
app.include_router(subuser.router)
app.include_router(roles.router)
app.include_router(roleUser.router)
app.include_router(vehicleAmounts.router)
app.include_router(dashboard.router)

# Mounting assets file path

app.mount("/files", StaticFiles(directory="files"), name="files")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)