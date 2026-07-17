# IPv6 Addressing

> IPv6 is the modern Internet protocol, utilizing 128-bit addresses to provide a practically limitless supply of unique IP addresses for every device on Earth.

## Overview
IPv4 ran out of unallocated addresses. While NAT (Network Address Translation) delayed the crisis, it added massive complexity to the Internet. **Internet Protocol version 6 (IPv6)** was designed to replace IPv4. It eliminates the need for NAT by using 128-bit addresses, creating enough IP space for every grain of sand on Earth to have its own IP address.

Beyond capacity, IPv6 streamlines packet headers for faster router processing, integrates security (IPsec was originally mandated for IPv6), and simplifies network auto-configuration.

## Why It Matters
IPv6 adoption is accelerating globally, driven by cellular networks, IoT devices, and cloud providers facing IPv4 scarcity. For network engineers, IPv6 changes fundamental concepts (e.g., no more broadcasts, no more NAT). For security professionals, IPv6 misconfigurations are a goldmine; many companies focus heavily on securing IPv4 while accidentally leaving IPv6 routing wide open to the Internet.

## Core Concepts
- **128-bit Structure:** An IPv6 address is 128 bits long, compared to IPv4's 32 bits.
- **Hexadecimal Notation:** Addresses are written as eight groups of four hexadecimal digits, separated by colons. Example: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`.
- **Simplification Rules:** 
  1. Leading zeros in a group can be omitted: `0db8` becomes `db8`.
  2. One consecutive block of all-zero groups can be replaced with a double colon `::`.
  - The example above simplifies to: `2001:db8:85a3::8a2e:370:7334`.
- **Prefix Length:** Subnet masks do not exist in IPv6. CIDR notation (e.g., `/64`) is used exclusively to define the network boundary.

## How It Works
1. **Network Prefix (First 64 bits):** Dictates the network location. The first 48 bits are usually assigned by the ISP, and the next 16 bits are the "Subnet ID" controlled by the enterprise.
2. **Interface ID (Last 64 bits):** The host portion. This is unique to the specific device on that subnet. Devices often generate this automatically using a mathematical function (EUI-64) based on their MAC address, or via Privacy Extensions to randomize it.
3. No NAT is used. If a device has a Global Unicast address, it can route directly to the Internet (assuming firewalls permit it).

## Components / Types
IPv6 completely eliminates the concept of Broadcasts.
- **Global Unicast (`2000::/3`):** Equivalent to an IPv4 Public IP. Routable on the global Internet.
- **Unique Local (`fc00::/7`):** Equivalent to an IPv4 Private IP (RFC 1918). Used for internal routing only.
- **Link-Local (`fe80::/10`):** *Crucial concept.* Every IPv6 interface automatically generates a Link-Local address. It is strictly used for communication on the exact same physical link (subnet). Routers will *never* forward packets with a Link-Local address.
- **Multicast (`ff00::/8`):** One-to-many communication. IPv6 relies heavily on Multicast for core functions (like finding routers and resolving MAC addresses).
- **Loopback:** `::1`.

## Practical Examples
- **No DHCP Required (SLAAC):** You plug a laptop into an IPv6 network. The laptop uses Stateless Address Autoconfiguration (SLAAC). It asks the local router for the `/64` Network Prefix. The laptop then generates its own 64-bit Interface ID, combining them to form a full, routable 128-bit address instantly without needing a DHCP server.
- **Dual-Stack:** Most modern networks run IPv4 and IPv6 simultaneously on the same interfaces to maintain compatibility during the decades-long transition period.

## Security Considerations
- **The End of NAT "Protection":** Because every device gets a globally routable Public IP, enterprise perimeter firewalls must explicitly deny incoming traffic by default, relying on stateful inspection rather than NAT obscurity to protect internal PCs.
- **Privacy Extensions:** Historically, EUI-64 embedded a device's permanent MAC address directly into its public IPv6 address, allowing websites to track mobile users globally. Modern OSs (Windows/macOS) use Privacy Extensions to generate random, temporary Interface IDs.
- **Shadow Networks:** Pentesters often find that corporate firewalls heavily restrict IPv4 traffic, but IPv6 rules are misconfigured or non-existent, allowing an attacker to exfiltrate data entirely over IPv6, bypassing monitoring tools.

## Commands / Configuration Examples
### Linux
```bash
# View IPv6 addresses (notice the 'inet6' lines)
ip -6 addr

# Ping an IPv6 address
ping6 2001:4860:4860::8888
```

### Windows
```powershell
# View IPv6 configuration
ipconfig
```

### Cisco IOS
```text
! Enable IPv6 routing globally (required for a router to forward v6 packets)
ipv6 unicast-routing

! Assign a Global Unicast address to an interface
interface GigabitEthernet0/1
 ipv6 address 2001:db8:acad:1::1/64
 no shutdown
```

## Troubleshooting
- **Cannot Reach Internet via IPv6:** Ensure `ipv6 unicast-routing` is enabled on the router. Check if the device has received both a valid Global Unicast address and a Default Gateway via SLAAC or DHCPv6.
- **Ping Link-Local:** If you ping a Link-Local address (`fe80::...`) from a router, you *must* specify the exit interface (e.g., `%eth0`), because every interface has the exact same `fe80::` network and the OS won't know which cable to send the ping down.

## Interview Questions
- How many bits are in an IPv6 address?
- Simplify the following IPv6 address: `2001:0db8:0000:0000:0000:ff00:0042:8329`. (Answer: `2001:db8::ff00:42:8329`).
- What is a Link-Local address used for in IPv6?
- Explain why IPv6 does not require Network Address Translation (NAT).

## Summary
IPv6 completely redesigns network addressing. By leveraging 128-bit hexadecimal strings, eliminating broadcasts, and relying on sophisticated autoconfiguration and multicast, it removes the band-aids holding IPv4 together, providing a streamlined and infinite foundation for the future Internet.

## References
- [IPv4 Addressing](ipv4-addressing.md)
- [Neighbor Discovery Protocol (NDP)](neighbor-discovery-protocol.md)
- [IPv6 Subnetting](ipv6-subnetting.md)
- [Multicast Addressing](multicast-addressing.md)
