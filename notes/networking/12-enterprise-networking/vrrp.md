# VRRP (Virtual Router Redundancy Protocol)

> VRRP is an open-standard First Hop Redundancy Protocol (FHRP) that creates a virtual default gateway, providing transparent failover for IPv4 and IPv6 clients when a primary router fails.

## Overview
Just like HSRP, **Virtual Router Redundancy Protocol (VRRP)** solves the problem of a single point of failure at the default gateway. If the router your computers use to access the Internet goes down, all devices on that subnet lose connectivity. VRRP allows two or more routers to share a single virtual IP address and MAC address, creating a resilient default gateway.

If the primary router (the "Master") fails, a backup router (the "Backup") seamlessly takes over, ensuring continuous network access for clients.

## Why It Matters
VRRP is the open-standard alternative to Cisco's proprietary HSRP. It is critical for deploying highly available network infrastructures in multi-vendor environments where different router brands need to provide redundant default gateways. Understanding VRRP is essential for designing resilient LANs and preventing network downtime due to router failures.

## Core Concepts
- **Open Standard (RFC 3768 for IPv4, RFC 5798 for IPv6):** This is the key difference from HSRP. Any vendor can implement VRRP.
- **Virtual Router:** Multiple physical routers act as one logical router.
- **Virtual IP Address:** The IP address assigned to the virtual router, used by clients as their default gateway.
- **Virtual MAC Address:** A special MAC address (beginning with `0000.5E00.01xx` for IPv4) that is dynamically owned by the VRRP Master router.
- **Master Router:** The physical router that currently owns the Virtual IP and Virtual MAC, forwarding all traffic.
- **Backup Router:** The physical router that monitors the Master and takes over if it fails.
- **Hello Messages:** Master and Backup routers send periodic Hello messages (every 1 second by default) to IP multicast address `224.0.0.18` (for IPv4) to monitor each other's status.

## How It Works
1. Two routers, `R1` and `R2`, are configured in a VRRP group (e.g., Group 1).
2. `R1` has an actual IP of `10.1.1.253`, and `R2` has `10.1.1.252`.
3. They agree to act as a virtual router using the **Virtual IP Address** `10.1.1.254`.
4. `R1` is elected as the **Master** router for VRRP Group 1 (based on priority). `R2` becomes the **Backup** router.
5. Clients on the `10.1.1.0/24` subnet are configured with `10.1.1.254` as their default gateway.
6. `R1` (the Master router) responds to ARP requests for `10.1.1.254` with the **Virtual MAC Address** `0000.5E00.0101`.
7. If `R1` fails (e.g., stops sending Hello messages), `R2` detects the failure.
8. `R2` transitions from Backup to Master. It takes over ownership of `10.1.1.254` and the Virtual MAC address.
9. `R2` sends a Gratuitous ARP for `10.1.1.254` to update client ARP caches.
10. Clients continue sending traffic to `10.1.1.254`, now transparently handled by `R2`.

## Components / Types
- **VRRP Group:** A logical grouping of routers that share a virtual IP and MAC.
- **Priority:** Used to determine which router is Master (highest priority wins).
- **Preemption:** Allows a higher-priority router to take over the Master role if it comes online or recovers.
- **Track Objects:** VRRP can monitor the status of an upstream interface (e.g., a WAN link). If the WAN link fails, VRRP can decrement the router's priority, forcing it to give up the Master role, even if its local LAN interface is still up.

## Practical Examples
- **Multi-Vendor Campus Core:** A university has a Cisco core router and a Juniper distribution router. They need a redundant default gateway for a student VLAN. VRRP allows both routers to participate in the same virtual gateway group, providing seamless failover regardless of vendor.
- **ISP Edge:** Small ISPs often use VRRP at their network edge to provide highly available Internet gateways for their customers.

## Security Considerations
- **VRRP Spoofing:** An attacker (or a misconfigured router) can inject fake VRRP advertisements with a higher priority, tricking legitimate routers into giving up the Master role. This allows the attacker to become the default gateway and perform a Man-in-the-Middle (MitM) attack.
- **Defense:** Configure VRRP authentication (simple plaintext or MD5) so that only routers with the correct pre-shared key can participate in the VRRP group.

## Commands / Configuration Examples
### Cisco IOS
```text
! Configure VRRP on an interface (usually an SVI for VLANs)
interface Vlan10
 ip address 10.1.1.253 255.255.255.0 ! Actual IP of R1
 vrrp 1 ip 10.1.1.254             ! Virtual IP for VRRP Group 1
 vrrp 1 priority 150              ! Make R1 Master (default is 100)
 vrrp 1 preempt                   ! Allow R1 to take over if it has higher priority
 vrrp 1 authentication md5 key-string SecretPass ! VRRP Authentication
 vrrp 1 track GigabitEthernet0/1 decrement 20 ! Track upstream WAN interface

! View VRRP status
show vrrp brief
show vrrp Vlan10
```

### Linux (Using keepalived)
`keepalived` is a common Linux tool that implements VRRP.
```nginx
# Example /etc/keepalived/keepalived.conf
vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 100
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass SecretPass
    }
    virtual_ipaddress {
        10.1.1.254/24
    }
}
```

## Troubleshooting
- **No Master Router:** If `show vrrp brief` shows both routers in a "Backup" or "Init" state, they are failing to communicate. Check IP connectivity, ensure VRRP is enabled, and verify authentication key mismatches.
- **Default Gateway Configuration:** Clients must be configured with the VRRP Virtual IP address as their default gateway.
- **Priority Conflicts:** If two routers are configured with the exact same priority and preemption is disabled, the router with the lowest IP address (or highest depending on implementation) will become Master, potentially leading to unintended traffic flows.

## Interview Questions
- What is the primary purpose of VRRP?
- How does VRRP differ from HSRP?
- What multicast IP address does VRRP use for Hello messages? (Answer: `224.0.0.18`).
- Explain the significance of the Virtual MAC Address in VRRP.

## Summary
VRRP provides essential default gateway redundancy for IPv4 and IPv6 clients. As an open standard, it is the preferred FHRP for multi-vendor network environments, enabling resilient and highly available network services with transparent failover.

## References
- [HSRP](hsrp.md)
- [GLBP](glbp.md)
- [High Availability](high-availability.md)
- [Gratuitous ARP](../03-ethernet-and-switching/gratuitous-arp.md)
