# Neighbor Discovery Protocol (NDP)

> NDP is the core operational protocol of IPv6, replacing IPv4's ARP and DHCP, managing address resolution, router discovery, and network autoconfiguration.

## Overview
Because IPv6 completely removed the concept of "Broadcasts," the old IPv4 protocols that relied on shouting to everyone (like ARP to find MAC addresses, and DHCP broadcasts to find routers) could no longer function. 

**Neighbor Discovery Protocol (NDP)** is the suite of ICMPv6 messages that replaces them. It uses highly efficient Multicast targeting to allow IPv6 nodes to find each other, discover default gateways, and automatically configure their own IP addresses without needing a dedicated server.

## Why It Matters
If you try to troubleshoot an IPv6 connection using your IPv4 knowledge, you will fail. There is no ARP table to check. Understanding NDP is essential because it governs how devices actually get onto the network and find the Internet. For security professionals, NDP spoofing is the IPv6 equivalent of ARP poisoning, and understanding it is critical for executing or defending against local MitM attacks.

## Core Concepts
NDP operates entirely via **ICMPv6** and defines five specific message types:
1. **Router Solicitation (RS):** "Are there any routers out there?" (Sent by booting PCs).
2. **Router Advertisement (RA):** "I am a router! Here is the network prefix, default gateway, and DNS info." (Sent periodically by routers, or in response to an RS).
3. **Neighbor Solicitation (NS):** "Who has IPv6 address X? What is your MAC address?" (The IPv6 replacement for an ARP Request).
4. **Neighbor Advertisement (NA):** "I have IPv6 address X, and my MAC is Y." (The IPv6 replacement for an ARP Reply).
5. **Redirect:** A router telling a host "There is a better router on this subnet you should use instead of me."

## How It Works
### Scenario 1: Finding a MAC Address (Replacing ARP)
1. PC-A needs to send a packet to PC-B (`2001:db8::5`). It needs PC-B's MAC address.
2. PC-A sends an **NS (Neighbor Solicitation)** message. Instead of broadcasting, it sends it to a special "Solicited-Node Multicast Address" based on PC-B's IP. 
3. Only PC-B (and maybe a few mathematically unlucky devices) processes the multicast frame.
4. PC-B replies directly with an **NA (Neighbor Advertisement)** containing its MAC address.

### Scenario 2: Getting an IP Address (SLAAC)
1. A laptop boots up and needs an IP. It sends a **RS (Router Solicitation)**.
2. The local router responds with a **RA (Router Advertisement)** saying, "The network here is `2001:db8:acad:1::/64`. I am the gateway."
3. The laptop takes that `/64` prefix, generates its own random 64-bit host ID, combines them, and boom—it has a fully routable Internet IP address without ever speaking to a DHCP server. This is called **SLAAC (Stateless Address Autoconfiguration)**.

## Components / Types
- **SLAAC:** The primary method for end-user devices to get IPv6 addresses via Router Advertisements.
- **DAD (Duplicate Address Detection):** Before a PC starts using a newly generated IPv6 address, it sends an NS message asking if anyone else is using it. If no NA reply comes back, the IP is safe to use.
- **Neighbor Cache:** The IPv6 equivalent of the ARP table, storing IPv6-to-MAC mappings.

## Practical Examples
- **Mobile Phones:** When your smartphone switches from cellular to Wi-Fi, it uses SLAAC via NDP Router Advertisements to acquire an IPv6 address in milliseconds, drastically speeding up connectivity compared to waiting for an IPv4 DHCP handshake.

## Security Considerations
NDP operates on trust, making it highly vulnerable on local segments:
- **Rogue RA Attacks:** An attacker spins up a tool that blasts fake Router Advertisements onto the LAN. All PCs on the network configure themselves using the attacker's bogus network prefix and set the attacker's machine as their default gateway, resulting in a devastating Man-in-the-Middle (MitM) attack.
- **NDP Spoofing:** Similar to ARP Poisoning, an attacker replies to Neighbor Solicitations with their own MAC address, intercepting local traffic.
- **Defense:** Enterprise switches use **IPv6 RA Guard** (dropping RAs coming from user ports) and **NDP Inspection** to secure the local environment.

## Commands / Configuration Examples
### Linux
```bash
# View the IPv6 Neighbor Cache (The new ARP table)
ip -6 neighbor show
```

### Windows
```powershell
# View the IPv6 Neighbor Cache
netsh interface ipv6 show neighbors
```

### Cisco IOS
```text
! View the router's IPv6 neighbor cache
show ipv6 neighbors

! Enable RA Guard on a user-facing switch port to prevent Rogue RA attacks
interface GigabitEthernet1/0/10
 ipv6 nd raguard attach-policy
```

## Troubleshooting
- **No Internet via SLAAC:** If a PC doesn't get an IPv6 address, ensure the router's interface is actually configured to send Router Advertisements. (In Cisco, ensure `ipv6 unicast-routing` is enabled globally).
- **Firewall Blocking ICMPv6:** Network admins sometimes copy/paste strict IPv4 ACLs that block all ICMP. If you block ICMPv6, you break NDP. ARP is gone; NDP *is* ICMP. Blocking it breaks local network functionality entirely.

## Interview Questions
- What protocol does IPv6 use to resolve IP addresses to MAC addresses, replacing ARP?
- Explain how SLAAC allows a device to configure its own IP address.
- What is a Rogue RA attack?
- What are the two ICMPv6 message types used to find a MAC address? (Answer: Neighbor Solicitation and Neighbor Advertisement).

## Summary
NDP is the engine of IPv6. By replacing noisy broadcast protocols with elegant, multicast-based ICMPv6 messages, NDP handles MAC resolution, router discovery, and autoconfiguration, making IPv6 networks significantly more efficient and self-sustaining than their IPv4 predecessors.

## References
- [IPv6 Addressing](ipv6-addressing.md)
- [ARP](../03-ethernet-and-switching/arp.md)
- [DHCP](../06-network-protocols/dhcp.md)
- [Multicast Addressing](multicast-addressing.md)
