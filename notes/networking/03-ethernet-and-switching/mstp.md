# MSTP (Multiple Spanning Tree Protocol)

> MSTP groups multiple VLANs into a single Spanning Tree instance, saving switch CPU resources while still allowing for load balancing.

## Overview
In large enterprise networks with hundreds of VLANs, running a separate Spanning Tree calculation for every single VLAN (as Cisco's PVST+ does) requires massive amounts of CPU and memory on the switches. Alternatively, running just one single Spanning Tree for the entire network (like basic 802.1Q) prevents you from load balancing traffic across redundant links.

**Multiple Spanning Tree Protocol (IEEE 802.1s)** offers the best of both worlds. It allows administrators to map dozens of VLANs to a single, combined Spanning Tree "Instance," dramatically reducing overhead while maintaining flexibility.

## Why It Matters
For campus and data center networks scaling beyond 50–100 VLANs, MSTP is often a requirement to prevent core switches from being overwhelmed by BPDU generation. Understanding MSTP is a key milestone in transitioning from a CCNA-level engineer to a CCNP-level enterprise architect.

## Core Concepts
- **Instances:** Instead of a tree per VLAN, MSTP uses Instances. You might map VLANs 1-100 to Instance 1, and VLANs 101-200 to Instance 2. 
- **Decoupling:** MSTP decouples the VLAN from the Spanning Tree. You only run the STP algorithm for the instances, not the VLANs.
- **Regions:** Because MSTP is complex, switches must agree on the rules. Switches are grouped into "Regions." To be in the same region, switches must have the exact same:
  1. Region Name
  2. Revision Number
  3. VLAN-to-Instance Mapping table.
- **Underlying Protocol:** MSTP runs on top of RSTP (Rapid Spanning Tree) under the hood, so it benefits from sub-second convergence speeds.

## How It Works
1. The admin configures Switch A and Switch B with identical MSTP region parameters and maps VLANs 10, 20, 30 to Instance 1, and 40, 50, 60 to Instance 2.
2. The switches calculate a Spanning Tree for **Instance 1**. Switch A becomes the Root Bridge for Instance 1.
3. The switches calculate a separate Spanning Tree for **Instance 2**. Switch B becomes the Root Bridge for Instance 2.
4. Traffic for VLANs 10, 20, 30 flows efficiently toward Switch A. Traffic for VLANs 40, 50, 60 flows toward Switch B, effectively load-balancing the network across both core switches. The CPU only had to calculate 2 trees, instead of 6.

## Components / Types
- **Internal Spanning Tree (IST):** Instance 0 (zero). This is the default instance that runs inside an MSTP region. Any VLAN not explicitly mapped to another instance falls into Instance 0. It is also used to communicate with legacy STP switches outside the region.
- **Common and Internal Spanning Tree (CIST):** The overarching spanning tree that connects different MSTP regions and legacy STP switches together to ensure the entire physical network is loop-free.

## Practical Examples
- **Campus Load Balancing:** You have two 10Gbps uplinks between an access switch and two core switches. With a single spanning tree, one 10Gbps link is blocked entirely. With MSTP, you configure half your VLANs to prefer Core A and half to prefer Core B. Both 10Gbps links are actively used, doubling your available bandwidth, while remaining protected from loops.

## Security Considerations
MSTP relies heavily on configuration consistency.
- **Region Mismatches:** If an attacker or a careless admin alters the MSTP configuration on one switch, that switch falls out of the region. This can trigger a massive network reconvergence as the CIST has to recalculate, potentially causing temporary outages.
- **Standard Protections:** BPDU Guard and Root Guard must still be applied to edge ports to prevent topology hijacking, just like in STP and RSTP.

## Commands / Configuration Examples
### Cisco IOS
```text
! Change mode to MST
spanning-tree mode mst

! Enter the MST configuration submode
spanning-tree mst configuration
 name HQ-DATACENTER
 revision 1
 instance 1 vlan 10,20,30
 instance 2 vlan 40,50,60
 exit

! Set the switch to be Root for Instance 1
spanning-tree mst 1 root primary

! Verify MST mappings and status
show spanning-tree mst
```

## Troubleshooting
- **Regional Boundaries:** The most common MSTP issue is a typo in the configuration. If the VLAN-to-Instance mapping on Switch B is off by even one VLAN compared to Switch A, they will view each other as existing in different regions. This changes how they handle links and can lead to sub-optimal blocking.
- **Instance 0 Overload:** Forgetting to map VLANs leaves them all in Instance 0. If you do this, you are effectively just running a single, non-load-balanced spanning tree, defeating the purpose of configuring MSTP.

## Interview Questions
- What is the primary advantage of MSTP over PVST+?
- What three parameters must match perfectly for two switches to belong to the same MSTP Region?
- What is the function of MSTP Instance 0?
- Does MSTP use legacy STP or RSTP for its underlying convergence calculations?

## Summary
MSTP is the enterprise-grade solution for Layer 2 redundancy. By mapping groups of VLANs to a limited number of spanning tree instances, it drastically reduces hardware overhead while enabling sophisticated traffic engineering and load balancing across the network core.

## References
- [STP](stp.md)
- [RSTP](rstp.md)
- [VLANs and Trunks](vlans-and-trunks.md)
