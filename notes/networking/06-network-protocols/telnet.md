# Telnet

> Telnet is an obsolete, unencrypted network protocol previously used to provide an interactive, command-line interface to remote devices.

## Overview
Developed in 1969, before network security was a primary concern, **Telnet** (Teletype Network) was the original protocol for remote device management. Operating on **TCP port 23**, it allows a user to sit at one computer and type commands into a terminal that execute on a remote server or router as if they were sitting directly in front of it.

Today, Telnet is universally considered insecure and obsolete for administrative tasks. It has been entirely replaced by SSH (Secure Shell).

## Why It Matters
You should never use Telnet to manage a device today. However, understanding Telnet is historically important and practically useful because the Telnet *client* remains an incredibly powerful, raw troubleshooting tool for testing basic TCP connectivity to other services (like web servers or email servers). Furthermore, legacy systems and poorly secured IoT devices still run Telnet, making it a prime target during penetration tests.

## Core Concepts
- **Cleartext Protocol:** Telnet provides zero encryption. Every single character typed, including the username, the password, and the resulting output, is sent across the network in easily readable plain text.
- **Virtual Terminal:** Telnet establishes a virtual terminal session, passing keystrokes to the remote system and returning the screen output.
- **The Universal Client:** Because Telnet simply opens a raw TCP connection and sends unformatted text, you can use the Telnet client software to manually speak to *other* cleartext protocols.

## How It Works
1. An administrator types `telnet 192.168.1.1` on their workstation.
2. The client establishes a TCP 3-way handshake with the router on Port 23.
3. The router presents a login prompt.
4. The admin types "admin" and hits enter. The word "admin" is sent across the wire.
5. The admin types their password "secret123". The password traverses the wire completely unencrypted.
6. The admin receives access to the router's command line.

## Components / Types
- **Telnet Daemon (telnetd):** The server software listening on port 23, accepting incoming connections.
- **Telnet Client:** The software used to initiate the connection. Often disabled by default in modern operating systems (like Windows 10/11) due to security risks, but easily re-enabled.

## Practical Examples
While managing devices via Telnet is bad, using the Telnet client as a diagnostic tool is excellent.

**Troubleshooting a Web Server:** 
You can't reach a website on port 80. You use the telnet client to test the port directly:
```bash
$ telnet example.com 80
Trying 93.184.216.34...
Connected to example.com.
```
If it says "Connected," you just proved that routing, firewalls, and the web service are all functioning at Layer 4. The problem is strictly at Layer 7.

## Security Considerations
- **Eavesdropping:** This is the critical flaw. Anyone with Wireshark on the same local network, or any router along the path, can effortlessly capture the Telnet packets, click "Follow TCP Stream", and read the administrator's password in plain text.
- **Man-in-the-Middle (MitM):** Because there is no encryption and no host authentication (unlike SSH Host Keys), an attacker can easily intercept the connection, spoof the router, and steal credentials.
- **IoT Botnets:** Massive botnets (like Mirai) were built entirely by scanning the Internet for exposed Telnet ports on cheap IoT devices (cameras, DVRs) and logging in using default factory passwords.

## Commands / Configuration Examples
### Using Telnet for Diagnostics (Linux / Windows)
```bash
# Test if a firewall is blocking Port 443 to a server
telnet 10.5.5.50 443

# Manually interacting with an SMTP (Email) server to test mail flow
telnet mail.example.com 25
HELO example.com
MAIL FROM: test@example.com
```

### Cisco IOS (Disabling Telnet - Best Practice)
To secure a Cisco device, you must explicitly disable Telnet and force SSH.
```text
line vty 0 4
 ! Tell the virtual terminal lines to ONLY accept SSH connections, dropping Telnet.
 transport input ssh
```

## Troubleshooting
- **"Connection Refused":** The target IP is reachable, but the specific port you are trying to telnet into is closed or the service isn't running.
- **"Trying X.X.X.X... (Hangs)":** The packet is being silently dropped. This almost always indicates a firewall in the path is blocking the connection, or the destination IP does not exist.

## Interview Questions
- What port does Telnet use by default?
- Why is Telnet considered fundamentally insecure?
- What protocol completely replaced Telnet for remote administration? (Answer: SSH).
- How can a network engineer use the Telnet client as a troubleshooting tool for services other than Telnet?

## Summary
Telnet is a legacy protocol that provided the foundation for remote device administration but failed to account for modern security threats. While the Telnet service should be eradicated from production networks, the Telnet client remains a versatile utility for raw TCP port diagnostics.

## References
- [SSH](ssh.md)
- [TCP](tcp.md)
- [Ports and Sockets](ports-and-sockets.md)
- [HTTP (Raw interactions)](http.md)
