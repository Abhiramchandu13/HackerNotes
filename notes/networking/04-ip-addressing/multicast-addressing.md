# Multicast Addressing

> Multicast allows a source to send a single packet that is efficiently duplicated by the network and delivered only to a specific group of interested receivers.

## Overview
If Unicast is a private phone call (One-to-One), and Broadcast is shouting with a megaphone in a crowded room (One-to-All), **Multicast** is like a radio station (One-to-Many). The radio station transmits one signal, and only the people who intentionally tune their radios to that specific frequency hear the music. 

In networking, a server sends one video stream, and routers and switches replicate that stream only down the paths where clients have specifically requested to join the "Multicast Group."

## Why It Matters
Multicast is the ultimate bandwidth saver. Imagine a CEO live-streaming a video to 1,000 employees. With Unicast, the server must send 1,000 separate video streams, crushing the server's CPU and the network uplink. With Multicast, the server sends exactly *one* stream. The network routers duplicate the packets only when the path splits, utilizing minimal bandwidth. 

## Core Concepts
- **Class D Space:** In IPv4, multicast addresses use the Class D block: `224.0.0.0` to `239.255.255.255`.
- **No Specific Source:** A multicast address is *never* assigned to a single computer's NIC. It is purely a destination address representing a group.
- **IGMP (Internet Group Management Protocol):** The protocol clients use to tell a router, "I want to join multicast group 239.1.1.1."
- **Layer 2 Mapping:** Multicast IP addresses are mathematically mapped to specific Multicast MAC addresses (starting with `01:00:5E` in IPv4) so switches can handle them.

## How It Works
1. A video server sends a stream of packets to the destination IP `239.10.10.10`.
2. PC-A and PC-B want to watch. They send an **IGMP Join** message to their local router: "I am subscribing to 239.10.10.10."
3. The router notes this. When the router receives the video stream packets, it forwards them onto the local LAN.
4. PC-C doesn't care about the video. PC-C's network card sees the multicast MAC address, realizes it never subscribed to that group, and drops the frame in hardware, saving CPU cycles.

## Components / Types
- **Reserved Link-Local Multicast (`224.0.0.x`):** Used by network protocols to talk to devices on the same subnet. Packets sent here have a TTL of 1 and are never routed.
  - `224.0.0.1`: All hosts on the subnet.
  - `224.0.0.2`: All routers on the subnet.
  - `224.0.0.5` / `224.0.0.6`: All OSPF routers.
- **Administratively Scoped (`239.x.x.x`):** Private multicast space for enterprise use (like internal video streaming), equivalent to RFC 1918 private IPs.
- **Multicast Routing (PIM):** Protocol Independent Multicast. Used by routers to build "Multicast Distribution Trees" across large enterprise networks to figure out exactly where the streams need to flow.

## Practical Examples
- **IPTV & Streaming:** Corporate environments use multicast to stream Bloomberg TV or CEO town halls to hundreds of screens and PCs efficiently.
- **Routing Protocols:** OSPF and EIGRP routers use multicast to discover each other and exchange routing tables, replacing the old, noisy broadcast methods of RIP.
- **mDNS (Bonjour/Avahi):** Devices like Apple TVs and wireless printers use multicast DNS (`224.0.0.251`) to announce their services to the local network so iPhones can easily find them.

## Security Considerations
- **Multicast Flooding:** If a switch does not support "IGMP Snooping," it doesn't know who subscribed to the stream. It behaves like a dumb hub and floods the high-bandwidth video stream to *every* port, destroying network performance.
- **Eavesdropping:** Because multicast traffic is often flooded locally, attackers can simply join the multicast group using a script to intercept unencrypted corporate video feeds, stock ticker data, or routing protocol updates.
- **Amplification Attacks:** Poorly configured multicast routers can be tricked into reflecting heavy traffic loads toward a victim network.

## Commands / Configuration Examples
### Linux
```bash
# View IGMP group memberships for the local host
netstat -g

# Or use the newer command
ip maddr show
```

### Cisco IOS
```text
! Enable multicast routing globally on a router
ip multicast-routing

! Enable IGMP Snooping on a switch to prevent multicast flooding
ip igmp snooping
```

## Troubleshooting
- **Video freezing/pixelating:** Usually points to a network bottleneck or a switch dropping multicast packets because IGMP Snooping timers are misconfigured.
- **Stream not crossing VLANs:** Multicast requires a router running PIM (Protocol Independent Multicast) to cross VLAN boundaries. If the router isn't configured for multicast, the stream dies on the local subnet.

## Interview Questions
- What is the difference between Broadcast and Multicast?
- What IPv4 address range is reserved for Multicast? (Answer: 224.0.0.0 - 239.255.255.255).
- What protocol do host computers use to tell routers they want to receive a multicast stream? (Answer: IGMP).
- What is IGMP Snooping and why is it critical for switch performance?

## Summary
Multicast is a highly efficient delivery mechanism designed for one-to-many communication. By requiring clients to explicitly subscribe via IGMP and utilizing specialized routing trees, it allows networks to deliver massive media streams and protocol updates with minimal bandwidth overhead.

## References
- [IPv4 Addressing](ipv4-addressing.md)
- [Broadcast Address](broadcast-address.md)
- [IGMP](../06-network-protocols/igmp.md)
- [OSPF](../05-routing/ospf.md)
