# Bandwidth

> Bandwidth is the maximum capacity of a link to carry data over time.

## Overview
Bandwidth is often described as the size of a network pipe. A larger pipe can carry more data at once, but the real-world speed depends on many other factors.

Bandwidth is usually measured in bits per second, such as Mbps or Gbps.

## Why It Matters
Bandwidth affects:
- File transfer times
- Video quality
- Backup windows
- Cloud replication
- User experience during busy periods

In security work, bandwidth also affects the speed of exfiltration, scanning, and log collection.

## Core Concepts
- Bandwidth is capacity, not actual speed
- Throughput is the actual achieved rate
- Higher bandwidth does not guarantee lower latency
- Shared media can reduce effective bandwidth per device

## How It Works
A link has a physical or logical upper limit determined by the medium, interface speed, and protocol overhead.

For example:
- A 1 Gbps Ethernet link can theoretically carry up to 1 Gbps
- Real throughput is lower because of framing, protocol overhead, and congestion
- Wireless bandwidth changes depending on signal quality, channel use, and modulation

## Components / Types
- Link speed
- Available capacity
- Shared capacity
- Symmetric vs asymmetric bandwidth
- Burst bandwidth in cloud or ISP services

## Practical Examples
- A home Internet plan advertises 500 Mbps download bandwidth.
- A data center uplink may run at 10 Gbps.
- A backup job may saturate bandwidth and slow down other applications.
- A VPN tunnel may reduce usable bandwidth because of encryption overhead.

## Security Considerations
- Attackers can abuse bandwidth for exfiltration or DDoS.
- Defenders may use bandwidth monitoring to spot anomalies.
- Encapsulation and encryption can reduce effective capacity.
- Rate limiting and QoS help protect critical traffic.

## Commands / Configuration Examples
### Linux
```bash
ethtool eth0
iperf3 -c 192.0.2.10
```

### Windows
```powershell
Get-NetAdapterStatistics
```

### Cisco IOS
```text
show interfaces gigabitEthernet0/1
show policy-map interface
```

## Troubleshooting
- Is the link negotiating at the expected speed?
- Is congestion reducing actual throughput?
- Is wireless interference lowering usable capacity?
- Is the ISP limiting performance?

## Interview Questions
- What is the difference between bandwidth and throughput?
- Why does higher bandwidth not always improve user experience?
- How do VPNs affect bandwidth?
- What tools can you use to measure bandwidth?

## Summary
Bandwidth is the maximum carrying capacity of a network link. It is a design limit, not a guarantee of real-world performance.

## References
- [Throughput](throughput.md)
- [Latency](latency.md)
- [Jitter](jitter.md)
- [IPv6 Transition Mechanisms](../04-ip-addressing/ipv6-transition-mechanisms.md)
