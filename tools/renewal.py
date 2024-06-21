import requests
import json
from datetime import datetime, timedelta

# Function to send GET request and retrieve data
def get_renewal_data(url):
    response = requests.get(url)
    return response.json()

# Function to calculate the number of days until the renewal date
def days_until_renewal(renewal_date):
    today = datetime.today()
    renewal_date = datetime.strptime(renewal_date, "%m-%d-%Y")
    return (renewal_date - today).days

# Function to send POST request
def send_post_request(item, days_left):
    post_url = f"http://127.0.0.1:5500/info/renewal?id={item['id']}"
    post_data = {"id": item['id'], "days_left": days_left}
    response = requests.post(post_url, json=post_data)
    print(f"Posted to {post_url} with data {post_data} - Response: {response.status_code}")

# Main script
if __name__ == "__main__":
    get_url = "http://127.0.0.1:5500/info/renewal"
    renewal_data = get_renewal_data(get_url)
    reminder_days = [90, 60, 30, 10]
    
    for item in renewal_data:
        renewal_date = item['renewal_date']
        days_left = days_until_renewal(renewal_date)
        print(f"ID: {item['id']} - Days until renewal: {days_left}")

        if days_left in reminder_days:
            send_post_request(item, days_left)
