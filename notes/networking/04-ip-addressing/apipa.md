# APIPA (Automatic Private IP Addressing)

> APIPA is a fallback mechanism where a device automatically assigns itself a specific local IP address if it fails to communicate with a DHCP server.

## Overview
Normally, computers rely on a DHCP server to hand them an IP address, subnet mask, and default gateway. But what happens if the DHCP server crashes, or the network cable connecting the switch to the DHCP server is unplugged? 

Instead of completely disabling the network adapter, Windows and macOS operating systems use **Automatic Private IP Addressing (APIPA)**. The computer randomly selects an IP address from a reserved range (`169.254.x.x`) so it can at least communicate with other devices on the exact same local switch that are also experiencing the DHCP outage.

## Why It Matters
APIPA is rarely a feature you want to see; it is almost universally an indicator of a network failure. For IT support and network engineers, seeing a `169.254.x.x` address is an immediate, glaring red flag that DHCP has failed. It is step one in troubleshooting connectivity issues.

## Core Concepts
- **The APIPA Range:** Defined by IETF RFC 3927 as the **Link-Local** address block: `169.254.0.0/16`.
- **Usable Range:** Devices will assign themselves an IP between `169.254.1.0` and `169.254.254.255`.
- **Subnet Mask:** APIPA always uses a `/16` subnet mask (`255.255.0.0`).
- **No Gateway:** APIPA does not assign a default gateway or DNS server. Therefore, APIPA addresses cannot reach the Internet and cannot cross a router.

## How It Works
1. A PC boots up and sends a DHCP Discover broadcast message.
2. The PC waits for a DHCP Offer.
3. If no offer arrives within a timeout period (usually a few seconds), the OS activates APIPA.
4. The OS randomly generates an IP address in the `169.254.x.x` range.
5. The OS uses ARP (Gratuitous ARP) to shout out on the local network, "Is anyone else using `169.254.42.10`?"
6. If no one replies, the PC claims the IP. (If someone replies, it generates a new random IP and tries again).
7. The PC continues to silently ping for a DHCP server in the background. If a DHCP server comes online, the PC drops the APIPA address and accepts the new, real IP address.

## Components / Types
- **IPv4 Link-Local:** APIPA (`169.254.x.x`).
- **IPv6 Link-Local:** The IPv6 equivalent, starting with `fe80::`. Unlike IPv4, IPv6 *always* generates a link-local address on every interface, regardless of whether DHCPv6 is present or not.

## Practical Examples
- **LAN Parties:** In the early days of networking, if you connected 5 laptops together with a cheap switch to play a LAN game, nobody had to configure IPs or bring a router. All 5 laptops would fail to find DHCP, assign themselves APIPA addresses, and be able to play the game on the local switch perfectly fine.
- **Troubleshooting a Dead Port:** A user complains of no Internet. You run `ipconfig` and see `169.254.55.101`. You immediately know the physical cable is fine (or it would say "Media Disconnected"), but the path to the DHCP server is broken (perhaps a misconfigured VLAN on the switch port).

## Security Considerations
- **Lateral Movement:** If an enterprise network experiences a DHCP failure, machines fallback to APIPA. An attacker plugged into the same switch also gets an APIPA address, retaining full Layer 2 connectivity to the victim machines for lateral movement, even though the "real" network is down.
- **Rogue DHCP:** If a client fails to reach the real DHCP server, they are highly susceptible to accepting an IP from an attacker running a Rogue DHCP server (e.g., Responder), routing their traffic through the attacker's machine.

## Commands / Configuration Examples
APIPA requires no configuration, but you use standard IP commands to spot it.

### Windows
```powershell
# If you see "Autoconfiguration IPv4 Address: 169.254.x.x", APIPA is active
ipconfig /all
```

### Linux
*Note: Linux behaviors vary by distribution. Some modern distros (like those using `systemd-networkd` or `avahi-autoipd`) support APIPA, while older ones may just leave the interface unconfigured.*
```bash
ip addr show
```

## Troubleshooting
If you see an APIPA address, investigate the DHCP path:
- **Port Security:** Did the switch port shut down?
- **VLAN Assignment:** Is the switch port assigned to a "dead" or incorrect VLAN that has no DHCP helper address configured?
- **DHCP Exhaustion:** Is the DHCP pool entirely out of available IP addresses?
- **Server Down:** Has the Windows Server or Router running the DHCP service crashed?

## Interview Questions
- What IP address range is reserved for APIPA?
- If a computer has a `169.254.x.x` address, can it browse the Internet? Why or why not?
- What underlying network failure causes an operating system to assign an APIPA address?
- What is the IPv6 equivalent of an APIPA address? (Answer: Link-Local `fe80::`).

## Summary
APIPA acts as a fail-safe mechanism, ensuring devices maintain local communication capabilities even when central DHCP services fail. While useful in isolated ad-hoc networks, in an enterprise environment, an APIPA address is the universal signal for a DHCP or Layer 2 connectivity issue.

## References
- [DHCP](../06-network-protocols/dhcp.md)
- [IPv4 Addressing](ipv4-addressing.md)
- [Rogue DHCP](../15-network-pentesting/rogue-dhcp.md)
