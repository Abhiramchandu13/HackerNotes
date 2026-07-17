# Wireshark

> Wireshark is a powerful, open-source graphical packet analyzer used to capture, filter, and inspect the raw binary data flowing over a network interface.

## Overview
If a packet is a letter, **Wireshark** is the tool that lets you steam open the envelope and read the exact text inside. It operates at the physical interface level, putting the Network Interface Card (NIC) into "promiscuous mode" to capture and translate raw bit streams into human-readable headers and payloads.

It is the industry standard for network analysis, protocol development, education, and security auditing.

## Why It Matters
A network engineer uses Wireshark to find out exactly why a protocol is failing (e.g., seeing TCP retransmissions or packet corruption). A security analyst uses it to inspect suspicious traffic, extract malicious files (like malware payloads) directly from the stream, and reconstruct network attacks. For pentesters, Wireshark is used to sniff cleartext passwords and understand local topologies.

## Core Concepts
- **Packet Capture (pcap):** The raw file format used to save network captures.
- **Promiscuous Mode:** A NIC setting that forces the card to process all packets it sees on the physical wire, not just the ones addressed to its own MAC address.
- **Display Filters:** Expressions used to filter the massive stream of captured packets so you only see what is relevant (e.g., `ip.addr == 10.0.0.5`).
- **Capture Filters:** Expressions used to limit what the NIC actually writes to memory *during* the capture (e.g., `host 10.0.0.5`).
- **Follow Stream:** A feature that automatically reassembles TCP segments or UDP datagrams to show the full, readable Application layer text of a conversation.

## How It Works
1. You select a network interface (e.g., `eth0` or Wi-Fi) and click start.
2. The Wireshark engine (using `libpcap` on Linux or `Npcap` on Windows) captures every frame arriving at the NIC.
3. Wireshark parses the binary headers, color-coding them by protocol (e.g., DNS is light blue, TCP errors are red).
4. You apply a display filter (like `http.request.method == "POST"`) to find login attempts.
5. You right-click a packet and choose "Follow -> TCP Stream" to view the plain-text HTTP payload, revealing the submitted password.

## Components / Types
- **Capture Engine:** Handled by `Npcap` (Windows) or `libpcap` (macOS/Linux).
- **Wireshark GUI:** The visual three-pane window:
  - *Top Pane:* List of packets with timestamp, source, destination, protocol, and info.
  - *Middle Pane:* Expandable protocol tree (Layer 2 down to Layer 7).
  - *Bottom Pane:* Raw hex and ASCII dump of the packet bytes.
- **tshark:** The command-line version of Wireshark (see [tshark](tshark.md)).

## Practical Examples
- **Diagnosing Slow Downloads:** You start a capture and download a file. Wireshark highlights many packets in black and red, marked as "TCP Dup ACK" and "TCP Retransmission". This proves the network is experiencing packet loss, forcing the sender to resend data constantly.
- **Analyzing a VoIP Call:** Under the `Telephony` menu, Wireshark can detect SIP and RTP streams, analyze the jitter, and even play back the unencrypted audio of a phone call.

## Security Considerations
- **Sniffing Exposure:** Because Wireshark captures everything in cleartext, running unencrypted protocols (HTTP, Telnet, FTP, LDAP, SMTP) is a massive security risk. Anyone on the path can read the data.
- **WIPS Detection:** Network intrusion systems can detect if a wireless card is placed into monitor/promiscuous mode, potentially alerting security to an attacker's presence.
- **Large Captures:** Packet capture files grow rapidly. Running Wireshark continuously on a high-throughput server will exhaust disk space in minutes. Use capture filters to limit the size.

## Commands / Configuration Examples
Wireshark is a GUI tool, but you must know the **Display Filter Syntax** to use it effectively.

### Common Display Filters
```text
! Show only HTTP traffic
http

! Show traffic to or from a specific IP
ip.addr == 192.168.1.50

! Show only TCP traffic on port 443 (HTTPS)
tcp.port == 443

! Show DNS requests for a specific domain
dns.qry.name contains "malicious"

! Find cleartext HTTP login attempts
http.request.method == "POST" && http contains "password"
```

## Troubleshooting
- **No Packets Captured:** Ensure you have administrative or root privileges. On Windows, ensure `Npcap` was installed correctly with the option to support raw packet loopback. On Linux, ensure the user belongs to the `wireshark` group.
- **Only Seeing Broadcasts:** If you are plugged into a switch port but only see broadcast traffic (like ARP), the switch is working correctly. It only sends unicast traffic to the target port. You must configure **port mirroring (SPAN)** on the switch to copy other users' traffic to your port.

## Interview Questions
- What is the difference between a Capture Filter and a Display Filter in Wireshark?
- Why is it necessary to enable Promiscuous Mode to sniff network traffic?
- What does a high number of "TCP Retransmission" packets in a capture indicate?
- How does Wireshark help security analysts during incident response?

## Summary
Wireshark is the essential diagnostic window into network operations. By parsing raw binary traffic into structured, readable protocol layers, it allows administrators and analysts to see exactly what is traveling over the wire, diagnose failures, and investigate security incidents.

## References
- [tcpdump](tcpdump.md)
- [tshark](tshark.md)
- [Ports and Sockets](../06-network-protocols/ports-and-sockets.md)
- [Packet Capture](packet-capture.md)
