import requests
import json

# Test registration
url = "http://localhost:8000/auth/register"
data = {
    "username": "basha",
    "email": "basha123@gmail.com",
    "password": "password123",
    "preferred_language": "pt"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response Type: {type(response.text)}")
    print(f"Response Length: {len(response.text)}")
    print(f"Response Content:\n{response.text}")
    
    try:
        json_data = response.json()
        print(f"JSON Response:\n{json.dumps(json_data, indent=2)}")
    except:
        print("Response is not JSON")
        
    if response.status_code == 200:
        print("\nRegistration successful!")
    else:
        print(f"\nError Status: {response.status_code}")
except Exception as e:
    import traceback
    print(f"Connection error: {e}")
    traceback.print_exc()
