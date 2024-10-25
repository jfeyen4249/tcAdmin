use sysinfo::{System, SystemExt, DiskExt};
use serde::Serialize;
use winreg::RegKey;
use winreg::enums::*;
use std::process::Command;
use std::env;
use reqwest::blocking::Client;
use whoami;

#[derive(Serialize, Debug)]
struct SystemInfo {
    os: String,
    windows_build: String,
    total_memory_gb: f64,
    used_memory_gb: f64,
    total_disk_size_gb: f64,
    free_disk_space_gb: f64,
    serial_number: String,
    processor: String,
    local_ip: String,
    hostname: String,
    make: String,
    model: String,
    username: String,
}

fn round_to_1_decimal_place(value: f64) -> f64 {
    (value * 10.0).round() / 10.0
}

fn get_windows_version() -> String {
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    let current_version = hklm.open_subkey("SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion");
    match current_version {
        Ok(subkey) => subkey.get_value("ProductName").unwrap_or_else(|_| "Unknown".to_string()),
        Err(_) => "Unknown".to_string(),
    }
}

fn get_windows_build() -> String {
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    let current_version = hklm.open_subkey("SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion");
    match current_version {
        Ok(subkey) => subkey.get_value("ReleaseId").unwrap_or_else(|_| "Unknown".to_string()),
        Err(_) => "Unknown".to_string(),
    }
}

fn get_serial_number() -> String {
    let output = Command::new("wmic").arg("bios").arg("get").arg("serialnumber").output();
    match output {
        Ok(output) => String::from_utf8_lossy(&output.stdout)
            .lines()
            .nth(1)
            .unwrap_or("Unknown")
            .trim()
            .to_string(),
        Err(_) => "Unknown".to_string(),
    }
}

fn get_processor() -> String {
    let output = Command::new("wmic").arg("cpu").arg("get").arg("name").output();
    match output {
        Ok(output) => String::from_utf8_lossy(&output.stdout)
            .lines()
            .nth(1)
            .unwrap_or("Unknown")
            .trim()
            .to_string(),
        Err(_) => "Unknown".to_string(),
    }
}

fn get_local_ip() -> String {
    let output = Command::new("ipconfig").output();
    match output {
        Ok(output) => {
            let ipconfig_output = String::from_utf8_lossy(&output.stdout);
            for line in ipconfig_output.lines() {
                if line.contains("IPv4 Address") {
                    let parts: Vec<&str> = line.split(':').collect();
                    if let Some(ip) = parts.get(1) {
                        return ip.trim().to_string();
                    }
                }
            }
            "Unknown".to_string()
        }
        Err(_) => "Unknown".to_string(),
    }
}

fn get_make() -> String {
    let output = Command::new("wmic").arg("csproduct").arg("get").arg("vendor").output();
    match output {
        Ok(output) => String::from_utf8_lossy(&output.stdout)
            .lines()
            .nth(1)
            .unwrap_or("Unknown")
            .trim()
            .to_string(),
        Err(_) => "Unknown".to_string(),
    }
}

fn get_model() -> String {
    let output = Command::new("wmic").arg("csproduct").arg("get").arg("name").output();
    match output {
        Ok(output) => String::from_utf8_lossy(&output.stdout)
            .lines()
            .nth(1)
            .unwrap_or("Unknown")
            .trim()
            .to_string(),
        Err(_) => "Unknown".to_string(),
    }
}

fn get_total_memory() -> f64 {
    let output = Command::new("powershell")
        .arg("-Command")
        .arg("Get-WmiObject Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum | Select-Object -ExpandProperty Sum")
        .output();

    match output {
        Ok(output) => {
            let output_str = String::from_utf8_lossy(&output.stdout);
            if let Ok(memory_bytes) = output_str.trim().parse::<f64>() {
                return round_to_1_decimal_place(memory_bytes / 1024.0 / 1024.0 / 1024.0); // Convert to GB
            }
            0.0
        },
        Err(_) => 0.0,
    }
}

fn main() {
    // Check if the `-I` flag is passed
    let args: Vec<String> = env::args().collect();
    let show_info_only = args.contains(&"-I".to_string());

    let mut sys = System::new_all();
    sys.refresh_all();

    
    let total_memory_gb = get_total_memory(); 
    let free_memory_gb = round_to_1_decimal_place((sys.free_memory() as f64) / 1024.0 / 1024.0 / 1024.0); 
    let used_memory_gb = round_to_1_decimal_place(total_memory_gb - free_memory_gb);

    // Get first disk if available
    let disk = sys.disks().get(0); 
    let (total_disk_size_gb, free_disk_space_gb) = if let Some(disk) = disk {
        (
            round_to_1_decimal_place((disk.total_space() as f64) / 1024.0 / 1024.0 / 1024.0),
            round_to_1_decimal_place((disk.available_space() as f64) / 1024.0 / 1024.0 / 1024.0),
        )
    } else {
        (0.0, 0.0) // Fallback values if disk is not found
    };

    // Get other details
    let windows_version = get_windows_version();
    let windows_build = get_windows_build();
    let serial_number = get_serial_number();
    let processor = get_processor();
    let local_ip = get_local_ip();
    let hostname = sys.host_name().unwrap_or_else(|| "Unknown".to_string());
    let make = get_make();
    let model = get_model();
    let username = whoami::username();

    // Prepare JSON payload
    let system_info = SystemInfo {
        os: windows_version,
        windows_build,
        total_memory_gb,
        used_memory_gb,
        total_disk_size_gb,
        free_disk_space_gb,
        serial_number,
        processor,
        local_ip,
        hostname,
        make,
        model,
        username,
    };

    // If `-I` flag is passed, print the system info and exit
    if show_info_only {
        println!("{:#?}", system_info);
        println!( "Logged In Username: {}",
            whoami::username(),
        );
        return;
    }

    // Otherwise, send the HTTP request
    let json_payload = serde_json::to_string(&system_info).expect("Failed to serialize system info");

    let client = Client::new();
    let response = client.post("http://pctools:5500/info/pc")
        .header("Content-Type", "application/json")
        .body(json_payload.clone())
        .send();

    // Print the response status or error
    match response {
        Ok(res) => println!("Response status: {}", res.status()),
        Err(e) => println!("Error sending request: {}", e),
    }
}
