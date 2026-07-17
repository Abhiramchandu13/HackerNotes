# Packet Analysis

> Packet Analysis is the process of dissecting captured network packets to understand the exact protocol behavior, diagnose failures, or investigate security incidents.

## Overview
A packet capture (`pcap`) is just the recording. **Packet Analysis** is the act of interpreting it. It means opening the capture in a tool like Wireshark or `tshark` and manually following the protocol layers (Ethernet, IP, TCP, HTTP) to answer questions like: "Did the server reply?", "Was the data encrypted?", or "Which field triggered the firewall block?"

## Why It Matters
The most difficult network problems can only be solved through packet analysis. Logs and monitoring dashboards provide summaries, but packets show the ground truth. For a pentester, packet analysis reveals where credentials flow in cleartext or which headers a WAF trusts. For an incident responder, packet analysis is used to reconstruct malware beacons, data exfiltration, or lateral movement.

## Core Concepts
- **Bottom-Up Inspection:** Analyze from Layer 1/2 upward: Is the Ethernet frame valid? Is the IP address correct? Did the TCP handshake complete? Did the HTTP request return a 500 error?
- **Timing Analysis:** The time deltas between packets reveal latency, jitter, retransmissions, and stalls.
- **Conversation Pairing:** Every request should have a corresponding reply. Missing replies indicate drops or firewall blocks.
- **Stream Reassembly:** Recombining all the packet fragments and TCP segments to see the actual application data being transmitted.

## How It Works
When you analyze a packet capture, you typically follow this sequence:
1. **Filter the traffic:** Narrow the view to the relevant hosts or ports.
2. **Check the transport:** Did SYN/SYN-ACK/ACK complete? Are there resets or retransmissions?
3. **Check the network:** Is the source/destination IP correct? Any TTL expiry or ICMP errors?
4. **Check the application:** Did the HTTP request return 200 or 500? Did SMTP return a 550 reject?
5. **Correlate timing:** Measure latency and see where delays occur.

## Components / Types
- **Performance Analysis:** Finding retransmissions, packet loss, or application stalls.
- **Protocol Analysis:** Decoding DNS, DHCP, SMB, HTTP, TLS, etc.
- **Security Analysis:** Looking for cleartext credentials, malware callbacks, odd ports, or protocol abuse.
- **Flow Analysis:** Tracing how traffic moved across source, destination, and intermediate responses.

## Practical Examples
- **Broken Website Diagnosis:** A user reports a website is slow. Packet analysis shows:
  - DNS resolves quickly.
  - TCP handshake succeeds instantly.
  - The server delays 15 seconds before sending the first byte.
  Result: The network is healthy. The application backend is slow.

- **VPN Issue:** A user says the VPN connects but large uploads fail. Packet analysis reveals `ICMP Fragmentation Needed` messages, proving an MTU mismatch.

## Security Considerations
- **Credential Discovery:** Analysts often find cleartext HTTP Basic Auth headers, FTP logins, or Telnet credentials inside packet captures.
- **Malware Detection:** Beacon timing, suspicious DNS queries, or repeated HTTPS posts to a foreign IP often become obvious when viewed packet by packet.
- **Data Exposure:** Captures often contain sensitive content. Analysts must store and share them securely.

## Commands / Configuration Examples
### tshark
```bash
# Print HTTP request methods and hosts from a pcap
tshark -r capture.pcap -Y "http.request" -T fields -e http.request.method -e http.host
```

### Wireshark Filters
```text
# Show only TCP retransmissions
tcp.analysis.retransmission

# Show only DNS traffic
dns

# Show packets to or from a host
ip.addr == 10.0.0.50
```

### Linux Integrity Checks
```bash
# Hash a pcap file before sharing it for forensic work
sha256sum capture.pcap
```

## Troubleshooting
- **No Useful Data:** If the capture was taken on the wrong interface or without SPAN/TAP, the relevant unicast packets may never have been seen.
- **Encrypted Traffic:** If the traffic is TLS, the payload cannot be read unless you have the server keys or are doing controlled decryption in a lab environment.
- **Incomplete Capture:** Kernel drops or packet loss during capture may hide the true root cause.

## Interview Questions
- What is the difference between packet capture and packet analysis?
- What packet evidence would show a TCP connectivity problem? (Answer: SYN retries, RSTs, retransmissions, missing ACKs).
- How can packet analysis distinguish a DNS issue from an application issue?
- Why is packet analysis considered the "ground truth" during troubleshooting?

## Summary
Packet analysis is where protocol theory meets operational reality. By dissecting captured traffic layer by layer, engineers and analysts can determine exactly what happened on the wire, why it happened, and who was responsible.

## References
- [Packet Capture](packet-capture.md)
- [Wireshark](wireshark.md)
- [tcpdump](tcpdump.md)
- [TLS](../09-network-security/tls.md)
- [ICMP](../06-network-protocols/icmp.md)
