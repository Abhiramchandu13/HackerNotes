# Routing Metrics

> A Routing Metric is a mathematical value assigned to a network path; the routing protocol uses it to decide which path is the absolute best when multiple paths exist to the same destination.

## Overview
While **Administrative Distance (AD)** determines which *protocol* to trust (e.g., OSPF vs Static), a **Metric** is how a *single protocol* decides between two competing paths it discovered itself. 

If OSPF finds two different ways to get from New York to London, it calculates a metric for both. The path with the **lowest metric** wins and gets installed into the Routing Table. Understanding how different protocols calculate their metrics is the key to traffic engineering.

## Why It Matters
Without metrics, a router might decide to send critical database traffic over a slow 10Mbps backup satellite link instead of a fast 10Gbps fiber link simply because the satellite link has fewer routers in the way. Network engineers manipulate metrics to intentionally force traffic down preferred, high-capacity paths and keep backup paths dormant.

## Core Concepts
- **Lowest is Best:** In routing, a metric represents "cost" or "distance". You always want the lowest cost.
- **Protocol Specific:** Every dynamic routing protocol uses a completely different formula to calculate its metric. You cannot compare an OSPF metric directly to an EIGRP metric.
- **Equal-Cost Multi-Path (ECMP):** If a routing protocol calculates that two different paths have the *exact same* metric, it will install both paths into the routing table and load-balance traffic across them.

## How It Works (By Protocol)
Different protocols care about different things:

### RIP (Routing Information Protocol)
- **Metric:** Hop Count.
- **How it works:** RIP only counts how many routers are between the source and destination. It ignores bandwidth entirely.
- **The Problem:** If Path A is 2 hops over slow 1.5Mbps T1 lines, and Path B is 3 hops over 10Gbps fiber lines, RIP will choose Path A, crippling network performance. (This is why RIP is obsolete).

### OSPF (Open Shortest Path First)
- **Metric:** Cost (based on Bandwidth).
- **How it works:** OSPF looks at the physical speed of the link. By default, Cisco uses the formula `Reference Bandwidth / Interface Bandwidth`. A 100Mbps link has a cost of 1. A 10Mbps link has a cost of 10. OSPF adds up the cost of every link along the path and chooses the lowest total.

### EIGRP (Enhanced Interior Gateway Routing Protocol)
- **Metric:** A complex composite formula.
- **How it works:** EIGRP defaults to using **Bandwidth** (the slowest link in the path) and **Delay** (the cumulative latency of the path). It uses complex math to generate a massive metric number (e.g., 2,560,000) allowing for incredibly precise path selection.

## Components / Types
- **Metric Manipulation:** Engineers can manually override the calculated metric on an interface. If you want OSPF to avoid a specific Gigabit link unless necessary, you can manually set `ip ospf cost 5000` on that interface, artificially making it look terrible to the algorithm.

## Practical Examples
- **Traffic Engineering:** You have two data centers connected by a primary 10Gbps fiber and a secondary 1Gbps fiber. Because OSPF calculates metrics based on bandwidth, it naturally assigns a lower cost to the 10Gbps link and routes all traffic there. If the 10G link drops, the metric calculation forces OSPF to failover to the 1G link.

## Security Considerations
- **Metric Spoofing:** In a route injection attack, an attacker advertising a rogue path to a subnet will intentionally advertise it with an artificially low metric (e.g., an OSPF cost of 1). This ensures the targeted routers will select the attacker's path over the legitimate path, facilitating a Man-in-the-Middle attack.

## Commands / Configuration Examples
### Cisco IOS
```text
! View the routing table. The metric is the second number in the brackets [AD/Metric]
! Example: O 10.5.5.0/24 [110/65] via 192.168.1.2
show ip route

! Manually increasing the OSPF metric on an interface to make it less desirable
interface GigabitEthernet0/1
 ip ospf cost 1000

! Fixing the OSPF reference bandwidth so it can distinguish between 1G and 10G links
! (By default, OSPF thinks 100Mbps, 1G, and 10G all have a cost of 1)
router ospf 1
 auto-cost reference-bandwidth 10000
```

## Troubleshooting
- **Sub-optimal Pathing:** If traffic is inexplicably taking a slow link, check the interface bandwidth settings. If an admin manually set the `bandwidth` command on a fast interface to a low number for QoS purposes, OSPF or EIGRP might read that fake bandwidth and ruin the metric calculation.
- **ECMP Confusion:** If `show ip route` displays two paths to the same destination, the metrics are tied. If you didn't intend to load-balance, you need to slightly adjust the metric on one interface to break the tie.

## Interview Questions
- What is the difference between Administrative Distance and a Routing Metric?
- What metric does RIP use, and why is that considered a flaw in modern networks?
- How does OSPF calculate its default cost?
- What does it mean if two routes in the routing table have the exact same metric? (Answer: ECMP load balancing).

## Summary
Routing Metrics are the mathematical heart of path selection. By understanding how different protocols evaluate factors like bandwidth, delay, or hop count, network engineers can predictably control the flow of data and design resilient, high-performance network topologies.

## References
- [Administrative Distance](administrative-distance.md)
- [Dynamic Routing Protocols](dynamic-routing-protocols.md)
- [OSPF](ospf.md)
- [EIGRP](eigrp.md)
