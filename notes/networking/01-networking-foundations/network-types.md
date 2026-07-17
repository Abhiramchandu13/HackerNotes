# Network Types

> Network types describe how large a network is, who can access it, and how far its traffic must travel.

## Overview
Network types help you classify systems by scope and purpose. Some networks are tiny and private, such as a home LAN. Others span cities, countries, or the globe.

Understanding network types is useful for design, troubleshooting, and security because each type has different performance, trust, and exposure characteristics.

## Why It Matters
Different network types introduce different risks and design decisions.

For example:
- A LAN can be optimized for speed and local management
- A WAN must handle latency and provider dependencies
- A VPN extends secure access across untrusted networks
- A cloud network behaves differently than a traditional on-prem network

Security teams use network type to estimate exposure, control trust, and scope incidents.

## Core Concepts
Common network types include:
- LAN: Local Area Network
- WLAN: Wireless Local Area Network
- WAN: Wide Area Network
- MAN: Metropolitan Area Network
- PAN: Personal Area Network
- SAN: Storage Area Network
- VPN: Virtual Private Network
- CAN: Campus Area Network
- Intranet: private internal network
- Extranet: controlled partner access network

## How It Works
Network type is usually defined by:
1. Geographic scope
2. Ownership and administrative control
3. Connection medium
4. Purpose and traffic patterns
5. Security boundaries

A LAN may connect office workstations to local servers. A WAN connects branch offices to a data center or cloud services. A VPN encrypts traffic over the Internet so remote users appear to be part of the internal network.

## Components / Types
### LAN
A private network inside a building or campus. Typical examples include office floors, lab environments, and home networks.

### WLAN
A LAN that uses wireless radio instead of only cables. See [Wireless Basics](../08-wireless-networking/wifi-basics.md).

### WAN
A network that connects distant sites using leased lines, MPLS, SD-WAN, or the public Internet.

### PAN
A short-range network around a person, such as Bluetooth headsets, smart watches, and phone tethering.

### SAN
A specialized network for connecting storage systems to servers with high throughput and low latency.

## Practical Examples
- A company floor with switches, access points, and printers is a LAN.
- A branch office connected to headquarters over MPLS is part of a WAN.
- A laptop connected to a phone hotspot is using a PAN-style connection.
- Two businesses sharing limited resources through a partner portal may use an extranet.

## Security Considerations
- LANs are not automatically safe; attackers inside the network can still move laterally.
- WANs often cross provider infrastructure and public networks.
- WLANs are vulnerable to weak encryption, rogue access points, and signal leakage.
- Extranets must enforce strict authentication and authorization.

## Commands / Configuration Examples
### Linux
```bash
ip addr
ip route
nmcli device status
```

### Windows
```powershell
Get-NetAdapter
Get-NetIPConfiguration
route print
```

### Cisco IOS
```text
show interfaces status
show vlan brief
show ip route
```

## Troubleshooting
Ask these questions first:
- Is the device on the expected network type?
- Is the correct interface in use, wired or wireless?
- Is the traffic leaving the LAN toward a WAN or VPN?
- Is the network boundary blocking the request?

## Interview Questions
- What is the difference between a LAN and WAN?
- How does a WLAN differ from a LAN?
- What is the purpose of a VPN in networking?
- What is an extranet?
- Why do enterprises use a SAN?

## Summary
Network types define scope, ownership, and trust. They are the first step toward understanding how traffic should move and where security controls belong.

## References
- [What is Networking](what-is-networking.md)
- [Internet, Intranet, and Extranet](internet-vs-intranet-vs-extranet.md)
- [Wireless Basics](../08-wireless-networking/wifi-basics.md)
- [Cloud Networking](../11-cloud-and-virtual-networking/cloud-networking.md)
