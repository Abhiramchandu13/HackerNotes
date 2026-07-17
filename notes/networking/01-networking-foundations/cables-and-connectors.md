# Cables and Connectors

> Cables and connectors physically attach devices and determine how signals enter and leave network equipment.

## Overview
A network link is only as good as the cable and connector that carry it. Good cabling reduces errors, improves throughput, and makes troubleshooting easier.

This topic covers the common copper, fiber, and connector types used in modern networking.

## Why It Matters
Bad cabling causes:
- Link drops
- Packet loss
- Interference
- Slow performance
- Intermittent outages

In security work, cable plants matter because unauthorized patching, tap devices, or damaged cabling can create exposure.

## Core Concepts
- Copper uses electrical signaling
- Fiber uses light signaling
- Connectors must match the medium and device port
- Poor terminations can cause signal loss or reflections
- Cable standards determine maximum distance and speed

## How It Works
Signals travel through a conductor or fiber and exit through a connector.

Key considerations:
1. The cable category must match the speed requirement.
2. The connector must fit the port and medium.
3. The cable must be installed within length and bend limits.
4. Shielding and pairing help reduce noise.

## Components / Types
### Copper Cables
- UTP
- STP
- Cat5e
- Cat6
- Cat6a
- Coaxial cable

### Fiber Cables
- Multimode fiber
- Single-mode fiber

### Common Connectors
- RJ-45
- LC
- SC
- ST
- MPO/MTP
- BNC

## Practical Examples
- Office Ethernet ports often use Cat6 with RJ-45 connectors.
- Data centers commonly use fiber between switches.
- Coaxial cable may still appear in broadband or specialized environments.

## Security Considerations
- Cable taps can capture traffic if physical access is available.
- Unlabeled patch panels make unauthorized changes harder to detect.
- Fiber is harder to tap than copper, but not impossible.
- Cable management supports incident response and change control.

## Commands / Configuration Examples
### Linux
```bash
ethtool eth0
lshw -class network
```

### Windows
```powershell
Get-NetAdapter
Get-CimInstance Win32_NetworkAdapter
```

### Cisco IOS
```text
show interfaces
show inventory
```

## Troubleshooting
- Is the cable seated properly?
- Is the connector type correct?
- Is the cable damaged, bent, or too long?
- Is the link LED on?
- Is the negotiated speed as expected?

## Interview Questions
- What is the difference between copper and fiber cabling?
- When would you use Cat6a instead of Cat5e?
- Why are fiber connectors important in data centers?
- How can cable issues appear at the network layer?

## Summary
Cables and connectors are simple but critical. They influence performance, reliability, and physical security across the entire network.

## References
- [Transmission Media](transmission-media.md)
- [Signal Propagation](signal-propagation.md)
- [Ethernet](../03-ethernet-and-switching/ethernet.md)
