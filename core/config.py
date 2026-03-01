# To configure database
import os
from dotenv import load_dotenv

from pathlib import Path
env_path = Path('.')/'.env'
load_dotenv(dotenv_path=env_path)

class project_config:
    # To name the project
    PROJECT_NAME: str = "Vehicles Parking System"
    PROJECT_VERSION: str = "1.0.0"
    BASE_URL: str = os.getenv("BASE_URL")
    
    # To configure database
    MYSQL_USER : str = os.getenv("MYSQL_USER")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
    MYSQL_SERVER : str = os.getenv("MYSQL_SERVER","localhost")
    MYSQL_PORT : str = os.getenv("MYSQL_PORT",3306) # default mysql port is 3306
    MYSQL_DB : str = os.getenv("MYSQL_DB","tdd")
    DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_SERVER}:{MYSQL_PORT}/{MYSQL_DB}"
    ADMIN_SECRET_PASSWORD: str = os.getenv("ADMIN_SECRET_PASSWORD", "your_secure_password")


XpertsTax_config = project_config()