# Windows Networking Labs

> Windows Networking Labs provide practical experience in configuring, managing, and troubleshooting network services and interfaces on Windows Server and client operating systems.

## Overview
Windows operating systems power the majority of corporate desktops and a significant portion of enterprise servers. Proficiency in Windows networking is a fundamental skill for system administrators, IT support, and cybersecurity professionals. **Windows Networking Labs** offer a hands-on environment to master essential tools, understand network configurations, and diagnose connectivity issues within the Microsoft ecosystem.

## Why It Matters
Windows networking is deeply integrated with Active Directory, Group Policy, and a suite of proprietary protocols (SMB, NTLM, Kerberos). These labs help you:
- Understand how IP addresses are assigned and managed (DHCP).
- Configure host-based firewalls (Windows Defender Firewall).
- Manage DNS resolution (Windows DNS Server, client resolver).
- Utilize PowerShell for network automation and configuration.
- Troubleshoot common connectivity problems.

## Core Concepts
-   **`ipconfig`:** Legacy command for viewing IP configuration.
-   **PowerShell networking cmdlets:** `Get-NetAdapter`, `Get-NetIPConfiguration`, `Test-NetConnection`, `New-NetFirewallRule`.
-   **Windows Defender Firewall:** Host-based firewall management.
-   **DHCP Client/Server:** Managing IP address assignment.
-   **DNS Client/Server:** Managing hostname resolution, Active Directory integration.
-   **`netsh`:** Command-line utility for network configuration (legacy but still used).

## How It Works
1.  You create a virtual machine (e.g., in VirtualBox, VMware, or Hyper-V) running a Windows Server or client OS.
2.  You access the VM's command-line interface (CLI) via PowerShell or Command Prompt, or use the Server Manager GUI.
3.  You use Windows networking commands and tools to implement lab objectives (e.g., assign a static IP, configure a firewall rule to open port 3389 for RDP, set up a DHCP server).
4.  You verify your configuration using diagnostic tools (`ping`, `nslookup`, `Test-NetConnection`) and troubleshoot any issues.

## Components / Types
-   **Virtual Machines (VMs):** Using Hyper-V, VirtualBox, or VMware Workstation to create isolated Windows instances.
-   **Cloud Instances:** Utilizing Azure VMs or AWS EC2 instances for Windows server labs.
-   **Remote Server Administration Tools (RSAT):** A suite of GUI tools that can be installed on a Windows 10/11 client to manage remote Windows Servers.

## Practical Examples
-   **Static IP Configuration Lab:** Assign a static IPv4 address, subnet mask, default gateway, and DNS servers to a Windows Server.
-   **RDP Firewall Lab:** Configure Windows Defender Firewall to allow inbound RDP (port 3389) from a specific management subnet while blocking all other connections.
-   **DHCP Server Lab:** Set up a Windows Server DHCP role to hand out IP addresses to other virtual clients, integrating with Active Directory.
-   **Troubleshooting Internet Access:** Diagnose why a Windows client cannot reach external websites using `ipconfig`, `ping`, `nslookup`, and `Test-NetConnection`.

## Security Considerations
-   **Firewalling:** Mastering Windows Defender Firewall is paramount for protecting Windows endpoints from lateral movement and internet-borne threats.
-   **PowerShell Security:** PowerShell is a powerful scripting tool that can be abused by attackers. Practice using it securely and be aware of PowerShell attack vectors.
-   **SMB Security:** Windows relies heavily on SMB for file sharing. Labs should cover disabling SMBv1 and securing SMB configurations.
-   **DNS Security:** Proper DNS configuration is critical for Active Directory. Labs should cover securing dynamic updates and preventing zone transfers.

## Commands / Configuration Examples
### Common Windows Networking Commands
```powershell
# View IP configuration
ipconfig /all

# View network adapters
Get-NetAdapter

# View routing table
route print

# Test connectivity (ping, port check, tracert)
Test-NetConnection 8.8.8.8 -Port 443

# Show listening ports and connections
netstat -ano

# Configure static IP
New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress 192.168.1.50 -PrefixLength 24 -DefaultGateway 192.168.1.1

# Allow RDP through firewall
New-NetFirewallRule -DisplayName "Allow RDP Inbound" -Direction Inbound -LocalPort 3389 -Protocol TCP -Action Allow
```

## Troubleshooting
-   **No Internet Access:** Check `ipconfig /all` for IP, gateway, and DNS. Ping gateway and `8.8.8.8`. `nslookup google.com`.
-   **Cannot Remote Desktop:** Verify RDP is enabled in system settings. Check Windows Defender Firewall rules for port 3389.
-   **Application Not Working:** Use `Test-NetConnection` to verify port connectivity. Check `netstat -ano` to ensure the application is listening.

## Interview Questions
-   How do you configure a static IP address and DNS servers on a Windows machine using PowerShell?
-   What are the default network profiles for Windows Defender Firewall, and how do they differ?
-   How do you troubleshoot a Windows server that can ping internal resources but not external websites?
-   What PowerShell cmdlet can you use to test if a specific TCP port is open on a remote Windows server? (Answer: `Test-NetConnection`).

## Summary
Windows Networking Labs provide the essential hands-on training for managing the network stack of Microsoft environments. By working through practical scenarios with PowerShell, host firewalls, and Active Directory integration, administrators build the confidence and expertise required to operate and secure critical Windows infrastructure.

## References
- [PowerShell for Networking](../16-windows-networking/powershell-for-networking.md)
- [Windows Firewall](../16-windows-networking/windows-firewall.md)
- [DHCP in Windows](../16-windows-networking/dhcp-in-windows.md)
- [DNS in Windows](../16-windows-networking/dns-in-windows.md)
