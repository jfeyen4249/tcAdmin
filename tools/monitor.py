import requests
import subprocess
import sys
import time

server_url = 'http://127.0.0.1:5500/info/monitor'
post_url = 'http://127.0.0.1:5500/info/monitor'

ip_list = []

# Fetch IP addresses from the server
try:
    response = requests.get(server_url)
    response.raise_for_status()
    ip_list = response.json()
    #print(f"IP addresses received: {ip_list}")
except requests.exceptions.HTTPError as http_err:
    print(f"HTTP error occurred: {http_err}")
except Exception as err:
    print(f"Other error occurred: {err}")

def ping_ip(id, ip):
    try:
        print(f"Pinging IP: {ip}")
        output = subprocess.run(['ping', '-c', '1', ip], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        success = output.returncode == 0
        payload = {'id': id, 'ip': ip, 'status': 'passed' if success else 'failed'}
        print(f"Ping result for {ip}: {'success' if success else 'failed'}")
        
        try:
            response = requests.post(post_url, json=payload)
            response.raise_for_status()
            #print(f"Posted status for {ip}: {payload['status']}")
        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred while posting status for {ip}: {http_err}")
        except Exception as err:
            print(f"Other error occurred while posting status for {ip}: {err}")
            print('')
            print('')
        time.sleep(1)  # Adding a short delay to ensure the loop proceeds correctly
    except Exception as e:
        print(f"Error pinging IP {ip}: {e}")

print(ip_list)
print('')
print('')
print('')

# Corrected for loop to iterate over IP addresses
for item in ip_list:
    id = item.get('id')
    ip = item.get('ip')
    print(f"Processing ID: {id}, IP: {ip}")
    ping_ip(id, ip)
    time.sleep(1)

print("Script completed.")
print('')
print('')
print('')
sys.exit(0)
