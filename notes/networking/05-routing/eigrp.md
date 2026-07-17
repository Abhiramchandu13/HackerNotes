# EIGRP (Enhanced Interior Gateway Routing Protocol)

> EIGRP is an advanced distance-vector routing protocol uniquely optimized for extremely fast convergence and complex metric calculations, heavily associated with Cisco environments.

## Overview
**Enhanced Interior Gateway Routing Protocol (EIGRP)** was developed by Cisco in the 1990s as an upgrade to older, slow protocols. While it is technically an advanced "Distance Vector" protocol, it behaves much like a Link-State protocol (like OSPF), maintaining neighbor tables and topology tables. 

Historically, EIGRP was completely proprietary to Cisco equipment. In 2013, Cisco partially open-sourced it, but it remains predominantly used in exclusively Cisco-based enterprise networks.

## Why It Matters
If you work in a heavy Cisco environment, you will encounter EIGRP. It is highly prized by engineers because it is significantly easier to configure than OSPF, does not require strict hierarchical Area designs, and possesses a unique feature: it can load-balance traffic across links of *unequal* speeds.

## Core Concepts
- **Advanced Distance Vector:** It doesn't build a full map of the network like OSPF. Instead, it relies on "Routing by Rumor"—trusting the calculations of its neighbors.
- **DUAL Algorithm:** The Diffusing Update Algorithm is the math EIGRP uses. It guarantees 100% loop-free paths and calculates backup paths in advance.
- **Feasible Successor (Backup Route):** EIGRP's superpower. It calculates the best path (Successor) and calculates a guaranteed loop-free backup path (Feasible Successor). If the main link dies, EIGRP switches to the backup in *milliseconds* without having to recalculate anything.
- **Autonomous System (AS) Number:** All EIGRP routers must be configured with the exact same AS number to become neighbors.

## How It Works
1. **Discovery:** Routers send Multicast Hello packets (to `224.0.0.10`) to find neighbors.
2. **Exchange:** They exchange their full routing tables once.
3. **Calculation (DUAL):** The router evaluates the received routes using its complex metric formula and identifies the absolute best paths (Successors) and valid backup paths (Feasible Successors).
4. **Maintenance:** EIGRP goes quiet. It only sends partial, triggered updates if a link goes down or a new network is added, making it highly bandwidth efficient.

## Components / Types
EIGRP uses a highly complex composite metric formula. By default, it relies on two variables:
- **Bandwidth:** The *slowest* link bandwidth anywhere along the path to the destination.
- **Delay:** The *cumulative* sum of latency across all links in the path.

*(It can technically also use Reliability and Load, but these are disabled by default because they cause constant, chaotic recalculations).*

## Practical Examples
- **Unequal-Cost Load Balancing:** You have a primary 10Gbps fiber link and a backup 1Gbps copper link. OSPF will only use the 10Gbps link and leave the 1Gbps idle. By using the EIGRP `variance` command, you can tell the router to use *both* links simultaneously, sending 10 packets down the fast link for every 1 packet it sends down the slow link, maximizing your purchased bandwidth.

## Security Considerations
Like OSPF, EIGRP is vulnerable to rogue route injection.
- **Unauthorized Neighbors:** An attacker who knows the EIGRP AS Number can plug in a rogue device, form an adjacency, and inject a better route to a critical server, effectively performing a Man-in-the-Middle attack.
- **Defense:** EIGRP supports cryptographic authentication (MD5, and later SHA-256). Enabling this ensures that only trusted routers possessing the pre-shared key can participate in the routing process.

## Commands / Configuration Examples
### Cisco IOS
```text
! Basic EIGRP Configuration (Using Autonomous System Number 100)
router eigrp 100
 ! Advertise networks (EIGRP natively supports classful or wildcard masks)
 network 10.0.0.0 0.255.255.255
 network 192.168.1.0 0.0.0.255
 ! Prevent Hello packets from exiting user ports
 passive-interface GigabitEthernet0/1

! View EIGRP Neighbors
show ip eigrp neighbors

! View the EIGRP Topology Table (Shows Successors and Feasible Successors)
show ip eigrp topology
```

## Troubleshooting
- **K-Value Mismatches:** EIGRP uses constants (K-Values) to determine which metric components to use. If a junior admin modifies the K-values on one router but not the others, they will refuse to form a neighbor adjacency.
- **AS Number Mismatch:** If Router A is configured with `router eigrp 100` and Router B is configured with `router eigrp 101`, they will never speak to each other.
- **Auto-Summary:** In older IOS versions, EIGRP automatically summarized network boundaries, causing catastrophic routing loops in disconnected subnet designs. Always use `no auto-summary` in legacy environments.

## Interview Questions
- What metric components does EIGRP use by default? (Answer: Bandwidth and Delay).
- What is a Feasible Successor in EIGRP?
- Why might a network architect choose EIGRP over OSPF? (Answer: Easier configuration, unequal-cost load balancing, and blazing fast failover via DUAL).
- What multicast address does EIGRP use for Hello packets? (Answer: `224.0.0.10`).

## Summary
EIGRP blends the simple configuration of distance-vector protocols with the advanced features and speed of link-state protocols. While its strong ties to Cisco hardware limit its universal adoption, its sophisticated DUAL algorithm and unequal-cost load balancing make it a powerful tool in proprietary enterprise networks.

## References
- [OSPF](ospf.md)
- [Dynamic Routing Protocols](dynamic-routing-protocols.md)
- [Dynamic Routing Metrics](dynamic-routing-metrics.md)
