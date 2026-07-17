# Layer 1 - Physical Layer

> The Physical Layer (Layer 1) transmits raw bit streams over physical media like cables or radio waves.

## Overview
Layer 1 of the OSI model is where data literally meets the physical world. It dictates how bits (0s and 1s) are converted into electrical impulses, light flashes, or radio waves. Everything physical—from the type of copper cable to the shape of the connector, to the voltage levels representing binary data—belongs to the Physical Layer.

## Why It Matters
Without a functional Physical Layer, no network communication can occur. You can have perfect routing and application logic, but if a cable is cut or there is severe wireless interference, the network is down. Understanding Layer 1 is crucial for designing reliable infrastructure and solving "layer 1 issues," which account for a massive percentage of network outages.

## Core Concepts
- **Bits:** The PDU (Protocol Data Unit) at Layer 1 is a bit.
- **Signaling:** How 1s and 0s are represented (e.g., +5V for a 1, 0V for a 0).
- **Media:** The physical path (copper wire, fiber optic glass, wireless spectrum).
- **Topology:** The physical layout of the network (e.g., star, bus, ring).
- **Synchronization:** Ensuring the sender and receiver read the bits at the exact same pace (clocking).

## How It Works
When Layer 2 (Data Link) passes a frame down to Layer 1, the network interface card (NIC) converts that frame into a sequence of bits. Depending on the medium:
- **Copper (Ethernet):** Bits become electrical signals.
- **Fiber:** Bits become pulses of light (lasers or LEDs).
- **Wireless (Wi-Fi):** Bits become modulated radio frequencies.
The receiving device's NIC detects these signals, translates them back into a bit stream, and passes them up to its own Data Link layer.

## Components / Types
Hardware operating primarily at Layer 1 includes:
- **Cables:** Cat5e, Cat6, Fiber Optics, Coaxial.
- **Connectors:** RJ-45, LC, SC, MPO.
- **Hubs:** Dumb devices that blindly repeat electrical signals out all ports.
- **Repeaters:** Devices that regenerate a degraded signal to extend network distance.
- **Transceivers / SFP Modules:** Pluggable optics that convert electrical signals to optical signals.

## Practical Examples
- Plugging an RJ-45 Ethernet cable from a laptop into a wall jack.
- An SFP+ module transmitting light over a fiber backbone between two data centers.
- A home router broadcasting Wi-Fi signals on a 5GHz frequency.

## Security Considerations
Layer 1 is susceptible to physical attacks:
- **Wiretapping/Sniffing:** Attackers can physically tap copper lines or use splitters on fiber lines to copy data undetected.
- **Denial of Service (Jamming):** Flooding a wireless frequency with noise prevents legitimate Layer 1 transmissions.
- **Physical Access:** If an attacker can plug a rogue device into a switch port, they bypass perimeter firewalls. Physical security (locks, badge readers) is Layer 1 security.

## Commands / Configuration Examples
Checking the physical status of an interface is the first step in troubleshooting.

### Linux
```bash
ethtool eth0      # Check speed, duplex, and link detection
ip link show      # View interface UP/DOWN status
```

### Windows
```powershell
Get-NetAdapter | Select-Object Name, Status, LinkSpeed
```

### Cisco IOS
```text
show interfaces status
show controllers ethernet-controller
```
*Note: If an interface says `FastEthernet0/1 is down, line protocol is down`, the first "down" usually indicates a Layer 1 issue (no physical link).*

## Troubleshooting
When troubleshooting Layer 1:
- Check for physical link lights on the NIC and switch.
- Verify the cable is securely plugged in and undamaged.
- Swap the cable with a known good one.
- Check for speed/duplex mismatches (though duplex technically spans L1/L2).
- Ensure the SFP transceiver matches the fiber type (single-mode vs. multimode).

## Interview Questions
- What is the PDU of the Physical Layer?
- Name three devices that operate at Layer 1.
- If a network cable is severed by construction equipment, which OSI layer is failing?
- What does it mean if the interface status is "down/down"?

## Summary
The Physical Layer handles the mechanical, electrical, and optical transmission of binary data. It forms the literal foundation of the network, meaning any failures here will cascade up the entire OSI model, disrupting all communication.

## References
- [OSI Model Overview](osi-model-overview.md)
- [Data Link Layer](data-link-layer.md)
- [Cables and Connectors](../01-networking-foundations/cables-and-connectors.md)
- [Transmission Media](../01-networking-foundations/transmission-media.md)
