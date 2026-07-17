# NAT and PAT

> NAT (Network Address Translation) translates private IP addresses to public IP addresses so internal devices can access the Internet. PAT (Port Address Translation) allows hundreds of devices to share a single public IP.

## Overview
There are roughly 4.3 billion IPv4 addresses. There are over 20 billion devices connected to the Internet. The math shouldn't work. **NAT (Network Address Translation)** is the magic that keeps the Internet running. 

It allows enterprise firewalls and home routers to hide thousands of devices using Private IPs (RFC 1918) behind a handful of valid Public IPs. The router alters the IP headers of packets on the fly as they enter and leave the network.

## Why It Matters
Without NAT, every device in the world would require a registered, expensive Public IP address. For network engineers, configuring NAT rules is a daily task required to grant outbound internet access or publish internal web servers to the outside world. For security professionals, NAT obscures internal network topologies from outside observation and heavily impacts how Incident Responders trace malicious IP connections.

## Core Concepts
- **Inside Local:** The actual Private IP of the PC on the LAN (e.g., `192.168.1.10`).
- **Inside Global:** The Public IP the outside world sees the PC as (e.g., `203.0.113.5`).
- **Outside Global:** The actual Public IP of the destination server (e.g., `8.8.8.8`).
- **Translation Table:** The router maintains a stateful table tracking exactly which internal PC made which request, so when the reply comes back, it knows who to hand it to.

## Components / Types
1. **Static NAT (1-to-1):** Maps a single Private IP permanently to a single Public IP. Used for web servers or email servers that must be reachable from the outside. (Also called *Destination NAT* or *Port Forwarding*).
2. **Dynamic NAT:** Maps Private IPs to a pool of Public IPs on a first-come, first-served basis. Rarely used today.
3. **PAT (Port Address Translation / NAT Overload):** A many-to-one translation. 1,000 Private IPs translate to exactly 1 Public IP. This is what your home router uses. It keeps track of the 1,000 connections by assigning a unique Source Port to each one.

## How PAT Works
1. PC A (`192.168.1.10`, Source Port `4444`) connects to a Web Server (`8.8.8.8`, Dest Port `80`).
2. The packet hits the firewall. The firewall changes the Source IP to its own Public IP (`203.0.113.5`).
3. The firewall also changes the Source Port to a random available port (e.g., `5555`).
4. The firewall writes this to its NAT Table: `192.168.1.10:4444 <--> 203.0.113.5:5555`.
5. The Web Server replies to `203.0.113.5` on Port `5555`.
6. The firewall receives it, checks the table, translates the destination back to `192.168.1.10` on Port `4444`, and hands it to the PC.

## Practical Examples
- **Home Internet (PAT):** Your iPhone, TV, and laptop all have `192.168.1.x` addresses. They all browse the web simultaneously. Every external server thinks the traffic is coming from a single entity—your ISP modem's Public IP.
- **Hosting a Game Server (Static NAT):** You want friends to join your Minecraft server. You configure "Port Forwarding" on your router. Any traffic hitting your Public IP on port 25565 is translated and forwarded to the Private IP of your gaming PC.

## Security Considerations
- **NAT is not a Firewall:** NAT provides "security by obscurity" because external attackers cannot initiate a connection directly to an internal Private IP. However, it offers zero protection against malware that initiates a connection from the *inside out* (like a reverse shell or botnet beacon).
- **Incident Response Blindspots:** If a web host informs you that your Public IP was attacking them, finding the culprit is impossible unless you log your firewall's NAT translation table. Without logs, you know the attack came from your building, but you don't know which of the 5,000 internal PCs did it.

## Commands / Configuration Examples
### Cisco IOS (Configuring PAT / NAT Overload)
```text
! 1. Define the internal network to translate
access-list 1 permit 192.168.1.0 0.0.0.255

! 2. Identify the internal interface
interface GigabitEthernet0/1
 ip nat inside

! 3. Identify the external (Internet) interface
interface GigabitEthernet0/0
 ip nat outside

! 4. Create the PAT rule tying them together
ip nat inside source list 1 interface GigabitEthernet0/0 overload

! View active translations
show ip nat translations
```

## Troubleshooting
- **No Internet Access:** Ensure both `ip nat inside` and `ip nat outside` are applied to the correct interfaces. Ensure the routing table knows how to reach the Internet.
- **Asymmetric Routing:** If traffic leaves the network via Firewall A, but the return traffic enters via Firewall B, Firewall B will drop it because it doesn't have a matching NAT table entry.
- **Port Exhaustion:** In massive networks (e.g., a stadium Wi-Fi), 50,000 users sharing a single Public IP will run out of available TCP/UDP ports (max 65,535). The firewall will start dropping new internet requests. You must assign a pool of multiple Public IPs.

## Interview Questions
- What is the difference between NAT and PAT?
- Explain the role of the NAT Translation Table.
- Does NAT inherently protect computers from viruses? Why or why not?
- What problem does "Port Forwarding" solve? (Answer: Allowing outside traffic to reach an inside server hidden behind NAT).

## Summary
Network Address Translation is the essential mechanism bridging the gap between isolated Private networks and the globally routed Public Internet. By seamlessly altering IP headers, NAT conserves the IPv4 address space and hides internal topology.

## References
- [Private IP](private-ip.md)
- [Public IP](public-ip.md)
- [Ports and Sockets](../06-network-protocols/ports-and-sockets.md)
