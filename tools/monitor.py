import requests
import subprocess
import sys
import time
import socket

server_url = 'http://127.0.0.1:5500/info/monitor'
post_url = 'http://127.0.0.1:5500/info/monitor'

ip_list = []

# Fetch IP addresses and types from the server
try:
    response = requests.get(server_url)
    response.raise_for_status()
    ip_list = response.json()
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
        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred while posting status for {ip}: {http_err}")
        except Exception as err:
            print(f"Other error occurred while posting status for {ip}: {err}")
    except Exception as e:
        print(f"Error pinging IP {ip}: {e}")

def http_check(id, ip):
    try:
        print(f"Checking HTTP on IP: {ip}")
        response = requests.get(f"http://{ip}")
        success = response.status_code == 200
        payload = {'id': id, 'ip': ip, 'status': 'passed' if success else 'failed'}
        print(f"HTTP check result for {ip}: {'success' if success else 'failed'}")
    except Exception as e:
        print(f"Error checking HTTP on IP {ip}: {e}")
        payload = {'id': id, 'ip': ip, 'status': 'failed'}
    
    try:
        response = requests.post(post_url, json=payload)
        response.raise_for_status()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred while posting status for {ip}: {http_err}")
    except Exception as err:
        print(f"Other error occurred while posting status for {ip}: {err}")

def port_scan(id, ip, ports):
    failed_ports = []
    for port in ports.split(','):
        try:
            port = int(port.strip())
            print(f"Scanning port {port} on IP: {ip}")
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex((ip, port))
            success = result == 0
            sock.close()
            if not success:
                failed_ports.append(port)
            print(f"Port scan result for {ip}:{port}: {'success' if success else 'failed'}")
        except Exception as e:
            print(f"Error scanning port {port} on IP {ip}: {e}")
            failed_ports.append(port)

    status = 'passed' if not failed_ports else 'degraded'
    message = f"The following ports have failed: {', '.join(map(str, failed_ports))}" if failed_ports else ""
    payload = {'id': id, 'ip': ip, 'ports': ports, 'status': status, 'message': message}

    try:
        response = requests.post(post_url, json=payload)
        response.raise_for_status()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred while posting status for {ip}:{ports}: {http_err}")
    except Exception as err:
        print(f"Other error occurred while posting status for {ip}:{ports}: {err}")

# Process each item in the IP list
for item in ip_list:
    id = item.get('id')
    ip = item.get('ip')
    check_type = item.get('type')
    ports = item.get('port')
    print(f"Processing ID: {id}, IP: {ip}, Type: {check_type}, Ports: {ports}")

    if check_type == 'ping':
        ping_ip(id, ip)
    elif check_type == 'http':
        http_check(id, ip)
    elif check_type == 'scan' and ports != 'none':
        port_scan(id, ip, ports)
    else:
        print(f"Unknown check type or missing ports for ID: {id}, IP: {ip}")

    time.sleep(1)

print("Script completed.")
sys.exit(0)
