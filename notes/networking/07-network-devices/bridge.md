# Bridge

> A network bridge is an early Layer 2 device that connects two separate LAN segments together, filtering traffic based on MAC addresses to reduce congestion.

## Overview
Before switches became the ubiquitous backbone of enterprise networks, large networks built on hubs suffered from massive congestion because every single packet collided with every other packet. The **Network Bridge** was invented to solve this. Operating at the **Data Link Layer (Layer 2)**, a bridge is essentially a two-port switch. It connects two large hub-based networks and intelligently decides whether traffic needs to cross over the bridge to the other side, or if it can stay on its local side.

Today, standalone hardware bridges are virtually extinct, having been entirely replaced by multi-port switches. However, the *concept* of bridging is alive and well in virtualization, software-defined networking, and wireless access points.

## Why It Matters
Understanding bridges is vital because modern switches are literally just "multi-port bridges." The logic a bridge uses to learn MAC addresses and filter traffic is the exact same logic your $10,000 core switch uses today. Furthermore, in modern cloud and container environments (like Docker or KVM), software "Linux Bridges" are used to seamlessly connect virtual machines to physical networks.

## Core Concepts
- **Collision Domain Separation:** A bridge breaks a single massive collision domain into two smaller collision domains, drastically improving performance.
- **MAC Learning:** Like a switch, a bridge listens to incoming traffic and builds a table of MAC addresses to learn which computers are on the "Left" side of the bridge, and which are on the "Right" side.
- **Filtering and Forwarding:** If PC-A (Left side) talks to PC-B (Left side), the bridge ignores the traffic (Filtering), keeping the Right side uncongested. If PC-A talks to PC-Z (Right side), the bridge passes the frame across (Forwarding).
- **Spanning Tree Protocol (STP):** STP was originally invented for bridges (hence "Bridge Protocol Data Units" - BPDUs) to prevent endless loops if someone plugged two bridges between the same two network segments.

## How It Works
1. A 50-person office on Hub A (Left) is connected to a Bridge. A 50-person office on Hub B (Right) is connected to the other side of the Bridge.
2. A computer on Hub A sends an Ethernet frame.
3. The Bridge receives the frame. It looks at the Source MAC address and writes it in its internal table: "MAC 123 is on the Left."
4. It looks at the Destination MAC. If it doesn't know where it is, it floods the frame to the Right side.
5. Once the Bridge learns all MAC addresses, it acts as a smart filter. It stops Left-to-Left traffic from needlessly crossing over and interrupting the Right side.

## Components / Types
- **Transparent Bridge:** The standard Ethernet bridge. It is "transparent" because the PCs have no idea it exists; they just send frames normally.
- **Wireless Bridge:** A pair of Wi-Fi antennas used to connect two physically separate wired networks (e.g., connecting a warehouse network to the main office network across a parking lot via a point-to-point wireless link).
- **Software Bridge (Virtualization):** A virtual Layer 2 switch created inside a Linux operating system (e.g., `br0`). It allows a Virtual Machine's virtual network card to "bridge" directly onto the host's physical network card, giving the VM a real IP address on the physical LAN.

## Practical Examples
- **Hyper-V / VMware Virtual Switches:** When you create an "External Virtual Switch" in Hyper-V, you are technically creating a software bridge. It links the virtual network of your VMs directly to the physical copper cable plugged into the back of your server.
- **Home Wi-Fi Extenders:** A device that connects to your home Wi-Fi network and has an Ethernet port on the back for your Smart TV. It acts as a wireless-to-wired bridge, seamlessly translating the 802.11 wireless frames into 802.3 Ethernet frames.

## Security Considerations
- **Evasion:** Because bridges operate silently at Layer 2, they don't decrement the IP Time-To-Live (TTL) counter, and they don't show up on a `traceroute`. An attacker could theoretically install a transparent bridge containing a network tap inline between a switch and a router to intercept traffic without altering the logical network topology.
- **STP Manipulation:** Software bridges (like those created maliciously by malware or accidentally by users enabling "Internet Connection Sharing" on a dual-homed laptop) can inadvertently generate Spanning Tree BPDUs. If the software bridge claims to be the Root Bridge, it can drastically alter the flow of corporate traffic, acting as a massive Man-in-the-Middle.

## Commands / Configuration Examples
Hardware bridges have no modern CLI, but creating software bridges in Linux is a daily task for cloud engineers.

### Linux (Creating a Software Bridge)
```bash
# Using the modern 'ip' tool to create a bridge named 'br0'
sudo ip link add name br0 type bridge

# Add a physical interface (eth0) to the bridge
sudo ip link set dev eth0 master br0

# Bring the bridge interface up
sudo ip link set dev br0 up

# View the bridge's MAC address learning table (equivalent to a switch CAM table)
bridge fdb show
```

## Troubleshooting
- **Bridging Loops:** If two wireless bridges are pointing at the same building, or if a software bridge misconfiguration creates a second path to the same network, a Layer 2 broadcast storm will occur unless STP is enabled on the bridge interfaces.
- **MAC Address Spoofing/Promiscuity:** For a Linux software bridge to work correctly (especially in nested virtualization or packet sniffing), the underlying physical network card must often be put into `promiscuous mode` so it accepts frames destined for the VMs' MAC addresses, not just its own.

## Interview Questions
- What is the primary difference between a bridge and a router? (Answer: A bridge operates at Layer 2 using MAC addresses to connect LANs; a router operates at Layer 3 using IP addresses to connect different subnets).
- How does a bridge improve network performance compared to a hub?
- In modern virtualization, what is the purpose of a "Bridged" network adapter?
- Why was Spanning Tree Protocol originally developed for bridges?

## Summary
The network bridge introduced the concept of intelligent, MAC-based traffic filtering, evolving the chaotic hub-based networks of the past into segmented, efficient systems. Today, the legacy of the bridge lives on entirely within the silicon of every network switch and the virtual networking stacks of modern cloud infrastructure.

## References
- [Switch](switch.md)
- [Hub](hub.md)
- [Data Link Layer](../02-osi-and-tcpip-models/data-link-layer.md)
- [STP](../03-ethernet-and-switching/stp.md)
