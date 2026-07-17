# VLSM (Variable Length Subnet Masking)

> VLSM allows network engineers to subnet an already subnetted network, creating subnets of varying sizes to perfectly fit the number of required hosts without wasting IP addresses.

## Overview
Before VLSM, routing protocols (like RIPv1) didn't send subnet masks in their routing updates. Because of this, if you took a network and sliced it into pieces, every piece had to be the exact same size (Fixed Length Subnet Masking - FLSM). 

**Variable Length Subnet Masking (VLSM)**, introduced alongside modern classless routing, allows you to apply different subnet masks to different subnets within the same major network block. This is the cornerstone of efficient IP address management.

## Why It Matters
IPv4 addresses are a finite, exhausted resource. In enterprise networks, wasting IP space causes administrative headaches and forces unnecessary NAT boundaries. If you have a branch office with 50 users, and a WAN link between two routers that only needs 2 IP addresses, FLSM would force you to assign a 64-IP subnet to the WAN link, wasting 62 IPs. VLSM allows you to give the branch a `/26` (64 IPs) and the WAN link a `/30` (4 IPs), maximizing efficiency.

## Core Concepts
- **Classless Routing Protocols:** VLSM *requires* modern routing protocols (OSPF, EIGRP, BGP, RIPv2) because they explicitly carry the subnet mask (prefix length) along with the network route in their updates.
- **Hierarchical Design:** VLSM encourages you to assign the largest subnets first, and then carve the remaining address space into progressively smaller subnets.
- **The "Subnetting a Subnet" Concept:** You take a large block (e.g., `/24`), split it into two `/25`s. You assign the first `/25` to users. You take the second `/25` and split it further into `/26`s, `/28`s, and `/30`s as needed.

## How It Works
1. **Analyze Requirements:** You are given `192.168.1.0/24`. You need: 100 IPs for HR, 50 IPs for Sales, 10 IPs for Servers, and 2 IPs for a point-to-point router link.
2. **Start Largest:** HR needs 100 IPs. The smallest power of 2 that fits is 128 (a `/25`). Assign `192.168.1.0/25` to HR. Remaining space: `192.168.1.128/25`.
3. **Next Largest:** Sales needs 50 IPs. The smallest fit is 64 (a `/26`). Take the remaining `/25` and split it into two `/26`s. Assign `192.168.1.128/26` to Sales. Remaining space: `192.168.1.192/26`.
4. **Continue Down:** Servers need 10 IPs. Fits in 16 (a `/28`). Split the remaining `/26` down to a `/28`. Assign `192.168.1.192/28`.
5. **Smallest Link:** The router link needs 2 IPs. Fits in 4 (a `/30`). Assign `192.168.1.208/30`.
6. **Result:** Zero IP overlap, highly efficient space utilization, and plenty of room left over for future expansion.

## Components / Types
- **CIDR Notation:** VLSM relies entirely on Classless Inter-Domain Routing (CIDR) notation (e.g., `/27`) rather than legacy Class A/B/C definitions.
- **Route Summarization:** VLSM allows for elegant route summarization, where multiple smaller contiguous VLSM subnets can be advertised to the core network as a single large route, saving router memory.

## Practical Examples
- **Enterprise Address Planning:** A company buys a public `/22` block. They use VLSM to assign a `/24` to their public-facing web servers, a `/26` to their VPN gateway pool, and carve the remaining space into `/29`s for isolated DMZ application tiers.

## Security Considerations
- **Right-Sizing Security Boundaries:** VLSM is vital for security microsegmentation. By making a subnet perfectly fit the required hosts (e.g., placing two highly sensitive databases in a `/29`), you leave zero empty IP addresses for an attacker to illicitly assign to a rogue device and hide within that high-security zone.
- **Routing Attacks:** If misconfigured, complex VLSM setups can be susceptible to routing loops or unauthorized route injection, though this is a flaw of the routing protocol configuration, not VLSM itself.

## Commands / Configuration Examples
VLSM is entirely conceptual and mathematical. The configuration is simply applying the varying CIDR masks to the router interfaces.

### Cisco IOS
```text
! Configuring VLSM subnets on different interfaces
interface GigabitEthernet0/1
 description HR_Users
 ip address 192.168.1.1 255.255.255.128   ! A /25 mask

interface GigabitEthernet0/2
 description P2P_to_Core
 ip address 192.168.1.209 255.255.255.252 ! A /30 mask
```

## Troubleshooting
- **Overlapping Networks:** The most common VLSM error. Because you are carving slices of different sizes, it is easy to miscalculate and overlap the end of a `/26` with the start of a `/28`. Cisco IOS will reject the configuration with `% 192.168.1.x overlaps with GigabitEthernet0/1`.
- **IP Addressing Spreadsheets:** Troubleshooting complex VLSM in your head is prone to error. Always maintain a documented IP Address Management (IPAM) tool or spreadsheet showing exactly where each variable subnet begins and ends.

## Interview Questions
- Define VLSM and explain its primary benefit over FLSM.
- Why couldn't legacy routing protocols like RIPv1 support VLSM?
- Explain the methodology for assigning subnets using VLSM. (Answer: Always assign the subnet with the largest host requirement first).
- What CIDR prefix length is standard for a Point-to-Point router link, and why? (Answer: /30, because it provides exactly 2 usable IPs).

## Summary
VLSM is the application of CIDR logic to internal subnetting. By breaking away from rigid, uniform subnet sizes, VLSM empowers network architects to design highly efficient, tightly bound networks that perfectly mirror the physical and security requirements of the organization.

## References
- [IPv4 Subnetting](ipv4-subnetting.md)
- [CIDR](cidr.md)
- [Dynamic Routing Protocols](../05-routing/dynamic-routing-protocols.md)
- [OSPF](../05-routing/ospf.md)
