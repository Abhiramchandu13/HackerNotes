# Windows Firewall

> The Windows Defender Firewall is a stateful, host-based firewall built directly into the Windows operating system, providing a critical layer of defense by controlling inbound and outbound network traffic for the individual machine.

## Overview
While a corporate network firewall protects the entire building from the Internet, the **Windows Defender Firewall with Advanced Security** protects the individual laptop or server from *other computers inside the building*. 

Operating at Layers 3 and 4 (IP and Ports), and optionally at Layer 7 (Application filtering), it ensures that even if an attacker plugs into the corporate LAN or a user connects to a hostile coffee shop Wi-Fi, the machine itself rejects unauthorized connections. 

## Why It Matters
In a modern "Assume Breach" or Zero Trust environment, you cannot trust the local network. A compromised printer on the same VLAN could be used to launch SMB exploits against a domain controller. The Windows Firewall acts as micro-segmentation at the host level, making lateral movement incredibly difficult for attackers. For system administrators, mastering its configuration via Group Policy is a foundational security task.

## Core Concepts
- **Host-Based:** Runs on the endpoint itself. Moves with the laptop wherever it goes.
- **Stateful Inspection:** It remembers outbound connections. If your browser reaches out to a website on port 80, the firewall automatically allows the website's reply back in, even if inbound port 80 is technically blocked by default.
- **Network Profiles:** The firewall behaves differently depending on what type of network you connect to:
  - *Domain:* The most trusted. Applied automatically when the PC detects the corporate Active Directory domain controllers.
  - *Private:* Trusted home or small office networks. Allows local discovery (printers, file sharing).
  - *Public:* Untrusted networks (airports, cafes). Highly restrictive. Blocks file sharing and remote desktop by default.
- **Application vs. Port Rules:** You can create a rule that says "Allow TCP 3389" (Port rule), or "Allow `C:\App\server.exe` to communicate on any port it wants" (Application rule).

## How It Works
1. A laptop connects to a hotel Wi-Fi. Windows classifies it as a **Public** network.
2. The Public profile rules are applied: Inbound connections are denied by default; Outbound connections are allowed.
3. Another guest on the hotel Wi-Fi runs a port scan against the laptop, looking for open SMB shares (Port 445).
4. The scan packets hit the laptop's network card. The Windows Firewall inspects them.
5. Because the Public profile blocks inbound SMB by default, the firewall drops the packets silently. The attacker sees the laptop as a "dead" IP address.

## Components / Types
- **Inbound Rules:** Protects the PC from others. (Default: Deny all unprompted traffic).
- **Outbound Rules:** Prevents the PC from reaching out. (Default: Allow all traffic). *Note: Highly secure environments change the outbound default to Deny to prevent malware from calling home.*
- **Connection Security Rules (IPsec):** Advanced rules that mandate traffic between two specific Windows machines must be encrypted using IPsec before the firewall will allow it through.

## Practical Examples
- **RDP Restriction:** An administrator wants to manage servers via Remote Desktop (Port 3389). Instead of opening Port 3389 to the entire company (which is dangerous), they create a custom inbound rule on the servers: "Allow TCP 3389, but ONLY if the Source IP belongs to the IT Jumpbox (`10.5.5.10`)."
- **Blocking Malware Egress:** An admin notices a specific piece of malware always tries to communicate outbound on TCP port 6667. They deploy an Outbound Deny rule across the domain for that port, instantly neutralizing the malware's command-and-control capability.

## Security Considerations
- **"Just Turn it Off":** The biggest security risk regarding the Windows Firewall is lazy administration. When an application doesn't work, junior admins often turn the firewall completely off instead of taking 5 minutes to write a proper port exception. This leaves the server completely defenseless against lateral movement.
- **Living off the Land:** If an attacker gains local Administrator rights on a PC, they will frequently use native commands (`netsh` or PowerShell) to quietly add exceptions to the Windows Firewall, ensuring their backdoors or reverse shells remain undetected.
- **Group Policy Override:** Local administrators can change local firewall rules, but rules pushed via Active Directory Group Policy (GPO) will always override local settings, preventing users from disabling corporate protections.

## Commands / Configuration Examples
Managing the firewall is traditionally done via the "Windows Defender Firewall with Advanced Security" MMC snap-in (`wf.msc`), but PowerShell is heavily used for automation.

### PowerShell
```powershell
# Check the status of the firewall profiles (Domain, Private, Public)
Get-NetFirewallProfile

# Create a new inbound rule to allow a custom web server on port 8080
New-NetFirewallRule -DisplayName "Allow Custom Web Server" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow

# Disable an existing rule (e.g., blocking standard file sharing)
Disable-NetFirewallRule -DisplayGroup "File and Printer Sharing"
```

### Legacy netsh (Still common in older scripts)
```cmd
# Open port 3389 for RDP
netsh advfirewall firewall add rule name="Open RDP" dir=in action=allow protocol=TCP localport=3389
```

## Troubleshooting
- **Cannot Ping the Server:** By default, Windows Server and Windows 10/11 block incoming ICMP Echo Requests (Ping) on Public and Private profiles. The server is online, but the firewall drops the ping. You must explicitly enable the "File and Printer Sharing (Echo Request - ICMPv4-In)" rule to allow pings.
- **Application Works Locally but not Remotely:** If you can access a website by typing `localhost` on the server itself, but it fails from another PC, the application is running correctly, but the Windows Firewall is blocking inbound access to that specific port.
- **Profile Confusion:** If a server's network adapter fails to detect the Domain Controller upon booting (e.g., due to a temporary network blip), it will fall back to the "Public" profile. Suddenly, all RDP and file sharing will stop working, even though no firewall rules were changed. Restarting the `Network Location Awareness` service usually forces it to re-detect the Domain profile.

## Interview Questions
- Why is a host-based firewall like Windows Defender necessary if a company already has a strong perimeter firewall? (Answer: To prevent lateral movement and protect devices when they connect to untrusted networks).
- What are the three network profiles used by the Windows Firewall?
- Why do you often receive a "Request Timed Out" when pinging a freshly installed Windows Server? (Answer: The Windows Firewall blocks inbound ICMP Echo Requests by default).
- Explain the difference between an Application Rule and a Port Rule in the Windows Firewall.

## Summary
The Windows Firewall is the ultimate micro-segmentation tool for Microsoft environments. By enforcing stateful inspection, profile-aware policies, and strict inbound filtering at the endpoint level, it transforms every single PC and server into a defensible fortress, regardless of the hostility of the surrounding network.

## References
- [Firewalls](../09-network-security/firewalls.md)
- [Group Policy for Networking](group-policy-for-networking.md)
- [PowerShell for Networking](powershell-for-networking.md)
- [RDP](../06-network-protocols/rdp.md)
