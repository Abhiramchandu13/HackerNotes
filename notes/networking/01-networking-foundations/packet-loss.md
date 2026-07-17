# Packet Loss

> Packet loss happens when one or more network packets fail to reach their destination.

## Overview
Packet loss means data was sent but did not arrive, arrived too late to be useful, or was discarded by a device or application.

A small amount of loss may be tolerated by some protocols, but heavy loss causes retransmissions, poor quality, and application failures.

## Why It Matters
Packet loss affects:
- File transfers and downloads
- Voice and video quality
- TCP performance
- Real-time applications
- Monitoring and security telemetry

Loss often points to congestion, bad cabling, Wi-Fi interference, or failing hardware.

## Core Concepts
- Loss can occur on the sender, network, or receiver side
- TCP retransmits lost packets
- UDP usually does not retransmit automatically
- Loss is measured as a percentage of packets
- Even low loss can noticeably affect voice and video

## How It Works
Packets may be lost because of:
1. Congested queues dropping traffic
2. Physical errors on links
3. Wireless interference or weak signal
4. MTU or fragmentation issues
5. Firewall or ACL drops
6. Device overload

## Components / Types
- Random loss
- Burst loss
- Interface errors
- Wireless loss
- Queue drops

## Practical Examples
- A video call freezes when the wireless signal degrades.
- A file transfer slows down because the router is dropping packets.
- A VPN tunnel experiences retransmissions due to MTU mismatch.

## Security Considerations
- Loss can hide data exfiltration attempts if monitoring is incomplete.
- Attackers may use DoS to create packet loss intentionally.
- Packet loss metrics can reveal link degradation or malicious interference.
- Logging and IDS sensors may miss traffic during severe loss.

## Commands / Configuration Examples
### Linux
```bash
ping -c 20 8.8.8.8
mtr 8.8.8.8
```

### Windows
```powershell
ping -n 20 8.8.8.8
pathping 8.8.8.8
```

### Cisco IOS
```text
show interfaces
show interfaces counters errors
```

## Troubleshooting
- Are there interface errors or CRC errors?
- Is the wireless signal weak?
- Is a firewall dropping traffic?
- Is the MTU set correctly?
- Is the link saturated?

## Interview Questions
- What causes packet loss?
- Why does packet loss affect voice more than file downloads?
- How does TCP react to loss?
- How do you troubleshoot packet loss?

## Summary
Packet loss is a clear sign of trouble. It may point to congestion, physical errors, wireless issues, or security controls.

## References
- [Latency](latency.md)
- [Jitter](jitter.md)
- [MTU](mtu.md)
- [Troubleshooting Methodology](../10-monitoring-and-troubleshooting/troubleshooting-methodology.md)
