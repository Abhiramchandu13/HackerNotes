# IPv4 Subnetting

> Subnetting is the mathematical process of dividing a large, single IP network into smaller, more efficient logical networks.

## Overview
If a company is assigned the `10.0.0.0/8` network, they possess over 16 million IP addresses. Putting 16 million computers on a single network is impossible; broadcast traffic would instantly crash the switches. **Subnetting** allows network engineers to borrow bits from the "Host" portion of the IP address and convert them into "Network" bits, slicing that massive block into thousands of smaller, manageable subnets (e.g., one for HR, one for Guest Wi-Fi, one for Servers).

## Why It Matters
Subnetting is arguably the most notorious hurdle for junior network engineers, yet it is absolutely fundamental. Without subnetting, routing is impossible to scale, and security is impossible to enforce. Subnetting creates the boundaries where VLANs operate and where Layer 3 firewalls apply Access Control Lists (ACLs).

## Core Concepts
- **The Ruler:** The Subnet Mask dictates the boundary. `255` in binary is `11111111` (network). `0` in binary is `00000000` (host).
- **Borrowing Bits:** To create subnets, you move the boundary to the right, changing `0`s to `1`s in the subnet mask.
- **Subnet ID:** The very first address in a subnet (all host bits are `0`). Identifies the network itself; cannot be assigned to a PC.
- **Broadcast Address:** The very last address in a subnet (all host bits are `1`). Used to talk to everyone on the subnet; cannot be assigned to a PC.
- **Usable Hosts:** The addresses between the Subnet ID and Broadcast Address. Formula: `2^h - 2` (where `h` is the number of remaining host bits).

## How It Works
1. **The Starting Block:** You are given `192.168.1.0/24` (Mask: `255.255.255.0`). You have 1 network with 254 usable hosts.
2. **The Requirement:** You need to split this into two separate networks for two different departments.
3. **The Math:** You need 2 subnets. You "borrow" 1 bit from the host portion (`2^1 = 2` subnets).
4. **The New Mask:** The mask moves from `/24` to `/25`. The decimal mask changes from `255.255.255.0` to `255.255.255.128`.
5. **The Result:** 
   - Subnet A: `192.168.1.0/25` (Usable IPs: `.1` to `.126`)
   - Subnet B: `192.168.1.128/25` (Usable IPs: `.129` to `.254`)

## Components / Types
- **Fixed Length Subnet Masking (FLSM):** The legacy method of subnetting where every resulting subnet must be the exact same size. Wasteful.
- **Variable Length Subnet Masking (VLSM):** The modern method where you can take a subnet and subnet it *again*, creating differently sized networks to perfectly match host requirements.

## Practical Examples
- **Point-to-Point Links:** Connecting two routers only requires 2 IP addresses. Using a standard `/24` subnet wastes 252 IPs. A network engineer uses subnetting to create a `/30` (giving exactly 2 usable IPs) or a `/31` for the link, conserving address space.
- **Cloud VPCs:** When building an AWS VPC, you allocate a large CIDR block (e.g., `10.0.0.0/16`) and then subnet it into smaller blocks for Public subnets (`/24`) and Private database subnets (`/24`).

## Security Considerations
- **Microsegmentation:** Security relies on subnetting. By placing high-security databases in a small `/28` subnet and user desktops in a separate `/24` subnet, a router or firewall is forced to sit between them, allowing the security team to implement strict IPS rules and ACLs.
- **Broadcast Containment:** Smaller subnets mean smaller broadcast domains, preventing an attacker's ARP spoofing or multicast-based discovery tool from reaching across the entire enterprise.

## Commands / Configuration Examples
Subnetting is a design concept, so there are no commands to "do subnetting." You simply apply the calculated mask to an interface.

### Linux
```bash
# Applying a subnetted /28 mask to an interface
sudo ip addr add 10.10.10.17/28 dev eth0
```

### Cisco IOS
```text
! Applying a subnetted IP to an SVI (VLAN interface)
interface Vlan 50
 ! IP 192.168.1.65 with a /26 mask (allows 62 hosts)
 ip address 192.168.1.65 255.255.255.192
```

## Troubleshooting
- **Overlapping Subnets:** The most common design error. If you configure `10.0.0.0/23` on Interface 1, and `10.0.0.128/24` on Interface 2, the router will throw an "Overlapping Subnets" error because the IP ranges collide.
- **Wrong Mask on Client:** If the router is configured for a `/25` but the DHCP server hands out a `/24` mask to clients, the clients will have a completely skewed perception of the network boundary, resulting in bizarre routing failures for the top half of the subnet.

## Interview Questions
- Why do we subtract 2 in the formula `2^h - 2` when calculating usable host addresses?
- You have the IP `192.168.5.33/27`. What is the Network ID and the Broadcast address for this subnet? (Answer: Network `192.168.5.32`, Broadcast `192.168.5.63`).
- What is the difference between FLSM and VLSM?
- How many usable IPs are in a `/30` subnet?

## Summary
Subnetting is the art of manipulating the 32-bit IPv4 boundary. By trading host capacity for network quantity, network engineers can sculpt a flat IP space into a highly organized, secure, and hierarchical routed infrastructure.

## References
- [IPv4 Addressing](ipv4-addressing.md)
- [CIDR](cidr.md)
- [VLSM](vlsm.md)
- [Routing Fundamentals](../05-routing/routing-fundamentals.md)
