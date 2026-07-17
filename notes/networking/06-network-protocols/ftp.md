# FTP (File Transfer Protocol)

> FTP is a legacy, cleartext protocol designed to transfer files between a client and a server across a network.

## Overview
Before the web, cloud storage, and robust APIs, moving a file from a server to a workstation required a dedicated mechanism. Developed in the 1970s, the **File Transfer Protocol (FTP)** was the standard. It provides a structured way to authenticate, list directories, upload (put), and download (get) files.

Crucially, FTP operates using *two* separate TCP connections to accomplish this, a design that makes it notoriously difficult to secure and pass through modern firewalls.

## Why It Matters
While FTP is heavily deprecated in favor of secure alternatives (SFTP/FTPS), it stubbornly survives in legacy enterprise environments, automated data dumps, and internal mainframe systems. Understanding FTP is primarily an exercise in understanding its flaws: why it breaks through firewalls and why it is a severe security risk.

## Core Concepts
- **Cleartext Protocol:** Like HTTP and Telnet, standard FTP encrypts nothing. Usernames, passwords, and file contents traverse the network in easily readable plain text.
- **The Two Channels:**
  - **Command Channel (TCP Port 21):** Used to send login credentials and commands (like `ls` or `get`).
  - **Data Channel (TCP Port 20 or Random):** A completely separate TCP connection spun up *only* when a file actually needs to be moved or a directory listed.

## How It Works (Active vs. Passive Mode)
The dual-channel nature of FTP creates firewall nightmares, leading to two different operational modes:

### Active Mode (Legacy)
1. Client opens a Command Channel to Server Port 21.
2. Client says, "I want to download a file. I am listening on my own Port 5000. Send it there."
3. The Server initiates a *new*, inbound connection from its Port 20 to the Client's Port 5000 to send the data.
*The Problem:* Modern client firewalls block unsolicited inbound connections. The server's attempt to connect to the client will fail, breaking the file transfer.

### Passive Mode (Modern Default)
1. Client opens a Command Channel to Server Port 21.
2. Client asks for Passive mode (`PASV`).
3. The Server replies: "Okay, I have opened a random port (e.g., 6000) on my end. Connect to me there."
4. The Client initiates the Data Channel connection to Server Port 6000 to download the file.
*The Fix:* Because the client initiates *both* connections outbound, it seamlessly passes through the client's NAT and local firewalls.

## Components / Types
- **Anonymous FTP:** A configuration allowing users to log in with the username `anonymous` and an email address as the password. Common historically for public software repositories.
- **FTPS (FTP over SSL/TLS):** A bolted-on security upgrade. It wraps standard FTP connections in TLS encryption. While it solves the cleartext issue, it does not solve the complex firewall problems caused by the two-channel design.

## Practical Examples
- **Automated Reporting:** A legacy inventory system automatically uploads a CSV report every midnight to an internal FTP server.
- **Website Management (Legacy):** Before modern Git workflows, web developers used FTP clients like FileZilla to drag-and-drop HTML files directly onto shared hosting servers.

## Security Considerations
- **Cleartext Credentials:** Capturing an FTP login via Wireshark or a network tap is trivial. Never use FTP across untrusted networks or the Internet.
- **Bounce Attacks:** Because Active FTP allows a client to tell the server "Send this file to IP X on Port Y," attackers historically abused this feature to force the FTP server to port-scan or attack third-party machines on their behalf.
- **Deprecation:** Security compliance frameworks (like PCI-DSS) strictly mandate the removal of cleartext FTP. It must be replaced with SFTP or HTTPS.

## Commands / Configuration Examples
### Linux / macOS
```bash
# Connect to an FTP server
ftp ftp.example.com

# Common interactive commands once logged in:
ls       # List directory
cd       # Change directory
get      # Download a file
put      # Upload a file
binary   # Set transfer mode to binary (required for images/executables)
bye      # Disconnect
```

### Windows
```cmd
C:\> ftp ftp.example.com
```

## Troubleshooting
- **Login succeeds, but directory listing fails / times out:** This is the classic FTP firewall issue. The Command Channel (Port 21) succeeded, but the Data Channel failed to build. Ensure the client is using **Passive Mode**. If it still fails, the server's firewall is likely blocking the high-numbered passive ports.
- **Corrupted Downloads:** If you download an image or executable and it won't open, the FTP client likely transferred it in `ASCII` mode (which modifies line endings) instead of `Binary` mode. Always type `binary` before downloading non-text files.

## Interview Questions
- What ports does standard FTP use? (Answer: TCP 20 and 21).
- Explain the fundamental difference between Active and Passive FTP.
- Why is FTP considered a major security risk?
- What is the difference between FTPS and SFTP? (Answer: FTPS is legacy FTP wrapped in TLS. SFTP is a completely different, secure protocol operating as a subsystem of SSH on Port 22).

## Summary
FTP is a historical artifact of early network design. While its ability to transfer files is foundational, its cleartext transmission and complex, dual-channel architecture make it fundamentally unsuited for modern, firewall-heavy, security-conscious environments. It should always be replaced by SFTP where possible.

## References
- [SFTP](sftp.md)
- [TFTP](tftp.md)
- [TCP](tcp.md)
- [Ports and Sockets](ports-and-sockets.md)
