# Packet Capture

> Packet Capture is the process of intercepting, recording, and saving raw network packets as they travel across a network for later analysis.

## Overview
A **Packet Capture** (often shortened to "pcap" after the file format) is the act of creating a recording of network traffic. It is not a specific tool, but a task performed by tools like Wireshark, `tcpdump`, or `tshark`. 

Packet captures are the network equivalent of a flight data recorder. When an application crashes or a security incident occurs, the pcap file is the definitive, unchangeable record of exactly what data traveled over the wire, in what order, and when.

## Why It Matters
For difficult network problems, logs lie, but packets don't. A router log might say "Connection timed out," but a packet capture reveals whether the SYN packet was dropped by a firewall, or the server actually replied with a TCP RST. For incident response, a pcap is forensic gold, allowing analysts to replay an attack, recover exfiltrated data, and prove exactly how a breach happened.

## Core Concepts
- **Promiscuous Mode:** For a capture to be useful on a switched LAN, the network card must be forced into Promiscuous Mode so it accepts all packets, not just its own traffic.
- **SPAN / Port Mirroring:** On a switched network, unicast traffic is only sent to the destination port. To capture traffic between two other devices, a switch is configured to mirror (SPAN) one port or VLAN and send a copy of that traffic to the analyst's sniffing laptop.
- **TAP (Test Access Point):** A dedicated hardware device inserted inline on a cable. Like a hub, it creates a physical copy of the traffic and sends it to a monitoring port. TAPs are superior to SPAN because they never drop packets, even under heavy load.
- **pcap / pcapng:** The standard binary file formats used to store packet captures. `.pcap` is the universal classic. `.pcapng` is newer and can store more metadata, like comments and hostnames.

## How It Works
1. An engineer configures a SPAN port on a core switch, mirroring all traffic to and from the web server.
2. They plug their laptop into the SPAN port and run Wireshark.
3. The laptop's NIC, now in promiscuous mode, receives a copy of every packet.
4. Wireshark (or `tcpdump`) writes the raw binary packets to a `.pcap` file.
5. The engineer analyzes the file later, filtering for `tcp.port == 80` or `ip.addr == 10.0.0.50` to isolate the problematic conversation.

## Components / Types
- **Live Capture:** Sniffing traffic in real-time from a network interface.
- **Offline Analysis:** Opening and dissecting a saved `.pcap` file after the fact.
- **Filtered Capture:** Using BPF syntax at capture time (e.g., `host 10.0.0.5`) to only save relevant packets, reducing file size and CPU load.
- **Full Capture:** Saving everything and filtering later. Best for deep forensics but consumes massive storage.

## Practical Examples
- **Proving a Firewall Issue:** A web developer blames the network for an application outage. The network engineer captures the traffic. The pcap shows the firewall permits the SYN packet, the server replies with a SYN-ACK, the TCP handshake completes, and then the server sends an `HTTP/1.1 500 Internal Server Error`. The pcap proves the network is healthy; the server code is crashing.
- **Malware Analysis:** An incident responder captures the traffic of a ransomware-infected laptop in a sandbox. The pcap file reveals DNS lookups to a strange domain, an HTTPS beacon to an IP in Russia, and then the upload of encrypted files to a cloud bucket.

## Security Considerations
- **Sensitive Data Exposure:** Packet captures are extraordinarily sensitive. They may contain usernames, passwords, personal data, or even file contents in cleartext. `.pcap` files must be treated as secret data, encrypted at rest, and deleted when the investigation is over.
- **Chain of Custody:** In legal or forensics scenarios, the pcap file is evidence. Analysts must hash the capture file (e.g., SHA256) immediately after collection to prove it was not tampered with during analysis.
- **Disk Exhaustion:** Capturing all traffic on a 1Gbps link can generate terabytes of data per day. Captures on production links must be carefully filtered or capped by size/time to prevent filling the analysis server's disk.

## Commands / Configuration Examples
### Cisco IOS (Creating a SPAN Port)
```text
! Mirror all traffic from source interface Gi1/0/1 to destination interface Gi1/0/48
monitor session 1 source interface GigabitEthernet1/0/1 both
monitor session 1 destination interface GigabitEthernet1/0/48
```

### Linux (tcpdump)
```bash
# Capture 100 packets from any interface and write to a file
sudo tcpdump -i any -c 100 -w capture.pcap

# Capture only HTTP traffic from a specific host
sudo tcpdump -i eth0 host 10.0.0.50 and port 80 -w web.pcap
```

## Troubleshooting
- **No Packets Captured:** On a switched network, if you are not on the SPAN or TAP port, you will only capture broadcast traffic and your own traffic. You cannot capture another user's unicast traffic without switch cooperation.
- **Dropped Packets During Capture:** If the NIC or CPU cannot keep up, the capture tool will report dropped packets. This means the pcap is incomplete. Apply a capture filter to reduce load.
- **Broken Stream Reassembly:** If there is significant packet loss, Wireshark may fail to reassemble a TCP stream correctly because key packets are missing from the pcap. The analysis is only as good as the completeness of the capture.

## Interview Questions
- What is the difference between a SPAN port and a network TAP?
- Why must a network card be placed in Promiscuous Mode to capture traffic on a shared segment?
- What is the standard file extension for a packet capture? (Answer: `.pcap` or `.pcapng`).
- Why should packet capture files be handled as sensitive data?

## Summary
Packet Capture creates the forensic truth of a network event. By recording the raw traffic at the bit level and saving it to a portable, analyzable file, packet captures empower engineers to solve complex performance problems and security analysts to reconstruct breaches with absolute certainty.

## References
- [Wireshark](wireshark.md)
- [tcpdump](tcpdump.md)
- [tshark](tshark.md)
- [Syslog](../06-network-protocols/syslog.md)
