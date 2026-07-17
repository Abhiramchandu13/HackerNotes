# IPv6 Subnetting

> IPv6 subnetting is the process of dividing an assigned IPv6 network block into smaller organizational networks. Thanks to the massive size of IPv6, the math is significantly easier than IPv4.

## Overview
In IPv4, subnetting is a painful process of borrowing individual bits to save every last IP address. In IPv6, the address space is so unfathomably large that you almost never worry about host counts. Instead, IPv6 subnetting is purely about **administrative hierarchy**. You carve the network along logical hexadecimal boundaries (nibbles) rather than stressing over binary bits.

## Why It Matters
When an ISP hands an enterprise an IPv6 block, the enterprise must plan how to distribute that space to different campuses, buildings, and VLANs. Poor IPv6 design leads to massive, messy routing tables. Understanding IPv6 subnetting allows you to build clean, summarizable routing topologies that are highly performant and easy to secure.

## Core Concepts
- **The Standard /64:** The absolute golden rule of IPv6 is that **every single user subnet (VLAN, LAN) should be a `/64`**. Never use a `/120` or `/112` for a LAN. Breaking the `/64` rule breaks SLAAC (Stateless Address Autoconfiguration) and fundamental IPv6 features.
- **Network vs. Host:**
  - `First 64 bits:` Network Routing.
  - `Last 64 bits:` Host ID (Interface ID).
- **The Nibble Boundary:** A nibble is 4 bits (one hexadecimal character). Subnetting in IPv6 is almost exclusively done on nibble boundaries (e.g., `/48`, `/52`, `/56`, `/60`, `/64`) so the math can be done by simply looking at the hex characters without converting to binary.

## How It Works
1. **The Allocation:** An enterprise is typically assigned a `/48` block by their ISP (e.g., `2001:db8:acad::/48`).
2. **The Goal:** The enterprise needs subnets for their VLANs. Because every VLAN must be a `/64`, the enterprise has the bits between `/48` and `/64` to use for their own internal routing structure.
3. **The Subnet Field:** $64 - 48 = 16$ bits available for subnetting. 16 bits equals exactly 4 hexadecimal characters.
4. **The Math:**
   - Base Network: `2001:db8:acad:0000::/64`
   - Subnet 1 (VLAN 10): `2001:db8:acad:0001::/64`
   - Subnet 2 (VLAN 20): `2001:db8:acad:0002::/64`
   - Subnet 3 (VLAN 30): `2001:db8:acad:000A::/64` (Hexadecimal!)
   - You have 65,536 (`2^16`) possible `/64` subnets. Each one can hold 18 quintillion hosts.

## Components / Types
- **Global Routing Prefix:** The portion assigned by the ISP or Regional Internet Registry (usually the first 48 bits).
- **Subnet ID:** The portion defined by the enterprise to separate internal networks (usually bits 49 to 64).
- **Interface ID:** The host portion (bits 65 to 128).

## Practical Examples
- **Large Campus Design:** A university is given `2001:db8::/32`. They assign a `/40` to each physical campus. Within a campus, they assign a `/48` to each building. Inside the building, they assign a `/64` to each floor/VLAN. This hierarchical design allows the core router to summarize the entire campus network into a single `/40` route, keeping routing tables tiny.

## Security Considerations
- **Scanning Impossibility:** In IPv4, a pentester can scan a `/24` subnet (254 IPs) in a few seconds using `nmap`. In IPv6, a standard `/64` subnet contains 18,446,744,073,709,551,616 addresses. A brute-force ping sweep of an IPv6 subnet would take 50,000 years.
- **Defense:** Because scanning is dead, attackers rely on OSINT, DNS zone transfers, intercepting multicast traffic, or exploiting known servers. Security teams must ensure robust logging and DNS security, as "hiding in the sheer size of the subnet" is the new reality.

## Commands / Configuration Examples
Configuring a router interface with an IPv6 subnet is straightforward.

### Cisco IOS
```text
! Configuring sequential /64 subnets on router interfaces
interface GigabitEthernet0/1
 description Users_VLAN
 ipv6 address 2001:db8:abcd:0001::1/64

interface GigabitEthernet0/2
 description Servers_VLAN
 ipv6 address 2001:db8:abcd:0002::1/64
```

## Troubleshooting
- **Incorrect Subnetting:** Trying to conserve space by assigning a `/112` to a user VLAN is a critical mistake. It will break Android and Apple devices that expect a `/64` to generate their privacy-extension Interface IDs. Always use a `/64` for LANs.
- **Point-to-Point Links:** Historically, engineers used `/127` or `/64` for router-to-router point-to-point links. Modern RFC 6164 standardizes using a **`/127`** for point-to-point links to prevent "Ping-Pong" routing loop attacks, though some organizations still dedicate a full `/64` for simplicity.

## Interview Questions
- Why do we typically not worry about calculating "host limits" when subnetting IPv6?
- What prefix length should always be used for a local area network (LAN) in IPv6, and why?
- If an ISP assigns you `2001:db8:1234::/48`, how many `/64` subnets can you create? (Answer: 65,536, derived from the 16 bits of difference).
- Why is it impossible to perform a traditional `nmap` brute-force ping sweep on an IPv6 LAN?

## Summary
IPv6 subnetting shifts the focus from preserving addresses to creating clean, logical, and highly summarizable network architectures. By standardizing on the `/64` boundary and manipulating hexadecimal nibbles, engineers can rapidly design global-scale networks with minimal mathematical strain.

## References
- [IPv6 Addressing](ipv6-addressing.md)
- [IPv4 Subnetting](ipv4-subnetting.md)
- [Neighbor Discovery Protocol (NDP)](neighbor-discovery-protocol.md)
