# Access Point (AP)

> An Access Point is a Layer 2 network device that acts as a bridge, converting wired Ethernet traffic into wireless radio signals (Wi-Fi) to allow mobile devices to connect to the network.

## Overview
While switches provide connectivity for desktop PCs via physical copper cables, mobile devices like laptops, phones, and IoT sensors rely on Wi-Fi. A **Wireless Access Point (AP or WAP)** is the physical hardware bolted to the ceiling that provides this wireless signal. 

Conceptually, an Access Point is simply a wireless switch. It operates at the **Data Link Layer (Layer 2)**, bridging the 802.11 (Wi-Fi) frames from the air onto the 802.3 (Ethernet) frames on the wired corporate backbone. 

## Why It Matters
Wireless connectivity is the primary access method for modern enterprises, schools, and homes. Network engineers spend vast amounts of time designing AP placement for optimal coverage and capacity. For cybersecurity professionals, Access Points represent the most vulnerable perimeter of a network; a misconfigured AP can broadcast access to the internal corporate LAN far beyond the physical walls of the building into the parking lot.

## Core Concepts
- **BSSID (Basic Service Set Identifier):** The actual MAC address of the radio inside the Access Point. Every AP has a unique BSSID.
- **SSID (Service Set Identifier):** The human-readable network name broadcasted by the AP (e.g., "Corporate_WiFi"). Multiple APs can broadcast the exact same SSID to allow roaming.
- **PoE (Power over Ethernet):** Because APs are mounted on ceilings where power outlets are rare, they almost exclusively receive their electrical power directly through the Ethernet data cable provided by the upstream switch.
- **Half-Duplex Medium:** Unlike modern switched Ethernet, Wi-Fi is a shared, half-duplex medium. Only one device can talk to the AP on a specific channel at a time. The AP uses CSMA/CA (Collision Avoidance) to manage this traffic jam.

## How It Works
1. A laptop searches the airwaves for the SSID "Guest_Network".
2. The Access Point, hardwired to a switch on VLAN 99, is broadcasting that SSID.
3. The laptop authenticates and associates with the AP via radio waves.
4. The laptop sends an IP packet to the Internet. The packet is encapsulated into an 802.11 wireless frame.
5. The AP receives the wireless frame via its antennas.
6. The AP strips off the 802.11 wireless header, converts it into a standard 802.3 Ethernet frame, and pushes it down the copper cable to the switch on VLAN 99.

## Components / Types
- **Autonomous (Fat) AP:** A standalone access point. It contains its own management GUI, routing logic, DHCP server, and security settings. Typical for home routers (which combine a router, switch, and Fat AP into one box) or very small businesses.
- **Lightweight (Thin) AP:** Enterprise standard (e.g., Cisco Aironet, Aruba). The AP has almost no "brain." It cannot function on its own. It boots up, connects over the network to a central **Wireless LAN Controller (WLC)**, and downloads its configuration and operating instructions dynamically. 
- **Cloud-Managed AP:** Devices (like Cisco Meraki) that act like thin APs, but instead of a physical controller in a server rack, they pull their configuration directly from a vendor-hosted web dashboard over the Internet.

## Practical Examples
- **Enterprise Roaming:** A university campus has 500 Lightweight Access Points all broadcasting the SSID "Student_WiFi". Because all 500 APs are managed by a single central controller, a student can walk from the library to the cafeteria while on a VoIP call. As the signal from one AP fades, the system seamlessly hands the connection off to the next closest AP without dropping the call.

## Security Considerations
- **Rogue Access Points:** The greatest physical threat to a network. An employee brings a cheap home router, plugs it into a wall jack in their cubicle, and broadcasts an unencrypted Wi-Fi signal. An attacker in the parking lot connects to it, entirely bypassing the corporate firewall and gaining full access to the internal LAN.
- **Evil Twin Attack:** An attacker sets up their own AP broadcasting the exact same SSID (e.g., "Starbucks_Free") as a legitimate network. Users accidentally connect to the attacker's AP, allowing the attacker to execute a Man-in-the-Middle attack and steal credentials.
- **WPA3 / 802.1X:** APs must be configured to use strong encryption (WPA2/WPA3) and Enterprise authentication (802.1X/RADIUS) to tie wireless access directly to Active Directory credentials rather than a shared, easily leaked password.

## Commands / Configuration Examples
### Cisco IOS (Configuring an Access Switch Port for a Lightweight AP)
Lightweight APs usually require power (PoE) and often operate on a "Trunk" port so they can map different SSIDs to different VLANs.
```text
interface GigabitEthernet1/0/10
 description Connection_to_Ceiling_AP
 ! Enable Power over Ethernet
 power inline auto
 ! Configure the port as a trunk to allow multiple Wi-Fi VLANs
 switchport mode trunk
 switchport trunk allowed vlan 10,20,99
```

### Linux (Scanning for APs)
Pentesters and engineers use Linux tools to map the physical layout of Access Points.
```bash
# Scan the airwaves and list all nearby APs, their SSIDs, and their BSSIDs (MACs)
nmcli dev wifi list
```

## Troubleshooting
- **Interference / Channel Overlap:** If users complain of terrible speeds despite a strong signal, multiple APs (or a neighboring business's APs) are likely broadcasting on the exact same radio channel. The APs must be reconfigured to use non-overlapping channels (e.g., Channels 1, 6, and 11 on the 2.4GHz band).
- **PoE Failure:** If a new high-density AP (like Wi-Fi 6) constantly reboots or fails to power on, the upstream switch might not support the required Power over Ethernet standard (e.g., PoE+ 802.3at providing 30 watts), starving the AP of electricity.
- **Controller Unreachable:** A Lightweight AP flashing a red LED usually means it has an IP address but cannot discover or route to its central Wireless Controller across the network, leaving it stranded and useless.

## Interview Questions
- Explain the difference between an Autonomous (Fat) AP and a Lightweight (Thin) AP.
- What is Power over Ethernet (PoE) and why is it vital for Access Point deployments?
- How does an Access Point differ from a standard Wireless Router? (Answer: A router performs Layer 3 routing and NAT; an AP only performs Layer 2 bridging between wireless and wired mediums).
- What is a Rogue Access Point and how do organizations detect them?

## Summary
The Access Point is the critical edge of the modern network, translating invisible radio waves into wired Ethernet data. While deploying a single AP is simple, scaling hundreds of them across an enterprise requires a deep understanding of Layer 2 bridging, PoE, radio frequency physics, and centralized controller management.

## References
- [Wireless Controller](wireless-controller.md)
- [Wi-Fi Basics](../08-wireless-networking/wifi-basics.md)
- [IEEE 802.11](../08-wireless-networking/ieee-802-11.md)
- [Rogue Access Point](../14-network-pentesting/rogue-access-point.md)
