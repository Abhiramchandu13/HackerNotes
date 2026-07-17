# Latency

> Latency is the time it takes for data to travel from source to destination.

## Overview
Latency is delay. Even if bandwidth is high, high latency can make systems feel slow or unresponsive.

It is usually measured in milliseconds.

## Why It Matters
Latency affects:
- Web page responsiveness
- Voice and video quality
- Remote desktop performance
- API calls
- Multiplayer gaming
- Cloud application behavior

For security professionals, latency can also affect beaconing analysis, packet timing, and distributed control planes.

## Core Concepts
- Propagation delay: time for the signal to travel
- Processing delay: time spent handling the packet
- Queueing delay: time spent waiting in a buffer
- Transmission delay: time required to place bits onto the link
- Round-trip time (RTT): time to send a packet and get a reply

## How It Works
Latency comes from multiple sources:
1. The physical distance the packet travels
2. The number of devices in the path
3. The amount of traffic in queues
4. The speed of the devices processing traffic
5. The protocol behavior, such as handshakes and retransmissions

A nearby server may still feel slow if the application adds processing delay.

## Components / Types
- One-way latency
- Round-trip latency
- Propagation latency
- Network latency
- Application latency

## Practical Examples
- A local LAN ping may be 1 ms or less.
- A remote cloud region can add noticeable latency.
- Video conferencing may remain usable with moderate latency but poor with high jitter.
- A database query across continents may be slow even on a fast link.

## Security Considerations
- Attackers may use timing differences to infer network paths.
- High latency can complicate detection and response.
- Distributed systems and tunnels may hide the real source of delay.
- Timing anomalies can indicate congestion or malicious traffic.

## Commands / Configuration Examples
### Linux
```bash
ping -c 4 8.8.8.8
traceroute 8.8.8.8
```

### Windows
```powershell
ping 8.8.8.8
tracert 8.8.8.8
```

### Cisco IOS
```text
ping 8.8.8.8
traceroute 8.8.8.8
```

## Troubleshooting
- Is the issue on the local network or across the WAN?
- Does latency increase at a specific hop?
- Is the application itself slow?
- Is the path going through a VPN, proxy, or distant cloud region?

## Interview Questions
- What is latency?
- Why can a fast bandwidth connection still feel slow?
- What is RTT?
- Which network devices can increase latency?

## Summary
Latency is the delay between sending and receiving data. It is a critical performance metric for interactive applications and network troubleshooting.

## References
- [Bandwidth](bandwidth.md)
- [Throughput](throughput.md)
- [Jitter](jitter.md)
- [traceroute](../10-monitoring-and-troubleshooting/traceroute.md)
