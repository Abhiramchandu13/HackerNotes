# Routing Fundamentals

> Routing is the process of selecting the best path across one or more networks to move data from a source to a destination.

## Overview
If switching (Layer 2) is how computers talk to each other in the same room, **Routing** (Layer 3) is how computers talk to each other across the world. A router acts as a network intersection, examining the destination IP address of an incoming packet, determining the best path to get there, and forwarding the packet along that path. Without routing, the Internet would not exist.

## Why It Matters
For network engineers, routing is the core mechanism of infrastructure design. You must understand how to direct traffic efficiently and redundantly. For security professionals, routing dictates where traffic flows. If you control the routing, you control the network. Attackers manipulate routing to intercept traffic, while defenders use it to enforce choke points where firewalls can inspect data.

## Core Concepts
- **The Router:** A specialized computer that operates at Layer 3 of the OSI model. It connects two or more different logical networks (subnets).
- **The Routing Table:** The router's internal map. It lists all known networks and the specific interface to use to reach them.
- **Hop:** Every time a packet passes through a router, it has taken one "hop".
- **Time to Live (TTL):** A mechanism to prevent routing loops. Every time a packet takes a hop, its TTL decreases by 1. If TTL hits 0, the router drops the packet.
- **Next-Hop IP:** The IP address of the adjacent router that is the next step along the path to the final destination.

## How It Works
1. **Packet Arrival:** A router receives an Ethernet frame on Port A.
2. **De-encapsulation:** It strips the Layer 2 Ethernet header and looks at the Layer 3 IP header.
3. **Lookup:** It reads the Destination IP address (e.g., `10.5.5.50`) and consults its Routing Table.
4. **Match:** It finds a matching entry: "To reach `10.5.5.0/24`, send out Port B to Next-Hop `192.168.1.2`".
5. **Re-encapsulation:** It builds a new Layer 2 Ethernet frame around the packet (using the Next-Hop router's MAC address as the destination) and sends it out Port B.
6. **Decrement TTL:** Before sending, the router subtracts 1 from the packet's TTL.

## Components / Types
- **Directly Connected Routes:** The router automatically knows about networks directly plugged into its own interfaces.
- **Static Routes:** Routes manually typed into the router by an administrator.
- **Dynamic Routes:** Routes learned automatically from other routers using protocols like OSPF or BGP.
- **Default Route:** The "catch-all" route used when the destination IP isn't listed anywhere else in the routing table (usually pointing to the Internet).

## Practical Examples
- **Home Networking:** Your smartphone wants to load `google.com`. The phone realizes Google isn't on your home Wi-Fi, so it sends the packet to your home router (the Default Gateway). Your home router looks at the packet, doesn't know where Google is specifically, and sends it to the ISP's router via its Default Route.
- **Corporate Branch:** A user in the New York branch needs to access a server in the London datacenter. The New York router consults its table, sees a static route pointing traffic destined for London across the corporate MPLS link, and forwards the packet.

## Security Considerations
- **Routing Loops:** If routers are misconfigured and point to each other in a circle, traffic will bounce back and forth until the TTL expires, consuming massive CPU and bandwidth.
- **Man-in-the-Middle (MitM):** If an attacker compromises a router or injects fake routing updates, they can force the router to send sensitive traffic through the attacker's machine before it reaches its destination.
- **Blackholing:** A defensive technique where an administrator intentionally routes malicious traffic (like a DDoS attack) to an invalid interface (Null0), instantly dropping it.

## Commands / Configuration Examples
### Cisco IOS
```text
! View the entire routing table
show ip route

! View routing statistics and forwarding information
show ip protocols
```

### Linux
```bash
# View the routing table
ip route show

# View the routing path taken by a packet
traceroute 8.8.8.8
```

### Windows
```powershell
# View the routing table
route print
```

## Troubleshooting
- **Cannot reach the Internet:** Check the Default Gateway. If a PC has an IP and Subnet Mask but no Gateway, it cannot route off its local subnet.
- **Asymmetric Routing:** Traffic leaves the network via Router A, but the reply comes back via Router B. Firewalls hate this because they only see half the conversation and will drop the return traffic. Ensure routing paths are symmetric where stateful inspection is required.

## Interview Questions
- At what layer of the OSI model does routing occur?
- Explain the process a router uses to forward a packet.
- What prevents a packet from bouncing infinitely between two misconfigured routers?
- Explain the difference between a MAC address and an IP address in the context of a routed packet. (Answer: The IP addresses remain constant end-to-end, but the MAC addresses are rewritten at every single router hop).

## Summary
Routing is the fundamental process of navigating the Internet and enterprise networks. By using IP addresses and routing tables, routers make intelligent, hop-by-hop decisions to guarantee data reaches its global destination efficiently.

## References
- [Network Layer](../02-osi-and-tcpip-models/network-layer.md)
- [Routing Table](routing-table.md)
- [Static Routing](static-routing.md)
- [Dynamic Routing Protocols](dynamic-routing-protocols.md)
