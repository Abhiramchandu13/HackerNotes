# Switch

> A network switch is a Layer 2 device that connects devices together on a local area network (LAN) and uses MAC addresses to forward data only to the specific device that needs it.

## Overview
If a router connects different cities, a **Switch** is the road system within a single neighborhood. Operating primarily at the **Data Link Layer (Layer 2)**, switches physically connect computers, printers, and servers. Instead of broadcasting every message to everyone (like obsolete hubs), switches learn the physical identity of every device and intelligently direct traffic to the correct port, allowing dozens of simultaneous conversations without collisions.

## Why It Matters
Switches are the foundation of local connectivity. 99% of wired end-user devices plug directly into a switch. Understanding switch operations is critical for provisioning network access, dividing networks securely into VLANs, and preventing catastrophic network loops via Spanning Tree Protocol (STP). For pentesters, compromising a switch or exploiting its Layer 2 mechanics allows for devastating Man-in-the-Middle (MitM) attacks across the local network.

## Core Concepts
- **MAC Address Table (CAM Table):** The switch's brain. It dynamically records which MAC address is plugged into which physical port.
- **Unicast Forwarding:** Because the switch knows where devices are, if Port 1 sends data to Port 5, the switch opens a dedicated internal path. Ports 2, 3, and 4 never see the data, increasing security and preserving bandwidth.
- **Microsegmentation:** A switch places every single port into its own distinct "Collision Domain," effectively making data collisions a thing of the past (assuming full-duplex operation).
- **VLANs (Virtual LANs):** Switches can be logically sliced into multiple separate networks. Port 1-10 might be VLAN 10 (HR), and Port 11-20 might be VLAN 20 (Sales). They cannot talk to each other without a router.

## How It Works
1. **Learning:** A PC is plugged into Port 3 and sends a frame. The switch looks at the *Source MAC address* on the frame and records it: "MAC `AA:BB` lives on Port 3."
2. **Flooding (Unknown Unicast):** The PC wants to talk to MAC `CC:DD`. The switch checks its table but hasn't learned where `CC:DD` is yet. It safely *floods* the frame out of all ports (except Port 3) to ensure it reaches the target.
3. **Forwarding:** The target device replies. The switch learns its location. The next time PC A talks to PC B, the switch forwards the frame *directly* between their two ports.

## Components / Types
- **Unmanaged Switch:** Plug-and-play. No IP address, no configuration interface, no VLANs. Common in homes or small unsecure branch extensions.
- **Managed Switch:** Enterprise-grade (e.g., Cisco Catalyst). Configurable via SSH/HTTPS. Supports VLANs, STP, Port Security, and SNMP monitoring.
- **Layer 3 Switch (Multilayer Switch):** A high-end managed switch that also has the brain of a router built into the hardware. It can route traffic between its own internal VLANs at blazing hardware speeds without needing an external router.

## Practical Examples
- **The Access Layer:** In a corporate office, a 48-port switch sits in the wiring closet. Every cubicle's wall jack wires back to this switch. The switch provides both network data and physical power (PoE) to the VoIP phones on the desks.
- **Trunking:** A switch on Floor 1 connects to a switch on Floor 2 via a single fiber optic cable. The switches configure this port as a "Trunk," allowing traffic from VLANs 10, 20, and 30 to flow simultaneously across the single cable.

## Security Considerations
Because switches operate on "trust," they are susceptible to local attacks.
- **MAC Flooding:** An attacker sends thousands of fake MAC addresses per second. The switch's memory (CAM table) fills up. Unable to learn new addresses, it panics and falls back to acting like a hub, broadcasting all traffic everywhere, allowing the attacker to sniff other people's passwords.
- **VLAN Hopping:** Exploiting misconfigured trunk ports to jump from a low-security guest VLAN into a high-security server VLAN.
- **Defense:** Enterprise switches rely heavily on **Port Security** (limiting how many MACs are allowed on a port), **DHCP Snooping**, and **802.1X** (requiring username/password authentication before the switch turns the port on).

## Commands / Configuration Examples
### Cisco IOS
```text
! View the switch's learned MAC addresses
show mac address-table

! Assign a user port to the Sales VLAN
interface GigabitEthernet1/0/5
 description User_Desk_Port
 switchport mode access
 switchport access vlan 20

! View the status and speed of all ports
show interfaces status
```

## Troubleshooting
- **Broadcast Storms:** If someone accidentally plugs both ends of an Ethernet cable into the same unmanaged switch, it creates a physical loop. Broadcast frames will duplicate infinitely, crashing the network. Managed switches use Spanning Tree Protocol (STP) to detect and block these loops automatically.
- **Duplex Mismatch:** If a switch port is hardcoded to Full-Duplex, but a legacy server defaults to Half-Duplex, the connection will establish, but the server will experience massive collisions and network speeds will drop to a crawl.

## Interview Questions
- What is the difference between a hub and a switch?
- How does a switch populate its MAC address table?
- What happens if a switch receives a frame destined for a MAC address it doesn't know?
- What is a Layer 3 switch?

## Summary
The switch is the intelligent foundation of local networking. By learning the physical addresses of connected devices and microsegmenting traffic flow, switches provide the high performance, basic isolation, and foundational access control required by modern enterprise architectures.

## References
- [Router](router.md)
- [Hub](hub.md)
- [Switch Operation](../03-ethernet-and-switching/switch-operation.md)
- [VLANs and Trunks](../03-ethernet-and-switching/vlans-and-trunks.md)
