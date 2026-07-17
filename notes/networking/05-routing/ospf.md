# OSPF (Open Shortest Path First)

> OSPF is a highly efficient, industry-standard Link-State routing protocol that builds a complete mathematical map of the network to find the fastest path based on bandwidth.

## Overview
**Open Shortest Path First (OSPF)** is the undisputed king of internal enterprise routing. As an Interior Gateway Protocol (IGP), it is used to route traffic inside a company's network. It is vendor-neutral, meaning a Cisco router, a Juniper firewall, and a Linux server can all speak OSPF to each other flawlessly.

Unlike older protocols that just gossip with their neighbors, OSPF routers build a complete, detailed topographical map of the entire network, ensuring fast, loop-free routing.

## Why It Matters
If you work in enterprise networking or cloud infrastructure, you will work with OSPF. Understanding how OSPF forms neighbor relationships, builds its database, and calculates metrics is mandatory for CCNP-level engineers. For security professionals, OSPF authentication misconfigurations are a primary vector for internal routing attacks.

## Core Concepts
- **Link-State Protocol:** Every router creates a "Link-State Advertisement" (LSA) detailing its connected interfaces, IPs, and link speeds. These LSAs are flooded to every other router.
- **Link-State Database (LSDB):** The collection of all LSAs. Every router ends up with the exact same LSDB—a complete map of the network.
- **Dijkstra’s Algorithm (SPF):** The complex math equation every router runs locally against its LSDB to find the Shortest Path First to every destination.
- **Cost (Metric):** OSPF determines the "Shortest Path" using a metric called Cost, which is derived from the bandwidth of the links. Higher bandwidth = lower cost = preferred path.
- **Areas:** To prevent the LSDB from getting too massive and crushing router CPUs, OSPF networks are divided into hierarchical Areas. **Area 0** is the backbone.

## How It Works
1. **Hello Protocol:** A router sends Multicast "Hello" packets (to `224.0.0.5`) out its interfaces to find neighbors.
2. **Adjacency:** If parameters (Area ID, Hello timers, Authentication) match, the routers become neighbors.
3. **Database Sync:** The routers exchange their LSDBs. 
4. **Calculation:** The router runs the SPF algorithm to calculate the best paths.
5. **Routing Table:** The best paths are injected into the Routing Table with an Administrative Distance (AD) of `110`.
6. **Maintenance:** It goes quiet, only sending tiny 10-second Hello keep-alives. It only sends routing updates if a link actually breaks or changes state (Triggered Updates).

## Components / Types
- **Designated Router (DR):** On shared Ethernet segments (like a switch connecting 10 routers), establishing adjacencies between *every* router creates chaos. OSPF elects a DR. All routers form adjacencies only with the DR, which then distributes the LSAs to everyone else, saving massive bandwidth.
- **ABR (Area Border Router):** A router that connects a secondary area (like Area 1) to the Backbone Area 0.
- **ASBR (Autonomous System Boundary Router):** A router that connects the OSPF network to the outside world (like injecting BGP internet routes into OSPF).

## Practical Examples
- **Campus Design:** A large hospital has 50 buildings. The core data center is configured as OSPF Area 0. Each physical building is configured as Area 1, Area 2, etc. If a switch reboots in Building 1 (Area 1), only the routers in Area 1 have to recalculate the math. The core network (Area 0) is shielded from the instability.

## Security Considerations
- **Rogue Router Injection:** By default, OSPF trusts any router that says "Hello." An attacker plugging into an OSPF-enabled port can establish an adjacency and inject a default route (`0.0.0.0/0`), forcing the entire building's internet traffic through their Kali Linux machine.
- **Authentication:** To prevent this, OSPF supports cryptographic authentication (MD5 or SHA). All routers must be configured with a pre-shared key. Packets without the correct cryptographic hash are instantly dropped. This is a mandatory enterprise security baseline.
- **Passive Interfaces:** Any port connected to end-users (PCs/Printers) should be set as a "Passive Interface." This prevents the router from sending OSPF Hello packets out that port, effectively blocking attackers from attempting to form adjacencies.

## Commands / Configuration Examples
### Cisco IOS
```text
! Basic OSPF Configuration (Process ID 1)
router ospf 1
 ! Set a unique Router ID
 router-id 1.1.1.1
 ! Advertise a specific subnet into Area 0 (Uses wildcard masks)
 network 10.1.1.0 0.0.0.255 area 0
 ! Stop sending Hello packets out the user-facing interface
 passive-interface GigabitEthernet0/1

! Viewing OSPF Neighbors (Crucial troubleshooting step)
show ip ospf neighbor

! Viewing the OSPF Routing Table
show ip route ospf
```

## Troubleshooting
- **Neighbors Stuck in "INIT" or "EXSTART":** This usually means an MTU mismatch between the two routers, or an authentication key mismatch.
- **Missing Routes:** If neighbors are "FULL" but routes are missing, ensure the missing subnets are actually included in a `network` statement under the OSPF process on the remote router.
- **Sub-optimal Pathing:** By default, OSPF's reference bandwidth assumes 100Mbps is the fastest possible speed. It treats a 1Gbps link and a 10Gbps link as having the exact same cost. You must adjust the `auto-cost reference-bandwidth` on all routers to fix this in modern networks.

## Interview Questions
- What type of routing protocol is OSPF? (Answer: Link-State).
- What metric does OSPF use to determine the best path?
- Explain the significance of OSPF Area 0.
- How do you secure OSPF against rogue route injection?
- What is a Designated Router (DR) and why is it used?

## Summary
OSPF is the complex but incredibly powerful engine behind most enterprise internal networks. By building a complete mathematical map of the topology and organizing it into hierarchical areas, OSPF ensures fast, loop-free, and scalable routing.

## References
- [Dynamic Routing Protocols](dynamic-routing-protocols.md)
- [Dynamic Routing Metrics](dynamic-routing-metrics.md)
- [Administrative Distance](administrative-distance.md)
- [BGP](bgp.md)
