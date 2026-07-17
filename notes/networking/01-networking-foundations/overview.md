# Overview

> The networking overview is the big picture of how devices, protocols, and infrastructure work together.

## Overview
This note ties together the foundational ideas in the phase. Networking is not one concept; it is a stack of concepts that includes scope, media, timing, addressing, and transport.

This overview should help you connect the basics before moving into OSI, Ethernet, IP, routing, and protocols.

## Why It Matters
A lot of early networking confusion comes from mixing layers and terminology.

For example:
- Bandwidth is not the same as throughput
- Latency is not the same as jitter
- MTU is not the same as MSS
- Internet, intranet, and extranet are different trust boundaries, not just names

A clear mental model reduces errors during troubleshooting and design.

## Core Concepts
- Networks are built from components, media, and protocols
- Traffic has a source, destination, and path
- Performance depends on capacity, delay, and loss
- Security depends on segmentation, identity, and inspection

## How It Works
When a device communicates, it usually moves through these broad stages:
1. It connects to the network via copper, fiber, or wireless.
2. It receives a network configuration.
3. It resolves names and determines the path.
4. It sends traffic using transport and application protocols.
5. Security controls inspect, allow, or block traffic.

## Components / Types
The major foundational themes in this phase are:
- Network scope and network types
- Trust boundaries
- Client-server and peer-to-peer models
- Physical media and signal behavior
- Performance metrics
- Standards organizations

## Practical Examples
- A remote worker uses VPN to extend secure access to an intranet.
- A branch office uses WAN links to reach a central data center.
- A wireless office network relies on signal quality and channel planning.
- A SOC analyst reviews packet loss and latency to determine whether a network problem is operational or malicious.

## Security Considerations
- Unclear trust boundaries create exposure.
- Weak cabling or wireless design can leak data or create instability.
- Poor performance can mask attacks or delay detection.
- Standards help establish safe defaults.

## Commands / Configuration Examples
### Linux
```bash
ip a
ip r
ping -c 3 1.1.1.1
```

### Windows
```powershell
ipconfig /all
route print
```

### Cisco IOS
```text
show ip interface brief
show ip route
```

## Troubleshooting
Use this checklist:
- Is the network type correct for the use case?
- Is the media appropriate for the distance and speed?
- Are latency and jitter within normal ranges?
- Are you checking the right trust boundary?

## Interview Questions
- What are the most important foundational concepts in networking?
- Why do we care about latency, jitter, and throughput separately?
- How do standards organizations influence networking?
- How do you explain networking to a non-technical person?

## Summary
Networking fundamentals provide the vocabulary and mental model for every later topic. If this overview makes sense, the rest of the phase will be much easier.

## References
- [What is Networking](what-is-networking.md)
- [Network Types](network-types.md)
- [OSI and TCP/IP Models](../02-osi-and-tcpip-models/osi-model-overview.md)
