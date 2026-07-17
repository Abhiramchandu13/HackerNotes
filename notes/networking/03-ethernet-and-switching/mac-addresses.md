# MAC Addresses

> A MAC Address is a unique, physical identifier assigned to a network interface controller (NIC) used for communications on a local network segment.

## Overview
Media Access Control (MAC) addresses are the bedrock of Layer 2 communication. While IP addresses (Layer 3) are logical and change based on your location (like a mailing address), MAC addresses are permanently burned into the hardware of a device (like a social security number). Switches use MAC addresses to forward Ethernet frames directly to the correct physical device.

## Why It Matters
Without MAC addresses, switches wouldn't know where to send data, resulting in network-wide broadcasting for every single message. For network engineers, tracking MAC addresses is how you find exactly which switch port a rogue device is plugged into. For penetration testers, understanding MAC addresses is essential for bypassing network access controls and performing Layer 2 attacks.

## Core Concepts
- **Structure:** A MAC address is 48 bits (6 bytes) long, represented as 12 hexadecimal digits (e.g., `00:1A:2B:3C:4D:5E`).
- **OUI (Organizationally Unique Identifier):** The first 24 bits (first half) identify the manufacturer of the NIC (e.g., Cisco, Intel, Apple).
- **NIC Specific:** The last 24 bits (second half) are uniquely assigned by the manufacturer.
- **Physical vs. Logical:** MAC addresses operate strictly on the local LAN. They never cross a router. When a packet passes through a router, the source and destination MAC addresses are rewritten for the next local hop.

## How It Works
1. A computer generates an Ethernet frame to send to a local server.
2. It stamps its own MAC address as the "Source" and the server's MAC address as the "Destination".
3. The switch receives the frame, reads the Destination MAC, checks its CAM table, and forwards the frame out the specific port where the server is connected.
4. **Broadcasts:** If a device needs to send a message to *everyone* on the LAN (like an ARP request), it uses the special Broadcast MAC address: `FF:FF:FF:FF:FF:FF`.

## Components / Types
- **Unicast MAC:** Addressed to a single, specific device (e.g., `00:14:22:01:23:45`).
- **Multicast MAC:** Addressed to a specific group of devices. The first byte always ends in an odd number (e.g., `01:00:5E:xx:xx:xx` for IPv4 multicast).
- **Broadcast MAC:** Addressed to all devices on the local segment (`FF:FF:FF:FF:FF:FF`).

## Practical Examples
- **Finding a Stolen Laptop:** If a company tracks the MAC addresses of its corporate laptops, a network admin can search the switch logs to see if that specific MAC address has connected to the network recently, instantly revealing which physical office port the laptop is plugged into.
- **DHCP Reservations:** A system administrator configures the DHCP server to always assign `192.168.1.50` to the printer with MAC `AA:BB:CC:11:22:33`, ensuring the printer's IP never changes.

## Security Considerations
MAC addresses are inherently insecure because they are sent in cleartext and can be easily altered in software.
- **MAC Spoofing:** A pentester can change their laptop's MAC address to match an authorized device (like a printer or a CEO's laptop) to bypass MAC filtering, captive portals, or NAC solutions.
- **MAC Randomization:** Modern operating systems (iOS, Android, Windows) automatically randomize their MAC addresses when scanning for Wi-Fi networks to prevent retail stores from tracking users' physical movements.
- **Port Security:** Switches can be configured to shut down a port if it detects an unauthorized MAC address.

## Commands / Configuration Examples
### Linux
```bash
# View the MAC address of all interfaces
ip link show

# Temporarily spoof (change) a MAC address
sudo ip link set dev eth0 down
sudo ip link set dev eth0 address 00:11:22:33:44:55
sudo ip link set dev eth0 up
```

### Windows
```powershell
# View physical MAC addresses
Get-NetAdapter | Select-Object Name, MacAddress
```

### Cisco IOS
```text
# Find which port a specific MAC address is connected to
show mac address-table | include 001A.2B3C.4D5E
```

## Troubleshooting
- **IP Conflict vs MAC Conflict:** If two devices have the same IP, the network breaks. If two devices have the same MAC, the switch's CAM table constantly "flaps" between two ports, causing severe intermittent connectivity for both devices.
- **Router Boundaries:** Remember that a MAC address only gets you to the router. If you are trying to ping a server on the Internet, the destination MAC in your frame will be the MAC of your *local default gateway*, not the Google server.

## Interview Questions
- How many bits are in a MAC address?
- What does the OUI portion of a MAC address represent?
- Does a MAC address cross a router to reach the Internet? Why or why not?
- How would an attacker bypass MAC address filtering on a wireless router?

## Summary
MAC addresses are the fundamental physical identifiers for network hardware. While they are permanent at the hardware level, their role is strictly local. Understanding how MAC addresses dictate local traffic flow is the first step in mastering switching and Layer 2 security.

## References
- [Frames](frames.md)
- [ARP](arp.md)
- [CAM Table](cam-table.md)
- [IEEE OUI Lookup](https://standards.ieee.org/products-services/regauth/oui/index.html)
