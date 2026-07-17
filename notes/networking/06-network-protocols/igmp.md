# IGMP (Internet Group Management Protocol)

> IGMP is an IPv4 protocol used by host computers to report their multicast group memberships to adjacent routers.

## Overview
When a network uses Multicast (One-to-Many communication), a server sends a single video stream, and the network duplicates it to interested viewers. But how does the router know *who* is interested? It uses the **Internet Group Management Protocol (IGMP)**. 

Hosts use IGMP to tell their local router, "I want to receive traffic for Multicast Group 239.1.1.1." The router uses this information to build a forwarding state, ensuring the heavy multicast traffic is only sent down network segments where someone actually asked for it.

## Why It Matters
Without IGMP, multicast traffic would be flooded to every single port on the network like a massive broadcast storm, crushing switch CPUs and exhausting bandwidth. Understanding IGMP is critical for engineers designing IPTV, financial trading platforms, or dense enterprise video-conferencing networks.

## Core Concepts
- **Multicast Group:** A Class D IPv4 address (e.g., `239.1.1.1`).
- **IGMP Join:** A message sent by a PC to the router to subscribe to a group.
- **IGMP Leave:** A message sent by a PC to the router to unsubscribe.
- **IGMP Query:** A periodic message sent by the router asking, "Is anyone out there still listening to Group X?"
- **IGMP Snooping:** A crucial Layer 2 switch feature. The switch "snoops" on the IGMP conversation between the PC and the Router, learning exactly which physical switch port wants the multicast traffic, preventing the switch from flooding the stream everywhere.

## How It Works
1. **The Source:** A streaming server on VLAN 10 starts transmitting video to `239.50.50.50`. The local router receives it.
2. **The Join:** A user on VLAN 20 opens VLC Media Player and clicks a link for the stream. VLC instructs the OS to send an **IGMP Report (Join)** message for `239.50.50.50`.
3. **The Switch (Snooping):** The access switch intercepts the IGMP message, notes that Port 5 wants the stream, and forwards the IGMP message to the router.
4. **The Router:** The router receives the IGMP Join from VLAN 20. It alters its multicast routing table and begins routing the video stream from VLAN 10 down into VLAN 20.
5. **Delivery:** The switch receives the stream and forwards it *only* out of Port 5, preserving bandwidth for all other users.
6. **Maintenance:** Every 60 seconds, the router sends an IGMP Query. If the user closed VLC, their PC doesn't reply. The router stops sending the stream.

## Components / Types
- **IGMPv1:** Legacy. Hosts could join, but couldn't explicitly "leave." The router just had to wait for them to stop responding to queries.
- **IGMPv2:** The enterprise standard. Introduced the explicit "Leave Group" message, allowing routers to stop sending heavy streams immediately when users tuned out.
- **IGMPv3:** Adds "Source-Specific Multicast" (SSM). A host can say "I want the stream for 239.1.1.1, but *only* if it originates from Server IP 10.0.0.5," enhancing security and efficiency.
- **MLD (Multicast Listener Discovery):** The exact equivalent of IGMP, but redesigned for **IPv6** networks using ICMPv6.

## Practical Examples
- **Stock Market Tickers:** Financial exchanges blast live pricing data via multicast. Traders' workstations use IGMP to subscribe to specific commodity streams.
- **Smart Home Discovery:** Apple AirPlay and Google Chromecast rely heavily on mDNS/Bonjour, which uses IGMP under the hood to manage local device discovery groups.

## Security Considerations
- **IGMP DoS Attacks:** An attacker can use a tool like `yersinia` to generate thousands of forged IGMP Join messages for random groups. The router attempts to process and route all of these, exhausting its memory and CPU, leading to network collapse.
- **Eavesdropping:** If IGMP Snooping is disabled on a switch, multicast traffic floods like a broadcast. An attacker can simply open Wireshark and passively capture proprietary video streams or routing updates without ever officially joining the group.
- **Mitigation:** Enterprise networks use features like "IGMP Filter" to strictly control which multicast groups users are allowed to join, and "IGMP Snooping" is enabled universally.

## Commands / Configuration Examples
### Linux
```bash
# View current IGMP multicast group memberships on the local host
netstat -g
# OR
ip maddr show
```

### Cisco IOS
```text
! Enable IGMP Snooping globally on a Layer 2 switch (Usually on by default)
ip igmp snooping

! View the switch's snooping table to see which ports requested which streams
show ip igmp snooping groups

! On a router, view the connected interfaces that have active IGMP members
show ip igmp interfaces
```

## Troubleshooting
- **Video Stuttering / Flooding:** If the entire office complains the network is incredibly slow when the CEO starts a live stream, IGMP Snooping is likely disabled on the access switches, causing the video to flood to every PC.
- **Stream Dies After 3 Minutes:** This is a classic IGMP Query failure. The PC joins successfully, but the router is misconfigured and fails to send the periodic IGMP Queries. After a timeout period, the router assumes the PC left and kills the stream.
- **Across Subnets:** IGMP only operates locally (between host and router). If the stream crosses multiple routers, you must configure a multicast routing protocol (like PIM) between the routers.

## Interview Questions
- What is the specific purpose of IGMP?
- What problem does IGMP Snooping solve on a Layer 2 switch?
- What is the difference between IGMPv2 and IGMPv3?
- If a host wants to receive IPv6 multicast traffic, what protocol does it use instead of IGMP? (Answer: MLD).

## Summary
IGMP is the subscription mechanism for IPv4 multicast. By empowering hosts to explicitly request specific traffic streams, and enabling switches to "snoop" on those requests, IGMP prevents network flooding and makes large-scale media distribution possible.

## References
- [Multicast Addressing](../04-ip-addressing/multicast-addressing.md)
- [IPv4 Addressing](../04-ip-addressing/ipv4-addressing.md)
- [Neighbor Discovery Protocol (NDP)](../04-ip-addressing/neighbor-discovery-protocol.md)
