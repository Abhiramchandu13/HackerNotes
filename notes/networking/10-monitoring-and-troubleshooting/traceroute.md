# traceroute

> traceroute is a diagnostic utility that maps the exact Layer 3 path (router hops) a packet takes to reach a destination, using increasing ICMP TTL values to force error reporting.

## Overview
When a network connection is down or slow, `ping` can tell you that a connection failed, but it cannot tell you *where* it failed. **traceroute** (named `tracert` in Windows) solves this. Operating at the **Network Layer (Layer 3)**, it lists every single router hop between your computer and the target, revealing exactly where latency spikes or where packets are dropped.

## Why It Matters
For network engineers, traceroute is the primary tool for diagnosing WAN and internet routing issues. If you are experiencing high latency, traceroute will pinpoint the exact router or ISP hop causing the delay. For cybersecurity professionals, it maps network topologies, helping to identify border firewalls and external entry points.

## Core Concepts
- **TTL (Time to Live):** A field in the IP header designed to prevent loops. Every router that forwards a packet decrements the TTL by 1. If a router receives a packet with a TTL of 1, it drops the packet and sends an **ICMP Type 11 (Time Exceeded)** message back to the sender.
- **Traceroute Trick:** Traceroute intentionally exploits this behavior. It sends a sequence of packets with increasing TTL values (first packet TTL=1, second TTL=2, third TTL=3) to force each router along the path to drop the packet and reveal its IP address.
- **Probe Types:** 
  - *Linux/Unix:* Defaults to sending **UDP** packets on high ports (33434+).
  - *Windows (tracert):* Defaults to sending **ICMP Echo Requests** (like ping).

## How It Works
1. You run `traceroute 8.8.8.8`.
2. **Hop 1:** Your PC sends a packet with TTL=1. It reaches the local router. The router decrements TTL to 0, drops the packet, and sends back an ICMP Type 11 (Time Exceeded). Your PC records the router's IP and RTT.
3. **Hop 2:** Your PC sends a packet with TTL=2. It passes through the local router (TTL becomes 1) and reaches the ISP router. The ISP router drops it (TTL=0) and sends an ICMP Type 11. Your PC records the IP.
4. **Hop 3+:** This continues, increasing the TTL by 1 each time, until the packet finally reaches the target (`8.8.8.8`).
5. **The End:** The target receives the packet. Since it is the final destination, it replies with an ICMP Echo Reply (or ICMP Port Unreachable if using UDP), and the trace stops.

## Components / Types
- **traceroute (Linux/macOS):** Command-line tool using UDP probes by default. Can be forced to use ICMP (`-I`) or TCP (`-T`).
- **tracert (Windows):** Command-line tool using ICMP Echo Requests by default.
- **mtr (My Traceroute):** A modern, interactive Linux tool that combines `ping` and `traceroute` into a real-time updating dashboard, ideal for diagnosing packet loss.

## Practical Examples
- **Locating an ISP Outage:** A company's branch office cannot reach the cloud server. The admin runs `traceroute`. The trace shows hops 1 through 4 (internal routers) are fine with 2ms latency. Hop 5 (the ISP gateway) responds in 10ms. Hop 6 displays `* * *` (asterisks) and the trace stalls. The admin immediately knows the outage is at the ISP's boundary, not inside the corporate network.

## Security Considerations
- **Firewall Blocking:** Modern firewalls frequently block ICMP Type 11 (Time Exceeded) messages or ignore UDP probes. When this happens, traceroute will display asterisks (`* * *`) for those hops, hiding the firewall's IP.
- **Network Reconnaissance:** Attackers run traceroute to map out the external network boundaries of a company, identifying the ISPs, routers, and edge firewalls.
- **TCP Traceroute:** Because many firewalls block UDP/ICMP probes, pentesters use TCP traceroute (`traceroute -T` or `tcptraceroute`) targeting Port 80 or 443. Firewalls must allow web traffic through, so they are forced to process and decrement the TTL, revealing their existence.

## Commands / Configuration Examples
### Linux
```bash
# Standard traceroute using UDP (requires root for some options)
traceroute 8.8.8.8

# Force traceroute to use ICMP (like Windows)
traceroute -I 8.8.8.8

# Use TCP on port 443 to bypass firewalls
sudo traceroute -T -p 443 8.8.8.8

# Run the interactive MTR tool
mtr 8.8.8.8
```

### Windows
```powershell
# Windows equivalent (uses ICMP by default)
tracert 8.8.8.8

# Force tracert to not resolve IPs to hostnames (runs much faster)
tracert -d 8.8.8.8
```

## Troubleshooting
- **All Hops After X are Asterisks (`* * *`):** The packet reached hop X successfully, but the next router in the path (or a firewall) is silently dropping the packets or blocking the returning ICMP Type 11 error messages. 
- **High Latency at One Hop:** If hop 5 suddenly jumps from 10ms to 200ms, but hop 6 drops back to 12ms, the delay is *not* a network issue. It means the router at hop 5 is busy and prioritizing routing data packets over replying to diagnostic traceroute packets. Real network latency continues to propagate downstream (meaning if hop 5 is slow, all subsequent hops 6, 7, and 8 would also show 200ms+ delay).

## Interview Questions
- Explain how `traceroute` uses the IP TTL field to map a network path.
- What ICMP message type is returned by intermediate routers during a traceroute? (Answer: ICMP Type 11 - Time Exceeded).
- What is the difference between how `traceroute` works on Linux vs `tracert` on Windows? (Answer: Linux uses UDP probes on high ports by default; Windows uses ICMP Echo Requests).
- What does it mean if you see asterisks (`* * *`) in a traceroute output?

## Summary
`traceroute` is the ultimate path-mapping diagnostic. By exploiting the loop-prevention mechanics of the IP TTL field, it forces every router along a path to identify itself, providing network administrators with the visibility needed to isolate routing failures and latency bottlenecks.

## References
- [ICMP](../06-network-protocols/icmp.md)
- [Ping](ping.md)
- [Troubleshooting Methodology](troubleshooting-methodology.md)
