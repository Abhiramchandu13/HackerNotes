# Ethernet Frames

> An Ethernet Frame is the digital envelope used at Layer 2 to carry data across a local network link.

## Overview
While Ethernet dictates the physical cables and speeds, the **Ethernet Frame** is the logical structure of the data traveling over those cables. It is the Protocol Data Unit (PDU) of the Data Link Layer. A frame encapsulates Layer 3 packets (like IP) and adds the necessary hardware addressing and error-checking required for local delivery.

## Why It Matters
Understanding the anatomy of a frame is crucial for network troubleshooting and packet analysis (using tools like Wireshark). For cybersecurity, manipulating frame headers is the foundation of Layer 2 attacks, including MAC spoofing, VLAN hopping, and ARP poisoning.

## Core Concepts
The standard Ethernet frame (specifically Ethernet II, or DIX) consists of several fields:
- **Preamble & SFD (8 bytes):** Alerts the receiving NIC that a frame is arriving and synchronizes timing.
- **Destination MAC (6 bytes):** The hardware address of the intended recipient.
- **Source MAC (6 bytes):** The hardware address of the sender.
- **EtherType / Type (2 bytes):** Identifies the Layer 3 protocol encapsulated inside the frame (e.g., `0x0800` for IPv4, `0x86DD` for IPv6).
- **Payload / Data (46 to 1500 bytes):** The actual data being transported (usually an IP packet). If the data is less than 46 bytes, "padding" is added.
- **FCS (4 bytes):** Frame Check Sequence. A cyclical redundancy check (CRC) used to detect data corruption during transit.

## How It Works
1. **Creation:** A PC wants to send an IPv4 packet to its router. The PC's NIC takes the packet and wraps it in a frame, putting the router's MAC address in the Destination field and its own MAC in the Source field. It calculates the FCS and appends it to the end.
2. **Transmission:** The frame is converted to bits and sent on the wire.
3. **Reception:** The switch reads the Destination MAC to determine which port to forward it to.
4. **Validation:** The receiving router's NIC calculates its own FCS based on the received data. If its calculation matches the FCS in the frame trailer, the frame is intact. If it doesn't match, the frame was corrupted and is silently dropped.

## Components / Types
- **Ethernet II Frame:** The standard frame type used by almost all IPv4 and IPv6 traffic today.
- **802.3 Frame with 802.2 LLC:** An older standard used mostly by legacy protocols like Spanning Tree Protocol (STP) or IPX.
- **Jumbo Frames:** Non-standard frames that allow a payload larger than 1500 bytes (up to 9000 bytes). Used primarily in Storage Area Networks (SANs) to reduce CPU overhead.
- **802.1Q Tagged Frame:** A standard frame with an extra 4-byte "VLAN Tag" inserted between the Source MAC and EtherType fields.

## Practical Examples
- **Wireshark Analysis:** When inspecting a packet capture, the first expandable section is "Ethernet II". Here you can clearly see the Source MAC, Destination MAC, and the EtherType identifying what comes next (like IPv4).
- **Jumbo Frames in Data Centers:** A backup server transferring terabytes of data over an iSCSI connection uses Jumbo Frames to send fewer, larger chunks of data, significantly increasing throughput.

## Security Considerations
- **MAC Spoofing:** Because switches blindly trust the Source MAC address in a frame, an attacker can modify their NIC to generate frames with a forged Source MAC, bypassing MAC filtering.
- **FCS Abuse:** Attackers can intentionally generate malformed frames to crash legacy network equipment or obscure intrusion detection signatures.
- **Sniffing:** Promiscuous mode allows a NIC to process all frames it sees on the wire, not just the ones addressed to its MAC.

## Commands / Configuration Examples
### Linux
```bash
# Capture and display raw Ethernet frame headers
tcpdump -i eth0 -e -n -c 5
```

### Cisco IOS
```text
! Enable Jumbo Frames system-wide (requires a reboot on some platforms)
system mtu jumbo 9000

! Check interface statistics for frame errors
show interfaces GigabitEthernet0/1
# Look for "runts, giants, CRC, frame, overrun, ignored"
```

## Troubleshooting
- **CRC/FCS Errors:** If a switch shows a high number of CRC errors, frames are arriving corrupted. This is almost always a physical layer issue: bad cables, EMI interference, or a failing NIC.
- **Runts and Giants:** A "runt" is a frame smaller than the minimum 64 bytes (often caused by collisions). A "giant" is a frame exceeding 1518 bytes on an interface not configured for jumbo frames.
- **MTU Mismatch:** If a PC sends a 1500-byte frame, but an intermediate switch is configured for a lower MTU, the frame will be dropped.

## Interview Questions
- What is the purpose of the Frame Check Sequence (FCS)?
- What is an EtherType field used for?
- What is the difference between a standard frame and a Jumbo frame?
- Which layer of the OSI model does a frame belong to?

## Summary
The Ethernet Frame is the core structural unit of local network communication. By encapsulating higher-layer data with hardware addressing and error-checking mechanisms, frames ensure reliable node-to-node delivery across switches and physical media.

## References
- [Ethernet](ethernet.md)
- [MAC Addresses](mac-addresses.md)
- [VLANs and Trunks](vlans-and-trunks.md)
- [Wireshark](../10-monitoring-and-troubleshooting/wireshark.md)
