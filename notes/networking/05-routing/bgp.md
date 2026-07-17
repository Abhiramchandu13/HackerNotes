# BGP (Border Gateway Protocol)

> BGP is the protocol that runs the global Internet, designed to route traffic between massive organizations based on business policies rather than sheer speed.

## Overview
Protocols like OSPF and EIGRP (Interior Gateway Protocols) are great at finding the fastest path inside a single building or company. But when Verizon needs to route traffic to AT&T, or a company needs to route traffic to AWS, speed is not the primary concern—money, contracts, and peering agreements are. 

**Border Gateway Protocol (BGP)** is an Exterior Gateway Protocol (EGP). It is the postal service of the Internet, routing data between massive Autonomous Systems (AS) using highly customizable rules.

## Why It Matters
If BGP breaks, the Internet breaks (as seen in major global outages involving Facebook, Cloudflare, or major ISPs). Anyone working in Cloud infrastructure, ISP engineering, or large enterprise edge networking must understand BGP. For cybersecurity, BGP vulnerabilities allow nation-states to hijack massive swathes of global internet traffic.

## Core Concepts
- **Autonomous System Number (ASN):** Every distinct organization on the Internet (ISPs, Google, large enterprises) is assigned a globally unique ASN by IANA (e.g., Google is AS15169).
- **Path Vector Protocol:** BGP doesn't care about bandwidth. It keeps track of the exact *path* of ASNs a route has traversed.
- **TCP Port 179:** Unlike OSPF which uses raw IP, BGP establishes formal, reliable TCP connections on port 179 between routers.
- **Attributes:** The "metrics" of BGP. BGP uses a complex list of attributes (AS-Path length, Local Preference, MED) to decide which route is best.

## How It Works
1. **Peering:** An enterprise border router establishes a TCP session with the ISP's border router. They become "BGP Peers."
2. **Advertising:** The enterprise router advertises: "I own the IP block `203.0.113.0/24`. My ASN is 65000."
3. **Propagation:** The ISP adds its own ASN to the path and advertises it to the rest of the Internet: "To reach `203.0.113.0/24`, go through AS701 (Verizon), then AS65000."
4. **Path Selection:** When a user in Europe tries to reach that IP, their ISP looks at the BGP table. It might see a path that goes through 3 ASNs, and another that goes through 5 ASNs. It chooses the path with the shortest "AS-Path."

## Components / Types
- **eBGP (External BGP):** Running BGP between two different organizations (different ASNs). This is the standard use case.
- **iBGP (Internal BGP):** Running BGP between routers inside the *same* organization (same ASN). Often used by ISPs to carry Internet routes across their internal backbone without overwhelming OSPF.
- **Default Route vs Full Table:** Small enterprises use BGP to receive a single `0.0.0.0/0` default route from their ISPs. Massive data centers download the "Full BGP Table" (over 900,000 routes) so they can make granular decisions on exactly which ISP is best for every destination on Earth.

## Practical Examples
- **Multi-Homing:** An enterprise buys internet connections from Comcast and Level3. They use BGP to advertise their Public IPs out of both connections. BGP automatically load-balances inbound Internet traffic and provides seamless failover if Comcast goes down.
- **Anycast:** CDNs like Cloudflare advertise the exact same IP address (`1.1.1.1`) from 100 different ASNs globally. BGP naturally routes users to the physically closest ASN.

## Security Considerations
BGP was built on ultimate trust, which is a massive security flaw.
- **BGP Hijacking:** An attacker in another country configures their router to announce to the world, "I own Twitter's IP addresses." If the attacker's path looks better, global ISPs will believe it. The world's Twitter traffic is silently redirected to the attacker's servers (MitM or Blackholing).
- **Defense (RPKI):** Resource Public Key Infrastructure is a modern cryptographic framework where owners sign certificates proving they own their IP blocks. ISPs drop BGP announcements that fail the cryptographic check, preventing hijacking.
- **MD5 Authentication:** Always require MD5 passwords on TCP port 179 peering sessions to prevent random devices from spoofing BGP messages.

## Commands / Configuration Examples
### Cisco IOS
```text
! Basic eBGP Configuration
router bgp 65000
 ! Define the neighboring ISP router and its ASN
 neighbor 198.51.100.1 remote-as 701
 ! Require an authentication password
 neighbor 198.51.100.1 password SecretKey123
 
 ! Advertise your public IP block to the ISP
 network 203.0.113.0 mask 255.255.255.0

! View the BGP routing table
show ip bgp

! View the status of BGP peering sessions
show ip bgp summary
```

## Troubleshooting
- **Idle / Active State:** If `show ip bgp summary` shows the neighbor in an "Active" or "Idle" state instead of a number, the TCP session failed. Check IP reachability, firewalls blocking TCP port 179, or ASN mismatches.
- **Hidden Routes:** A router will *never* install a BGP route into its table if it sees its own ASN in the AS-Path. This is BGP's built-in loop prevention mechanism.

## Interview Questions
- What transport protocol and port does BGP use? (Answer: TCP port 179).
- Explain the difference between eBGP and iBGP.
- How does BGP prevent routing loops? (Answer: By checking the AS-Path attribute and dropping routes containing its own ASN).
- Describe what a BGP Hijacking attack is.

## Summary
BGP is the connective tissue of the global Internet and large-scale cloud architectures. Prioritizing business policy, path vectors, and massive scalability over sheer speed, mastering BGP is a hallmark of senior network engineering and essential for understanding global threat landscapes.

## References
- [Routing Fundamentals](routing-fundamentals.md)
- [Anycast Addressing](../04-ip-addressing/anycast-addressing.md)
- [Dynamic Routing Protocols](dynamic-routing-protocols.md)
- [TCP](../06-network-protocols/tcp.md)
