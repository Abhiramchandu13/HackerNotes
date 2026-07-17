# Gratuitous ARP

> A Gratuitous ARP is an unprompted ARP reply broadcasted by a device to announce or update its IP-to-MAC mapping to the rest of the network.

## Overview
Normally, ARP operates on a "request and reply" basis. A device asks "Who has this IP?", and the owner replies. **Gratuitous ARP (GARP)** breaks this rule. It is a broadcast packet sent by a node spontaneously, without anyone asking. 

Its primary purposes are to announce that an IP address is now in use, to update the stale ARP caches of other devices, or to check if an IP address is already taken.

## Why It Matters
Gratuitous ARP is the unsung hero of network resilience. Without it, High Availability (HA) failovers would result in minutes of downtime while switches and clients waited for old ARP entries to expire. However, for security professionals, GARP is a double-edged sword: the very mechanism that makes HA seamless is exactly the mechanism attackers use to execute massive Man-in-the-Middle attacks.

## Core Concepts
- **Unprompted Broadcast:** A GARP is sent as a broadcast so every device on the subnet receives it.
- **Sender/Target IP are identical:** In a GARP packet, the Sender IP and the Target IP are the exact same address.
- **Cache Updating:** When devices receive a GARP, standard protocol dictates they must update their ARP caches with the new MAC address provided.

## How It Works
When a device sends a Gratuitous ARP, it crafts an ARP packet where:
- Source MAC: Its own MAC address
- Destination MAC: Broadcast (`FF:FF:FF:FF:FF:FF`)
- Sender IP: Its own IP address
- Target IP: Its own IP address

When switches and hosts receive this, two things happen:
1. Switches update their CAM tables (MAC address tables), associating the Source MAC with the port the GARP arrived on.
2. Hosts and routers update their ARP caches, associating the Sender IP with the Source MAC.

## Components / Types
Gratuitous ARP is heavily utilized by specific network features:
- **Duplicate Address Detection (DAD):** When a computer boots up and configures an IP, it sends a GARP. If anyone replies, the computer knows the IP is already in use and displays an "IP Conflict" error.
- **High Availability (HA) / First Hop Redundancy (FHRP):** Protocols like HSRP, VRRP, or CARP use virtual IPs. If the primary router dies, the backup router takes over the virtual IP and immediately blasts a GARP to tell the network, "Send traffic to this IP to my MAC address now."
- **VM Migrations (vMotion):** When a Virtual Machine moves seamlessly from one physical host server to another, the hypervisor sends a GARP so the network switches instantly know the VM is on a new port.

## Practical Examples
- **Router Failover:** You have an active/standby firewall pair sharing the gateway IP `10.0.0.1`. The active firewall loses power. The standby firewall becomes active and immediately sends a Gratuitous ARP. All PCs on the network instantly update their ARP cache, and Internet traffic continues flowing without dropping a single connection.

## Security Considerations
Because RFCs require hosts to update their ARP caches when they receive a GARP, this feature is fundamentally exploitable.
- **ARP Poisoning / Spoofing:** An attacker doesn't have to wait for a victim to send an ARP request. The attacker can simply blast Gratuitous ARPs to the subnet claiming that their own MAC address owns the Default Gateway's IP address.
- **Impact:** All traffic destined for the Internet is redirected to the attacker's machine.
- **Defense:** Dynamic ARP Inspection (DAI) on managed switches will intercept Gratuitous ARPs, verify them against a trusted database, and drop malicious spoofed GARPs.

## Commands / Configuration Examples
You usually don't configure GARP manually; systems trigger it automatically. However, you can force it in Linux.

### Linux
```bash
# Use arping to send a Gratuitous ARP to update neighbors
# -A specifies ARP reply, -I specifies interface
sudo arping -A -I eth0 192.168.1.50
```

### Cisco IOS
```text
! When configuring HSRP, Gratuitous ARPs are sent automatically upon failover.
! You can view ARP inspection statistics to see dropped GARPs:
show ip arp inspection statistics
```

## Troubleshooting
- **Intermittent Connectivity:** If two devices have the same IP, they will both occasionally send GARPs. The network will constantly flip-flop routing traffic between the two MAC addresses, causing massive instability.
- **Failover Not Working:** If a backup firewall takes over but clients lose Internet for 5 minutes, it usually means the firewall failed to send a Gratuitous ARP, and clients are waiting for their local ARP caches to expire naturally.

## Interview Questions
- What makes a Gratuitous ARP different from a standard ARP request?
- How is Gratuitous ARP used in High Availability (HA) network setups?
- Explain how Duplicate Address Detection (DAD) works.
- Why is Gratuitous ARP dangerous from a cybersecurity perspective?

## Summary
Gratuitous ARP is a proactive broadcast used by devices to announce their presence, detect IP conflicts, and facilitate instant network reconvergence during failovers. While essential for modern network uptime, its trust-based nature requires robust Layer 2 security controls.

## References
- [ARP](arp.md)
- [High Availability](../12-enterprise-networking/high-availability.md)
- [ARP Spoofing](../15-network-pentesting/arp-spoofing.md)
