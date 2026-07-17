# WAN Technologies

> WAN (Wide Area Network) Technologies are the diverse methods and services used to connect geographically dispersed local area networks (LANs) over long distances.

## Overview
A LAN connects devices in a single building or campus. A **WAN** connects those separate LANs together. This involves leveraging infrastructure owned by telecommunications carriers (ISPs). WAN technologies are constantly evolving, driven by the need for greater bandwidth, lower latency, and higher security over massive distances.

## Why It Matters
For any multi-site enterprise (branch offices, data centers, cloud providers), WAN technologies are the lifeline connecting their distributed operations. They are the most complex and expensive part of network infrastructure. Understanding WANs is critical for network architects designing global connectivity, and for security professionals securing traffic that traverses untrusted public networks.

## Core Concepts
- **Last Mile:** The physical connection from the ISP's central office to the customer's premise. Often the slowest and most expensive part of the WAN.
- **Circuit vs. Packet-Switched:**
  - *Circuit-Switched:* A dedicated, continuous physical path is established for the duration of the communication (e.g., traditional phone calls).
  - *Packet-Switched:* Data is broken into packets, and each packet might take a different path across the network, sharing bandwidth with other users.
- **Point-to-Point vs. Hub-and-Spoke vs. Full Mesh:** Common WAN topologies.

## How It Works
The exact mechanism depends on the technology.
- **Dedicated Lines:** Your router's interface connects directly to the ISP's router via a dedicated circuit.
- **MPLS:** Your router connects to the ISP's MPLS cloud, and labels are used to route traffic to other sites on your private MPLS VPN.
- **SD-WAN:** Your router establishes encrypted tunnels over the public Internet (and other links) to a central controller, which manages traffic policies.

## Components / Types
### 1. Traditional Leased Lines
- **T1/E1:** Legacy digital synchronous lines. T1 (1.544 Mbps in North America) and E1 (2.048 Mbps in Europe). Slow, expensive, but reliable.
- **DS3/OC-x:** Higher speed dedicated lines for connecting large sites.

### 2. Packet-Switched Networks
- **Frame Relay:** Older technology (Layer 2) that created virtual circuits over a shared network. Mostly obsolete.
- **ATM (Asynchronous Transfer Mode):** Designed for voice and video, using fixed-size "cells." Mostly obsolete.
- **MPLS (Multiprotocol Label Switching):** The dominant Layer 2.5 technology for large-scale WANs, providing traffic engineering and VPN services.
- **Broadband Internet (DSL/Cable):** Inexpensive, best-effort internet access, often used with VPNs for remote branches.
- **Cellular (4G/5G):** Wireless WAN connectivity, good for remote locations or backup.

### 3. Software-Defined WAN (SD-WAN)
- A modern approach that uses software to manage multiple different WAN links (MPLS, broadband, cellular) as a single logical connection, dynamically selecting the best path for applications.

## Practical Examples
- **Small Branch Office:** Connects to the main office via a low-cost DSL internet connection with an IPsec VPN tunnel built over it.
- **Large Enterprise:** Uses an MPLS VPN from a global carrier to connect all its data centers and major branch offices.
- **Backup Link:** A primary MPLS circuit is backed up by a 5G cellular modem. If the MPLS link goes down, traffic automatically fails over to the cellular connection.

## Security Considerations
- **Traffic Interception:** Data traversing a public WAN (like the Internet) is highly susceptible to interception. Encryption (IPsec, TLS) is mandatory for sensitive data.
- **DoS/DDoS:** WAN links are finite resources. Attacks targeting WAN bandwidth can cripple connectivity. ISPs offer DDoS mitigation services.
- **Border Security:** All traffic entering or leaving the WAN must pass through firewalls and IDS/IPS systems.
- **SD-WAN Centralization:** While SD-WAN simplifies management, the central controller becomes a critical single point of failure if compromised.

## Commands / Configuration Examples
WAN configuration is complex and varies greatly by technology and vendor. These are basic router interface configuration examples.

### Cisco IOS (Configuring a Serial T1/E1 Interface)
```text
interface Serial0/0/0
 ip address 10.1.1.1 255.255.255.252
 encapsulation ppp
 clock rate 2048000
 no shutdown
```

### Linux (Configuring a PPPoE DSL Link)
```bash
# Example /etc/network/interfaces for PPPoE
auto dsl-provider
iface dsl-provider inet ppp
    provider dsl-provider
```

## Troubleshooting
- **Link Down:** Verify physical cabling to the ISP equipment. Check link lights. Contact the ISP.
- **High Latency/Packet Loss:** Run `ping` and `traceroute` to identify where in the WAN path the degradation is occurring. It's often at an ISP router.
- **VPN Tunnel Down:** If a VPN is used over the WAN, troubleshoot the VPN tunnel first (Phase 1/Phase 2 for IPsec).

## Interview Questions
- What is the fundamental difference between a LAN and a WAN?
- Name three different WAN technologies.
- Explain the role of MPLS in a large enterprise WAN.
- What are the security implications of sending unencrypted traffic over a public WAN link?

## Summary
WAN technologies are the lifeline connecting geographically dispersed networks. By leveraging a diverse set of physical and logical connections, they provide the necessary infrastructure for global communication, but require careful design and robust security to ensure reliable and secure data transfer across vast distances.

## References
- [MPLS](mpls.md)
- [SD-WAN](sd-wan.md)
- [IPsec](../09-network-security/ipsec.md)
- [BGP](../05-routing/bgp.md)
