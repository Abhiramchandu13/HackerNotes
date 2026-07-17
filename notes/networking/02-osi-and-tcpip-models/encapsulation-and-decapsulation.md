# Encapsulation and Decapsulation

> Encapsulation is the process of adding headers to data as it moves down the network stack, while decapsulation strips them away as it moves up.

## Overview
When data is sent over a network, it cannot simply be pushed onto a cable raw. It needs instructions on where to go, which application it belongs to, and how to check for errors. **Encapsulation** is the process of putting data inside "envelopes" (headers and trailers) as it travels down the OSI model. **Decapsulation** is the reverse process: opening those envelopes when the data arrives at the destination.

## Why It Matters
Understanding encapsulation is critical for analyzing packet captures, configuring VPN tunnels, and understanding network overhead. Every header added during encapsulation increases the overall size of the transmission, which relates directly to concepts like MTU (Maximum Transmission Unit).

## Core Concepts
- **Header:** Control information placed *before* the data.
- **Trailer:** Control information placed *after* the data (mostly used at Layer 2 for error checking).
- **Payload:** The actual data being carried inside the current header. To Layer 3, the Layer 4 segment is just "payload."
- **Overhead:** The extra bytes consumed by headers and trailers, which reduces the amount of effective bandwidth available for actual application data.

## How It Works
### Encapsulation (Sending)
1. **Layer 7 (Application):** You write an email. This is the **Data**.
2. **Layer 4 (Transport):** The OS takes the Data and adds a TCP Header (Source/Dest Ports). It is now a **Segment**.
3. **Layer 3 (Network):** The OS takes the Segment and adds an IP Header (Source/Dest IP). It is now a **Packet**.
4. **Layer 2 (Data Link):** The NIC takes the Packet, adds an Ethernet Header (Source/Dest MAC) and an FCS Trailer. It is now a **Frame**.
5. **Layer 1 (Physical):** The NIC translates the Frame into **Bits** and sends them onto the wire.

### Decapsulation (Receiving)
1. **Layer 1:** The receiving NIC reads the **Bits** and interprets them as a **Frame**.
2. **Layer 2:** The NIC checks the FCS trailer for errors, strips off the Ethernet Header/Trailer, and passes the **Packet** up.
3. **Layer 3:** The OS reads the IP Header, verifies the destination IP, strips the IP Header, and passes the **Segment** up.
4. **Layer 4:** The OS reads the TCP port, identifies the target application, strips the TCP Header, and passes the **Data** up.
5. **Layer 7:** The email application receives the raw data.

## Components / Types
- **Standard Encapsulation:** The standard L4 -> L3 -> L2 process.
- **Tunneling / Advanced Encapsulation:** Placing a full Packet inside *another* Packet. Used by VPNs (IPsec), GRE, and VXLAN.

## Practical Examples
- **Russian Nesting Dolls:** Encapsulation is exactly like Russian nesting dolls. The application data is the smallest doll. It goes inside the TCP doll, which goes inside the IP doll, which goes inside the Ethernet doll.
- **VPN Tunnels:** When you use a VPN, your private IP Packet is encapsulated entirely inside a new, public IP Packet so it can travel across the Internet securely. 

## Security Considerations
- **Encapsulation Overhead:** Attackers can abuse encapsulation (like GRE tunnels) to craft packets that bypass MTU limits, causing fragmentation-based Denial of Service (DoS) attacks.
- **Evasion:** Attackers sometimes encapsulate malicious traffic inside legitimate protocols (e.g., DNS Tunneling) to bypass firewalls that aren't doing deep packet inspection.
- **Decapsulation Errors:** If a firewall or Intrusion Prevention System (IPS) does not know how to decapsulate a specific tunnel protocol, it cannot inspect the payload for malware.

## Commands / Configuration Examples
You don't configure encapsulation directly as a single command, as the OS handles it automatically. However, you can view the results using packet capture tools.

### Linux / Windows (Wireshark/tcpdump)
Using `tcpdump` allows you to see the encapsulated headers:
```bash
# Capture traffic and display Ethernet (L2), IP (L3), and TCP (L4) headers
tcpdump -i eth0 -n -e -v
```

### Cisco IOS
```text
! Creating an encapsulation tunnel (GRE)
interface Tunnel0
 ip address 10.0.0.1 255.255.255.0
 tunnel source GigabitEthernet0/0
 tunnel destination 203.0.113.1
```

## Troubleshooting
- **MTU Mismatch:** If a packet has too many headers (e.g., standard headers + VPN headers), it might exceed the physical network's MTU (1500 bytes) and get dropped. This requires MSS clamping or MTU adjustment.
- **Stripping Tags:** A common issue in VLANs involves 802.1Q tags. If a switch forgets to strip the VLAN header (decapsulate) before sending a frame to a PC, the PC will drop the frame because it doesn't understand the tag.

## Interview Questions
- Define encapsulation and decapsulation in the context of the OSI model.
- At which layer is a trailer added to the data, and what is its purpose?
- Explain how a VPN utilizes encapsulation.
- If an application generates 100 bytes of data, why will the resulting Ethernet frame be larger than 100 bytes?

## Summary
Encapsulation is the method networks use to safely and accurately transport data. By wrapping data in sequential headers as it moves down the stack, and stripping them as it moves up, heterogeneous systems can seamlessly communicate.

## References
- [Protocol Data Units (PDU)](protocol-data-units.md)
- [TCP/IP Model](tcp-ip-model.md)
- [MTU](../01-networking-foundations/mtu.md)
- [VPNs](../09-network-security/vpns.md)
