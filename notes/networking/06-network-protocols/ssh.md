# SSH (Secure Shell)

> SSH is a cryptographic network protocol that provides a secure, encrypted tunnel for remote command-line login, file transfers, and port forwarding over an unsecured network.

## Overview
Before SSH, system administrators managed remote servers using Telnet—a protocol that transmitted every keystroke and password in readable plaintext. **Secure Shell (SSH)** was invented to fix this. Operating on **TCP port 22**, SSH provides strong authentication and encrypts all data in transit. It is the absolute standard mechanism for managing Linux servers, network routers, and cloud infrastructure worldwide.

## Why It Matters
If you manage servers, you use SSH daily. It is the doorway to the infrastructure. For cybersecurity professionals, securing the SSH configuration of a fleet of servers is a top priority. Conversely, attackers constantly scan the internet for exposed SSH ports, attempting to brute-force weak passwords or exploit misconfigured keys to gain full administrative control of systems.

## Core Concepts
- **Encryption:** SSH encrypts the entire session. Even if an attacker intercepts the traffic with Wireshark, they see only encrypted cipher-text.
- **Authentication:** Verifies identity using passwords, or more securely, Cryptographic Key Pairs (Public/Private keys).
- **Host Keys:** The server has a unique cryptographic identity. Upon first connecting, the client saves the server's public "Host Key." If the key suddenly changes in the future, SSH blocks the connection, warning of a potential Man-in-the-Middle attack.
- **Tunneling / Port Forwarding:** SSH can encapsulate and securely route other types of network traffic (like database queries or web traffic) through its encrypted connection.

## How It Works
1. **Connection & Negotiation:** The client connects to TCP 22. The client and server agree on the best encryption algorithms they both support.
2. **Key Exchange (Diffie-Hellman):** They securely negotiate a shared, symmetric "Session Key" used to encrypt the actual data flow.
3. **Server Authentication:** The server proves its identity to the client using its Host Key.
4. **User Authentication:** The client proves their identity to the server (via typing a password, or the SSH client automatically using a Private Key).
5. **Secure Shell:** A secure, multiplexed tunnel is established, giving the user an interactive command prompt on the remote machine.

## Components / Types
- **Password Authentication:** Basic, but vulnerable to brute-force attacks.
- **Public Key Authentication:** The user generates a mathematically linked pair of keys. The *Public Key* is placed on the server. The user keeps the *Private Key* safe on their laptop. When connecting, cryptography proves the user possesses the private key without ever transmitting it over the network.
- **Local Port Forwarding:** Binding a port on your local laptop, routing it through the SSH tunnel, and having the server forward it to an internal network resource.
- **Dynamic Port Forwarding (SOCKS Proxy):** Turning the SSH connection into a lightweight proxy, routing your browser traffic through the remote server to evade local firewalls or hide your IP.

## Practical Examples
- **Cloud Administration:** You spin up a new Linux EC2 instance in AWS. By default, AWS disables password logins. You must use the provided SSH Private Key (`.pem` file) to securely access the server console.
- **Secure File Transfer:** The widely used `sftp` and `scp` commands rely entirely on the SSH protocol under the hood to move files securely.

## Security Considerations
- **Brute Force & Credential Stuffing:** Any server with port 22 exposed to the Internet will face thousands of automated login attempts daily. 
  - *Defense:* Disable password authentication in `/etc/ssh/sshd_config` (`PasswordAuthentication no`) and enforce Public Key authentication. Run `fail2ban` to block attacking IPs.
- **Root Login:** Allowing the `root` user to log in directly via SSH is highly discouraged. Users should log in with standard accounts and use `sudo` for administrative tasks, ensuring accountability.
- **Stolen Keys:** If an attacker steals a developer's unprotected Private Key, they gain instant access to every server that trusts that key. Private keys should always be protected with a passphrase.

## Commands / Configuration Examples
### Linux / macOS (Client)
```bash
# Connect to a remote server
ssh username@192.168.1.50

# Connect using a specific Private Key file
ssh -i ~/.ssh/my_private_key.pem username@10.0.0.5

# Generate a new SSH Key Pair on your local machine
ssh-keygen -t ed25519 -C "my_email@example.com"

# Copy your public key to a remote server to enable password-less login
ssh-copy-id username@192.168.1.50

# Local Port Forwarding (Accessing a remote internal database locally on port 9000)
ssh -L 9000:localhost:3306 username@remote_server
```

### Cisco IOS
```text
! Enable SSH on a Cisco Router (Disabling insecure Telnet)
hostname Router1
ip domain-name mycorp.local
! Generate the RSA crypto keys required for SSH
crypto key generate rsa modulus 2048

line vty 0 4
 ! Force the router to only accept SSH connections
 transport input ssh
 login local
```

## Troubleshooting
- **"Connection Refused":** The server is online, but the SSH daemon (`sshd`) is not running, or a firewall is actively blocking port 22.
- **"Permission Denied (publickey)":** You disabled password authentication, but the server does not recognize the private key your client is offering. Ensure your public key is correctly pasted into the server's `~/.ssh/authorized_keys` file.
- **"WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!":** The strict host key checking failed. This means the server you are connecting to has a different cryptographic identity than it did last time. This could be a Man-in-the-Middle attack, or simply that the server was wiped and reinstalled. You must manually clear the old key from your `~/.ssh/known_hosts` file to proceed.

## Interview Questions
- What port does SSH operate on by default?
- Explain the security benefit of using SSH Key Pairs over standard passwords.
- What does the warning "Remote Host Identification Has Changed" mean, and what causes it?
- Describe a scenario where you would use SSH Port Forwarding (Tunneling).

## Summary
SSH is the definitive protocol for secure remote administration. By combining robust encryption with flexible authentication and powerful tunneling capabilities, it provides a safe, encrypted conduit through the inherently untrusted Internet.

## References
- [Telnet](telnet.md)
- [SFTP](sftp.md)
- [TCP](tcp.md)
- [Ports and Sockets](ports-and-sockets.md)
