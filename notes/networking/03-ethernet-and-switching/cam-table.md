# CAM Table

> The CAM (Content Addressable Memory) table is the switch's internal brain, storing the mapping of MAC addresses to physical switch ports.

## Overview
A switch makes intelligent forwarding decisions, but it needs a map to do so. The CAM table, also referred to as the MAC Address Table, is that map. It dynamically records which devices are plugged into which ports. Without the CAM table, a switch would have no memory and would be forced to operate like a legacy hub, broadcasting every frame everywhere.

## Why It Matters
For network engineers, understanding the CAM table is essential for tracking down devices. If you know a server's MAC address, querying the CAM table tells you exactly which port to troubleshoot. For cybersecurity, the CAM table is a primary target; manipulating its limits or contents is how attackers perform local network surveillance and Man-In-The-Middle attacks.

## Core Concepts
- **Content Addressable Memory (CAM):** A specialized type of computer memory used in high-speed searching. Unlike standard RAM (where you provide an address to retrieve data), with CAM, you provide the data (a MAC address), and it instantly returns the address (the switch port).
- **Dynamic Learning:** Switches populate this table automatically by observing traffic.
- **Aging Timer:** Entries don't last forever. If a device stops transmitting, the switch removes its MAC from the table after a set period (usually 300 seconds / 5 minutes) to free up memory.
- **Static Entries:** Network admins can manually hardcode a MAC address to a specific port permanently.

## How It Works
1. **Empty State:** A switch boots up with an empty CAM table.
2. **Learning Phase:** PC 1 (MAC `AA`) sends a frame on Port 1. The switch looks at the Source MAC and writes `MAC AA -> Port 1` into the CAM table.
3. **Forwarding Phase:** Later, the router sends a frame destined for MAC `AA`. The switch hardware instantly queries the CAM table, finds the entry for `AA`, and forwards the frame exclusively out Port 1.
4. **Aging:** If PC 1 is turned off and stops sending frames, the 300-second countdown begins. When it reaches 0, the entry `MAC AA -> Port 1` is deleted.

## Components / Types
The CAM table generally contains four key pieces of information for every entry:
1. **VLAN ID:** The logical network the device belongs to.
2. **MAC Address:** The 48-bit hardware address.
3. **Type:** `Dynamic` (learned automatically) or `Static` (manually configured).
4. **Port:** The physical interface the device is connected to (e.g., `Gi1/0/24`).

## Practical Examples
- **Locating a Rogue Access Point:** A security alert flags a suspicious MAC address. The network engineer logs into the core switch, views the CAM table for that MAC, traces it to an edge switch, views the CAM table there, and discovers the device is plugged into port `FastEthernet0/15` in the conference room.
- **Device Moves:** If you unplug your laptop from your desk and plug it into a meeting room, your laptop sends a new frame. The switch immediately updates the CAM table, moving your MAC address from the old port to the new port.

## Security Considerations
The CAM table has a finite amount of memory (e.g., it might only hold 8,000 MAC addresses).
- **MAC Flooding Attack (CAM Table Overflow):** An attacker uses a tool like `macof` to generate thousands of fake frames with random source MAC addresses per second. The CAM table fills up instantly. 
- **The Result:** Once full, the switch cannot learn legitimate addresses. When legitimate traffic arrives, the switch doesn't know where to send it, so it floods it out of all ports. The attacker can now sniff traffic meant for other users.
- **Defense:** Configure **Port Security** to limit a port to a maximum of 1 or 2 MAC addresses, mitigating flooding attacks entirely.

## Commands / Configuration Examples
### Cisco IOS
```text
! View the entire CAM table
show mac address-table

! Find exactly which port a specific MAC is on
show mac address-table address 0011.2233.4455

! Find all MACs currently on a specific port
show mac address-table interface GigabitEthernet1/0/5

! Change the aging time from default 300 seconds to 600 seconds
mac address-table aging-time 600
```

## Troubleshooting
- **Unicast Flooding:** If the switch aging timer (e.g., 5 mins) is shorter than the router's ARP timeout (e.g., 4 hours), the switch forgets the server's port. When the router sends traffic to the server, the switch floods it to all ports, causing massive performance degradation.
- **MAC Flapping:** If the same MAC address rapidly switches between two different ports in the CAM table, it indicates a Layer 2 loop in the network (often caused by misconfigured or failing Spanning Tree Protocol).

## Interview Questions
- What is the difference between CAM memory and standard RAM?
- How does a switch dynamically populate its CAM table?
- What happens to a switch when its CAM table is completely full?
- What is the default aging time for a dynamic MAC address entry on a Cisco switch?

## Summary
The CAM table is the mechanism that allows a switch to be "smart." By dynamically mapping MAC addresses to physical ports using specialized high-speed memory, the switch ensures local network traffic is delivered efficiently and privately.

## References
- [Switch Operation](switch-operation.md)
- [MAC Addresses](mac-addresses.md)
- [Port Security](port-security.md)
- [ARP](arp.md)
