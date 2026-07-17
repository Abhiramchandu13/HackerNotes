# Antenna Types

> Antennas are the physical hardware that transmit and receive radio waves, shaped to focus the Wi-Fi signal in specific directions for optimal coverage.

## Overview
A wireless router is useless without an antenna to push the electrical signals into the air as electromagnetic waves. The physical shape and design of the antenna completely dictate how far the signal goes and what shape the coverage area takes. 

In wireless engineering, choosing the wrong antenna type guarantees poor performance, regardless of how expensive the Access Point (AP) is.

## Why It Matters
If you mount a standard AP on a 40-foot warehouse ceiling, the signal will never reach the scanners on the floor. You must use specialized antennas. Understanding antenna radiation patterns is the core of Wireless Site Surveys and physical network design. For security professionals, highly directional antennas are the tools used to execute Wi-Fi attacks against buildings from miles away.

## Core Concepts
- **Gain (dBi):** A measure of how much an antenna focuses the signal. A high-gain antenna does not magically create more power; it simply squishes the signal like a flashlight beam to make it go further in one specific direction.
- **Radiation Pattern:** The 3D shape of the signal field created by the antenna (usually visualized as a doughnut, a sphere, or a cone).
- **Polarization:** The orientation of the radio waves (usually vertical or horizontal). The sending and receiving antennas must have matching polarization for maximum efficiency.

## How It Works
When the transmitter generates a radio frequency signal, the antenna acts as the launching pad. 
- A simple, straight piece of wire radiates signal equally in all directions horizontally, but not vertically up or down.
- By adding metallic reflectors behind the wire, the antenna physically blocks the signal from going backward and forces all the energy forward, massively increasing the signal range in that specific direction.

## Components / Types
Antennas are broadly categorized into two types: Omnidirectional and Directional.

### 1. Omnidirectional (Dipole)
- **Shape:** Radiates in a 360-degree circle outward, like a doughnut. The signal does not go straight up or down.
- **Use Case:** The standard "rubber duck" antennas on home routers. Used in offices and open spaces where users are scattered all around the AP.
- **Placement:** Should be mounted vertically in the center of the coverage area.

### 2. Directional
Focuses energy in a specific direction.
- **Patch / Panel:** Radiates in a wide cone (e.g., 60 to 120 degrees). Often mounted flat on walls. Excellent for pointing down warehouse aisles or providing coverage in high-ceiling auditoriums.
- **Sector:** Similar to patch, but highly focused. Used in cellular towers and stadiums to carve massive crowds into smaller, focused coverage zones.
- **Yagi / Parabolic Grid:** Extremely focused, narrow beams. 
- **Use Case:** Point-to-Point links. Used to beam a Wi-Fi signal from one building to another building 5 miles away across a valley.

## Practical Examples
- **Office Design:** An engineer mounts omnidirectional APs flush against the drop ceiling in the center of the office. The doughnut-shaped signal covers the entire floor evenly.
- **Long-Distance Hacking:** A pentester attaches a highly directional Yagi antenna (which looks like an old rooftop TV antenna) to their laptop. They point it at a corporate office building from a hotel room a mile away and successfully capture the WPA handshakes of the corporate Wi-Fi.

## Security Considerations
- **Signal Leakage:** Using high-gain omnidirectional antennas near the perimeter of a building pushes the corporate network deep into the public parking lot, inviting attackers to sit in their cars and launch attacks in comfort. Proper antenna selection and power reduction keep the signal inside the building.
- **Physical Security:** Directional antennas allow attackers to achieve staggering ranges. You cannot assume your Wi-Fi is safe just because there are no unauthorized people physically near the building.

## Commands / Configuration Examples
Antennas are physical hardware; you do not configure them via CLI. However, you *do* configure the power going into them (Transmit Power).

### Cisco WLC
```text
! Navigate to the AP radio settings and adjust the Transmit (Tx) Power.
! Power levels are usually 1 (Maximum) to 8 (Minimum).
! Reducing Tx power shrinks the coverage cell, reducing interference and signal leakage.
config 802.11a txPower ap AP-Name 4
```

## Troubleshooting
- **Ceiling Height Issues:** A common mistake is mounting omnidirectional APs on 30-foot ceilings. Because the signal radiates outward like a doughnut, the signal goes out over everyone's heads and never reaches the floor. High ceilings require Patch antennas pointed straight down.
- **Antenna Orientation:** The antennas on a standard router should generally point straight up. If you lay them flat, the signal will blast straight up into the ceiling and straight down into the floor, ruining horizontal coverage for the room.
- **Connector Loss:** When screwing an external antenna onto an AP using a coaxial cable, every connector and foot of cable introduces signal loss (attenuation). If the cable is too long, the antenna becomes useless.

## Interview Questions
- What is the difference between an omnidirectional and a directional antenna?
- If you need to connect two buildings wirelessly across a campus, what type of antenna should you use?
- Explain what antenna "Gain" (dBi) means.
- Why is it a poor design to mount a standard omnidirectional access point on a 40-foot warehouse ceiling?

## Summary
Antennas are the physical lenses of wireless networking. By understanding how different antenna types shape, focus, and distribute radio frequency energy, engineers can design networks that efficiently cover complex physical environments while minimizing external security leakage.

## References
- [Wi-Fi Basics](wifi-basics.md)
- [Wireless Site Surveys](wireless-site-surveys.md)
- [Wireless Attacks](wireless-attacks.md)
