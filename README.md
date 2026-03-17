# Vehicles Parking System

A comprehensive parking management system featuring a powerful Python FastAPI backend and a beautiful, responsive React frontend.

## 🚀 Features
- **Secure Authentication:** JWT-based login, role management, and tiered access for users and admins.
- **Parking Management:** Track active vehicles, historical data, spaces, and active parking durations.
- **Dynamic Pricing:** Highly configurable tariff rules based on vehicle size, category, and parking durations.
- **Facility Mapping:** Support for multiple places, floors, and specific spatial tracking.
- **Modern UI:** Built on React and Vite for a blazing fast frontend experience.

## 🛠️ Technology Stack
- **Backend:** Python 3, FastAPI, SQLAlchemy
- **Database:** MySQL
- **Frontend:** React 19, Vite, CoreUI, Chart.js

---

## 💻 Local Development Setup

### 1. Database Setup
Ensure you have MySQL running. Create an empty database (e.g., `VehicleParking`).

### 2. Backend Setup
Navigate to the root directory and set up your Python environment:
```bash
# Create and activate a virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure your environment
# Copy .env.example to .env and fill in your MySQL credentials
cp .env.example .env

# Run the backend development server
python main.py
```
*The backend API will run at http://127.0.0.1:8000.*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and start the Vite server:
```bash
cd vehicles-parking-system-frontend

# Install dependencies
npm install

# Start the frontend
npm run start
```
*The frontend application will run at http://localhost:3000.*

## 🔒 Security
This project uses `.gitignore` to protect sensitive information. Your `.env` files, `node_modules`, and `venv` directories are intentionally excluded from version control to protect your credentials and maintain a clean repository.
