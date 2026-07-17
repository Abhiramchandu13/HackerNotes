# User Datagram Protocol (UDP)

> UDP is a lightweight, connectionless Transport layer protocol that prioritizes absolute speed by sending data without guaranteeing delivery, ordering, or error recovery.

## Overview
While TCP is a meticulous delivery service requiring signatures and tracking numbers, **User Datagram Protocol (UDP)** is like throwing a postcard out the window of a moving car. UDP operates at Layer 4 of the OSI model and simply slaps source and destination ports onto data and fires it onto the network. If the packet gets lost, arrives out of order, or gets duplicated, UDP does not care and will not fix it.

## Why It Matters
UDP is the protocol of choice when speed is more critical than perfect accuracy. Real-time applications like Voice over IP (VoIP), live video streaming, and online gaming use UDP because waiting for a retransmitted packet would cause intolerable stuttering. In cybersecurity, UDP's lack of handshakes makes it the primary vehicle for massive amplification and reflection DDoS attacks.

## Core Concepts
- **Connectionless:** No 3-Way Handshake. The sender just starts transmitting immediately.
- **Unreliable (Best Effort):** No acknowledgments (ACKs). The sender has no idea if the packet actually arrived.
- **No Sequencing:** Packets are not numbered. If they arrive out of order, the network stack hands them to the application out of order.
- **No Congestion Control:** UDP will blast data as fast as the application generates it, even if it overwhelms the network and causes massive packet drops.
- **Low Overhead:** The UDP header is only 8 bytes (compared to TCP's 20-60 bytes), making it highly efficient.

## How It Works
1. An application (like a DNS resolver) generates a request.
2. It passes the data to the OS Transport layer, specifying UDP.
3. The OS adds an 8-byte UDP header containing the Source Port (e.g., `51322`), Destination Port (e.g., `53`), Length, and a simple Checksum.
4. The Datagram is encapsulated into an IP packet and sent.
5. The receiver gets the packet and immediately hands the payload to the application listening on Port 53. If the packet was lost in transit, nothing happens. It is entirely up to the Application layer (e.g., the DNS software) to realize a timeout occurred and send a brand new request.

## Components / Types
Because UDP lacks built-in reliability, any necessary tracking must be coded directly into the Application Layer protocol using it.
- **Real-Time Media:** RTP (Real-time Transport Protocol) runs over UDP to handle VoIP and video.
- **Quick Queries:** DNS (Port 53), NTP (Port 123), and SNMP (Port 161) use UDP because establishing a TCP handshake for a tiny, single-packet question is highly inefficient.
- **File Transfer (Specific):** TFTP (Trivial FTP, Port 69) uses UDP, relying on its own application-level ACK system to transfer boot files to routers.

## Practical Examples
- **Live Video (Twitch/YouTube Live):** If a packet of video data is dropped by a congested router, UDP ignores it. Your screen might show a minor graphical glitch or a dropped frame for a split second, but the video continues playing in real-time. If it used TCP, the video would freeze entirely while waiting for the missing packet to be retransmitted.
- **DNS Lookups:** When you type `google.com`, the browser wants the IP address instantly. A UDP DNS request gets the answer in one round trip. 

## Security Considerations
- **Statelessness is Dangerous:** Firewalls have a harder time filtering UDP because there is no defined "Connection State" (like a SYN or FIN flag) to track.
- **IP Spoofing / Reflection Attacks:** Because UDP has no handshake to verify the sender, an attacker can forge a packet with the victim's Source IP. They send this forged UDP packet to a vulnerable NTP or DNS server. The server processes the request and sends a massive reply (Amplification) directly to the victim, causing a crippling DDoS attack.
- **UDP Scanning:** `nmap -sU` scans are notoriously slow and difficult. Since UDP doesn't respond to open ports (it just stays silent), the scanner has to rely on ICMP "Port Unreachable" errors to guess if a port is closed, which firewalls frequently block.

## Commands / Configuration Examples
### Linux
```bash
# View active UDP listening sockets
ss -uan

# Send a raw UDP packet using netcat
echo "test message" | nc -u -w1 192.168.1.50 8080
```

### Windows
```powershell
# View UDP connections (Note: UDP has no 'State' column because it is stateless)
netstat -ano | findstr UDP
```

## Troubleshooting
- **Application Timeouts:** Since UDP doesn't guarantee delivery, network congestion will result in silent application failures. The network won't tell you the packet dropped; the app will just time out.
- **Firewall Drops:** Many strict corporate firewalls drop all outbound UDP traffic (except port 53 for DNS) by default because it is heavily used by malware, torrents, and VPN evasion tools. If a new VoIP app isn't working, check the UDP egress rules.

## Interview Questions
- Contrast TCP and UDP. When would you use one over the other?
- Why is UDP the preferred protocol for Voice over IP (VoIP)?
- Explain how the lack of a handshake in UDP makes it susceptible to amplification attacks.
- What is the size of a standard UDP header? (Answer: 8 bytes).

## Summary
UDP strips away all the complex tracking, ordering, and reliability mechanisms of TCP to provide a raw, high-speed delivery mechanism. By shifting the burden of error recovery to the application itself, UDP empowers real-time streaming, rapid queries, and lightweight communications.

## References
- [TCP](tcp.md)
- [Ports and Sockets](ports-and-sockets.md)
- [DNS](dns.md)
- [NTP](ntp.md)
- [Port Scanning](../14-network-pentesting/port-scanning.md)
