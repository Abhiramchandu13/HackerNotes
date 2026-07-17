# Layer 3 - Network Layer

> The Network Layer (Layer 3) handles logical addressing and determines the best path to route data between different networks.

## Overview
While Layer 2 handles communication on a local network, Layer 3 makes the global Internet possible. The Network layer is responsible for logical addressing (like IP addresses) and routing. If data needs to leave your local office and travel to a server in another country, Layer 3 figures out the path it must take across multiple interconnected networks.

## Why It Matters
Without Layer 3, devices could only talk to computers plugged into the exact same switch. Understanding the Network Layer is mandatory for IT and cybersecurity professionals because it forms the basis of subnets, IP addressing, routing tables, and perimeter firewall filtering.

## Core Concepts
- **Packets:** The Protocol Data Unit (PDU) at Layer 3.
- **Logical Addressing:** Unlike hard-coded MAC addresses, logical addresses (IPv4, IPv6) are assigned by administrators and represent a device's location in the network hierarchy.
- **Routing:** The process of examining the destination IP address of a packet and choosing the best path to send it forward.
- **Fragmentation:** Breaking large packets into smaller ones if they exceed the MTU (Maximum Transmission Unit) of the underlying Layer 2 link.

## How It Works
1. The Network Layer receives a Segment from Layer 4 (Transport).
2. It encapsulates the segment into a **Packet** by adding a Layer 3 header, which includes the Source IP and Destination IP.
3. The device checks its routing table. If the destination IP is on the same subnet, it sends it locally. If it is on a different subnet, it forwards the packet to the Default Gateway (a router).
4. The router receives the packet, decapsulates Layer 2, reads the Layer 3 destination IP, checks its routing table, and forwards the packet out the appropriate interface toward the destination.

## Components / Types
- **Routers:** The definitive Layer 3 device. They connect different networks together.
- **Layer 3 Switches:** Switches equipped with routing capabilities (often replacing traditional routers in enterprise campus cores).
- **Protocols:** IPv4, IPv6, ICMP (Ping), IPsec, and routing protocols like OSPF, EIGRP, and BGP.

## Practical Examples
- **Browsing a website:** Your PC (IP `192.168.1.15`) wants to talk to Google (`8.8.8.8`). Layer 3 realizes `8.8.8.8` is not local, so it routes the packet to your home router (`192.168.1.1`).
- **Ping:** Using the `ping` utility sends an ICMP Echo Request at Layer 3 to test basic connectivity and routing to a target host.

## Security Considerations
Layer 3 is the primary boundary for access control in enterprise networks:
- **IP Spoofing:** Attackers forge the source IP address in a packet to hide their identity or bypass IP-based authentication.
- **Ping of Death / Smurf Attack:** Legacy attacks that abused Layer 3 fragmentation and ICMP to crash targets.
- **Firewalls:** Network-level firewalls and Access Control Lists (ACLs) operate here, explicitly allowing or denying traffic based on Source/Destination IP.
- **IPsec:** Provides confidentiality and integrity for entire IP packets, commonly used for site-to-site VPNs.

## Commands / Configuration Examples
### Linux
```bash
ip addr show         # View IP addresses
ip route show        # View the routing table
ping 8.8.8.8         # Test Layer 3 reachability
```

### Windows
```powershell
ipconfig             # View basic IP info
route print          # View the Windows routing table
tracert 8.8.8.8      # Trace the Layer 3 path to a destination
```

### Cisco IOS
```text
show ip interface brief   ! View interface IP assignments
show ip route             ! View the router's routing table
```

## Troubleshooting
When troubleshooting Layer 3:
- **Is the IP correct?** Verify the device has a valid, non-overlapping IP address and subnet mask.
- **Can you ping the gateway?** If you cannot reach your default gateway, you cannot route traffic off the local network.
- **Check the routing table:** Ensure the router actually knows a path to the destination network.
- **Trace the route:** Use `traceroute` to see exactly which router along the path is dropping your packets.

## Interview Questions
- What is the PDU of the Network Layer?
- Explain the main difference between a MAC address and an IP address.
- What is the function of a router at the Network layer?
- Which protocol operates at Layer 3 to provide error reporting and connectivity testing? (Answer: ICMP)

## Summary
The Network Layer handles logical IP addressing and path determination. By utilizing routers and routing protocols, Layer 3 ensures that packets can traverse complex webs of interconnected LANs to reach destinations anywhere in the world.

## References
- [Data Link Layer](data-link-layer.md)
- [Transport Layer](transport-layer.md)
- [IPv4 Addressing](../04-ip-addressing/ipv4-addressing.md)
- [Routing Fundamentals](../05-routing/routing-fundamentals.md)
