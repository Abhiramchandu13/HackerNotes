# Inter-VLAN Routing

> Inter-VLAN routing is the process of using a Layer 3 device (a router or multilayer switch) to allow traffic to pass between different, isolated VLANs.

## Overview
By design, VLANs are strict boundaries. A device in VLAN 10 cannot communicate with a device in VLAN 20 at Layer 2, even if they are plugged into the exact same switch. To allow these devices to talk to each other, the traffic must be lifted out of Layer 2 (MAC addresses) and handed to a Layer 3 device (IP addresses) that knows how to route traffic between the subnets. 

## Why It Matters
A network without Inter-VLAN routing is a collection of isolated islands. You create VLANs for security and broadcast control, but eventually, users need to reach shared resources (like a server in the Data Center VLAN). Inter-VLAN routing is the controlled gateway that bridges these islands together, providing the exact point where firewalls and Access Control Lists (ACLs) can inspect the traffic.

## Core Concepts
- **Default Gateway:** For a PC in VLAN 10 to talk to VLAN 20, it must send its traffic to its Default Gateway (the router interface assigned to VLAN 10).
- **One Subnet per VLAN:** Best practice dictates a 1:1 mapping. If you have VLAN 10, it should correspond to a specific IP subnet (e.g., `10.0.10.0/24`). 
- **802.1Q Tagging:** Routers must understand VLAN tags to know which subnet the incoming traffic belongs to.

## How It Works
1. PC-A in VLAN 10 wants to ping a Server in VLAN 20.
2. PC-A realizes the Server IP is on a different subnet. It ARPs for its Default Gateway's MAC address.
3. PC-A sends an Ethernet frame to the Gateway. The switch forwards this frame to the router.
4. The router receives the frame, strips off the Layer 2 header, looks at the Layer 3 Destination IP, and realizes it needs to go to the VLAN 20 subnet.
5. The router builds a *new* Ethernet frame, tagging it for VLAN 20, and sends it back down to the switch.
6. The switch delivers the frame to the Server.

## Components / Types
There are three historical/modern ways to achieve Inter-VLAN routing:

1. **Legacy (Physical Interfaces):** The router has a dedicated physical cable plugged into the switch for every single VLAN. Highly unscalable.
2. **Router-on-a-Stick (ROAS):** A single physical cable connects the switch to the router. The switch port is a Trunk. The router port is divided into logical "Subinterfaces" (one for each VLAN), reading the 802.1Q tags to separate the traffic.
3. **Layer 3 Switching (SVI):** The modern enterprise standard. The switch itself handles the routing internally using virtual interfaces called Switch Virtual Interfaces (SVIs). No external router is needed for internal traffic.

## Practical Examples
- **Corporate Office (Layer 3 Switch):** The core switch has SVIs for `VLAN 10 (Users)` and `VLAN 20 (Printers)`. When a user prints a document, the core switch routes the traffic between the VLANs at hardware speeds, without the traffic ever leaving the switch.
- **Small Branch (Router-on-a-Stick):** A small office has a simple Layer 2 switch connected to a firewall. The firewall acts as the "stick," handling routing between the Guest VLAN and the Employee VLAN.

## Security Considerations
Inter-VLAN routing breaks the absolute isolation of a VLAN.
- **Missing ACLs:** Once Inter-VLAN routing is enabled, traffic freely passes between VLANs by default. If you isolate Guest Wi-Fi into VLAN 99, but forget to apply an ACL on the router, Guests can route directly into the corporate server VLAN.
- **Choke Points:** The Inter-VLAN router (or Layer 3 switch) is the optimal place to deploy ACLs or integrate intrusion detection sensors, as all cross-department traffic passes through it.

## Commands / Configuration Examples
### Cisco IOS (Router-on-a-Stick)
```text
! On the Router: Configure subinterfaces for dot1q tags
interface GigabitEthernet0/0
 no shutdown

interface GigabitEthernet0/0.10
 encapsulation dot1Q 10
 ip address 10.0.10.1 255.255.255.0

interface GigabitEthernet0/0.20
 encapsulation dot1Q 20
 ip address 10.0.20.1 255.255.255.0
```

### Cisco IOS (Layer 3 Switch - SVI)
```text
! Enable IP routing globally on the switch
ip routing

! Create the Switch Virtual Interfaces (Default Gateways)
interface Vlan10
 ip address 10.0.10.1 255.255.255.0
 no shutdown

interface Vlan20
 ip address 10.0.20.1 255.255.255.0
 no shutdown
```

## Troubleshooting
- **No Reachability:** Ensure the PC is configured with the correct Default Gateway IP address.
- **SVI is "Down":** A Cisco SVI (Interface VlanX) will remain in a "down/down" state unless at least one active, physical access port or trunk is passing traffic for that specific VLAN.
- **Trunk Configuration:** If using Router-on-a-Stick, verify the switch port connected to the router is configured as a Trunk (`switchport mode trunk`), not an access port.

## Interview Questions
- Why can't a Layer 2 switch route traffic between two different VLANs?
- Explain the concept of "Router-on-a-Stick".
- What is an SVI (Switch Virtual Interface) and what is its primary purpose?
- If you configure Inter-VLAN routing, how do you prevent VLAN 10 from accessing VLAN 20? (Answer: Apply an Access Control List).

## Summary
Inter-VLAN routing marries Layer 2 logical segmentation with Layer 3 connectivity. Whether using a traditional router with subinterfaces or a modern multilayer switch with SVIs, it provides the essential pathways for controlled communication across an enterprise network.

## References
- [VLANs and Trunks](vlans-and-trunks.md)
- [Routing Fundamentals](../05-routing/routing-fundamentals.md)
- [IPv4 Addressing](../04-ip-addressing/ipv4-addressing.md)
