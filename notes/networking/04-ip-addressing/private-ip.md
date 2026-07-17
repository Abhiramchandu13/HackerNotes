# Private IP Addresses

> Private IP addresses are designated blocks of IPv4 addresses intended exclusively for use within internal, local networks and are not routable on the public Internet.

## Overview
In the mid-1990s, the architects of the Internet realized they were going to run out of the 4.3 billion available IPv4 addresses. To delay this, they published **RFC 1918**. This document carved out three specific blocks of IP addresses and declared them "Private." 

Anyone in the world can use these Private IP addresses inside their home or corporate network for free, without registering them. Because everyone is using the same addresses internally, these IPs are strictly banned from crossing the public Internet.

## Why It Matters
Without Private IPs (and the NAT process that accompanies them), the IPv4 internet would have collapsed decades ago. As an IT professional, 99% of the servers, workstations, and devices you deploy will use Private IP addresses. Understanding these ranges is essential for network design, writing firewall rules, and distinguishing internal vs. external traffic during security incident triage.

## Core Concepts
RFC 1918 defines three specific blocks for private use:
1. **The 10.x.x.x Network (Class A Equivalent):**
   - Range: `10.0.0.0` to `10.255.255.255`
   - CIDR: `10.0.0.0/8`
   - Provides 16.7 million addresses. Used by large enterprises and cloud providers (AWS/Azure default VPCs).
2. **The 172.16.x.x Network (Class B Equivalent):**
   - Range: `172.16.0.0` to `172.31.255.255`
   - CIDR: `172.16.0.0/12`
   - Provides over 1 million addresses. Often used for mid-sized corporate networks or Docker container networks.
3. **The 192.168.x.x Network (Class C Equivalent):**
   - Range: `192.168.0.0` to `192.168.255.255`
   - CIDR: `192.168.0.0/16`
   - Provides 65,000 addresses. Extremely common in home routers and small businesses.

## How It Works
1. You set up a network in your office using `10.0.0.0/24`. You assign `10.0.0.5` to your PC.
2. A company across the street also sets up an office using `10.0.0.0/24` and assigns `10.0.0.5` to their PC. This is perfectly fine because the networks are physically separated.
3. Your PC wants to access google.com. The PC sends the packet to your local router.
4. The router knows that `10.0.0.5` is a Private IP and will be dropped by Internet ISPs. 
5. The router uses **NAT (Network Address Translation)** to swap your private `10.0.0.5` address for a single, registered Public IP address before sending it onto the Internet.

## Components / Types
- **RFC 1918:** The standard defining Private IPs.
- **CGNAT (Carrier-Grade NAT) Space:** `100.64.0.0/10`. A specialized private block used by ISPs and cellular carriers to perform NAT for their customers before hitting the broader Internet (RFC 6598).
- **Non-Routable:** Core Internet backbone routers are configured to instantly drop any packet with a destination or source address matching RFC 1918 space.

## Practical Examples
- **Home Wi-Fi:** You buy a Linksys router, plug it in, and connect your phone. Your phone gets `192.168.1.15` (a Private IP). Your router is performing NAT to hide your phone behind the one Public IP your ISP gave you.
- **Corporate Mergers:** Company A uses `10.1.0.0/16`. Company B uses `10.1.0.0/16`. When Company A buys Company B, they cannot simply connect their networks together via VPN because the Private IPs overlap. They must undergo a painful IP re-addressing project or set up complex NAT rules.

## Security Considerations
- **Security through Obscurity:** Private IPs offer a minor layer of protection because an attacker on the Internet cannot directly ping or scan your `192.168.1.5` PC. However, if an attacker tricks the user into clicking a link, the connection is initiated from the inside out, bypassing this "protection."
- **Internal Pentesting:** When conducting an internal pentest, the attacker's target scope is almost exclusively RFC 1918 space. 
- **Egress Filtering:** Security best practices dictate that enterprise firewalls should block any packet trying to *leave* the network that has a source address that doesn't match the company's assigned Private IP subnet (to prevent IP spoofing attacks).

## Commands / Configuration Examples
Checking if a machine has a private IP is standard procedure.

### Linux
```bash
ip addr
# Look for inet addresses starting with 10., 172.16-31., or 192.168.
```

### Cisco IOS
```text
! A standard edge ACL dropping Private IPs arriving from the Internet
! (Spoofing defense)
access-list 100 deny ip 10.0.0.0 0.255.255.255 any
access-list 100 deny ip 172.16.0.0 0.15.255.255 any
access-list 100 deny ip 192.168.0.0 0.0.255.255 any
```

## Troubleshooting
- **Overlapping IP Space:** The most common issue with Private IPs in enterprise settings. If you establish a VPN between a remote worker's home network (`192.168.1.0/24`) and a corporate branch office that also uses (`192.168.1.0/24`), routing will fail. The PC won't know whether to send traffic to the local printer or across the VPN.
- **No Internet Access:** If a computer has a `169.254.x.x` address, this is an APIPA address, meaning it failed to reach a DHCP server, not a valid RFC 1918 private IP.

## Interview Questions
- What RFC defines Private IP addresses?
- List the three primary Private IPv4 address ranges.
- Can Private IP addresses be routed across the public Internet?
- If two different companies use the `10.0.0.0/8` network internally, why doesn't this cause a global IP conflict?

## Summary
Private IP addresses act as reusable, isolated address spaces for local networks. By decoupling internal addressing from global Internet addressing, RFC 1918 saved IPv4 from exhaustion and fundamentally shaped how modern corporate and home networks are architected behind NAT gateways.

## References
- [Public IP Addresses](public-ip.md)
- [NAT and PAT](nat-and-pat.md)
- [APIPA](apipa.md)
- [CIDR](cidr.md)
