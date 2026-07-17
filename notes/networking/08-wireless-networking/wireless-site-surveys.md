# Wireless Site Surveys

> A Wireless Site Survey is the process of physically measuring and mapping the radio frequency behavior in an environment to design, deploy, or troubleshoot a Wi-Fi network.

## Overview
You cannot design a reliable wireless network by simply looking at a floor plan and guessing where to place Access Points. Concrete walls, metal elevator shafts, and inventory racks absorb and reflect radio waves unpredictably. 

A **Wireless Site Survey** is an engineering exercise that uses specialized hardware and software to map exactly how radio waves propagate through a specific physical building. It ensures that signal strength, channel overlap, and capacity requirements are met before permanently bolting hardware to the ceiling.

## Why It Matters
Skipping a site survey guarantees a bad Wi-Fi deployment. It leads to dead zones, sticky clients, co-channel interference, and wasted budget on over-provisioned APs. For network engineers, site surveys are the foundation of wireless architecture. For security teams, surveys are used to map signal leakage outside the building and locate unauthorized rogue access points hidden on the premises.

## Core Concepts
- **RSSI (Received Signal Strength Indicator):** The measurement of how strong the Wi-Fi signal is at the client device, usually measured in negative decibels (dBm). (e.g., `-50 dBm` is excellent, `-80 dBm` is poor).
- **SNR (Signal-to-Noise Ratio):** The difference between the actual Wi-Fi signal and the background radio noise in the room. A high SNR means the data is clearly readable above the static.
- **Attenuation:** The loss of signal strength as it passes through physical objects (e.g., a drywall wall might cause 3 dB of loss, while a brick wall causes 12 dB of loss).
- **Heatmap:** The visual output of a site survey. It overlays vibrant colors onto a floorplan to visually represent signal strength coverage.

## How It Works
A traditional physical site survey involves an engineer walking the entire building with a laptop running specialized software (like Ekahau or Ametek AirMagnet).
1. The engineer imports a scaled CAD drawing of the floorplan into the software.
2. The engineer clicks on their exact physical location on the map. The software records the Wi-Fi data (signal strength, channels, interference) at that exact spot.
3. The engineer walks 10 feet, clicks the map again, and repeats this process until the entire building is covered.
4. The software interpolates the data points and generates a continuous heatmap.

## Components / Types
- **Predictive (Virtual) Survey:** Done off-site before the building is even built. The engineer draws the walls into the software, tells the software what the walls are made of (brick, glass), places virtual APs, and the software mathematically predicts the coverage.
- **Active Survey:** The surveyor's laptop actively connects to the AP being tested, generating actual traffic to measure real-world throughput, latency, and packet loss.
- **Passive Survey:** The laptop does not connect. It simply passively listens to all Wi-Fi beacons in the air, measuring the coverage of the entire environment simultaneously.

## Practical Examples
- **Warehouse Redesign:** An engineer conducts a survey in a warehouse. The predictive survey looked great, but the physical passive survey reveals massive dead zones. The engineer realizes the predictive survey didn't account for the massive metal racks filled with liquid-filled pallets, which absorb almost all 5GHz Wi-Fi signals. They redesign the network to use directional antennas pointing down the aisles.

## Security Considerations
- **Rogue AP Hunting:** Security teams perform regular sweeps using survey tools. If the tool detects a strong Wi-Fi signal belonging to an unauthorized BSSID inside the CEO's office, the team can use the heatmap to pinpoint its exact physical location.
- **Signal Leakage (Egress):** A highly secure facility requires that their Wi-Fi cannot be intercepted from the public street. A site survey validates that the RF signal drops below a usable threshold (e.g., weaker than `-90 dBm`) before it crosses the property line.

## Commands / Configuration Examples
Site surveys rely on GUI software (Ekahau, AirMagnet, NetSpot). However, you can perform rudimentary spot-checks via CLI.

### macOS (Spot Check)
macOS has a built-in, hidden wireless diagnostic tool.
```bash
# Launch the Wireless Diagnostics tool and open the "Performance" or "Scan" windows
open /System/Library/CoreServices/Applications/Wireless\ Diagnostics.app
```
*(Alternatively, hold `Option` and click the Wi-Fi icon to see instant RSSI and Noise metrics).*

### Linux
```bash
# Continuously monitor the signal strength of nearby networks
watch -n 1 iwconfig wlan0
```

## Troubleshooting
- **Interpreting RSSI:** A common mistake is misreading dBm because it is negative. `-60 dBm` is a *stronger* and better signal than `-80 dBm`. 
- **The -67 dBm Rule:** Enterprise VoIP over Wi-Fi (Voice) typically requires a minimum signal strength of `-67 dBm` everywhere. If the survey shows a spot dropping to `-75 dBm`, the voice call will drop or become robotic in that location.
- **Co-Channel Interference (CCI):** The survey heatmap might show perfectly strong signals everywhere (solid green), but the network is terribly slow. Switching the survey tool to view "Channel Overlap" reveals that three APs on Channel 6 are blasting into the same room, ruining the SNR.

## Interview Questions
- What is the difference between a Predictive site survey and a Passive site survey?
- What does RSSI stand for, and what is considered a "good" value for a standard enterprise deployment? (Answer: Received Signal Strength Indicator; roughly -65 dBm).
- Why might a Wi-Fi network perform terribly even if the signal strength is exceptionally high? (Answer: High noise floor / poor SNR, or Co-Channel Interference).
- How do security teams utilize wireless site survey tools?

## Summary
A Wireless Site Survey is the translation of abstract radio frequency theory into tangible, physical engineering. By methodically measuring signal strength, noise, and physical attenuation, engineers can guarantee the performance, capacity, and security boundaries of a wireless deployment.

## References
- [Wi-Fi Basics](wifi-basics.md)
- [Antenna Types](antenna-types.md)
- [Channels and SSID](channels-and-ssid.md)
- [Rogue Access Point](../14-network-pentesting/rogue-access-point.md)
