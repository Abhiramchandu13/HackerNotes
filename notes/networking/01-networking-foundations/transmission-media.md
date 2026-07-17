# Transmission Media

> Transmission media is the physical or wireless path that carries signals between devices.

## Overview
Transmission media is how network data gets from one point to another. It can be copper cable, fiber optic cable, or wireless radio.

Choosing the right medium matters for speed, distance, interference resistance, and security.

## Why It Matters
Different media support different use cases:
- Copper is inexpensive and common for short runs
- Fiber supports long distances and high bandwidth
- Wireless provides mobility and flexibility

Security teams care because physical media affects interception risk, reliability, and attack surface.

## Core Concepts
- Guided media: signals travel through a cable or other physical path
- Unguided media: signals travel through air or space
- Attenuation: signal loss over distance
- Interference: unwanted noise that affects signal quality
- Bandwidth and throughput depend partly on the medium

## How It Works
### Copper
Electrical signals travel across twisted pairs or coaxial cable. The medium is susceptible to electromagnetic interference, especially over longer distances.

### Fiber
Light pulses travel through glass or plastic fibers. Fiber is faster, supports longer distances, and resists interference.

### Wireless
Radio waves carry data through the air. Wireless provides flexibility but has shared-spectrum challenges and greater exposure to interception.

## Components / Types
### Copper Media
- UTP: Unshielded Twisted Pair
- STP: Shielded Twisted Pair
- Coaxial cable

### Fiber Media
- Multimode fiber
- Single-mode fiber

### Wireless Media
- Wi-Fi
- Bluetooth
- Cellular networks
- Microwave links
- Satellite links

## Practical Examples
- Ethernet in an office uses copper twisted pair.
- A data center backbone may use single-mode fiber.
- A laptop connects to an access point using Wi-Fi.
- A remote site may connect over a microwave radio link.

## Security Considerations
- Copper and fiber can be tapped physically.
- Wireless can be intercepted if encryption is weak.
- EMI and poor cabling can cause packet loss and retransmissions.
- Cable plant documentation helps detect unauthorized changes.

## Commands / Configuration Examples
### Linux
```bash
ethtool eth0
ip link show
```

### Windows
```powershell
Get-NetAdapter
Get-NetAdapterStatistics
```

### Cisco IOS
```text
show interfaces
show controllers ethernet-controller
```

## Troubleshooting
- Is the cable type correct for the distance?
- Is the link speed negotiating as expected?
- Is there interference or excessive attenuation?
- Is the wireless signal strong enough?

## Interview Questions
- What are the main types of transmission media?
- Why is fiber preferred for long distances?
- When would you choose copper over fiber?
- What is the security risk of wireless media?

## Summary
Transmission media is the path data takes across a network. Copper, fiber, and wireless each have different strengths, limits, and security concerns.

## References
- [Cables and Connectors](cables-and-connectors.md)
- [Signal Propagation](signal-propagation.md)
- [Wi-Fi Basics](../08-wireless-networking/wifi-basics.md)
