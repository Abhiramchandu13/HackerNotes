# CIDR (Classless Inter-Domain Routing)

> CIDR is the modern system of IP addressing and routing that replaces legacy network classes, using a slash notation (e.g., /24) to flexibly define the network boundary.

## Overview
In the early days of the Internet, IP addresses were divided into rigid classes (Class A, B, and C). If a company needed 300 IP addresses, a Class C (254 IPs) was too small, so they were given a Class B (65,534 IPs), wasting over 65,000 addresses. 

**Classless Inter-Domain Routing (CIDR)**, introduced in 1993 via RFC 1519, abolished this rigid class system. It allowed network boundaries (subnet masks) to be drawn at any bit, providing variable-sized networks and saving the IPv4 address space from premature exhaustion.

## Why It Matters
CIDR is the absolute standard for how IP addresses are communicated today. Whether you are configuring an AWS VPC, writing a firewall rule in Palo Alto, or setting up a Linux container, you will use CIDR notation. For security professionals, understanding CIDR is mandatory for scoping penetration tests (e.g., scanning a `/22` range) and writing accurate Access Control Lists (ACLs).

## Core Concepts
- **CIDR Notation (Slash Notation):** Represents the subnet mask by stating exactly how many bits (from left to right) are turned "on" (set to 1). 
  - Instead of writing `255.255.255.0`, you write `/24` (because 24 bits are 1s).
  - Instead of writing `255.255.255.128`, you write `/25`.
- **Prefix:** The network portion of the address defined by the CIDR notation.
- **Route Summarization (Supernetting):** CIDR allows multiple contiguous smaller networks (e.g., four `/24` networks) to be aggregated and advertised to the global Internet as a single, larger route (e.g., one `/22` network). This drastically reduces the size of global routing tables.

## How It Works
1. **The Slash:** When you see `10.5.0.0/20`, the `/20` dictates the mask.
2. **The Mask:** A `/20` means the first 20 bits are the network, leaving 12 bits for hosts (32 total bits - 20 network bits = 12 host bits).
3. **The Math:** $2^{12} - 2 = 4094$ usable IP addresses. 
4. **The Routing:** When a core Internet router receives a packet, it looks at its routing table, which is filled with CIDR blocks. It uses the "Longest Prefix Match" rule: if a packet matches a `/16` route and a `/24` route, the router sends it to the `/24` route because it is more specific.

## Components / Types
While CIDR abolished classes, remembering the old class boundaries is helpful for context:
- **Class A Equivalent:** `/8` (16 million hosts)
- **Class B Equivalent:** `/16` (65,000 hosts)
- **Class C Equivalent:** `/24` (254 hosts)
- **Host Route:** `/32` (Points to exactly 1 specific computer/IP).

## Practical Examples
- **AWS VPC Creation:** When building a cloud environment, AWS forces you to define your network using CIDR. You might define your entire cloud footprint as `10.0.0.0/16`, and then carve out a public web tier at `10.0.1.0/24`.
- **Nmap Scanning:** A pentester wants to scan an entire client office. Instead of listing hundreds of IPs, they run `nmap 192.168.50.0/23`, and the tool knows exactly which range of IPs to hit.

## Security Considerations
- **Scope Creep in Firewall Rules:** A common junior mistake is creating a firewall allow rule for `10.1.1.0/16` when they meant `10.1.1.0/24`. A `/16` allows over 65,000 IPs through the firewall, vastly over-exposing the network. Mastery of CIDR is required to write tight, least-privilege firewall policies.
- **BGP Route Hijacking:** Because BGP routers prefer the longest prefix match (the most specific CIDR block), an attacker can advertise a specific `/24` route to hijack traffic away from a legitimate company advertising a broader `/16` route.

## Commands / Configuration Examples
CIDR notation is natively supported by almost all modern OS commands and firewall GUIs.

### Linux
```bash
# Add an IP using CIDR
ip addr add 192.168.10.5/24 dev eth0

# Use nmap to scan a CIDR block
nmap -sn 10.0.0.0/24
```

### Cisco IOS
*(Note: Cisco IOS interface configuration still requires dotted decimal (`255.255.255.0`), but newer routing protocols and ACLs often support CIDR).*
```text
! Configuring a static route using dotted decimal (representing a /24)
ip route 192.168.20.0 255.255.255.0 10.0.0.1
```

## Troubleshooting
- **CIDR Math Errors:** If you define a network as `192.168.1.10/24` in a configuration tool, it may throw an error because `.10` is a host IP, not a network ID. The proper notation for the network block is `192.168.1.0/24`.
- **Subnet Overlaps:** In cloud environments (AWS/Azure), you cannot peer two VPCs together if their CIDR blocks overlap (e.g., both use `10.0.0.0/16`). Proper CIDR planning across an enterprise prevents this.

## Interview Questions
- What problem did CIDR solve?
- Convert the subnet mask `255.255.240.0` into CIDR notation. (Answer: `/20`).
- What is a `/32` route, and when would you use it?
- Explain the concept of Route Summarization (Supernetting).

## Summary
CIDR rescued the IPv4 Internet from collapse by replacing rigid classes with a flexible, bit-level boundary system. By mastering the "slash" notation, you gain the ability to effortlessly parse network sizes, write precise security rules, and understand global BGP routing.

## References
- [IPv4 Subnetting](ipv4-subnetting.md)
- [VLSM](vlsm.md)
- [Routing Fundamentals](../05-routing/routing-fundamentals.md)
- [BGP](../05-routing/bgp.md)
