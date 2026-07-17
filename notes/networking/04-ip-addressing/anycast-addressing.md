# Anycast Addressing

> Anycast is a routing technique where a single IP address is shared across multiple servers in different physical locations, and the network routes the user to the closest available server.

## Overview
In traditional networking (Unicast), one IP address points to exactly one specific server. **Anycast** breaks this rule intentionally. With Anycast, you assign the *exact same* Public IP address to ten different servers sitting in ten different data centers around the world. 

When a user in Tokyo requests data from that IP, global routers use standard routing metrics to determine that the Tokyo data center is 3 hops away, while the New York data center is 15 hops away. The network automatically delivers the packet to the Tokyo server.

## Why It Matters
Anycast is the secret sauce behind the speed and resilience of the modern Internet. It is used by Content Delivery Networks (CDNs) and global DNS providers to guarantee incredibly fast response times and massive DDoS resilience. Understanding Anycast is vital for cloud architects and cybersecurity professionals analyzing global traffic flows.

## Core Concepts
- **One-to-Closest:** Anycast provides one-to-one communication, but the network decides *which* "one" receives the packet based on routing distance (BGP shortest path).
- **Shared IP:** Multiple distinct physical devices advertise the same IP address.
- **Stateless Best Fit:** Anycast works flawlessly for stateless protocols (like UDP DNS requests). It is trickier, but entirely possible, to use for stateful protocols (like TCP/HTTPS) with modern CDN configurations.

## How It Works
1. Google operates DNS server `8.8.8.8` in 50 different data centers globally.
2. The routers in all 50 data centers use BGP to advertise to the Internet: "I know how to get to `8.8.8.8`."
3. A user in London types `google.com`. Their PC sends a DNS request to `8.8.8.8`.
4. The user's ISP looks at its BGP routing table. It sees 50 different paths to `8.8.8.8`.
5. The ISP picks the path with the shortest routing metric (which happens to lead to the London data center) and forwards the packet there. 
6. If the London data center goes offline, the ISP's routing table updates, and the user's next packet is automatically routed to the next closest server, perhaps in Frankfurt.

## Components / Types
- **Global Anycast:** Used on the public Internet via BGP (e.g., Cloudflare, Cloud DNS, Root DNS servers).
- **Local/Internal Anycast:** Used inside large enterprise data centers (often via OSPF) to load-balance traffic to internal DNS or syslog servers.
- **IPv6 Anycast:** Anycast is built natively into the IPv6 standard, whereas in IPv4 it is effectively a routing "trick."

## Practical Examples
- **1.1.1.1 and 8.8.8.8:** These are Anycast addresses. You aren't reaching a single magic server in a basement somewhere; you are reaching a cluster of servers in the specific city closest to you.
- **CDNs (Content Delivery Networks):** Cloudflare and Fastly assign your website an Anycast IP. When users request your images, the Anycast routing ensures the image is served from a cache in their geographic region, slashing latency.

## Security Considerations
Anycast provides massive inherent security benefits against Distributed Denial of Service (DDoS) attacks:
- **DDoS Mitigation:** If a botnet of 100,000 infected IoT devices worldwide launches a DDoS attack against an Anycast IP, the attack doesn't concentrate on one server. The attack is naturally split up and absorbed by the 50 different data centers worldwide based on the geographic location of the bots. The attack becomes highly localized and manageable.
- **Sinkholing / BGP Hijacking:** Because Anycast relies purely on routing announcements, an attacker who successfully executes a BGP Route Hijack can announce a shorter path to a target's Anycast IP, silently stealing all traffic from a specific region.

## Commands / Configuration Examples
Anycast is not a configuration on a server's network card; it is achieved entirely through routing protocol configurations (BGP/OSPF).

### Linux (Observing Anycast)
You can prove Anycast is working by using `traceroute` from different geographical locations (using a cloud VM) and watching the traffic route to entirely different endpoints.
```bash
# Trace route to Google DNS
traceroute 8.8.8.8
```

## Troubleshooting
- **TCP Connection Resets:** If routing metrics fluctuate rapidly (Route Flapping), a user's packets might be sent to Data Center A, and a second later, their packets are sent to Data Center B. Because Data Center B doesn't know about the TCP handshake that occurred with Data Center A, it drops the connection. This is why Anycast is easiest with UDP.
- **Geographic Misrouting:** Sometimes BGP paths don't match geographic reality. Due to ISP peering agreements, a user in Texas might be routed to an Anycast node in London rather than Dallas, causing high latency.

## Interview Questions
- Describe the difference between Unicast, Multicast, and Anycast.
- Explain how Anycast helps mitigate DDoS attacks.
- Why is Anycast natively better suited for UDP traffic (like DNS) than TCP traffic?
- How do Content Delivery Networks (CDNs) utilize Anycast?

## Summary
Anycast is a brilliant application of dynamic routing. By allowing multiple geographic servers to share a single IP address, Anycast drastically reduces latency for global users, guarantees high availability, and provides robust, natural defense against DDoS attacks.

## References
- [IPv4 Addressing](ipv4-addressing.md)
- [BGP](../05-routing/bgp.md)
- [DNS](../06-network-protocols/dns.md)
- [CDN Security](../02-web-architecture/cdn.md)
