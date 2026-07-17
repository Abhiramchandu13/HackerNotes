# SFTP (SSH File Transfer Protocol)

> SFTP is a highly secure file transfer protocol that leverages the cryptographic protections of SSH to safely move files across untrusted networks.

## Overview
Despite the similarity in naming, **SFTP** is *not* FTP wrapped in encryption (that is FTPS). SFTP is an entirely different protocol designed from the ground up as an extension of **Secure Shell (SSH)**. It operates over the standard SSH port (**TCP port 22**) and utilizes the exact same robust encryption, public-key authentication, and secure tunnel mechanisms that system administrators use for remote command-line access.

## Why It Matters
Legacy FTP transmits usernames, passwords, and data in easily intercepted plaintext. SFTP is the modern, enterprise-mandated replacement. It is the definitive standard for securely transferring sensitive data—like daily financial batches between banks, HR payroll files, or automated cloud backups—over the public Internet.

## Core Concepts
- **SSH Subsystem:** SFTP runs inside an SSH tunnel. It inherits all the cryptographic strength of SSH (AES encryption, RSA/Ed25519 keys).
- **Single Port:** Unlike legacy FTP, which requires complex multi-port configurations that break firewalls, SFTP does everything (authentication, commands, and data transfer) multiplexed over a single TCP connection (Port 22).
- **Full File Management:** Beyond just uploading and downloading, SFTP supports remote file deletion, resuming interrupted transfers, and modifying file permissions.

## How It Works
1. The SFTP client initiates an SSH connection to the server on TCP port 22.
2. The server and client negotiate encryption ciphers and perform a secure key exchange.
3. The client authenticates (typically using an SSH Key Pair or a password).
4. Once authenticated, the client requests the SFTP subsystem.
5. The client can now issue commands (`ls`, `get`, `put`). All commands and the resulting file data are encrypted, packaged into SSH packets, and transmitted securely over the single connection.

## Components / Types
- **Password Authentication:** Logging in with a standard username and password.
- **Public Key Authentication:** The preferred, secure method. The client possesses a private key, and the server possesses the matching public key. Allows for highly secure, automated, password-less file transfers.
- **SCP (Secure Copy Protocol):** A related but older and less capable protocol. SCP is faster for simple file transfers but lacks the directory management and interrupted-resume features of SFTP. (Many modern systems alias the `scp` command to actually use the SFTP protocol under the hood).

## Practical Examples
- **B2B Integration:** An e-commerce company automatically exports a massive CSV of daily orders and uses SFTP to securely transmit it to their logistics partner's server every night at 2:00 AM.
- **Secure Web Administration:** Instead of using insecure FTP, modern web developers use tools like WinSCP or Cyberduck to securely upload code changes to cloud web servers via SFTP.

## Security Considerations
- **Chroot Jails:** By default, a user logging in via SFTP might be able to browse the entire filesystem of the Linux server. Security best practices dictate configuring a `chroot jail` in the SSH daemon, which mathematically locks the SFTP user into a specific directory (e.g., `/var/sftp/uploads`), preventing them from seeing or accessing system files.
- **Key Management:** Automated SFTP transfers require Private Keys to be stored on servers. If an attacker compromises the server, they can steal the Private Key and gain authorized access to the partner's SFTP server. Keys must be rotated and closely guarded.
- **Brute Force:** Because SFTP operates on the SSH port, it is subjected to constant global brute-force attacks. Disabling password authentication in favor of keys, or implementing fail2ban, is critical.

## Commands / Configuration Examples
### Linux / macOS (Client)
```bash
# Connect to an SFTP server interactively
sftp username@sftp.example.com

# Connect using a specific SSH Private Key
sftp -i ~/.ssh/id_rsa username@sftp.example.com

# Common interactive commands once connected:
ls       # List remote directory
lls      # List local directory
get      # Download a file from the server
put      # Upload a file to the server
quit     # Exit the session
```

### Linux (Server Configuration - sshd_config)
```text
# Example /etc/ssh/sshd_config snippet to force an SFTP-only user into a chroot jail
Match User vendor_upload
    ChrootDirectory /var/sftp/vendor
    ForceCommand internal-sftp
    AllowTcpForwarding no
```

### Windows
Windows does not include a native interactive SFTP client by default in older versions, but heavily relies on third-party GUI tools like **WinSCP** or **FileZilla**, or the native `sftp` command in modern PowerShell/WSL.

## Troubleshooting
- **Connection Refused:** Ensure the SSH daemon (sshd) is actually running on the server and that port 22 is open on the firewalls.
- **Subsystem Request Failed:** The SSH connection works, but SFTP drops immediately. Check the server's `sshd_config` file to ensure the `Subsystem sftp` line is properly configured and uncommented.
- **Permission Denied in Chroot:** When configuring an SFTP chroot jail, Linux enforces extremely strict permissions. The folder acting as the jail *must* be owned by root, not the user, or the SSH daemon will aggressively close the connection upon login.

## Interview Questions
- What is the difference between FTPS and SFTP? (Answer: FTPS is legacy FTP wrapped in TLS using ports 20/21. SFTP is an SSH subsystem using only port 22).
- Why is SFTP significantly easier to pass through a firewall than standard FTP?
- What is a chroot jail, and why is it important for SFTP servers?
- How do you automate SFTP transfers without hardcoding passwords into scripts? (Answer: Use SSH Key-Pair authentication).

## Summary
SFTP elegantly solves the security and firewall-traversal nightmares of legacy file transfer protocols. By piggybacking on the bulletproof architecture of SSH, SFTP provides the modern enterprise standard for confident, secure data exchange.

## References
- [FTP](ftp.md)
- [SSH](ssh.md)
- [TCP](tcp.md)
- [Ports and Sockets](ports-and-sockets.md)
