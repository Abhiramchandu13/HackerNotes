# MPLS (Multiprotocol Label Switching)

> MPLS is a high-performance, flexible data-carrying mechanism that forwards network packets based on short path labels rather than complex IP address lookups, improving speed and traffic engineering in large networks.

## Overview
Traditional IP routing is like a postal service that reads the full address on every single letter at every single sorting office. This is flexible, but it's slow. **Multiprotocol Label Switching (MPLS)** is like slapping a simple color-coded sticky note (a "label") on the letter at the first sorting office, and then every subsequent office just reads the color, making forwarding decisions much faster.

MPLS is a protocol that operates somewhere between Layer 2 (Data Link) and Layer 3 (Network) of the OSI model, making it a "Layer 2.5" technology. It allows data to be forwarded at near Layer 2 speeds with the flexibility of Layer 3 routing.

## Why It Matters
MPLS is the backbone of almost every modern Wide Area Network (WAN) and large Internet Service Provider (ISP) network. It enables high-performance traffic engineering, allows ISPs to provide features like VPNs directly to customers (MPLS VPNs), and is crucial for delivering services with strict Quality of Service (QoS) guarantees. Understanding MPLS is a core requirement for CCNP-level network engineers.

## Core Concepts
- **Label:** A short, fixed-length (20-bit) identifier that is prepended to an IP packet.
- **LSR (Label Switch Router):** An MPLS-enabled router that forwards packets based on labels.
- **LER (Label Edge Router):** The router at the edge of the MPLS cloud that *applies* labels to incoming IP packets and *removes* labels from outgoing labeled packets.
- **FEC (Forwarding Equivalence Class):** A group of packets that are forwarded in the same manner (e.g., all packets destined for `10.1.1.0/24`). All packets in the same FEC are assigned the same label.
- **Label Stacking:** Multiple labels can be stacked on top of each other, creating hierarchical tunnels.

## How It Works
1. An IP packet arrives at the **LER (Label Edge Router)** at the entrance to the MPLS network.
2. The LER performs a traditional IP lookup, identifies the **FEC** (e.g., "traffic for `10.1.1.0/24`"), and assigns a specific label (e.g., Label 100). It pushes this label onto the packet and forwards it.
3. The packet then travels through the core of the MPLS network, passing through **LSRs (Label Switch Routers)**.
4. Each LSR does *not* perform an IP lookup. It simply reads the label, swaps it for a new label (e.g., Label 100 becomes Label 101), and forwards the packet based on that label. This is incredibly fast.
5. The packet reaches the **egress LER** (at the exit of the MPLS network). The egress LER removes the label and performs a final IP lookup, forwarding the original IP packet to its destination.

## Components / Types
- **LDP (Label Distribution Protocol):** The most common protocol used by LSRs to exchange and negotiate which label corresponds to which FEC.
- **MPLS VPNs (RFC 4364):** The dominant use case. Allows ISPs to provide customers with isolated VPNs over a shared MPLS backbone. Customers simply receive their own routing table, and the MPLS labels keep their traffic completely separate from other customers.
- **MPLS Traffic Engineering (TE):** Allows engineers to force traffic down specific paths, regardless of traditional IP routing metrics, to optimize network performance or utilize specific bandwidth.

## Practical Examples
- **ISP Core Routing:** When you send a packet from your home to Google, it often first hits your ISP's core network. That core network is almost certainly running MPLS. Your IP packet is labeled at the edge, travels rapidly across the MPLS backbone, and is unlabeled before being sent to Google's network.
- **Layer 3 VPNs (L3VPN):** A large enterprise has 50 branches. Instead of building 50 separate IPsec VPNs, they subscribe to an MPLS L3VPN from their ISP. Each branch connects to the ISP's MPLS cloud, and the ISP uses labels to create a private routing domain between all 50 branches, making them appear as one seamless network.

## Security Considerations
- **MPLS VPN Segmentation:** Properly implemented MPLS VPNs provide strong isolation between customer networks. Traffic from Company A cannot accidentally bleed into Company B. However, misconfigurations can lead to cross-customer traffic leaks.
- **Denial of Service (DoS):** Attacking the core MPLS network can disrupt thousands of customers. DDoS attacks are often mitigated at the edge of the MPLS network.
- **Traffic Interception:** While MPLS provides segmentation, it does not inherently encrypt the traffic. If data is sensitive, it should be encrypted at a higher layer (e.g., IPsec or TLS) before entering the MPLS cloud.

## Commands / Configuration Examples
### Cisco IOS
```text
! Enable MPLS globally
mpls ip

! Enable MPLS on specific interfaces
interface GigabitEthernet0/0
 mpls ip
```

### Displaying MPLS Forwarding Table
```text
! View the Label Forwarding Information Base (LFIB) on an LSR
show mpls forwarding-table

! View LDP neighbors
show mpls ldp neighbor
```

## Troubleshooting
- **Label Not Found (LFIB):** If a packet enters an LSR with a label it doesn't recognize, the packet is usually dropped. This indicates an issue with the LDP protocol (neighbor not forming, or the label wasn't distributed correctly).
- **Control Plane vs. Data Plane:** A common MPLS troubleshooting technique is to verify that LDP (Control Plane) has correctly distributed labels *before* checking if traffic is actually flowing (Data Plane).
- **TTL Propagation:** By default, MPLS copies the IP packet's TTL into its own label header. This ensures that a packet doesn't loop endlessly inside the MPLS cloud.

## Interview Questions
- What is the primary purpose of MPLS?
- At what OSI layer does MPLS operate? (Answer: Layer 2.5).
- Explain the role of an LER (Label Edge Router) and an LSR (Label Switch Router).
- What is a key benefit of MPLS for Internet Service Providers? (Answer: Traffic Engineering and MPLS VPNs).

## Summary
MPLS is the invisible, high-speed engine of modern WANs and ISP backbones. By replacing IP lookups with simple label swaps, it enables massive scale, flexible traffic engineering, and the seamless delivery of diverse services like VPNs, forming the critical "glue" that connects the global Internet.

## References
- [WAN Technologies](wan-technologies.md)
- [BGP](../05-routing/bgp.md)
- [QoS](qos.md)
- [Virtual Private Networks (VPNs)](../09-network-security/vpns.md)
