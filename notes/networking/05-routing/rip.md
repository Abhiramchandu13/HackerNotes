# RIP (Routing Information Protocol)

> RIP is a legacy distance-vector routing protocol that makes decisions based entirely on "hop count," prioritizing paths with the fewest routers between source and destination.

## Overview
**Routing Information Protocol (RIP)** is one of the oldest dynamic routing protocols in existence. It is simple to configure and understand, making it an excellent learning tool for networking students. However, due to severe limitations in how it calculates best paths and its slow convergence times, it is considered obsolete and is rarely seen in modern enterprise networks.

## Why It Matters
You will likely never deploy RIP in a production environment. However, it remains a heavily tested concept in foundational certifications (like CompTIA Network+ and CCNA) because it perfectly illustrates the concept of a pure "Distance Vector" protocol. Understanding why RIP fails in modern networks highlights exactly why OSPF and BGP are necessary.

## Core Concepts
- **Distance Vector:** RIP operates by "routing by rumor." It does not know the topology of the network; it only knows what its direct neighbors tell it.
- **Metric (Hop Count):** RIP's only metric is "Hops." Every time a packet passes through a router, that is 1 hop. RIP maxes out at 15 hops.
- **Infinity (16 Hops):** If a network is 16 hops away, RIP considers it unreachable (Infinite). This strictly limits RIP to very small networks.
- **Periodic Updates:** RIP broadcasts its entire routing table out of all active interfaces every 30 seconds, wasting significant bandwidth.

## How It Works
1. Router A is connected to Network 1. It broadcasts a RIP update saying, "I can reach Network 1 in 1 hop."
2. Router B receives this, adds 1 hop for itself, and updates its routing table: "I can reach Network 1 in 2 hops via Router A."
3. Router B broadcasts this new table to Router C.
4. If Router C has two paths to Network 1—one path that is 3 hops away, and another path that is 5 hops away—it will always choose the 3-hop path and discard the 5-hop path.

## Components / Types
- **RIPv1:** The original version. It was *classful*, meaning it did not send subnet masks in its routing updates. It completely broke modern subnetting (VLSM/CIDR).
- **RIPv2:** The upgraded version. It sends subnet masks in its updates (supporting VLSM), supports MD5 authentication, and uses Multicast (`224.0.0.9`) instead of noisy broadcasts.
- **RIPng (Next Generation):** The version of RIP adapted to support IPv6 routing.

## Practical Examples
- **The Bandwidth Flaw:** You have two paths to a destination. Path A goes through one router connected via a terribly slow, saturated 56Kbps dial-up link (1 hop). Path B goes through two routers connected via blazing fast 10Gbps fiber optic cables (2 hops). RIP will *always* choose the slow 56Kbps link because it is only 1 hop away, crippling network performance.

## Security Considerations
RIPv1 was extremely insecure due to its use of unauthenticated broadcasts.
- **Route Poisoning / Hijacking:** An attacker plugging into a RIPv1 network can simply broadcast fake routing updates. All routers will accept them, allowing the attacker to blackhole traffic or execute Man-In-The-Middle attacks effortlessly.
- **Defense:** If you must use RIP, use RIPv2 and configure MD5 authentication on the routing process so updates are only accepted from neighbors possessing the correct password.

## Commands / Configuration Examples
### Cisco IOS
```text
! Enable the RIP routing process
router rip
 ! Always use version 2
 version 2
 ! Disable legacy classful summarization
 no auto-summary
 ! Advertise connected networks into RIP
 network 10.0.0.0
 network 192.168.1.0

! View the routing table (RIP routes are marked with an 'R')
show ip route rip
```

## Troubleshooting
- **Slow Convergence / Routing Loops:** If a link goes down, it can take RIP several minutes to realize it and propagate the failure through the network (a process called "counting to infinity"). This can cause temporary routing loops where packets bounce back and forth until their TTL expires.
- **Missing Subnets:** If using RIPv1 (or RIPv2 with auto-summary accidentally left on), discontiguous subnets (like `10.1.1.0/24` and `10.2.2.0/24`) will be summarized incorrectly, hiding specific routes from the routing table.

## Interview Questions
- What metric does RIP use to determine the best path?
- What is the maximum hop count in RIP, and what happens at hop 16?
- Explain the critical flaw in RIP's metric calculation regarding link speed.
- What is the difference between RIP version 1 and RIP version 2?

## Summary
Routing Information Protocol (RIP) is a foundational distance-vector protocol that prioritizes the shortest router-hop path over everything else. While its strict 15-hop limit, slow convergence, and ignorance of bandwidth make it obsolete for modern enterprises, it provides the fundamental theory required to understand routing metrics.

## References
- [Dynamic Routing Protocols](dynamic-routing-protocols.md)
- [Dynamic Routing Metrics](dynamic-routing-metrics.md)
- [VLSM](../04-ip-addressing/vlsm.md)
- [OSPF](ospf.md)
