# VLANs and Trunks

> VLANs divide a single physical switch into multiple isolated logical networks, and Trunks allow those isolated networks to travel across a single cable between switches.

## Overview
Virtual Local Area Networks (VLANs) are one of the most powerful and fundamental tools in networking. They allow administrators to group devices logically, regardless of where they are physically plugged in. For example, all HR computers can be on VLAN 10 and all Guest Wi-Fi devices on VLAN 20, even if they are connected to the exact same switch.

A **Trunk** is a specialized port configuration that allows traffic from multiple different VLANs to be transmitted over a single physical wire to another switch or router.

## Why It Matters
VLANs are the primary method for Layer 2 security and traffic management. 
- **Performance:** VLANs break up massive broadcast domains. A broadcast sent by a device in VLAN 10 is only heard by other devices in VLAN 10, preventing network-wide congestion.
- **Security:** Devices in different VLANs cannot communicate directly. Traffic must pass through a router or firewall, giving security teams a choke point to inspect and filter traffic.

## Core Concepts
- **VLAN ID:** A number from 1 to 4094 identifying the logical network. (VLAN 1 is the default).
- **Access Port:** A switch port assigned to a *single* VLAN. End devices (PCs, printers) plug into access ports. They are unaware VLANs exist.
- **Trunk Port:** A switch port designed to carry traffic for *multiple* VLANs. Used to connect switches to other switches or routers.
- **802.1Q Tagging:** The IEEE standard protocol for trunking. When a switch sends a frame out a trunk port, it inserts a 4-byte "Tag" containing the VLAN ID into the Ethernet frame so the receiving switch knows which VLAN it belongs to.
- **Native VLAN:** The one VLAN on an 802.1Q trunk that is sent *untagged* (without the 4-byte insertion). Used for backward compatibility.

## How It Works
1. PC-A is plugged into Port 1 (configured for VLAN 10). It sends a standard Ethernet frame.
2. The switch receives the frame. Because Port 1 is an Access Port for VLAN 10, the switch internally associates this frame with VLAN 10.
3. The switch needs to send the frame to PC-B (also in VLAN 10), which is located on a different switch. 
4. The frame is sent out the Trunk Port connecting the two switches. As it leaves, the switch inserts an 802.1Q tag marking it as "VLAN 10".
5. The receiving switch sees the tag, strips the tag off, and forwards the standard, untagged frame to PC-B's access port.

## Components / Types
- **Data VLAN:** Standard VLAN carrying user traffic.
- **Voice VLAN:** Specifically configured to carry VoIP traffic alongside data traffic on the same physical wire (connecting a PC through an IP Phone).
- **Management VLAN:** The VLAN used by administrators to SSH or HTTPS into the network infrastructure devices themselves.

## Practical Examples
- **Guest Wi-Fi:** A company wants to offer free Wi-Fi, but doesn't want guests accessing the corporate servers. They create VLAN 99 for Guests and VLAN 10 for Corporate. Even though both share the same physical access points and switches, Layer 2 separation keeps them completely isolated.

## Security Considerations
VLANs provide isolation, but misconfigurations create serious vulnerabilities:
- **VLAN Hopping (Switch Spoofing):** If an attacker plugs into a port configured to dynamically negotiate trunking (DTP), they can trick the switch into forming a trunk. The attacker can then inject 802.1Q tags to access any VLAN on the network.
- **Double Tagging:** An attacker crafts a frame with two 802.1Q tags. The first switch strips the outer tag (the Native VLAN) and forwards it. The second switch reads the inner tag and forwards the frame into a restricted VLAN.
- **Best Practice:** Hardcode user ports to `access` mode. Disable DTP. Never use VLAN 1 as your native or management VLAN.

## Commands / Configuration Examples
### Cisco IOS
```text
! Create a VLAN
vlan 10
 name HumanResources

! Configure an Access Port (for a PC)
interface GigabitEthernet1/0/1
 switchport mode access
 switchport access vlan 10

! Configure a Trunk Port (to another switch)
interface GigabitEthernet1/0/24
 switchport trunk encapsulation dot1q
 switchport mode trunk
 ! Best practice: restrict which VLANs are allowed on the trunk
 switchport trunk allowed vlan 10,20,99
```

## Troubleshooting
- **PC cannot get an IP:** Check the access port. Is it assigned to the correct VLAN?
- **VLANs isolated across switches:** Check the trunk link. Ensure the trunk is active (`show interfaces trunk`), and ensure the specific VLAN ID has been allowed across the trunk.
- **Native VLAN Mismatch:** If Switch A uses Native VLAN 1, and Switch B uses Native VLAN 99, traffic on those VLANs will bleed into each other, and Spanning Tree will throw constant error messages.

## Interview Questions
- What is the primary purpose of a VLAN?
- Explain how 802.1Q encapsulation works on a trunk port.
- What is a Native VLAN?
- How does an attacker perform a VLAN hopping attack using switch spoofing?

## Summary
VLANs and Trunks are the architectural tools that allow network engineers to scale physical infrastructure efficiently. By securely separating broadcast domains and tunneling them between devices via 802.1Q tags, networks remain manageable, performant, and secure.

## References
- [Ethernet Frames](frames.md)
- [Inter-VLAN Routing](inter-vlan-routing.md)
- [Switch Operation](switch-operation.md)
- [VLAN Hopping](../15-network-pentesting/vlan-hopping.md)
