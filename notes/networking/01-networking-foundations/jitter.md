# Jitter

> Jitter is the variation in packet delay over time.

## Overview
Jitter describes how inconsistent latency is. A network can have acceptable average latency but still perform poorly if the delay changes too much between packets.

This is especially important for voice, video, and real-time collaboration.

## Why It Matters
Real-time applications need steady packet delivery.

High jitter can cause:
- Choppy VoIP calls
- Video freezes or artifacts
- Poor streaming quality
- Unstable remote sessions
- Packet buffering and dropouts

Security and monitoring tools may also experience unreliable timing under high jitter.

## Core Concepts
- Low jitter means stable delay
- High jitter means variable delay
- Buffering is often used to smooth jitter
- Jitter is measured in milliseconds

## How It Works
Jitter can be caused by:
1. Congestion and queueing
2. Route changes
3. Wireless interference
4. Load balancer behavior
5. CPU or interface instability
6. Competing traffic on shared links

Voice and video systems often add jitter buffers to smooth variable arrival times.

## Components / Types
- Network jitter
- Application jitter
- VoIP jitter
- Wireless jitter

## Practical Examples
- A Zoom call may sound robotic during peak network usage.
- A Wi-Fi client near the edge of coverage may experience variable jitter.
- A branch office with a congested WAN link may see choppy voice quality.

## Security Considerations
- Attackers may create jitter to disrupt communications.
- Congested links can hide suspicious traffic patterns.
- Variability in packet timing can reveal path instability or traffic shaping.
- Real-time security services should account for jitter in alert thresholds.

## Commands / Configuration Examples
### Linux
```bash
mtr 8.8.8.8
ping -i 0.2 8.8.8.8
```

### Windows
```powershell
pathping 8.8.8.8
```

### Cisco IOS
```text
show policy-map interface
show interfaces
```

## Troubleshooting
- Is jitter constant or intermittent?
- Does it happen on wired and wireless clients?
- Does it correlate with high traffic or specific times?
- Is the issue inside the LAN or on the WAN?

## Interview Questions
- What is jitter?
- Why is jitter important for VoIP?
- How do you reduce jitter?
- What is the difference between latency and jitter?

## Summary
Jitter is the consistency of delay, not just the delay itself. Low jitter is crucial for stable real-time communications.

## References
- [Latency](latency.md)
- [Throughput](throughput.md)
- [Packet Loss](packet-loss.md)
- [Wireless Basics](../08-wireless-networking/wifi-basics.md)
