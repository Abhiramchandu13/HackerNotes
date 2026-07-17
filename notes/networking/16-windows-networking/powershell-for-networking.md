# PowerShell for Networking

> PowerShell is Microsoft's task automation framework and configuration management program, consisting of a command-line shell and associated scripting language, fundamentally changing how administrators manage Windows networking.

## Overview
Historically, Windows network administration relied on clunky GUIs (Network and Sharing Center) or ancient, output-only command-line tools like `ipconfig` and `ping`. **PowerShell** revolutionized this by introducing Cmdlets (Command-lets) that interact directly with the Windows networking stack and the WMI/CIM database.

Unlike Bash or legacy Command Prompt, PowerShell outputs objects, not just text strings. This allows administrators to query an IP address, pipe that object into a variable, and use its properties to instantly configure a firewall rule—all in a single line of code.

## Why It Matters
Modern Windows Server administration (especially Server Core, which has no GUI) requires PowerShell. If you want to automate the deployment of 50 web servers in Azure, or quickly troubleshoot a routing issue across a cluster of Hyper-V hosts, you cannot click through menus. For cybersecurity, PowerShell is a double-edged sword: it is the ultimate tool for incident response (querying connections), but it is also the primary weapon used by malware to execute "fileless" attacks and move laterally across networks.

## Core Concepts
- **Verb-Noun Syntax:** PowerShell commands always follow a clear naming convention: `Action-Target` (e.g., `Get-NetAdapter`, `Test-NetConnection`).
- **Objects, Not Text:** When you run `Get-NetIPAddress`, you aren't getting a string of text. You are getting an object with properties (`IPAddress`, `PrefixOrigin`). You can interact with these properties programmatically.
- **Pipelines (`|`):** The output of one command can be passed directly as the input to the next command.
- **Modules:** Networking commands are bundled into modules (like `NetTCPIP` or `NetSecurity`) that are loaded automatically.

## How It Works
1. You open a PowerShell prompt.
2. You type `Get-NetAdapter | Where-Object {$_.Status -eq "Up"}`.
3. `Get-NetAdapter` queries the Windows kernel for all physical and virtual network interface cards and generates a list of objects.
4. The pipeline (`|`) passes those objects to the `Where-Object` cmdlet.
5. The `Where-Object` cmdlet filters the list, keeping only the adapters where the `Status` property equals "Up".
6. The final filtered list is displayed on the screen.

## Components / Types
Key networking modules in PowerShell:
- **NetTCPIP:** Manages IP addresses, routing, and ports (`Get-NetIPAddress`, `New-NetRoute`).
- **NetAdapter:** Manages the physical and virtual NICs (`Get-NetAdapter`, `Restart-NetAdapter`).
- **NetSecurity:** Manages the Windows Defender Firewall (`Get-NetFirewallRule`, `New-NetFirewallRule`).
- **DnsClient:** Manages DNS resolution and cache (`Resolve-DnsName`, `Clear-DnsClientCache`).

## Practical Examples
- **The Modern Ping:** Instead of using the legacy `ping` or `tracert`, modern admins use `Test-NetConnection`. It not only pings, but it can test specific TCP ports and perform route tracing in a single command, returning structured data.
- **Automated Provisioning:** A script automatically runs on a newly deployed server, renames the network adapter, assigns a static IP, sets the DNS servers, and disables IPv6, taking 2 seconds instead of 5 minutes of GUI clicking.

## Security Considerations
- **PowerShell Remoting (WinRM):** PowerShell allows admins to run commands on remote computers (e.g., `Invoke-Command -ComputerName Server1 -ScriptBlock {Get-NetAdapter}`). This runs over TCP port 5985/5986. It is highly secure (encrypted by default in AD), but if an attacker compromises an admin credential, they can use WinRM to execute malware across the entire network simultaneously.
- **Execution Policies:** By default, Windows prevents the execution of PowerShell scripts (`.ps1` files) to stop accidental malware execution. However, this is a minor hurdle, not a security boundary; attackers bypass it easily (e.g., `powershell.exe -ExecutionPolicy Bypass`).
- **Script Block Logging:** A critical defense mechanism. Defenders configure Group Policy to record every single block of PowerShell code executed on any machine into the Windows Event Logs, allowing SOC analysts to see exactly what an attacker typed.

## Commands / Configuration Examples
### Diagnostic Commands (Replacing Legacy Tools)
```powershell
# Legacy: ping 8.8.8.8
# Modern: Tests ping, but also provides source IP, interface, and detailed metrics
Test-NetConnection 8.8.8.8

# Legacy: telnet example.com 443
# Modern: Tests if a specific TCP port is open on a remote server
Test-NetConnection example.com -Port 443

# Legacy: nslookup example.com
# Modern: Queries DNS and returns structured objects
Resolve-DnsName example.com

# Legacy: ipconfig /all
# Modern: Retrieves detailed IP configuration objects
Get-NetIPConfiguration
```

### Configuration Commands (Requires Administrator)
```powershell
# Find an adapter and assign a static IP and Gateway
New-NetIPAddress -InterfaceAlias "Ethernet0" -IPAddress 192.168.1.50 -PrefixLength 24 -DefaultGateway 192.168.1.1

# Set the DNS servers for the adapter
Set-DnsClientServerAddress -InterfaceAlias "Ethernet0" -ServerAddresses 10.0.0.5, 8.8.8.8

# Restart a frozen network adapter
Restart-NetAdapter -Name "Ethernet0"
```

## Troubleshooting
- **Command Not Found:** If a specific networking cmdlet doesn't work, you might be on an older version of Windows (Windows 7/Server 2008), or the specific module (like `NetSecurity`) isn't installed.
- **Access Denied:** Commands that modify the network state (like `New-NetIPAddress` or restarting adapters) require you to open PowerShell as an Administrator. Diagnostics (like `Test-NetConnection`) can be run as a standard user.
- **Remote Execution Fails:** If `Invoke-Command` fails to connect to a remote server, ensure the remote server has WinRM enabled (`Enable-PSRemoting`) and the firewall allows inbound traffic on Port 5985.

## Interview Questions
- What PowerShell cmdlet replaces the legacy `ping` and `telnet` commands for testing port connectivity? (Answer: `Test-NetConnection`).
- Explain the benefit of PowerShell outputting objects rather than plain text.
- How do you view the IP configuration of a Windows machine using native PowerShell cmdlets? (Answer: `Get-NetIPConfiguration` or `Get-NetIPAddress`).
- What is PowerShell Remoting, and what protocol does it use under the hood? (Answer: It allows remote execution of commands, utilizing WinRM over HTTP/HTTPS).

## Summary
PowerShell has fundamentally modernized Windows network administration. By providing an object-oriented, scriptable interface to the operating system's networking stack, it enables the rapid automation, precise diagnostics, and scalable management required in complex enterprise and cloud environments.

## References
- [Windows Firewall](windows-firewall.md)
- [DNS in Windows](dns-in-windows.md)
- [Ping](../10-monitoring-and-troubleshooting/ping.md)
- [ipconfig](../10-monitoring-and-troubleshooting/ip-command.md)
