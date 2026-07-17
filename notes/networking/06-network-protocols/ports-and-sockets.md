# Ports and Sockets

> A port is a logical number identifying a specific process or service, and a socket is the combination of an IP address and a port that forms a complete endpoint for network communication.

## Overview
If an IP address gets a packet to the correct building (server), the **Port** gets the packet to the correct room (application). The **Transport Layer (Layer 4)** uses ports to ensure that web traffic goes to the web server process, email traffic goes to the mail server process, and game traffic goes to the game server process—all running simultaneously on the same machine.

A **Socket** is simply the IP address combined with the port (e.g., `192.168.1.10:80`). It acts as a unique door through which an application sends and receives data over the network.

## Why It Matters
Understanding ports and sockets is the foundation of network security and troubleshooting. Firewalls are almost entirely built around blocking or allowing specific ports. Penetration testers spend their first hours on an engagement "port scanning" targets to see exactly what services are listening for connections. Without this concept, "multiplexing"—running multiple network apps at the same time—would be impossible.

## Core Concepts
- **Port Numbers:** 16-bit integers ranging from `0` to `65535`.
- **Multiplexing:** Using different ports to combine multiple distinct data streams over a single physical or logical connection.
- **Listen State:** A service that is actively bound to a port and waiting for incoming connections (e.g., Apache listening on port 80).
- **Socket Pair:** A complete network conversation requires two sockets: the *Source IP:Port* and the *Destination IP:Port*.

## How It Works
1. You open a web browser and type `http://example.com`. 
2. The browser needs to make an outgoing connection. The OS assigns it a random, high-numbered **Source Port** (e.g., `54321`).
3. The browser knows that HTTP traffic defaults to **Destination Port** `80`.
4. The OS builds the packet: `Src IP: 10.0.0.5, Src Port: 54321` --> `Dst IP: 93.184.216.34, Dst Port: 80`. This represents the socket pair.
5. The web server receives the packet on port 80, processes the HTTP request, and sends the reply back to the client's socket (`10.0.0.5:54321`).

## Components / Types
Ports are divided by the Internet Assigned Numbers Authority (IANA) into three categories:

1. **Well-Known Ports (0 - 1023):** Reserved for core system and internet services. (e.g., 22 for SSH, 80 for HTTP, 443 for HTTPS). Requires admin/root privileges to bind to on most OSs.
2. **Registered Ports (1024 - 49151):** Assigned to specific vendor applications or services (e.g., 3306 for MySQL, 3389 for RDP). 
3. **Dynamic / Ephemeral Ports (49152 - 65535):** Used temporarily by client applications when making outbound connections. (Note: Many modern Linux/Windows systems actually use `32768-65535` as their ephemeral range).

## Practical Examples
- **Multiple Browser Tabs:** You open 10 tabs to the exact same website. The server's IP and Destination Port (443) are identical for all 10 connections. The OS keeps the data separate by assigning a unique Source Port to each individual tab.
- **Port Forwarding:** A home gamer wants friends to join a Minecraft server. They tell the home router: "Any traffic hitting our Public IP on Destination Port 25565, forward it to the internal gaming PC's Private IP on Port 25565."

## Security Considerations
- **Attack Surface:** Every open, listening port is an avenue of attack. The principle of least privilege mandates closing or fire-walling any port that isn't strictly necessary.
- **Port Scanning:** Tools like `nmap` probe all 65,535 ports on a target IP. If a port replies, the attacker knows a service is running and will attempt to identify the software version to look for CVEs.
- **Port Exhaustion:** In massive NAT environments or under DDoS conditions, a system can run out of available ephemeral source ports, crippling its ability to make new outbound connections.

## Commands / Configuration Examples
### Linux
```bash
# Show listening TCP and UDP sockets and the processes owning them
sudo ss -tulpn

# Legacy alternative
sudo netstat -tulpn

# Scan a target IP to see which common ports are open
nmap -F 10.0.0.50
```

### Windows
```powershell
# View active connections and listening ports with Process IDs
netstat -ano

# Test if a specific port is reachable on a remote server
Test-NetConnection 10.0.0.50 -Port 3389
```

### Cisco IOS
```text
! View active TCP and UDP sockets on the router
show control-plane host open-ports
```

## Troubleshooting
- **Connection Refused:** This error usually means the packet reached the destination IP, but no service was actively listening on that specific Destination Port.
- **Connection Timeout:** This error usually means the packet was silently dropped by a firewall along the path before it could ever reach the destination port.
- **Port Already in Use:** If a developer tries to start a web server, but gets an error, it means another process (like Skype or an older server instance) is already bound to that port. Only one application can listen on a specific port per IP address.

## Interview Questions
- What is the difference between a port and a socket?
- Describe the three ranges of port numbers as defined by IANA.
- If a web server responds to 1,000 clients simultaneously, does it need 1,000 open destination ports? (Answer: No, it listens on one destination port. The connections are multiplexed using 1,000 unique source ports from the clients).
- What port is typically used by HTTPS? By SSH? By DNS?

## Summary
Ports and Sockets provide the necessary multiplexing at the Transport layer, allowing a single IP address to handle thousands of concurrent conversations. By mapping specific ports to specific applications, operating systems ensure data arrives exactly where it is needed.

## References
- [TCP](tcp.md)
- [UDP](udp.md)
- [NAT and PAT](../04-ip-addressing/nat-and-pat.md)
- [Transport Layer](../02-osi-and-tcpip-models/transport-layer.md)
