# Switch Operation

> A network switch is a Layer 2 device that intelligently forwards Ethernet frames to specific destination ports based on MAC addresses.

## Overview
Switches are the workhorses of the modern Local Area Network (LAN). Unlike legacy hubs, which blindly broadcast every message out of every port, switches learn exactly where each device is located. By forwarding traffic only to the necessary port, switches eliminate collisions, vastly improve network performance, and provide a basic layer of isolation.

## Why It Matters
Understanding switch operation is fundamental to networking. If you don't know how a switch learns and forwards traffic, you cannot configure VLANs, troubleshoot connectivity issues, or understand how Layer 2 attacks work. For pentesters, manipulating a switch's normal operational behavior is the key to executing Man-In-The-Middle (MitM) attacks on local networks.

## Core Concepts
- **Microsegmentation:** A switch separates every single port into its own isolated collision domain.
- **MAC Learning:** The switch examines the *Source MAC address* of every incoming frame to learn which device is connected to which port.
- **Forwarding:** The switch examines the *Destination MAC address* of incoming frames to decide where to send them.
- **Flooding:** If the switch doesn't know where the destination MAC is, it sends the frame out *all* ports (except the one it came in on).

## How It Works
Switch operation revolves around building and utilizing the CAM Table (Content Addressable Memory table, or MAC Address Table).

1. **Learning:** PC A (MAC `AA`) sends a frame to PC B on Port 1. The switch looks at the Source MAC (`AA`), sees it came in on Port 1, and records `MAC AA -> Port 1` in its CAM table.
2. **Forwarding (Known Unicast):** Later, PC C sends a frame destined for MAC `AA`. The switch looks at the Destination MAC, checks its CAM table, sees `AA` is on Port 1, and forwards the frame *only* out of Port 1.
3. **Flooding (Unknown Unicast / Broadcast):** If PC A sends a frame to PC D (MAC `DD`), but the switch hasn't learned where `DD` is yet, it doesn't drop the frame. Instead, it floods the frame out of *all* active ports. When PC D replies, the switch learns its location. Broadcast frames (`FF:FF:FF:FF:FF:FF`) are always flooded.

## Components / Types
- **Unmanaged Switches:** Plug-and-play devices with no configuration interface. Common in homes.
- **Managed Switches:** Enterprise devices (like Cisco Catalyst) that support VLANs, spanning tree, port security, and SNMP monitoring.
- **Layer 3 Switches:** Advanced switches that perform traditional Layer 2 MAC switching, but also possess routing capabilities (Layer 3 IP routing) in hardware.

## Practical Examples
- **File Transfer:** When a user downloads a massive file from a local server, the switch ensures that heavy traffic stream only travels between the server's port and the user's port, without slowing down the rest of the office.
- **ARP Requests:** When a PC needs an IP address resolved, it sends an ARP request as a broadcast. The switch floods this broadcast out of every port so the target machine is guaranteed to hear it.

## Security Considerations
Switches are intelligent, but their logic can be exploited:
- **MAC Flooding:** An attacker sends thousands of frames with randomly generated Source MAC addresses. The switch's CAM table fills up completely. Unable to learn new addresses, the switch fails "open" and begins flooding *all* traffic out *all* ports, turning into a hub. The attacker can then sniff other users' traffic.
- **ARP Poisoning:** Attackers trick the switch and endpoints into sending traffic to the attacker's port instead of the default gateway, enabling interception.
- **Mitigation:** Enterprise switches use features like **Port Security** (limiting the number of MACs allowed per port) and **Dynamic ARP Inspection (DAI)** to prevent these attacks.

## Commands / Configuration Examples
### Cisco IOS
```text
! View the switch's learned MAC addresses (the CAM table)
show mac address-table

! Clear dynamically learned MAC addresses (forces the switch to relearn)
clear mac address-table dynamic

! View interface statistics and errors
show interfaces GigabitEthernet1/0/1
```

## Troubleshooting
- **Unknown Unicast Flooding:** If a switch's CAM table timeout (usually 5 minutes) is shorter than the ARP cache timeout on a router (usually 4 hours), the switch might "forget" a server's MAC address while traffic is still flowing. This causes the switch to constantly flood the traffic to all ports, degrading performance.
- **Port Flapping:** If a port goes up and down rapidly, the switch constantly flushes and rebuilds its MAC table, causing network instability.
- **Duplex Mismatches:** If a switch port is hardcoded to Full Duplex but a server is set to Auto, the server falls back to Half Duplex, causing collisions and massive performance drops.

## Interview Questions
- Explain the process a switch uses to learn MAC addresses.
- What does a switch do if it receives a frame destined for a MAC address it does not have in its MAC table?
- What is the difference between a collision domain and a broadcast domain?
- How does a MAC flooding attack compromise network confidentiality?

## Summary
Network switches are the foundation of local communication. By dynamically learning Source MAC addresses and intelligently forwarding traffic based on Destination MAC addresses, they provide fast, efficient, and collision-free connectivity for enterprise networks.

## References
- [MAC Addresses](mac-addresses.md)
- [CAM Table](cam-table.md)
- [VLANs and Trunks](vlans-and-trunks.md)
- [Port Security](port-security.md)
