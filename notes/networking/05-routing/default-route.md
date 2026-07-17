# Default Route

> A Default Route is the "gateway of last resort"—the path a router takes when it has no specific instructions on where to send a packet.

## Overview
A router's job is to look up the destination IP of an incoming packet in its routing table and forward it. But what happens if the user is trying to reach a random website on the Internet, and the router doesn't have a specific route for that IP? Instead of dropping the packet, the router uses a **Default Route**. 

The default route tells the router: "If you don't know where this goes, send it *here*, and let the next router figure it out."

## Why It Matters
Without a default route, the Internet would be impossible to access for normal devices. It is completely unfeasible for a home router or a corporate edge firewall to hold the entire global Internet routing table (over 900,000 routes). Instead, they hold a few local routes, and one Default Route pointing to their Internet Service Provider (ISP). 

## Core Concepts
- **The Catch-All Subnet:** In IPv4, the default route is represented by the address `0.0.0.0` with a subnet mask of `0.0.0.0` (written in CIDR as `0.0.0.0/0`).
- **IPv6 Equivalent:** In IPv6, the default route is `::/0`.
- **Longest Prefix Match:** Remember that routers always choose the most specific route. A `/24` route is more specific than a `/16`. The default route (`/0`) is the *least specific* route mathematically possible. It will only ever be used if absolutely no other route matches.
- **Gateway of Last Resort:** The physical next-hop IP address that the default route points to.

## How It Works
1. A user attempts to browse `93.184.216.34` (example.com).
2. The PC looks at its own routing table. It doesn't know where that is, so it uses its Default Gateway and sends the packet to the local Office Router.
3. The Office Router receives the packet. It checks its routing table for `93.184.216.34`. It only has routes for internal networks (`10.x.x.x`). 
4. Because there is no specific match, the Office Router hits the `0.0.0.0/0` rule at the very bottom of the table. 
5. The rule says "Send to ISP Router `203.0.113.1`". The packet is forwarded to the Internet.

## Components / Types
- **Static Default Route:** An administrator manually types the `0.0.0.0 0.0.0.0` route into the edge router. This is standard for 99% of businesses.
- **Dynamically Propagated Default Route:** Core routers can use protocols like OSPF or BGP to automatically advertise a default route down to all the internal branch routers, saving the admin from configuring it manually everywhere.

## Practical Examples
- **Home Networks:** When you connect to Wi-Fi, DHCP hands your phone an IP address and a Default Gateway. That Gateway is simply setting the `0.0.0.0/0` route on your phone, pointing it to your Wi-Fi router.
- **Stub Networks:** A small branch office connected to headquarters via a single T1 line doesn't need to know the complex internal routing of the HQ data center. The branch router just uses a single Default Route pointing back to HQ for everything.

## Security Considerations
- **Egress Filtering:** A default route sends *everything* unknown to the Internet. If internal malware tries to communicate with a random C2 server, the default route will happily facilitate it. Security relies on placing a strict firewall in the path of the default route to block unauthorized outbound traffic (Egress Filtering).
- **Default Route Hijacking:** If an attacker manages to inject a malicious Default Route into an internal dynamic routing protocol (like OSPF), they can force all outbound Internet traffic in the enterprise to route through the attacker's machine first.

## Commands / Configuration Examples
### Cisco IOS
```text
! Configure a static IPv4 default route pointing to the ISP's IP
ip route 0.0.0.0 0.0.0.0 203.0.113.1

! Configure a static IPv6 default route
ipv6 route ::/0 2001:db8:acad::1

! Tell OSPF to advertise this default route to all internal routers
router ospf 1
 default-information originate
```

### Linux
```bash
# View the routing table, looking for the 'default' line
ip route show

# Manually add a default route
sudo ip route add default via 192.168.1.1
```

### Windows
```powershell
# In Windows 'route print', the default route is the very first line:
# Network Destination        Netmask          Gateway
#           0.0.0.0          0.0.0.0      192.168.1.1
route print
```

## Troubleshooting
- **No Internet Access:** The most common cause is a missing default route. If `show ip route` does not contain a `Gateway of last resort` or a `0.0.0.0/0` entry, the router will drop all external traffic.
- **Routing Loops:** If two core routers both have default routes pointing at each other, unknown traffic will bounce between them in a circle until the packet's TTL expires.

## Interview Questions
- How is a default route written in IPv4 and IPv6 notation?
- Why will a router always prefer a specific route over a default route?
- What command is used in OSPF to share a default route with the rest of the network?
- What is a Gateway of Last Resort?

## Summary
The Default Route is the network's safety net. By providing a catch-all path for unknown destinations, it keeps routing tables infinitely smaller and allows disparate local networks to easily access the vast, unpredictable landscape of the Internet.

## References
- [Routing Table](routing-table.md)
- [Static Routing](static-routing.md)
- [CIDR](../04-ip-addressing/cidr.md)
