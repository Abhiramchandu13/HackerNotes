# Repeater

> A repeater is a Layer 1 network device that receives a degraded physical signal, regenerates it to its original strength, and transmits it further down the line.

## Overview
Every physical networking medium—whether a copper Ethernet cable, a fiber optic strand, or a Wi-Fi radio wave—suffers from **Attenuation**. Attenuation is the natural loss of signal strength over distance. For example, standard copper Ethernet (Cat6) can only carry a usable signal for 100 meters (328 feet). 

If you need to connect a building 150 meters away, you use a **Repeater**. Operating strictly at the **Physical Layer (Layer 1)**, a repeater is a "dumb" device. It doesn't read MAC addresses or IP addresses; it simply listens for a weak electrical or optical signal, cleans it up, amplifies it, and blasts it out the other side.

## Why It Matters
While standalone hardware repeaters are rare in modern office LANs (having been replaced by switches, which inherently repeat signals), the concept is crucial in long-haul networking, subsea fiber optics, and wireless deployments. Understanding how and why signals degrade—and how to extend them—is fundamental to physical network design.

## Core Concepts
- **Layer 1 Operation:** Repeaters do not make routing or switching decisions. They just repeat bits (1s and 0s).
- **Signal Regeneration:** Unlike a simple audio amplifier that amplifies both the music and the static noise, a true digital repeater reads the incoming binary signal, strips out the background noise, and creates a brand-new, perfectly clean digital signal to send forward.
- **Collision Domains:** Because repeaters operate at Layer 1, they do *not* divide collision domains. A network connected by repeaters behaves like one giant shared wire.

## How It Works
1. A switch sends an Ethernet frame down a 90-meter copper cable.
2. The electrical voltage degrades heavily due to resistance in the copper wire.
3. The signal hits the Repeater at the 90-meter mark.
4. The Repeater detects the faint 1s and 0s. It reconstructs the signal back to full voltage specifications.
5. The Repeater transmits the clean signal down the next 90-meter cable segment, allowing the data to successfully reach a server 180 meters away.

## Components / Types
- **Optical Repeaters:** Used in long-haul and transoceanic fiber-optic cables. Light naturally fades over hundreds of kilometers. Underwater optical repeaters are placed periodically to boost the lasers, ensuring cross-continent Internet connectivity.
- **Wireless Repeaters (Range Extenders):** Extremely common in large homes or warehouses. They receive a weak Wi-Fi signal from the main router and re-broadcast it. (Note: These often halve the effective wireless bandwidth because the radio must spend half its time talking to the router, and half its time talking to the client).
- **Hubs:** A hub is formally defined as a "multi-port repeater."

## Practical Examples
- **Campus Networking:** An IT closet needs to connect to a security camera on the far perimeter fence, 160 meters away. Rather than laying expensive fiber optics, an engineer places a small, PoE-powered Ethernet repeater at the 80-meter mark to push the copper signal the rest of the way.
- **Submarine Cables:** The massive fiber optic cables crossing the Atlantic Ocean require powerful optical repeaters powered by thousands of volts of electricity running through the cable sheathing itself.

## Security Considerations
Repeaters are generally "invisible" Layer 1 devices, meaning they have no IP address to hack.
- **Physical Tapping:** Because repeaters amplify signals and sit in the middle of long cable runs, they are ideal physical locations for an attacker to attach a network tap to intercept unencrypted traffic without causing noticeable signal loss at the endpoints.
- **Wireless Extension Vulnerabilities:** Wireless repeaters often require configuring the main Wi-Fi password on the repeater itself. If the repeater relies on weak encryption (like WEP or WPA) or has an unpatched management interface, it serves as a weak backdoor into the main corporate wireless network.

## Commands / Configuration Examples
Hardware Ethernet repeaters are unmanaged Layer 1 devices with zero configuration commands. You plug them in, and they work.

For Wireless Repeaters, configuration is usually done via a web GUI, but their presence can be inferred through Wi-Fi scanning tools.

### Linux (Detecting Wireless Repeaters)
```bash
# Scanning for Wi-Fi networks. If you see two networks with the exact same SSID 
# but different BSSIDs (MAC addresses) and signal strengths, one is likely a repeater.
nmcli dev wifi list
```

## Troubleshooting
- **Latency Increases:** Every repeater adds a tiny amount of processing delay. Daisy-chaining 5 repeaters together to cross a massive warehouse can result in noticeable latency or timing issues for sensitive protocols.
- **Late Collisions:** In legacy half-duplex networks, the Ethernet standard (CSMA/CD) relies on strict timing to detect collisions. If you use too many repeaters, the cable run becomes so long that a PC sending a packet won't realize a collision happened at the far end until it has already finished transmitting. This "late collision" breaks the network. This is known as the "5-4-3 Rule" limit in early Ethernet design.

## Interview Questions
- At what layer of the OSI model does a repeater operate? (Answer: Layer 1).
- What is the difference between an amplifier and a digital repeater? (Answer: An amplifier boosts the signal and the noise. A digital repeater reconstructs a clean signal, removing the noise).
- Does a repeater divide a collision domain or a broadcast domain? (Answer: Neither).
- Why do wireless range extenders often halve the effective throughput for connected clients?

## Summary
The repeater solves the physical limitations of transmission media. By receiving, cleaning, and regenerating fading signals, repeaters extend the geographic reach of networks. While mostly absorbed into the functionality of modern switches for copper LANs, they remain a vital architectural component for global fiber optics and wireless coverage.

## References
- [Hub](hub.md)
- [Physical Layer](../02-osi-and-tcpip-models/physical-layer.md)
- [Signal Propagation](../01-networking-foundations/signal-propagation.md)
- [Transmission Media](../01-networking-foundations/transmission-media.md)
