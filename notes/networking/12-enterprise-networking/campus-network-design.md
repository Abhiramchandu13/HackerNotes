# Campus Network Design

> Campus Network Design is the structured, hierarchical architecture used to build scalable, reliable, and manageable local area networks for enterprise environments spanning multiple buildings or large facilities.

## Overview
You cannot connect 5,000 computers in a corporate headquarters by simply daisy-chaining hundreds of cheap switches together. This creates a flat, unmanageable network highly susceptible to broadcast storms, single points of failure, and security breaches.

**Campus Network Design** provides a proven blueprint for scaling networks. Developed extensively by vendors like Cisco (the Hierarchical Network Model), it divides the network into distinct logical layers, each with a specific role, ensuring predictability, performance, and easy troubleshooting.

## Why It Matters
For network architects and engineers, the hierarchical model is the fundamental law of network design. It turns chaotic, organic network growth into a structured, modular system. Understanding this design is essential for deploying hardware efficiently (e.g., you don't buy an expensive core router for an access-layer closet) and for implementing comprehensive security zoning.

## Core Concepts
The classic hierarchical campus model consists of three layers:
1.  **Access Layer (The Edge):** Where end devices (PCs, phones, printers, APs) connect to the network. Focuses on port density, PoE, and initial security (Port Security, 802.1X).
2.  **Distribution Layer (The Middle):** Aggregates traffic from multiple Access switches. Focuses on routing, inter-VLAN routing, ACL enforcement, and policy application.
3.  **Core Layer (The Backbone):** Aggregates traffic from all Distribution switches. Focuses *exclusively* on moving massive amounts of data as fast as possible. No complex security or policy checking is done here.

*Note: In smaller campuses, the Core and Distribution layers are often combined into a "Collapsed Core" design.*

## How It Works
1. A user in Building A, Floor 1 plugs into an **Access Layer** switch in the local wiring closet. The switch assigns them to VLAN 10 and provides PoE to their IP phone.
2. The user requests a file from a server in the data center. The Access switch forwards the frame over a fiber uplink to the **Distribution Layer** switch for Building A.
3. The Distribution switch performs Inter-VLAN routing, checks its ACLs to ensure the user is allowed to access the server, and routes the packet up to the **Core Layer**.
4. The Core Layer rapidly switches the packet across the campus backbone to the data center distribution switches.

## Components / Types
- **Two-Tier (Collapsed Core):** Ideal for small to medium enterprises. Access switches connect directly to a pair of highly capable switches that perform both Distribution (routing/policy) and Core (high-speed switching) functions.
- **Three-Tier:** Essential for large campuses with multiple buildings. Separates Core and Distribution to maximize scalability and simplify physical cabling (e.g., all buildings connect back to a central Core facility).

## Practical Examples
- **University Campus:** A university has 20 buildings. Each building has a Distribution switch. The Distribution switch aggregates fiber links from 10 different Access switches located on various floors. The 20 Distribution switches then connect via 10Gbps fiber back to two massive Core switches located in the main IT data center, providing a highly structured, easily expandable network.

## Security Considerations
Security is enforced structurally within the model:
- **Access Layer:** The perimeter. Enforces Port Security, Dynamic ARP Inspection, DHCP Snooping, and 802.1X to prevent unauthorized physical access or rogue devices.
- **Distribution Layer:** The policy enforcement point. Implements Access Control Lists (ACLs) to control traffic between VLANs (e.g., blocking the Student VLAN from reaching the Finance VLAN).
- **Core Layer:** *No security filtering should happen here.* If the Core has to stop and inspect every packet against a firewall rule, the entire campus network will slow down. The Core's only job is speed.

## Commands / Configuration Examples
Campus design is an architectural concept, not a specific command. However, configurations vary by layer.

### Access Layer Configuration (Cisco IOS)
```text
! Access layer focuses on edge security and connectivity
interface GigabitEthernet1/0/1
 switchport mode access
 switchport access vlan 10
 switchport port-security
 spanning-tree bpduguard enable
```

### Distribution Layer Configuration (Cisco IOS)
```text
! Distribution layer focuses on routing and policy
interface Vlan10
 ip address 10.1.10.1 255.255.255.0
 ip access-group USER_ACL in
```

## Troubleshooting
- **Isolating Issues:** The hierarchical design simplifies troubleshooting. If one floor is down, the issue is at the Access Layer. If an entire building is down, check the Distribution Layer. If the whole campus is struggling to reach the data center, check the Core Layer.
- **Over-Complicating the Core:** If the Core network is experiencing high CPU or latency, verify that junior admins haven't accidentally applied complex ACLs, QoS marking, or NAT policies to the core interfaces. The Core must remain "dumb and fast."

## Interview Questions
- Name the three layers of the classic hierarchical network model.
- What is the primary function of the Core layer? (Answer: High-speed, highly redundant transport of data; no packet manipulation or security filtering).
- At which layer are end-user devices connected, and what security features are typically applied there?
- What is a "Collapsed Core" design, and when is it appropriate to use?

## Summary
Campus Network Design applies order to complex physical infrastructures. By adhering to the Access, Distribution, and Core hierarchical model, organizations can build networks that are inherently scalable, highly resilient, and significantly easier to secure and maintain as the business grows.

## References
- [Spine-Leaf Architecture](spine-leaf-architecture.md)
- [VLANs and Trunks](../03-ethernet-and-switching/vlans-and-trunks.md)
- [Inter-VLAN Routing](../03-ethernet-and-switching/inter-vlan-routing.md)
- [High Availability](high-availability.md)
