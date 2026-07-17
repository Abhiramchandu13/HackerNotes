# Router

> A router is an intelligent Layer 3 network device that connects different networks together and determines the best path to forward data packets between them.

## Overview
If a switch connects devices within the same office, a **Router** connects the office to the rest of the world. Operating at the **Network Layer (Layer 3)** of the OSI model, routers read the logical IP addresses on packets. They maintain an internal map (the routing table) to decide exactly which interface a packet should exit to reach its final destination, whether that is the subnet next door or a server across the globe.

## Why It Matters
Routers are the border guards and traffic directors of the Internet. Without routers, local area networks (LANs) would be isolated islands incapable of reaching cloud services or remote branches. Understanding router operation is the foundation of the Cisco CCNA and essential for any network engineer. For cybersecurity, routers are the primary enforcement points for wide-area Access Control Lists (ACLs) and site-to-site VPNs.

## Core Concepts
- **Layer 3 Forwarding:** Routers only care about IP addresses (IPv4/IPv6), ignoring underlying Layer 2 MAC addresses (which they rewrite at every hop).
- **Routing Table:** The database the router uses to match Destination IP addresses to physical exit interfaces.
- **Default Gateway:** For computers on a LAN, the router acts as the default gateway—the exit door for any traffic destined for a foreign network.
- **Broadcast Isolation:** Routers inherently **block broadcast traffic**. A broadcast sent on one subnet stops at the router, preventing massive broadcast storms from crippling wide-area networks.

## How It Works
1. A PC on Subnet A (`10.1.1.5`) wants to send a packet to a Server on Subnet B (`10.2.2.50`).
2. The PC realizes Subnet B is not local. It sends the Ethernet frame to the Router's MAC address.
3. The Router receives the frame, strips off the Layer 2 Ethernet header, and examines the Layer 3 Destination IP (`10.2.2.50`).
4. The Router queries its Routing Table. It finds an entry: "Subnet `10.2.2.0/24` is accessible via Interface `GigabitEthernet0/1`".
5. The Router builds a *new* Layer 2 Ethernet frame around the packet (with a new Source and Destination MAC address) and forwards it out `GigabitEthernet0/1` toward Subnet B.

## Components / Types
- **Edge / Border Router:** Placed at the perimeter of the corporate network to connect to the ISP and the public Internet (often running BGP).
- **Core Router:** High-capacity routers used internally within massive data centers or ISP backbones to move terabytes of data rapidly.
- **Branch Router:** Smaller devices connecting remote offices to headquarters, often utilizing VPNs and SD-WAN technologies.
- **Layer 3 Switch:** A high-speed network switch that has a routing engine built into its hardware, blurring the line between switching and routing in enterprise campus environments.

## Practical Examples
- **The Home Router:** The box provided by your ISP is actually a multi-function device: it is a Router (connecting your home to the ISP), a Switch (the 4 ports on the back), and an Access Point (the Wi-Fi antennas), performing NAT to hide your home devices.
- **Enterprise Router-on-a-Stick:** A single enterprise router uses "subinterfaces" to read 802.1Q VLAN tags, allowing it to route traffic between 10 different isolated VLANs across a single physical cable connected to a core switch.

## Security Considerations
- **Access Control Lists (ACLs):** Routers are the first line of defense. Standard and Extended ACLs are applied to router interfaces to permit or deny traffic based on Source/Destination IP and TCP/UDP ports.
- **Route Injection / Spoofing:** If an attacker compromises a router's dynamic routing protocol (like OSPF), they can inject false routes, redirecting sensitive corporate traffic to an attacker-controlled network. (Defended by routing protocol authentication).
- **Management Plane Protection:** Routers must have strict Control Plane Policing (CoPP). If management interfaces (SSH, SNMP) are left exposed to the Internet, attackers will brute-force them to gain control of the network backbone.

## Commands / Configuration Examples
### Cisco IOS
```text
! Basic interface configuration
interface GigabitEthernet0/0
 description WAN_Link_To_ISP
 ip address 203.0.113.2 255.255.255.252
 no shutdown

! Configure a static default route to the Internet
ip route 0.0.0.0 0.0.0.0 203.0.113.1

! View the routing table (The most important router command)
show ip route
```

### Linux (Acting as a Router)
```bash
# Enable IPv4 packet forwarding in the Linux kernel
sudo sysctl -w net.ipv4.ip_forward=1

# View the Linux routing table
ip route show
```

## Troubleshooting
- **No Route to Host:** If a router receives a packet for an IP it does not have in its routing table (and it has no default route), it will drop the packet and send an ICMP "Destination Unreachable" message back to the sender.
- **Asymmetric Routing:** If traffic leaves the network via Router A, but the ISP routes the return traffic back through Router B, stateful firewalls sitting behind the routers will drop the return traffic because they didn't see the initial connection.

## Interview Questions
- At which layer of the OSI model does a router operate? (Answer: Layer 3 - Network).
- What is the primary difference between a router and a switch?
- Why do routers inherently block broadcast traffic?
- Explain the process of how a router handles an incoming packet.

## Summary
Routers are the decision engines of internetworking. By isolating broadcast domains, making intelligent path decisions based on IP addresses, and acting as gateways between entirely different networks, they provide the global connectivity that defines modern IT.

## References
- [Network Layer](../02-osi-and-tcpip-models/network-layer.md)
- [Routing Fundamentals](../05-routing/routing-fundamentals.md)
- [Switch](switch.md)
- [Firewall](firewall.md)
