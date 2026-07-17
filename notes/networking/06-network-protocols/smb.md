# SMB (Server Message Block)

> SMB is the standard protocol used in Windows environments for sharing files, printers, and inter-process communication across a local network.

## Overview
When you open File Explorer in Windows and browse to a shared folder like `\\CorporateServer\Marketing`, you are using the **Server Message Block (SMB)** protocol. Originally developed by IBM and heavily refined by Microsoft, SMB is the backbone of Windows file sharing and active directory communication. 

Operating primarily over **TCP port 445**, it allows applications to read, write, and request services from files on remote servers as if those files were sitting on the local hard drive.

## Why It Matters
In almost every corporate environment, SMB is the protocol moving business data. Whether mapping network drives, accessing shared printers, or downloading group policies, SMB is involved. Because it is so ubiquitous and historically complex, it is also the number one target for lateral movement and ransomware propagation by attackers and penetration testers.

## Core Concepts
- **Client-Server Request/Response:** The client requests a file; the server checks permissions and provides it.
- **Dialects (Versions):** SMB has evolved significantly. SMBv1 is notoriously insecure. SMBv2 improved performance. SMBv3 introduced strong encryption and massive performance gains over high-latency links.
- **CIFS:** Common Internet File System. An old, deprecated dialect of SMBv1. You will hear the terms used interchangeably, but "CIFS" usually implies legacy tech.
- **IPC$ (Inter-Process Communication):** A hidden, administrative share built into SMB that allows remote computers to exchange commands and data directly, rather than just transferring files.

## How It Works
1. **Negotiation:** A client connects to a server on TCP port 445. They negotiate the highest SMB dialect they both support (e.g., SMB 3.1.1).
2. **Session Setup:** The client authenticates using NTLM or Kerberos credentials.
3. **Tree Connect:** The client requests access to a specific share (e.g., `\\Server\Finance`). The server verifies the user's access control lists (ACLs).
4. **File Operations:** The client opens a file, reads data, writes changes, and eventually closes the file.
5. **Disconnect:** The session is terminated.

## Components / Types
- **Samba:** The open-source Linux/Unix implementation of the SMB protocol. It allows Linux servers to seamlessly act as file servers for Windows clients, or join Active Directory domains.
- **Administrative Shares:** Windows automatically creates hidden shares ending in a `$` (e.g., `C$`, `ADMIN$`). These are accessible only to local administrators and are used heavily for remote management and software deployment.

## Practical Examples
- **Mapped Network Drives:** An IT department uses Group Policy to automatically map the `Z:` drive on every employee's computer to the SMB share `\\Fileserver\SharedData`.
- **Printer Sharing:** A central print server shares its installed printer out to the network via SMB, allowing clients to send print jobs to it without needing the printer's specific drivers.

## Security Considerations
SMB is incredibly powerful, which makes it incredibly dangerous if exposed or outdated.
- **EternalBlue (MS17-010):** A devastating vulnerability in **SMBv1** that allowed unauthenticated remote code execution. It powered the global WannaCry ransomware outbreak. **SMBv1 must be completely disabled on all networks.**
- **Pass-the-Hash / Relay Attacks:** Because SMB relies on Windows authentication (NTLM), attackers on the local network can capture and relay authentication hashes to impersonate administrators and execute code on remote machines (using tools like `psexec` or `smbexec`).
- **Internet Exposure:** You should **never** expose TCP port 445 to the public Internet. ISPs routinely block it because exposed SMB servers are immediately targeted by automated ransomware bots.

## Commands / Configuration Examples
### Windows
```powershell
# View active SMB connections to the local machine
Get-SmbSession

# Check which SMB protocol versions the client is using
Get-SmbConnection

# Map a network drive via command line
net use Z: \\192.168.1.50\SharedFolder /user:domain\username
```

### Linux (Using Samba tools)
```bash
# Connect to a Windows SMB share interactively
smbclient //192.168.1.50/SharedFolder -U username

# List all shares available on a target server
smbclient -L 192.168.1.50 -U username
```

## Troubleshooting
- **Cannot Access Share:** If a user gets "Access Denied," it is almost always a permissions issue. SMB relies on two layers of permissions: The "Share Permissions" (who can talk to the share) and the underlying "NTFS File Permissions" (who can read the actual file on the disk). The most restrictive permission applies.
- **Port Blocked:** If mapping a drive hangs and times out, a local firewall (Windows Defender) or network firewall is likely blocking TCP port 445.
- **Version Mismatch:** If a modern Windows 11 machine cannot connect to a 15-year-old NAS device, it's because Windows 11 disables SMBv1 by default for security, but the legacy NAS only speaks SMBv1.

## Interview Questions
- What port does modern SMB use? (Answer: TCP 445. Legacy NetBIOS SMB used 139).
- Why is it a critical security mandate to disable SMBv1? (Answer: Vulnerabilities like EternalBlue allow for unauthenticated remote code execution and ransomware propagation).
- What is Samba?
- What are administrative shares (like C$), and who can access them?

## Summary
SMB is the circulatory system of a Windows enterprise network, facilitating seamless file sharing and administrative control. However, its historical complexity and deep ties to the operating system make it a critical vector for lateral movement, demanding strict version control, monitoring, and network segmentation.

## References
- [NFS](nfs.md)
- [FTP](ftp.md)
- [Active Directory Basics](../../ad-pentesting/01-foundations/active-directory-basics.md)
- [SMB Enumeration](../14-network-pentesting/smb-enumeration.md)
