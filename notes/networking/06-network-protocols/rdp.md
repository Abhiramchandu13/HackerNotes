# RDP (Remote Desktop Protocol)

> RDP is a proprietary Microsoft protocol that provides a user with a graphical interface to connect to another computer over a network connection.

## Overview
While SSH provides a secure command-line interface to a remote system, **Remote Desktop Protocol (RDP)** provides a full graphical user interface (GUI). Operating on **TCP port 3389**, RDP allows a user to see the desktop of a remote Windows machine, use their local mouse and keyboard to control it, and even redirect audio, printers, and USB drives across the network.

## Why It Matters
RDP is the backbone of Windows administration and remote workforce access. Helpdesk teams use it to troubleshoot user PCs, sysadmins use it to manage servers, and remote employees use it to access their office workstations. However, because it provides full graphical access, RDP is arguably the most fiercely targeted attack vector by ransomware gangs and nation-state actors worldwide.

## Core Concepts
- **Graphical Transmission:** RDP does not send the entire video feed of the screen (which would consume massive bandwidth). It sends drawing commands (e.g., "draw a blue box here," "render this text font") and bitmaps, making it highly efficient even over slow links.
- **Device Redirection:** RDP can map local resources to the remote machine. A user can print a document from the remote server, and it will physically print on the printer sitting on their physical desk.
- **Network Level Authentication (NLA):** A crucial security enhancement that forces the user to authenticate to the server *before* the server allocates memory to spin up the actual graphical login screen, preventing many DoS and pre-authentication attacks.

## How It Works
1. The user opens the Remote Desktop Connection client (`mstsc.exe`).
2. The client initiates a TCP connection to the server on Port 3389.
3. **With NLA (Default):** A TLS-encrypted channel is established, and the user's credentials are verified via CredSSP (NTLM/Kerberos).
4. Once authenticated, the server creates a virtual session for the user and begins streaming the graphical interface.
5. Keystrokes and mouse movements are captured locally and sent across the TCP tunnel to manipulate the remote session.

## Components / Types
- **Remote Desktop Services (RDS):** Previously known as Terminal Services. Allows a single Windows Server to host dozens of distinct RDP sessions simultaneously for different users (VDI / Desktop as a Service).
- **RDP Gateway:** An edge server that acts as a secure reverse proxy for RDP. External users connect to the Gateway over standard HTTPS (Port 443), and the Gateway bridges the connection to internal servers over RDP (Port 3389), eliminating the need to expose 3389 to the Internet or use a full VPN.

## Practical Examples
- **Server Administration:** A sysadmin needs to apply patches to an Active Directory domain controller. Instead of walking into the cold data center, they open RDP from their desk and manage the server graphically.
- **Remote Work:** An employee works from home on a personal laptop. They use an RDP Gateway to securely connect to their powerful desktop PC sitting in the corporate office.

## Security Considerations
RDP is historically plagued with critical, wormable vulnerabilities.
- **BlueKeep (MS17-010):** A devastating unauthenticated remote code execution vulnerability in older RDP implementations.
- **Internet Exposure:** You should **never** expose TCP port 3389 directly to the public Internet. Shodan routinely finds millions of exposed RDP servers, which are immediately brute-forced by automated bots attempting to deploy ransomware.
- **Defenses:** Always require an RDP Gateway or VPN for remote access. Enforce Network Level Authentication (NLA). Enforce Multi-Factor Authentication (MFA) using tools like Duo or Microsoft Entra ID. Use Account Lockout policies to stop brute-forcing.

## Commands / Configuration Examples
### Windows (Client)
```powershell
# Open the standard RDP GUI client
mstsc.exe

# Quickly launch RDP to a specific server via Run dialog or command line
mstsc /v:server.example.com
```

### Windows (Server - Enabling RDP)
```powershell
# Enable RDP via PowerShell (modifying the registry and firewall)
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" -Name "fDenyTSConnections" -Value 0
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"
```

### Linux (Client)
Linux has several open-source RDP clients that interoperate perfectly with Windows.
```bash
# Connect to a Windows server using xfreerdp
xfreerdp /u:username /p:password /v:192.168.1.50
```

## Troubleshooting
- **"Remote Desktop can't connect to the remote computer":** The most common error. Verify the server is powered on, RDP is enabled in System Properties, and the local Windows Firewall has the "Remote Desktop" rule enabled.
- **"The remote computer requires Network Level Authentication":** The client trying to connect is too old to support NLA, or is trying to connect using an unsupported method. Upgrade the client or configure the server to drop the NLA requirement (not recommended for security).
- **Black Screen:** Sometimes the RDP connection establishes, but the screen stays black. This is often a video driver issue or an MTU/fragmentation issue dropping the large graphical packets over a VPN.

## Interview Questions
- What port does RDP use by default? (Answer: TCP 3389).
- What is Network Level Authentication (NLA) and why is it important?
- Why is it considered a critical security risk to port-forward RDP directly to the Internet?
- What is an RDP Gateway and how does it improve security? (Answer: It encapsulates RDP traffic inside standard HTTPS/443, providing a secure proxy and authentication choke point without exposing port 3389).

## Summary
RDP is the definitive protocol for graphical Windows management and remote work. While highly optimized and feature-rich, its historical vulnerabilities and value to ransomware actors demand that it be strictly protected behind VPNs, Gateways, and robust Multi-Factor Authentication.

## References
- [SSH](ssh.md)
- [TCP](tcp.md)
- [Ports and Sockets](ports-and-sockets.md)
- [Windows Networking](../../16-windows-networking/active-directory-networking.md)
