# Layer 4 - Transport Layer

> The Transport Layer (Layer 4) ensures end-to-end data delivery and distinguishes between different application communications using ports.

## Overview
While Layer 3 ensures a packet gets from Computer A to Computer B, it doesn't know *which* program on Computer B should receive the data. The Transport Layer solves this using Port Numbers. Furthermore, Layer 4 dictates the reliability of the connection—whether the network should guarantee delivery (TCP) or just send the data as fast as possible without checking (UDP).

## Why It Matters
For network engineers, Layer 4 is where Quality of Service (QoS) and port-based firewall rules are implemented. For security professionals and pentesters, Layer 4 is the foundation of port scanning (e.g., Nmap). If you understand Layer 4, you understand how stateful firewalls track connections.

## Core Concepts
- **Segments / Datagrams:** The PDU is a **Segment** for TCP, and a **Datagram** for UDP.
- **Port Numbers:** 16-bit logical constructs (ranging from 0 to 65535) that identify a specific process or service on a host (e.g., Port 80 for HTTP).
- **Multiplexing:** The ability for a single IP address to handle dozens of different network conversations simultaneously by utilizing different ports.
- **Reliability & Flow Control:** Mechanisms to ensure packets arrive in order, requesting retransmission for dropped packets, and slowing down transmission if the receiver is overwhelmed.

## How It Works
1. The Transport Layer receives data from the upper layers (Session/Presentation/Application).
2. It breaks large chunks of data into smaller pieces (Segmentation).
3. It adds a Layer 4 header containing a Source Port and a Destination Port.
4. **If using TCP:** It establishes a "Three-Way Handshake" with the destination to guarantee the connection before sending data. It numbers the segments to reassemble them in order.
5. **If using UDP:** It simply adds the ports and fires the datagrams at the destination immediately, without establishing a connection.

## Components / Types
- **Transmission Control Protocol (TCP):** Connection-oriented, reliable, sequenced. Used for web browsing (HTTP/HTTPS), email (SMTP), and file transfers (FTP).
- **User Datagram Protocol (UDP):** Connectionless, best-effort delivery. Used for Voice over IP (VoIP), video streaming, and DNS lookups.
- **Firewalls / Load Balancers:** Traditional stateful firewalls inspect Layer 4 headers to allow or deny traffic based on ports.

## Practical Examples
- **Web Browsing:** Your browser uses a random ephemeral source port (e.g., 54321) to connect to a web server's well-known destination port (443 for HTTPS) using TCP.
- **Voice Call:** A Skype call uses UDP. If a packet of audio is dropped, UDP doesn't re-request it (which would cause weird delays); it just skips it, resulting in a momentary blip in audio.

## Security Considerations
Layer 4 is a primary focus for network security:
- **Port Scanning:** Attackers use tools like Nmap to send probes to thousands of TCP/UDP ports on a target IP to see what services are running.
- **SYN Floods:** A type of Denial of Service (DoS) attack where an attacker sends thousands of TCP SYN requests but never completes the handshake, exhausting the server's connection limits.
- **Firewall Evasion:** Attackers may run malicious services on non-standard ports (e.g., SSH on port 443) to bypass simplistic port-based firewall rules.

## Commands / Configuration Examples
### Linux
```bash
ss -tulpn            # Show listening TCP/UDP ports and their processes
netstat -ano         # Legacy alternative to ss
nc -vz 10.0.0.1 22   # Use netcat to test if port 22 is open on a target
```

### Windows
```powershell
netstat -ano         # Show active TCP connections and listening ports
Test-NetConnection 10.0.0.1 -Port 3389 # Test RDP port reachability
```

### Cisco IOS
```text
! Creating a Layer 4 Access Control List (ACL)
access-list 100 permit tcp any any eq 80
access-list 100 deny udp any any eq 53
```

## Troubleshooting
When troubleshooting Layer 4:
- **Is the port listening?** Ensure the service (like Apache or SSHd) is actually running and bound to the correct port.
- **Is a firewall blocking the port?** Check local OS firewalls (Windows Defender, iptables/ufw) and network firewalls.
- **Are you using the right protocol?** Trying to test a UDP port with a TCP connection tester will fail.

## Interview Questions
- What is the difference between TCP and UDP?
- Name three protocols that use TCP and two that use UDP.
- What is the purpose of a port number at the Transport layer?
- Explain the TCP Three-Way Handshake.

## Summary
The Transport Layer acts as the liaison between network routing and application software. By utilizing TCP for reliability or UDP for speed, and separating traffic via ports, Layer 4 ensures applications receive the exact data meant for them.

## References
- [Network Layer](network-layer.md)
- [Session Layer](session-layer.md)
- [TCP](../06-network-protocols/tcp.md)
- [UDP](../06-network-protocols/udp.md)
- [Ports and Sockets](../06-network-protocols/ports-and-sockets.md)
