import subprocess
import json
import platform
import psutil
import socket
import requests
import os
import wmi

# Initialize WMI (Windows Management Instrumentation) for system information
c = wmi.WMI()

# Operating system info
os_info = platform.system() + " " + platform.version()

# Manufacturer and model
make = ""
model = ""
for system in c.Win32_ComputerSystem():
    make = system.Manufacturer
    model = system.Model

# Memory info
total_memory_gb = round(psutil.virtual_memory().total / (1024 ** 3), 1)
used_memory_gb = round(psutil.virtual_memory().used / (1024 ** 3), 1)

# Disk info
disk_info = psutil.disk_usage('C:\\')
total_disk_size_gb = round(disk_info.total / (1024 ** 3), 1)
free_disk_space_gb = round(disk_info.free / (1024 ** 3), 1)

# Hostname and IP address
hostname = socket.gethostname()

# Get local IP address
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
ip_address = s.getsockname()[0]
s.close()
local_ip = ip_address

# Username
username = os.getlogin()

# Processor info
cpu = platform.processor()

# Serial number
sn = ""
for bios in c.Win32_BIOS():
    sn = bios.SerialNumber or "N/A"  # Assign "N/A" if SerialNumber is null or empty


# Collect all system information
system_info = {
    "os": os_info,
    "make": make,
    "model": model,
    "total_memory_gb": total_memory_gb,
    "used_memory_gb": used_memory_gb,
    "total_disk_size_gb": total_disk_size_gb,
    "free_disk_space_gb": free_disk_space_gb,
    "hostname": hostname,
    "local_ip": local_ip,
    "username": username,
    "processor": cpu,
    "serial_number": sn
}

def send_system_info(url, system_info):
    try:
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, data=json.dumps(system_info), headers=headers)
        print(f"Response status: {response.status_code}")
    except requests.RequestException as e:
        print(f"Error sending request: {e}")

if __name__ == "__main__":
    # Replace with the target URL
    url = "http://10.1.40.35:5500/info/pc"
    print(json.dumps(system_info, indent=2))  # Print system info
    send_system_info(url, system_info)
