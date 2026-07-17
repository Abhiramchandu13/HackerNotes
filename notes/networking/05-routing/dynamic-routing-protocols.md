# Dynamic Routing Protocols

> Dynamic routing protocols are software applications that run on routers, allowing them to automatically discover networks, share that information with other routers, and dynamically calculate the best path for data.

## Overview
In a network with two routers, Static Routing (manually typing paths) is easy. In an enterprise network with 500 routers, manual configuration is impossible; a single cable break would require hundreds of manual updates to fix. 

**Dynamic Routing Protocols** solve this. Routers establish relationships with their neighbors, automatically advertise the networks they know about, and use mathematical algorithms to determine the absolute best, loop-free path to any destination on the globe. If a cable breaks, the protocol senses it and recalculates a new path in milliseconds.

## Why It Matters
Dynamic routing is the automation that keeps enterprise networks and the Internet functioning. Understanding the difference between routing protocols is essential for network design. You wouldn't use the protocol that powers the global Internet (BGP) to route traffic inside a small office (OSPF), because they are designed for entirely different scales and purposes.

## Core Concepts
- **Convergence:** The state when all routers in the network agree on the topology and have updated their routing tables. Fast convergence is the ultimate goal.
- **Metric:** While Administrative Distance breaks ties between *different* protocols, a Metric breaks ties between different paths within the *same* protocol. (e.g., OSPF uses "Cost" based on bandwidth to choose the best path).
- **Autonomous System (AS):** A collection of routers under a single administrative domain (e.g., your company's network, or an ISP's network).

## How It Works
At a high level, all dynamic routing protocols follow a similar lifecycle:
1. **Discovery:** The router sends "Hello" packets out of its interfaces to find neighboring routers running the same protocol.
2. **Adjacency:** If the parameters match, the routers become "neighbors" and form an adjacency.
3. **Exchange:** They share their routing information (either full tables or just the links they know about).
4. **Calculation:** The router runs an algorithm on the collected data to find the shortest/best path to every destination.
5. **Installation:** The best paths are installed into the Routing Table.
6. **Maintenance:** Routers continuously send tiny "keep-alive" messages. If a neighbor stops responding, the router knows a link died and recalculates immediately.

## Components / Types
Routing protocols are divided into two main categories:

### 1. Interior Gateway Protocols (IGP)
Used *inside* a single organization (within an Autonomous System). Designed for speed and fast convergence.
- **Distance Vector Protocols:** Older, simpler logic. They judge paths based purely on "hops" (how many routers are in the way) or simple math. (Examples: **RIP**, **EIGRP**).
- **Link-State Protocols:** Highly intelligent. Every router builds a complete, detailed mathematical map of the entire network before choosing a path based on bandwidth. (Examples: **OSPF**, **IS-IS**).

### 2. Exterior Gateway Protocols (EGP)
Used to route traffic *between* different organizations (connecting different Autonomous Systems together). Designed for massive scale and policy control, not speed.
- **Path Vector Protocol:** Evaluates paths based on complex policies and business rules rather than raw speed. (Example: **BGP**).

## Practical Examples
- **Campus Network (OSPF):** A university uses OSPF across its 50 buildings. If a fiber line is cut by construction, OSPF detects it in 2 seconds, calculates a backup path through another building, and traffic continues flowing.
- **The Internet (BGP):** Verizon and AT&T connect their networks. They use BGP to share their millions of routes, applying rules like "Never route my internal traffic through a competitor's network unless absolutely necessary."

## Security Considerations
Dynamic routing protocols operate on trust by default, making them highly vulnerable to internal disruption:
- **Route Poisoning / Hijacking:** An attacker plugs a laptop into the network, runs routing software (like Quagga or FRRouting), and forms an adjacency with the core router. The attacker advertises a fake route to the critical Database subnet, forcing all database traffic to flow through the attacker's laptop (MitM).
- **Authentication:** All modern routing protocols support cryptographic authentication (e.g., OSPF MD5 authentication). Routers will reject updates from neighbors that don't possess the pre-shared secret key. This is a mandatory security baseline.

## Commands / Configuration Examples
*See specific protocol notes for detailed configurations.*

### Cisco IOS (Basic Verification)
```text
! View which dynamic routing protocols are currently running on the router
show ip protocols

! View the routing table, filtering for dynamically learned routes
show ip route ospf
show ip route eigrp
```

## Troubleshooting
- **Neighbors Not Forming:** The most common issue. Ensure both routers are on the same subnet, can ping each other, are using the same Area/AS numbers, and have matching authentication keys and Hello timers.
- **Missing Routes:** Even if neighbors form, routes might not appear if the originating router hasn't been configured with the `network` command to actively advertise that specific subnet.

## Interview Questions
- What is the main difference between an IGP and an EGP?
- Explain the concept of Convergence.
- Name one Distance Vector protocol and one Link-State protocol.
- Why is it critical to configure authentication on dynamic routing protocols?

## Summary
Dynamic routing protocols replace tedious manual configurations with intelligent algorithms that allow networks to scale, adapt to failures, and self-heal in real-time. Choosing the right protocol depends entirely on the scale and boundaries of the network being designed.

## References
- [Routing Table](routing-table.md)
- [Dynamic Routing Metrics](dynamic-routing-metrics.md)
- [OSPF](ospf.md)
- [BGP](bgp.md)
