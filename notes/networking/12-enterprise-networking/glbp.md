# GLBP (Gateway Load Balancing Protocol)

> GLBP is a Cisco proprietary First Hop Redundancy Protocol (FHRP) that provides a single virtual IP address while simultaneously utilizing multiple physical routers to load balance traffic.

## Overview
HSRP and VRRP solve router redundancy, but they have a limitation: only one router is truly "Active" and forwarding traffic at any given time. The other routers sit idle, waiting for a failure. This wastes expensive hardware.

**Gateway Load Balancing Protocol (GLBP)**, a Cisco proprietary protocol, addresses this by allowing all routers in a group to actively forward traffic for the same virtual IP address. It combines redundancy with load balancing at the default gateway level.

## Why It Matters
For enterprise networks, GLBP is a powerful tool for maximizing the utilization of redundant hardware and increasing effective network bandwidth. It ensures that multiple core routers are actively used, preventing expensive idle equipment. Understanding GLBP is important for network engineers designing highly available and scalable campus or data center core networks.

## Core Concepts
- **Virtual Router:** Multiple physical routers cooperate as a single logical router.
- **Virtual IP Address:** The IP address assigned to the GLBP virtual router. This is the client's default gateway.
- **AVG (Active Virtual Gateway):** One router is elected as the AVG. Its job is to control the Virtual IP address and assign **Virtual MAC Addresses** to the other routers.
- **AVF (Active Virtual Forwarder):** All other routers in the GLBP group become AVFs. They actively forward traffic using their assigned Virtual MAC Address.
- **Load Balancing:** The AVG assigns different Virtual MAC Addresses to different clients on the subnet. This directs clients to use different AVFs as their forwarding router.

## How It Works
1. Two routers, `R1` and `R2`, are configured in a GLBP group (e.g., Group 1).
2. `R1` is elected as the **AVG (Active Virtual Gateway)**. It owns the Virtual IP (`10.1.1.254`).
3. The AVG (R1) then assigns two **Virtual MAC Addresses** (e.g., `0007.B400.0101` and `0007.B400.0102`).
4. `R1` becomes the **AVF (Active Virtual Forwarder)** for Virtual MAC 1.
5. `R2` becomes the **AVF (Active Virtual Forwarder)** for Virtual MAC 2.
6. When clients on the `10.1.1.0/24` subnet ARP for `10.1.1.254` (their default gateway), the AVG (R1) replies, but it alternates between giving out Virtual MAC 1 (R1's forwarding MAC) and Virtual MAC 2 (R2's forwarding MAC).
7. Result: Roughly half the clients send traffic to Virtual MAC 1 (forwarded by R1), and the other half send traffic to Virtual MAC 2 (forwarded by R2). Both physical routers are active.

## Components / Types
- **GLBP Group:** A logical grouping of routers that share a virtual IP and multiple virtual MACs.
- **Priority:** Used to elect the AVG (highest priority wins).
- **Preemption:** Allows a higher-priority router to take over the AVG role if it comes online or recovers.
- **Weighted Load Balancing:** GLBP can be configured to send more traffic to a more powerful router, or to reduce the weight of a router with a failing link.

## Practical Examples
- **Data Center Core:** Two core switches/routers in a data center simultaneously forward traffic for dozens of VLANs. GLBP ensures both multi-gigabit uplinks are actively utilized, doubling the effective bandwidth of the default gateway and providing immediate failover if one device fails.

## Security Considerations
- **GLBP Spoofing:** An attacker (or misconfigured router) can inject fake GLBP messages with a higher priority, tricking legitimate routers into giving up the AVG role. This allows the attacker to become the default gateway and perform a Man-in-the-Middle (MitM) attack.
- **Defense:** Configure GLBP authentication (MD5 or SHA) so that only routers with the correct pre-shared key can participate in the GLBP group.

## Commands / Configuration Examples
### Cisco IOS
```text
! Configure GLBP on an interface (usually an SVI for VLANs)
interface Vlan10
 ip address 10.1.1.1 255.255.255.0 ! Actual IP of R1
 glbp 1 ip 10.1.1.254             ! Virtual IP for GLBP Group 1
 glbp 1 priority 150              ! Make R1 AVG (default is 100)
 glbp 1 preempt                   ! Allow R1 to take over if it has higher priority
 glbp 1 authentication md5 key-string SecretPass ! GLBP Authentication

! View GLBP status
show glbp brief
show glbp Vlan10
```

## Troubleshooting
- **No Load Balancing:** If `show glbp brief` shows only one AVF (Active Virtual Forwarder) instead of two or more, check the load balancing method.
- **Default Gateway Configuration:** Clients must be configured with the GLBP Virtual IP address as their default gateway.
- **Authentication Mismatch:** Ensure GLBP authentication is correctly configured on all routers in the group.

## Interview Questions
- What problem does GLBP solve that HSRP and VRRP do not?
- Explain the role of the Active Virtual Gateway (AVG) and Active Virtual Forwarder (AVF) in GLBP.
- How does GLBP load balance client traffic? (Answer: By assigning different Virtual MAC Addresses to clients via ARP replies).
- What is the virtual IP address used for in GLBP?

## Summary
GLBP is a Cisco proprietary FHRP that enhances router redundancy with active load balancing. By allowing multiple routers to simultaneously forward traffic for a single virtual gateway, it maximizes hardware utilization and increases network throughput, making it a powerful choice for high-availability, high-bandwidth campus or data center core networks.

## References
- [HSRP](hsrp.md)
- [VRRP](vrrp.md)
- [High Availability](high-availability.md)
- [Gratuitous ARP](../03-ethernet-and-switching/gratuitous-arp.md)
