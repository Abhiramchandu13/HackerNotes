# Signal Propagation

> Signal propagation describes how electrical, optical, or radio signals travel through a medium.

## Overview
When data moves across a network, it is converted into signals. Those signals behave differently depending on the medium and environment.

Understanding propagation helps explain noise, range, attenuation, latency, and wireless coverage.

## Why It Matters
Poor signal propagation causes:
- Packet loss
- Retransmissions
- Slow connections
- Dropped wireless clients
- False troubleshooting conclusions

A network may look fine at the logical layer while the physical signal is failing.

## Core Concepts
- Propagation delay: time for a signal to travel from sender to receiver
- Attenuation: signal weakens with distance
- Reflection: signal bounces off boundaries
- Refraction: signal bends when medium changes
- Interference: noise from nearby devices or environments
- Noise floor: background signal level that affects reception

## How It Works
Signals behave differently by medium:
1. Copper uses voltage changes.
2. Fiber uses pulses of light.
3. Wireless uses electromagnetic waves.
4. The receiver must detect and decode the signal reliably.
5. If noise or attenuation is too high, errors increase.

Propagation delay is important in WANs, satellite links, and large data centers.

## Components / Types
### Electrical Signals
Used on copper cabling. Sensitive to EMI and crosstalk.

### Optical Signals
Used on fiber. Resists EMI but still has connector and bend-radius limits.

### Radio Signals
Used on Wi-Fi and cellular networks. Sensitive to walls, distance, channel congestion, and weather.

## Practical Examples
- Wi-Fi speed drops in a conference room due to interference and reflections.
- Long copper runs cause attenuation and can reduce link quality.
- Fiber links between buildings have better resistance to EMI.
- Satellite communication has visible latency because propagation distance is large.

## Security Considerations
- Signal leakage can make wireless networks easier to detect and attack.
- Poor shielding can increase susceptibility to interference.
- Physical cable tapping can expose traffic.
- Directional antennas and careful placement reduce unwanted propagation outside secure areas.

## Commands / Configuration Examples
### Linux
```bash
iw dev
ip link show
```

### Windows
```powershell
netsh wlan show interfaces
```

### Cisco IOS
```text
show interfaces wireless
show controllers dot11Radio 0
```

## Troubleshooting
- Is there too much distance for the medium?
- Is the antenna placement correct?
- Are there walls, metal, or machinery causing interference?
- Are wireless channels overlapping?

## Interview Questions
- What is attenuation?
- How does signal propagation differ between copper and fiber?
- Why does wireless performance vary by environment?
- What causes propagation delay?

## Summary
Signal propagation explains how real-world conditions affect network communication. It is the bridge between physical design and network performance.

## References
- [Transmission Media](transmission-media.md)
- [Latency](latency.md)
- [Jitter](jitter.md)
- [Wi-Fi Basics](../08-wireless-networking/wifi-basics.md)
