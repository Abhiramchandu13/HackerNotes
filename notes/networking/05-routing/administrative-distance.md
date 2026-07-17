# Administrative Distance

> Administrative Distance is a measure of trustworthiness a router uses to choose between multiple routing protocols that are offering paths to the exact same destination.

## Overview
Imagine you are driving to a new city. Your GPS tells you to take the highway, but your friend who lives there tells you to take the back roads. Who do you trust more? 

In networking, a router might learn how to reach `10.5.5.0/24` from an administrator (Static Route), from OSPF, and from BGP simultaneously. The router can only put one path into its active Routing Table. **Administrative Distance (AD)** is the tie-breaker. It is a predefined score of "trustworthiness" assigned to every routing protocol. The *lower* the AD, the more trusted the route.

## Why It Matters
In enterprise environments running multiple routing protocols (e.g., OSPF internally, BGP for the WAN, and Static routes for backups), AD is what prevents routing chaos. Understanding AD is crucial for configuring backup links (Floating Static Routes) and ensuring traffic takes the primary high-speed path instead of the slow backup path.

## Core Concepts
- **Trust Score:** An integer value from `0` to `255`.
- **Lower is Better:** A route with an AD of 1 beats a route with an AD of 110.
- **Maximum AD (255):** An AD of 255 means the route is completely untrusted and will never be installed in the routing table.
- **Local Significance:** AD is a localized concept. It is not transmitted in routing updates to other routers; it is solely used by the local router's CPU to make a decision.

## Standard Cisco Administrative Distances
*(Note: While the concept is universal, specific AD values can vary slightly between vendors like Juniper or Arista. These are the Cisco standard defaults).*

| Route Source | Default AD Value |
| :--- | :--- |
| **Directly Connected** | 0 |
| **Static Route** | 1 |
| **EIGRP (Internal)** | 90 |
| **OSPF** | 110 |
| **RIP** | 120 |
| **BGP (External)** | 20 |
| **BGP (Internal)** | 200 |

## How It Works
1. The router receives a routing update from OSPF saying, "Reach `10.5.5.0/24` via Interface Gi0/1." OSPF has an AD of `110`.
2. The administrator manually types a static route: "Reach `10.5.5.0/24` via Interface Gi0/2." Static routes have an AD of `1`.
3. The router compares the ADs. `1 < 110`.
4. The router installs the Static Route into the routing table. The OSPF route is kept in the database as a backup but is not actively used.

## Components / Types
- **Floating Static Route:** This is the most common real-world application of manipulating AD. You create a static route intended as a backup path over a slow cellular modem, but you artificially change its AD to `210`. The router prefers the OSPF route (`110`) over the primary fiber link. If the fiber link breaks and the OSPF route disappears, the static route (`210`) "floats" to the surface and is installed in the routing table, activating the cellular backup.

## Practical Examples
- **WAN Redundancy:** A company has a primary MPLS circuit (running BGP, AD 20) and a backup IPsec VPN tunnel (running OSPF, AD 110). Because BGP has a lower AD, the router automatically prefers the MPLS circuit. If the MPLS drops, the BGP route is removed, and the router seamlessly switches to the OSPF route over the VPN.

## Security Considerations
- **Route Injection Attacks:** If an attacker can inject an internal EIGRP route (AD 90) into a network, they can override existing OSPF routes (AD 110) because the router trusts EIGRP more. This allows the attacker to silently redirect and intercept traffic.
- **Mitigation:** Route filtering and authentication (e.g., OSPF MD5 hashing) are required to prevent unauthorized routers from introducing untrusted routes with superior ADs.

## Commands / Configuration Examples
### Cisco IOS
```text
! View the routing table. The AD is the first number in the brackets [AD/Metric]
! Example: O 10.5.5.0/24 [110/65] via 192.168.1.2
show ip route

! Creating a standard static route (Default AD is 1)
ip route 10.5.5.0 255.255.255.0 192.168.1.2

! Creating a Floating Static Route (Manually setting the AD to 210)
ip route 10.5.5.0 255.255.255.0 192.168.2.2 210
```

## Troubleshooting
- **Sub-optimal Routing:** If traffic is mysteriously taking a slow backup link instead of the primary link, check the routing table (`show ip route`). Ensure someone didn't accidentally leave a testing static route (AD 1) in the configuration, overriding the dynamic routing protocol.
- **Vendor Discrepancies:** If you have a Cisco router talking to a Juniper router, be aware their default ADs for protocols like OSPF might differ, potentially causing asymmetric routing issues if mutual redistribution is involved.

## Interview Questions
- What is Administrative Distance?
- If a router has a static route and an OSPF route to the exact same destination, which one will it use and why?
- What is the default Administrative Distance of OSPF? Of a Static Route?
- Explain how you would configure a Floating Static Route to act as a backup to an EIGRP learned route.

## Summary
Administrative Distance is the hierarchy of trust within a router. By knowing which protocols outrank others, network engineers can design predictable, highly available networks that automatically failover to backup paths without human intervention.

## References
- [Routing Table](routing-table.md)
- [Static Routing](static-routing.md)
- [Dynamic Routing Protocols](dynamic-routing-protocols.md)
- [OSPF](ospf.md)
