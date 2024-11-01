import subprocess
import json
import platform
import psutil
import socket
import json
import requests
import os
import getpass

result = subprocess.run(["cat", "/etc/os-release"], capture_output=True, text=True)

    # Parse the output
output = result.stdout
name = ""
version_id = ""

    # Loop through each line to find NAME and VERSION_ID
for line in output.splitlines():
        if line.startswith("NAME="):
                name = line.split("=")[1].strip('"')
        elif line.startswith("VERSION_ID="):
                version_id = line.split("=")[1].strip('"')

os_info = name + " " + version_id

make = subprocess.check_output(["sudo", "dmidecode", "-s", "system-manufacturer"]).decode().strip()
model = subprocess.check_output(["sudo", "dmidecode", "-s", "system-product-name"]).decode().strip()


total_memory_gb = round(psutil.virtual_memory().total / (1024**3), 1)
used_memory_gb = round(psutil.virtual_memory().used / (1024**3), 1)


disk_info = psutil.disk_usage('/')
total_disk_size_gb = round(disk_info.total / (1024**3), 1)
free_disk_space_gb = round(disk_info.free / (1024**3), 1)

    # Get the hostname and local IP address
hostname = socket.gethostname()
#local_ip = socket.gethostbyname(hostname)

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
ip_address = s.getsockname()[0]
s.close()
local_ip = ip_address




username = subprocess.check_output(["whoami"]).decode().strip()

#cpu = subprocess.check_output(["cat", "/proc/cpuinfo", "|", "grep", "model name", "|", "uniq" ]).decode().strip()
cpu_info = subprocess.check_output(["cat", "/proc/cpuinfo"]).decode().strip()
for line in cpu_info.splitlines():
        if "model name" in line:
                cpu=line.split(":")[1].strip()

sn = subprocess.check_output(["sudo", "dmidecode", "-s", "system-serial-number"]).decode().strip()



system_info = {
        "os":os_info,
        "make":make,
        "model":model,
        "total_memory_gb":total_memory_gb,
        "used_memory_gb":used_memory_gb,
        "total_disk_size_gb":total_disk_size_gb,
        "free_disk_space_gb":free_disk_space_gb,
        "hostname":hostname,
        "local_ip":local_ip,
                "username":username,
        "processor":cpu,
        "serial_number":sn
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
