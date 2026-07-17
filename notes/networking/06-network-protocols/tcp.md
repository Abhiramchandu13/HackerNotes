# Transmission Control Protocol (TCP)

> TCP is a reliable, connection-oriented Transport layer protocol that guarantees data delivery, order, and error-checking, sacrificing speed for accuracy.

## Overview
When you download a file or load a webpage, you expect every single byte of data to arrive perfectly intact. If a chunk goes missing, the file is corrupted. **Transmission Control Protocol (TCP)** solves this. Operating at Layer 4 of the OSI model, TCP establishes a formal connection before sending anything, numbers every piece of data, tracks what arrives, and automatically retransmits anything that gets lost on the network. 

## Why It Matters
TCP carries the vast majority of the world's internet traffic (HTTP, HTTPS, SSH, FTP). Understanding how TCP establishes connections, controls the flow of data, and handles congestion is mandatory for troubleshooting slow network performance, application timeouts, and firewall state tables. In cybersecurity, TCP flags and handshake manipulation are the basis of advanced network mapping, stealth scanning, and DoS attacks.

## Core Concepts
- **Connection-Oriented:** A formal connection (handshake) must be established before data transfer begins.
- **Reliable Delivery:** The receiver acknowledges (ACKs) received data. If the sender doesn't get an ACK, it retransmits.
- **Sequencing:** TCP breaks large data into "Segments," numbers them, and the receiver reassembles them in the correct order, even if they arrive out of order.
- **Flow Control:** Uses a "Window Size" mechanism where the receiver tells the sender how much data it can handle at once, preventing buffer overflows.
- **Stateful:** Firewalls and OS kernels must dedicate memory to track the "state" of every active TCP connection.

## How It Works: The 3-Way Handshake
Before sending data, TCP establishes trust:
1. **SYN:** Client sends a segment with the SYN (Synchronize) flag set, saying "I want to talk. My starting sequence number is 100."
2. **SYN-ACK:** Server receives it, agrees, and replies with a SYN-ACK flag. "I acknowledge your 100. My starting sequence number is 500."
3. **ACK:** Client receives it, and replies with an ACK. "I acknowledge your 500."
*The connection is now ESTABLISHED, and application data can flow.*

When finished, TCP uses a **4-Way Teardown** (FIN, ACK, FIN, ACK) to gracefully close the connection.

## Components / Types
TCP Headers contain several critical "Flags" (1-bit booleans) that dictate connection states:
- **SYN (Synchronize):** Initiate a connection.
- **ACK (Acknowledgment):** Confirm receipt of data.
- **FIN (Finish):** Gracefully terminate the connection.
- **RST (Reset):** Abruptly kill the connection (often sent by firewalls or when connecting to a closed port).
- **PSH (Push):** Tell the receiver to process the data immediately instead of buffering it.

## Practical Examples
- **File Transfers (SMB/FTP):** You copy a 10GB ISO file across a busy WAN link. Some packets are dropped due to congestion. TCP automatically detects the gaps, retransmits the missing segments silently, and delivers a flawless file to the destination.
- **Congestion Control:** During a massive Netflix stream, TCP algorithms detect network latency and packet loss. TCP proactively shrinks its "Window Size," slowing down the stream to prevent network collapse, then slowly ramps back up.

## Security Considerations
- **SYN Flood (DoS):** An attacker blasts millions of SYN packets to a server but never sends the final ACK. The server leaves the "half-open" connections sitting in memory until its connection table fills up, causing a Denial of Service for legitimate users.
- **Stealth Scanning (SYN Scan):** Nmap defaults to a "Half-Open" SYN scan. It sends a SYN, waits for the server's SYN-ACK, and then immediately sends an RST to kill the connection. Because the 3-way handshake never completes, many older application logs never record the connection attempt.
- **Session Hijacking:** If an attacker can accurately guess the TCP Sequence numbers being used between two hosts, they can inject malicious packets into an active, authenticated TCP stream.

## Commands / Configuration Examples
### Linux
```bash
# View active TCP connections and their current state (ESTABLISHED, TIME_WAIT)
ss -tna

# Use tcpdump to capture only the TCP 3-way handshake (SYN packets)
sudo tcpdump "tcp[tcpflags] & tcp-syn != 0"
```

### Windows
```powershell
# View active TCP connections
netstat -ano | findstr TCP
```

### Cisco IOS
```text
! View active TCP connections terminating on the router
show tcp brief

! Defend against SYN Floods using TCP Intercept
ip tcp intercept mode watch
```

## Troubleshooting
- **Asymmetric Routing:** If a packet leaves via ISP 1 but the SYN-ACK returns via ISP 2, the firewall on ISP 2 will drop it because it never saw the initial SYN packet. This breaks TCP.
- **Window Scaling / Slow Transfers:** If a 10Gbps link is only transferring files at 20Mbps, check for high latency. TCP throughput drops exponentially as latency increases if "TCP Window Scaling" is misconfigured or blocked by middleboxes.
- **Connection Resets:** If an application randomly drops, packet capture for the `RST` flag. A firewall or load balancer may be silently terminating long-running idle connections.

## Interview Questions
- Explain the TCP 3-Way Handshake in detail.
- What is the difference between TCP and UDP?
- How does TCP handle a dropped packet?
- Explain the purpose of the TCP Window Size.
- What is a SYN Flood attack and why is it effective?

## Summary
TCP is the heavyweight champion of network transport. By meticulously establishing connections, tracking sequence numbers, and guaranteeing delivery, TCP provides a perfectly reliable pipe over the inherently chaotic and unreliable Internet.

## References
- [UDP](udp.md)
- [Ports and Sockets](ports-and-sockets.md)
- [Transport Layer](../02-osi-and-tcpip-models/transport-layer.md)
- [Port Scanning](../14-network-pentesting/port-scanning.md)
