# Protocol Data Units (PDU)

> A Protocol Data Unit (PDU) is the specific term used to describe a block of data at a specific layer of the OSI model.

## Overview
As data moves down the OSI model from your application to the network cable, it gets wrapped in various headers and trailers. Because the structure of the data changes at every layer, network engineers use specific names—Protocol Data Units (PDUs)—to describe exactly what the data looks like at that specific moment. 

## Why It Matters
Using PDU terminology is essential for accurate communication in IT. If a network engineer says "I'm seeing a lot of dropped packets," they mean something very specific (a Layer 3 routing issue). If they say "We have malformed frames," they mean a Layer 2 switching or physical issue. Using the wrong term leads to misdiagnosis and confusion.

## Core Concepts
Here is the strict mapping of OSI Layers to their respective PDUs:

- **Layers 5, 6, 7 (Application, Presentation, Session):** Data / Message
- **Layer 4 (Transport):** Segment (TCP) or Datagram (UDP)
- **Layer 3 (Network):** Packet
- **Layer 2 (Data Link):** Frame
- **Layer 1 (Physical):** Bits

*Mnemonic to remember (Top-Down):* **D**on't **S**ome **P**eople **F**ear **B**irthdays? (Data, Segment, Packet, Frame, Bits).

## How It Works
When you send an email:
1. The email app creates **Data**.
2. The Transport layer takes that Data, cuts it up, and adds TCP ports, creating a **Segment**.
3. The Network layer takes the Segment, adds IP addresses, creating a **Packet**.
4. The Data Link layer takes the Packet, adds MAC addresses and an error-checking trailer, creating a **Frame**.
5. The Physical layer turns the Frame into electrical 1s and 0s, creating **Bits**.

## Components / Types
- **Data (L5-7):** Raw application payload.
- **Segment (L4):** Contains Source/Destination Ports.
- **Datagram (L4):** Same as a segment, but specifically used when referring to connectionless UDP traffic.
- **Packet (L3):** Contains Source/Destination IP Addresses.
- **Frame (L2):** Contains Source/Destination MAC Addresses and an FCS (Frame Check Sequence) trailer.

## Practical Examples
- **Wireshark Analysis:** When you look at Wireshark, the top pane shows a list of captured "Packets" or "Frames". When you click on one, the middle pane breaks it down by PDU: showing the Ethernet Frame header, then the IPv4 Packet header, then the TCP Segment header, and finally the Application Data.
- **Switch vs Router:** A switch makes forwarding decisions based on *Frames*. A router makes forwarding decisions based on *Packets*.

## Security Considerations
Security devices are classified by the PDU they inspect:
- A traditional firewall inspects **Segments** (checking TCP/UDP ports).
- An intrusion detection system (IDS) may reassemble Segments to inspect the overarching **Data** payload for malicious signatures.
- An IPSec VPN encrypts entire **Packets**, encapsulating them inside new Packets to hide the original IP headers.

## Commands / Configuration Examples
While you don't configure "PDUs" directly, command outputs reference them constantly.

### Cisco IOS
```text
# Viewing frame counts and physical errors
show interfaces GigabitEthernet0/1
# Output mentions "input errors, CRC, frame, overrun"

# Viewing packet routing
show ip route
```

### Linux
```bash
# The 'ip' command manipulates Layer 3 packets/routing, while 'bridge' manipulates Layer 2 frames.
# Check interface statistics for dropped packets and frames:
ip -s link
```

## Troubleshooting
- **Frame errors (FCS/CRC):** Usually indicate a Layer 1 cable issue corrupting the bits that make up the frame.
- **Dropped Packets:** Usually indicate a Layer 3 routing issue, a firewall block, or network congestion.
- **Missing Segments:** Indicates an unreliable connection where TCP has to constantly retransmit lost segments.

## Interview Questions
- What is the PDU of the Transport Layer?
- If a device forwards traffic based on MAC addresses, what PDU is it inspecting?
- What is the difference between a Segment and a Datagram?
- What happens to a Packet when it reaches the Data Link layer? (Answer: It is encapsulated into a Frame).

## Summary
Protocol Data Units (PDUs) are the vocabulary of the OSI model. By understanding that Data becomes Segments, which become Packets, which become Frames, which become Bits, you gain a precise understanding of how data moves through a network stack.

## References
- [Encapsulation and Decapsulation](encapsulation-and-decapsulation.md)
- [OSI Model Overview](osi-model-overview.md)
- [Wireshark](../10-monitoring-and-troubleshooting/wireshark.md)
