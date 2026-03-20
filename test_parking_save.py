
import requests
import json

# Replace with a valid token from your current session or run a login flow
TOKEN = "YOUR_TOKEN_HERE" 
BASE_URL = "http://127.0.0.1:8000"

def test_create_parking(slot_id, vehicle_no):
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "slotId": slot_id,
        "vehicle_no": vehicle_no,
        "club_type": "Guest",
        "barcode": 12345,
        "inTime": "2026-03-12", # Format YYYY-MM-DD as sent by frontend
        # ... other fields can be None
    }
    
    response = requests.post(f"{BASE_URL}/parking/parking", headers=headers, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")

if __name__ == "__main__":
    # You need to get a token first. 
    # For now, let's just inspect the code and try to fix the obvious gaps.
    pass
