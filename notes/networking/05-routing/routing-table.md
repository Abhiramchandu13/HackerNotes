# Routing Table

> The routing table is a router's internal database that lists all known network destinations and exactly which path to take to reach them.

## Overview
A router is essentially a traffic sorter. When a packet arrives, the router must decide where to send it. It makes this decision by consulting the **Routing Table**. If the destination IP address exists in the table, the packet is forwarded out the specified interface. If it doesn't exist (and there is no default route), the router drops the packet and sends an "Unreachable" message back to the sender.

## Why It Matters
The routing table is the absolute source of truth for network traffic flow. If you are troubleshooting a connectivity issue where a user cannot reach a server, checking the routing table of the routers along the path is step one. For penetration testers, viewing a compromised host's routing table reveals the layout of the internal network and identifies potential pivoting targets.

## Core Concepts
Every entry in a routing table contains specific components:
- **Destination Network:** The target subnet (e.g., `10.5.5.0/24`).
- **Next-Hop IP Address:** The IP of the *next* router the packet must be handed to.
- **Exit Interface:** The physical port on the local router the packet will leave from (e.g., `GigabitEthernet0/1`).
- **Metric:** The "cost" of the route. If there are two paths to the same destination, the router chooses the one with the lowest metric.
- **Administrative Distance (AD):** The "trustworthiness" of the route source. A directly connected route is trusted more than an OSPF route.

## How It Works
When a packet arrives destined for `192.168.50.15`:
1. The router scans the routing table looking for a match.
2. **Longest Prefix Match Rule:** The router will always choose the most specific route. If the table has an entry for `192.168.0.0/16` and an entry for `192.168.50.0/24`, it will use the `/24` route because it is a more precise match for the destination.
3. If no specific match is found, the router looks for a **Default Route** (`0.0.0.0/0`).
4. If there is no match and no default route, the packet is dropped.

## Components / Types
Routes enter the routing table via three primary methods:
1. **Directly Connected (C):** When you assign an IP to a router's interface (e.g., `10.1.1.1/24`), the router automatically adds the `10.1.1.0/24` network to the table.
2. **Static (S):** An administrator manually types the route into the configuration.
3. **Dynamic (O, D, B):** The router learns the route automatically from neighboring routers via protocols like OSPF (O), EIGRP (D), or BGP (B).

## Practical Examples
- **Reading a Table:** A routing table entry might look like: `O 10.2.2.0/24 [110/65] via 192.168.1.2, GigabitEthernet0/0`. This means: "I learned via OSPF (O) that to reach the `10.2.2.0/24` network, hand the packet to the router at `192.168.1.2` by sending it out of port `Gi0/0`."

## Security Considerations
- **Host Routing Tables:** Every Windows and Linux PC has its own mini routing table. Pentesters frequently use `route print` or `ip route` on a compromised endpoint to discover VPN subnets or hidden management networks the host has access to.
- **Route Injection:** If an attacker can inject fake routes into a dynamic routing protocol, they can poison the routing table, forcing the router to send sensitive traffic to the attacker's machine.

## Commands / Configuration Examples
### Cisco IOS
```text
! Display the full IPv4 routing table
show ip route

! View only routes learned via OSPF
show ip route ospf

! Query the table to see exactly which path a specific IP will take
show ip route 10.5.5.20
```

### Linux
```bash
# Display the routing table
ip route show

# Legacy command, still widely used
route -n
```

### Windows
```powershell
# Display the routing table
route print

# PowerShell native command
Get-NetRoute
```

## Troubleshooting
- **Missing Routes:** The most common issue. If `show ip route 10.2.2.5` returns `% Network not in table`, the router will instantly drop traffic destined for that IP.
- **Asymmetric Routing:** If Router A has a route to the destination via ISP 1, but the destination router has a route back via ISP 2, the traffic will take two different paths. Stateful firewalls in the middle will drop this traffic because they only see half the connection.

## Interview Questions
- What is a routing table used for?
- Explain the "Longest Prefix Match" rule.
- If a router has a static route (AD 1) and an OSPF route (AD 110) to the exact same destination, which one will it install in the routing table and why?
- How does a "Directly Connected" route get into the routing table?

## Summary
The routing table is the definitive rulebook for how a Layer 3 device processes traffic. Mastering how to read a routing table, and understanding how the Longest Prefix Match rule dictates forwarding decisions, is a non-negotiable skill for anyone in IT.

## References
- [Routing Fundamentals](routing-fundamentals.md)
- [Administrative Distance](administrative-distance.md)
- [Default Route](default-route.md)
- [Network Reconnaissance](../13-network-pentesting/network-reconnaissance.md)
