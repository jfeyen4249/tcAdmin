param (
    [switch]$i
)

# Get Windows version
$windowsVersion = (Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion").ProductName
$windowsBuild = (Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion").ReleaseId

# Get total memory in GB
$totalMemory = [math]::Round((Get-WmiObject -Class Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)

# Get free memory in GB
$freeMemoryKB = (Get-CimInstance -ClassName Win32_OperatingSystem).FreePhysicalMemory
$freeMemoryGB = [math]::Round($freeMemoryKB / 1024 / 1024, 2) # Converting KB to GB

# Get used memory in GB
$usedMemory = [math]::Round($totalMemory - $freeMemoryGB, 2)

# Get total disk size in GB
$totalDiskSize = [math]::Round((Get-PSDrive -PSProvider FileSystem | Where-Object {$_.Name -eq "C"}).Used / 1GB, 2)

# Get free disk space in GB
$freeDiskSpace = [math]::Round((Get-PSDrive -PSProvider FileSystem | Where-Object {$_.Name -eq "C"}).Free / 1GB, 2)

# Get serial number
$serialNumber = (Get-WmiObject -Class Win32_BIOS).SerialNumber

# Get processor information
$processor = (Get-WmiObject -Class Win32_Processor).Name

# Get local IP address (check common network interfaces)
$localIP = $null
$interfaces = @("Ethernet", "Wi-Fi", "Local Area Connection", "Ethernet 2", "Ethernet 3")
foreach ($interface in $interfaces) {
    try {
        $ip = Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias $interface -ErrorAction Stop | Select-Object -ExpandProperty IPAddress
        if ($ip) {
            $localIP = $ip
            break
        }
    } catch {
        continue
    }
}

# Get the hostname
$hostname = (Get-WmiObject Win32_ComputerSystem).Name

# Get the make and model
$computerSystem = Get-WmiObject -Class Win32_ComputerSystem
$make = $computerSystem.Manufacturer
$model = $computerSystem.Model

# Create JSON payload
$jsonPayload = @{
    os = $windowsVersion
    windows_build = $windowsBuild
    total_memory_gb = $totalMemory
    used_memory_gb = $usedMemory
    total_disk_size_gb = $totalDiskSize
    free_disk_space_gb = $freeDiskSpace
    serial_number = $serialNumber
    processor = $processor
    local_ip = $localIP
    hostname = $hostname
    make = $make
    model = $model
} | ConvertTo-Json

# Display the JSON payload if -i flag is used
if ($i) {
    Write-Host "JSON Payload:"
    Write-Host $jsonPayload
    Read-Host "Press Enter to continue..."
}

# Send JSON payload to the specified URL
Invoke-RestMethod -Uri "http://10.1.40.32:5500/info/pc" -Method Post -ContentType "application/json" -Body $jsonPayload
