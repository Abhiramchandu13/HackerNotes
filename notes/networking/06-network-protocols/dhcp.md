# DHCP (Dynamic Host Configuration Protocol)

> DHCP automatically assigns IP addresses, subnet masks, default gateways, and DNS servers to devices as they join a network.

## Overview
In the early days of networking, a sysadmin had to manually visit every new computer and type in an IP address, ensuring they didn't accidentally duplicate an address already in use. **Dynamic Host Configuration Protocol (DHCP)** automates this entirely. Operating at the Application Layer (using UDP ports 67 and 68), DHCP servers manage pools of IP addresses, dynamically "leasing" them to client devices as they boot up or join Wi-Fi networks.

## Why It Matters
Without DHCP, enterprise mobility is impossible. You cannot manually reconfigure an IP address every time a user moves their laptop from the 3rd floor to the 4th floor, or when a guest joins the lobby Wi-Fi. For security, DHCP logs provide the critical link between a logical IP address and a physical MAC address during incident response investigations.

## Core Concepts
- **The DORA Process:** The 4-step sequence (Discover, Offer, Request, Acknowledge) a client uses to obtain an IP.
- **The Lease:** DHCP hands out IPs temporarily. A lease might last 8 hours or 8 days. Clients must renew their lease before it expires; if they don't, the IP is returned to the pool for someone else to use.
- **Scope / Pool:** The range of IP addresses the server is allowed to distribute (e.g., `192.168.1.100` to `192.168.1.200`).
- **Options:** Extra configuration data handed out alongside the IP. The most common are Option 3 (Router/Default Gateway) and Option 6 (DNS Servers).

## How It Works (The DORA Process)
1. **Discover (Broadcast):** A PC boots up with no IP. It shouts to the local network: "Is there a DHCP server here? I need an IP!" (Sent to `255.255.255.255` on UDP 67).
2. **Offer (Unicast/Broadcast):** The DHCP server hears the request. It reserves an IP (e.g., `10.0.0.50`) and replies: "I am a server. You can use 10.0.0.50."
3. **Request (Broadcast):** The PC replies: "I accept the offer for 10.0.0.50!" (It broadcasts this in case multiple DHCP servers made offers, officially informing all of them whose offer it accepted).
4. **Acknowledge (ACK):** The DHCP server finalizes the lease, records the PC's MAC address in its database, and replies: "Confirmed. Here is your Subnet Mask and Default Gateway."

## Components / Types
- **Dynamic Allocation:** The standard process. IP is leased from a pool and returned when unused.
- **Automatic Allocation:** The server permanently assigns an IP to a client from the pool.
- **Static Allocation (DHCP Reservation):** The administrator manually maps a specific MAC address to a specific IP address in the server. Whenever that MAC asks for an IP, the server always gives it the exact same one. Used for printers or servers that need consistent IPs but still want centralized configuration.

## Practical Examples
- **Guest Wi-Fi:** A coffee shop sets their DHCP lease time to 1 hour. This ensures that IPs are quickly returned to the pool after customers leave, preventing the `192.168.1.0/24` subnet from running out of IPs (DHCP Exhaustion) during a busy day.
- **DHCP Relay (IP Helper):** Broadcasts do not cross routers. If VLAN 10 has PCs, and VLAN 99 has the DHCP server, the DORA broadcast from VLAN 10 will die at the router. A network engineer configures an "IP Helper Address" on the VLAN 10 router interface, which converts the broadcast into a unicast packet aimed directly at the DHCP server in VLAN 99.

## Security Considerations
DHCP is incredibly trusting, inherently believing any response it receives.
- **Rogue DHCP Server:** An attacker plugs a laptop into the network and runs a DHCP server software. When legitimate PCs send a Discover broadcast, the attacker replies faster than the real server. The attacker hands the victim a valid IP, but sets the *Default Gateway* or *DNS Server* to the attacker's own machine. This results in a massive Man-in-the-Middle (MitM) attack.
- **DHCP Starvation:** An attacker runs a script (like `Yersinia`) that constantly generates fake MAC addresses and requests IPs until the entire DHCP pool is empty, causing a Denial of Service for new clients.
- **Defense (DHCP Snooping):** A critical Layer 2 switch feature. The switch categorizes ports as "Trusted" (where the real DHCP server lives) and "Untrusted" (user ports). If a DHCP Offer packet originates from an untrusted port, the switch drops it instantly and disables the attacker's port.

## Commands / Configuration Examples
### Windows
```powershell
# Force the PC to release its current IP back to the server
ipconfig /release

# Restart the DORA process to get a new IP
ipconfig /renew

# View detailed IP info, including Lease expiration and DHCP Server IP
ipconfig /all
```

### Linux
```bash
# Request a new lease using the dhclient daemon (interface eth0)
sudo dhclient -v eth0

# Release the lease
sudo dhclient -r eth0
```

### Cisco IOS
```text
! Configure a DHCP Relay (IP Helper) on a router interface
interface Vlan 10
 ip address 10.1.10.1 255.255.255.0
 ip helper-address 10.1.99.5
```

## Troubleshooting
- **APIPA Address:** If a Windows PC shows an IP address of `169.254.x.x`, the DORA process failed. The PC could not reach a DHCP server. Check physical cabling, VLAN assignment, or missing IP Helper configurations.
- **IP Conflicts:** If someone manually assigns an IP address (e.g., `10.0.0.50`) to a server, but that IP is still inside the DHCP pool range, the DHCP server will eventually try to hand it to a laptop, causing a conflict. Always exclude static IPs from the DHCP pool.

## Interview Questions
- What does DORA stand for in the context of DHCP?
- Does DHCP use TCP or UDP? (Answer: UDP ports 67 for server and 68 for client).
- How do you allow a computer in VLAN 10 to receive an IP from a DHCP server located in VLAN 20? (Answer: Configure an IP Helper / DHCP Relay on the router).
- Explain how a Rogue DHCP server attack works and how to mitigate it.

## Summary
DHCP abstracts away the tedious and error-prone task of IP address management. By automating the distribution of logical network configurations, it enables frictionless mobility for users, though its broadcast-heavy, trust-based nature requires firm Layer 2 security defenses in enterprise environments.

## References
- [APIPA](../04-ip-addressing/apipa.md)
- [Broadcast Address](../04-ip-addressing/broadcast-address.md)
- [Rogue DHCP](../14-network-pentesting/rogue-dhcp.md)
- [UDP](udp.md)
