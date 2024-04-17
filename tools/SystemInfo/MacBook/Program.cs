using System;
using System.Diagnostics;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

class Program
{
    static async Task Main(string[] args)
    {
        // Get system information
        SystemInfo systemInfo = GetSystemInfo();

        // Convert system info to JSON
        string json = JsonConvert.SerializeObject(systemInfo);

        // Send HTTP POST request
        await SendPostRequest(json);
    }

    static SystemInfo GetSystemInfo()
{
    string processorInfo = GetProcessorInfo();
    double totalRAMInGB = GetTotalRAMInGB();
    double totalStorageSpaceInGB = GetTotalStorageSpaceInGB();
    double freeStorageSpaceInGB = GetFreeStorageSpaceInGB();
    double usedRAMInGB = GetUsedRAMInGB();
    string computerName = Environment.MachineName;
    string macAddress = GetMACAddress();
    string osVersion = GetOSVersion();
    string serialNumber = GetSerialNumber();
    string ipAddress = GetIPAddress();
    string macModel = GetMacModel(); // Retrieve the Mac model

    SystemInfo systemInfo = new SystemInfo
    {
        Processor = processorInfo,
        TotalRAMInGB = totalRAMInGB,
        TotalStorageSpaceInGB = totalStorageSpaceInGB,
        FreeStorageSpaceInGB = freeStorageSpaceInGB,
        UsedRAMInGB = usedRAMInGB,
        ComputerName = computerName,
        MACAddress = macAddress,
        OSVersion = osVersion,
        SerialNumber = serialNumber,
        IPAddress = ipAddress,
        MacModel = macModel // Include the Mac model in the system info
    };

    return systemInfo;
}


    static async Task SendPostRequest(string json)
    {
        try
        {
            // Define the URL where you want to send the POST request
            string url = "http://192.168.0.140:5500/connection/info/mac";

            // Create an HttpClient instance
            using (HttpClient client = new HttpClient())
            {
                // Create a StringContent object with the JSON data
                StringContent content = new StringContent(json, Encoding.UTF8, "application/json");

                // Send the POST request and get the response
                HttpResponseMessage response = await client.PostAsync(url, content);
                string responseContent = await response.Content.ReadAsStringAsync();
                // Check if the request was successful
                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"POST request successful! Response: {responseContent}");
                }
                else
                {
                    Console.WriteLine($"POST request failed: {response.StatusCode}");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while sending the POST request: {ex.Message}");
        }
    }

    static string GetProcessorInfo()
    {
        return RunShellCommand("sysctl -n machdep.cpu.brand_string");
    }

    static double GetTotalRAMInGB()
    {
        string result = RunShellCommand("sysctl -n hw.memsize");
        long totalRAMBytes = long.Parse(result);
        double totalRAMGB = totalRAMBytes / (1024.0 * 1024.0 * 1024.0); // Convert bytes to gigabytes
        return Math.Round(totalRAMGB, 2);
    }

    static double GetTotalStorageSpaceInGB()
    {
        string result = RunShellCommand("df -H / | awk 'NR==2 {print $2}' | sed 's/G//'");
        return double.Parse(result);
    }

    static double GetFreeStorageSpaceInGB()
    {
        string result = RunShellCommand("df -H / | awk 'NR==2 {print $4}' | sed 's/G//'");
        return double.Parse(result);
    }

    static double GetUsedRAMInGB()
    {
        string result = RunShellCommand("top -l 1 | awk '/PhysMem/ {print $8}' | sed 's/M//'");
        double usedRAMGB = double.Parse(result) / 1024.0; // Convert megabytes to gigabytes
        return Math.Round(usedRAMGB, 2);
    }

    static string GetMACAddress()
    {
        return RunShellCommand("ifconfig en0 | awk '/ether/ {print $2}'");
    }

   static string GetOSVersion()
    {
        return RunShellCommand("sw_vers -productVersion");
    }


    static string GetSerialNumber()
    {
        return RunShellCommand("system_profiler SPHardwareDataType | awk '/Serial/ {print $4}'");
    }

    static string GetIPAddress()
    {
        return RunShellCommand("ifconfig en0 | awk '/inet / {print $2}'");
    }

    static string GetMacModel()
    {
        return RunShellCommand("sysctl -n hw.model");
    }


    static string RunShellCommand(string command)
    {
        string result = "";
        try
        {
            ProcessStartInfo startInfo = new ProcessStartInfo
            {
                FileName = "/bin/bash",
                Arguments = $"-c \"{command}\"",
                RedirectStandardOutput = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using (Process process = Process.Start(startInfo))
            {
                result = process.StandardOutput.ReadToEnd().Trim();
                process.WaitForExit();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error running shell command: {ex.Message}");
        }
        return result;
    }

    class SystemInfo
    {
        public string Processor { get; set; }
        public double TotalRAMInGB { get; set; }
        public double TotalStorageSpaceInGB { get; set; }
        public double FreeStorageSpaceInGB { get; set; }
        public double UsedRAMInGB { get; set; }
        public string ComputerName { get; set; }
        public string MACAddress { get; set; }
        public string OSVersion { get; set; }
        public string SerialNumber { get; set; }
        public string IPAddress { get; set; }

        public string MacModel { get; set; }
    }
}
