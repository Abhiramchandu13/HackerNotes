# HSRP (Hot Standby Router Protocol)

> HSRP is a Cisco proprietary First Hop Redundancy Protocol (FHRP) that provides default gateway redundancy for IPv4 clients on a local network.

## Overview
Every computer needs a default gateway to reach the Internet. If that single gateway router fails, the entire subnet loses its connection to the outside world. **Hot Standby Router Protocol (HSRP)** solves this by allowing two or more physical routers to act as a single, virtual default gateway.

If the primary router fails, the secondary router seamlessly takes over the virtual IP address and MAC address, with minimal disruption to end-users. Clients are unaware of the failover.

## Why It Matters
For enterprise networks, HSRP is a foundational technology for ensuring network uptime and high availability. It prevents the router (the default gateway) from becoming a single point of failure for end-user subnets. Understanding HSRP is mandatory for any network engineer designing resilient LAN infrastructures.

## Core Concepts
- **Virtual Router:** Two or more physical routers cooperate to form a single logical router.
- **Virtual IP Address:** The IP address assigned to the virtual router. This is the IP address that client devices use as their default gateway.
- **Virtual MAC Address:** A special MAC address (beginning with `0000.0C07.ACxx`) that is dynamically owned by the active HSRP router.
- **Active Router:** The physical router that currently owns the Virtual IP and Virtual MAC, and is forwarding all traffic for the virtual router.
- **Standby Router:** The physical router that monitors the Active router and takes over if the Active router fails.
- **Hello Messages:** Active and Standby routers send periodic Hello messages (every 3 seconds by default) to UDP port 198 to monitor each other's status.

## How It Works
1. Two routers, `R1` and `R2`, are configured in an HSRP group (e.g., Group 1).
2. `R1` is configured with an IP address of `10.1.1.253` and `R2` with `10.1.1.252`.
3. They both agree to act as a virtual router using the **Virtual IP Address** `10.1.1.254`.
4. `R1` is elected as the **Active** router for HSRP Group 1 (based on priority or IP address). `R2` becomes the **Standby** router.
5. Clients on the `10.1.1.0/24` subnet are configured with `10.1.1.254` as their default gateway.
6. `R1` (the Active router) actively responds to ARP requests for `10.1.1.254` with the **Virtual MAC Address** `0000.0C07.AC01`.
7. If `R1` fails (e.g., stops sending Hello messages), `R2` detects the failure.
8. `R2` transitions from Standby to Active. It takes over ownership of `10.1.1.254` and the Virtual MAC address.
9. `R2` sends a Gratuitous ARP for `10.1.1.254` to update client ARP caches.
10. Clients continue sending traffic to `10.1.1.254`, now transparently handled by `R2`.

## Components / Types
- **HSRP Group:** A logical grouping of routers that share a virtual IP and MAC address.
- **Preemption:** Allows a higher-priority router to take over the Active role if it comes online (or recovers) even if a lower-priority router is currently Active.
- **Interface Tracking:** HSRP can monitor the status of an *upstream* interface (e.g., the WAN link). If the WAN link fails, HSRP can force the router to give up the Active role, even if its local LAN interface is still up, ensuring traffic doesn't get blackholed.

## Practical Examples
- **Campus Core Redundancy:** Two core routers in a data center serve as default gateways for dozens of VLANs. Each VLAN has an HSRP group configured, ensuring that if one router fails, the other instantly takes over, maintaining connectivity for all internal users.
- **Branch Office Failover:** A remote office has two routers (one primary, one backup). HSRP is configured. If the primary router's WAN link goes down, interface tracking detects it, and the backup router takes over, routing traffic out a secondary cellular modem link.

## Security Considerations
- **HSRP Spoofing:** An attacker (or a misconfigured router) can inject fake HSRP Hello messages with a higher priority, tricking the legitimate routers into giving up the Active role. This allows the attacker to become the default gateway and perform a Man-in-the-Middle (MitM) attack.
- **Defense:** Configure HSRP authentication (MD5 or SHA) so that only routers with the correct pre-shared key can participate in the HSRP group.

## Commands / Configuration Examples
### Cisco IOS
```text
! Configure HSRP on an interface (usually an SVI for VLANs)
interface Vlan10
 ip address 10.1.1.1 255.255.255.0 ! Actual IP of R1
 standby 1 ip 10.1.1.254          ! Virtual IP for HSRP Group 1
 standby 1 priority 150           ! Make R1 Active (default is 100)
 standby 1 preempt                ! Allow R1 to take over if it has higher priority
 standby 1 authentication md5 key-string SecretPass ! HSRP Authentication
 standby 1 track GigabitEthernet0/1 20 ! Track upstream WAN interface (decrement priority by 20 if it fails)

! View HSRP status
show standby brief
show standby Vlan10
```

## Troubleshooting
- **No Active Router:** If `show standby brief` shows both routers in a "Listen" or "Init" state, they are failing to communicate. Check IP connectivity between the interfaces, ensure HSRP is enabled, and verify authentication key mismatches.
- **Sticky Active:** If the primary router recovers but fails to take back the Active role, ensure preemption is enabled. If not, the current Active router (even if lower priority) will remain Active.
- **Default Gateway Configuration:** Clients must be configured with the HSRP Virtual IP address as their default gateway, not the physical IP address of either router.

## Interview Questions
- What problem does HSRP solve in a network?
- What is the difference between the Active and Standby routers in an HSRP group?
- What is the virtual IP address used for in HSRP?
- How can HSRP track the status of an upstream WAN interface and force a failover?

## Summary
HSRP is a fundamental building block of network high availability in Cisco environments. By providing a transparent default gateway failover mechanism, it ensures that end-users remain connected to the outside world, even when a critical router fails.

## References
- [VRRP](vrrp.md)
- [GLBP](glbp.md)
- [High Availability](high-availability.md)
- [Gratuitous ARP](../03-ethernet-and-switching/gratuitous-arp.md)
