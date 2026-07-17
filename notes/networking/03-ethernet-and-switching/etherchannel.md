# EtherChannel (Link Aggregation)

> EtherChannel logically combines multiple physical Ethernet links into a single, high-bandwidth logical link, providing load balancing and fault tolerance.

## Overview
In networking, if you connect two cables between the same two switches to get more bandwidth, Spanning Tree Protocol (STP) will view it as a loop and instantly block one of the cables. You end up with zero extra bandwidth. 

**EtherChannel** (a Cisco term for Link Aggregation, or LAG) solves this. By bundling 2 to 8 physical links into one logical "Port-Channel", you trick STP into seeing only one giant cable. You get the combined bandwidth of all the links, and if one physical cable fails, the Port-Channel stays up without triggering a disruptive STP recalculation.

## Why It Matters
As enterprise bandwidth demands grow, single uplinks between core switches become bottlenecks. Upgrading from 1Gbps to 10Gbps interfaces is expensive. EtherChannel allows you to cheaply bundle four 1Gbps cables to create a 4Gbps pipe. It is vital for high-availability designs in data centers and campus networks.

## Core Concepts
- **Port-Channel Interface:** The logical interface created by bundling physical ports. All configuration (VLANs, trunks) should be applied to the Port-Channel, not the physical ports.
- **Load Balancing:** Traffic is distributed across the physical links. However, it is not round-robin per packet. It relies on a hashing algorithm based on MAC or IP addresses to ensure packets belonging to the same flow take the same physical cable (preventing out-of-order delivery).
- **Fault Tolerance:** If a link in the bundle fails, traffic is redistributed to the remaining active links in milliseconds.

## How It Works
You can configure an EtherChannel statically (forcing it on), but it is safer to use a negotiation protocol.
1. The administrator bundles the physical ports on both switches into a Port-Channel.
2. The switches send negotiation packets (LACP or PAgP) across the links.
3. The switches verify that all ports in the bundle share the exact same speed, duplex, and VLAN configurations.
4. If they match, the links are aggregated. STP now treats the entire bundle as a single logical interface with a single cost.

## Components / Types
- **Static Aggregation (Mode 'on'):** No negotiation protocol is used. Dangerous, because if one side is misconfigured, it can cause severe bridging loops.
- **LACP (Link Aggregation Control Protocol):** IEEE 802.3ad. The open, vendor-neutral standard. Uses modes `Active` and `Passive`.
- **PAgP (Port Aggregation Protocol):** Cisco proprietary legacy protocol. Uses modes `Desirable` and `Auto`. Rarely used in modern networks in favor of LACP.

## Practical Examples
- **Server to Switch (NIC Teaming):** A hypervisor (like ESXi) with four physical NICs connects to a switch. Using LACP, the server aggregates the links to achieve higher throughput for virtual machines and protection against a single NIC failure.
- **Core to Distribution:** Two core switches in a campus are connected via a 4-port 10Gbps EtherChannel, creating a 40Gbps highly resilient backbone.

## Security Considerations
- **LACP Spoofing / DoS:** While rare, an attacker plugged into multiple ports could attempt to negotiate a rogue LACP bundle to disrupt topology or siphon traffic. 
- **Configuration Consistency:** Security ACLs applied to physical interfaces instead of the logical Port-Channel can result in inconsistent security policies depending on which physical cable the load-balancer selects for a specific flow.

## Commands / Configuration Examples
### Cisco IOS (Configuring LACP)
```text
! On Switch A
interface range GigabitEthernet1/0/1 - 2
 ! Bind to Port-Channel 1 using LACP Active mode
 channel-group 1 mode active

! Configure the newly created logical interface
interface Port-channel 1
 switchport mode trunk
 switchport trunk allowed vlan 10,20

! Verify the bundle
show etherchannel summary
```

### Linux (Bonding/Teaming)
```bash
# View active bonded interfaces (LACP corresponds to mode 4 / 802.3ad)
cat /proc/net/bonding/bond0
```

## Troubleshooting
- **Suspended Ports (`show etherchannel summary` shows `S` or `I` instead of `P`):** This happens when physical ports have mismatched configurations. Ensure speed, duplex, native VLAN, and allowed VLANs are identical on all physical ports before bundling.
- **Uneven Load Balancing:** If you notice one physical cable is at 99% utilization and the others are at 5%, the hashing algorithm is poorly suited for your traffic. (e.g., You are using Source-MAC hashing, but all traffic is routing through a single Gateway MAC). Change the load-balancing method to `src-dst-ip` or `src-dst-port`.

## Interview Questions
- Why use EtherChannel instead of just plugging in multiple cables between switches?
- What is the difference between LACP and PAgP?
- Explain how EtherChannel interacts with Spanning Tree Protocol (STP).
- Why doesn't EtherChannel load-balance packets round-robin? (Answer: To prevent out-of-order packet delivery for TCP sessions).

## Summary
EtherChannel (Link Aggregation) is an elegant solution to the limitations of Spanning Tree Protocol. By logically grouping physical links using protocols like LACP, networks achieve multiplied bandwidth and instantaneous fault tolerance without complex routing or hardware upgrades.

## References
- [STP](stp.md)
- [VLANs and Trunks](vlans-and-trunks.md)
- [High Availability](../12-enterprise-networking/high-availability.md)
