# Static Routing

> Static routing is the process of manually configuring a router with the exact path it must take to reach a specific destination network.

## Overview
Routers do not magically know the layout of the entire network when you turn them on; they only know about the cables directly plugged into them. To teach a router about a network located three hops away, an administrator can log in and type the route manually. This is **Static Routing**. 

Unlike dynamic routing (where routers talk to each other to figure out the map), static routes never change unless a human logs in and edits them.

## Why It Matters
Static routing is highly efficient because it consumes zero CPU power and zero bandwidth (there are no routing updates sent across the network). It is universally used in small networks, stub networks, and for defining Default Routes to the Internet. For security professionals, static routes are preferred in highly secure enclaves where you do not want the router accepting automated updates from potentially untrusted neighbors.

## Core Concepts
- **Manual Configuration:** A network engineer explicitly defines the Destination Network, Subnet Mask, and Next-Hop IP.
- **Administrative Distance (AD):** Static routes are highly trusted. In Cisco IOS, a static route has an AD of `1`, meaning the router will prefer it over almost any dynamically learned route.
- **Stub Network:** A network with only one way in and one way out. Static routing is perfect here because there are no alternative paths to calculate.
- **Floating Static Route:** A static route configured with an artificially high AD (e.g., 200). It remains hidden in the background and only activates if the primary dynamic route fails.

## How It Works
1. You have Router A and Router B. Router B is connected to the `10.5.5.0/24` network.
2. Router A has no idea how to reach `10.5.5.0/24`. 
3. The administrator logs into Router A and creates a static route: `ip route 10.5.5.0 255.255.255.0 192.168.1.2` (where `192.168.1.2` is the IP of Router B).
4. When Router A receives a packet for `10.5.5.50`, it checks its routing table, finds the manual entry, and forwards the packet to Router B.

## Components / Types
- **Standard Static Route:** Points to a specific subnet.
- **Default Static Route:** Uses `0.0.0.0 0.0.0.0` to route all unknown traffic (usually pointing to an ISP).
- **Null Route:** Routes traffic to a virtual "trash can" interface (`Null0`), immediately destroying the packet.

## Practical Examples
- **Small Business Internet:** A small office has one router connecting the LAN to the ISP. The admin creates a single Default Static Route pointing to the ISP's IP. No complex dynamic protocols are needed.
- **VPN Tunnels:** In an enterprise, a static route is often used to forcefully direct traffic destined for a remote branch office (`10.20.0.0/16`) into a specific IPsec VPN tunnel interface rather than out the standard Internet connection.

## Security Considerations
- **Predictability:** Attackers love static routes because the traffic flow is absolutely predictable. 
- **Lack of Failover:** If a primary link goes down, a standard static route will happily continue throwing traffic into a black hole because it cannot adapt. This causes silent network outages.
- **Blackholing (Defense):** If an internal server is infected and trying to communicate with a known Command & Control (C2) server at `198.51.100.45`, a security engineer can add a static route: `ip route 198.51.100.45 255.255.255.255 Null0`. The router will instantly drop any traffic heading to the attacker.

## Commands / Configuration Examples
### Cisco IOS
```text
! Syntax: ip route [Destination_Network] [Subnet_Mask] [Next-Hop_IP]
ip route 10.5.5.0 255.255.255.0 192.168.1.2

! Creating a "Floating" Static route for backup (AD of 210)
ip route 10.5.5.0 255.255.255.0 192.168.2.2 210

! Blackholing malicious traffic
ip route 203.0.113.99 255.255.255.255 Null0
```

### Linux
```bash
# Temporarily add a static route
sudo ip route add 10.5.5.0/24 via 192.168.1.2

# Add a blackhole route
sudo ip route add blackhole 203.0.113.99/32
```

## Troubleshooting
- **Next-Hop Unreachable:** If you configure a static route, but the router cannot reach the Next-Hop IP you specified (e.g., the interface is down), the router will silently remove the static route from the routing table.
- **Return Routing:** The most common mistake beginners make is configuring a static route on Router A to reach Router B, but forgetting to configure the *return* static route on Router B to reach Router A. Traffic gets there, but the reply is lost.

## Interview Questions
- What is a static route?
- What are the main disadvantages of using static routing in a large enterprise network?
- What is a Floating Static Route used for?
- Explain how a Null0 route can be used defensively.

## Summary
Static routing is the most fundamental, reliable, and secure way to direct network traffic. While it lacks the adaptability required for massive, complex enterprises, it is the backbone of small office routing, default internet gateways, and precise traffic engineering.

## References
- [Routing Table](routing-table.md)
- [Default Route](default-route.md)
- [Administrative Distance](administrative-distance.md)
- [Dynamic Routing Protocols](dynamic-routing-protocols.md)
