# Hub

> A hub is a legacy, unintelligent network device that connects multiple computers together by blindly repeating every electrical signal it receives out of all its other ports.

## Overview
Before the invention of intelligent switches, Local Area Networks (LANs) were built using **Hubs**. Operating strictly at the **Physical Layer (Layer 1)** of the OSI model, a hub is simply a multi-port repeater. It has no brain, no memory, and no concept of MAC addresses or IP addresses. It merely takes incoming electrical voltage on one port and amplifies and repeats that exact voltage out of every other port.

Today, hubs are entirely obsolete and represent a significant performance bottleneck and security risk if found in a production network.

## Why It Matters
You will almost never install a hub today. However, understanding how a hub works is mandatory for grasping foundational networking concepts like **Collision Domains**, half-duplex communication, and the CSMA/CD protocol. In cybersecurity, understanding hubs is crucial because attackers occasionally use specialized "network taps" (which behave exactly like hubs) to silently intercept network traffic.

## Core Concepts
- **Layer 1 Device:** It deals only in electrical signals (bits), completely ignoring Ethernet frames or IP packets.
- **Single Collision Domain:** Because a hub connects all devices to a single shared electrical medium, if two computers send data at the exact same millisecond, the electrical signals crash into each other, corrupting the data (a collision).
- **Single Broadcast Domain:** A hub forwards all traffic, including broadcasts, everywhere.
- **Half-Duplex Only:** Because of the shared medium, devices on a hub can only send *or* receive at one time. They cannot do both simultaneously (Full-Duplex).

## How It Works
1. PC A, PC B, and PC C are plugged into a 4-port Hub.
2. PC A wants to send a file specifically to PC C.
3. PC A's network card converts the data into electrical signals and sends them down the cable to the Hub.
4. The Hub receives the signal on Port 1.
5. The Hub blindly regenerates that signal and pushes it out Port 2 (to PC B) and Port 3 (to PC C).
6. PC B's network card receives the signal, processes it up to Layer 2, realizes the Destination MAC address doesn't belong to it, and drops the data.
7. PC C receives the signal, recognizes its own MAC address, and processes the file.

## Components / Types
- **Active Hub:** Plugs into the wall for power. It actively amplifies and regenerates the electrical signal before pushing it out the other ports, allowing for longer cable runs.
- **Passive Hub:** Requires no power. Simply acts as a physical splitter for the wires. Extremely rare and degrades signal quality rapidly.

## Practical Examples
- **The "LAN Party" Era:** In the late 90s, gamers would connect 5 PCs to a cheap 10Mbps hub to play games. As more players joined, the hub would experience massive collisions, slowing the network to a crawl for everyone.
- **Network Taps (Modern equivalent):** A security team places a physical "Tap" on the fiber cable connecting the core router to the firewall. Like a hub, the Tap mirrors all electrical signals passing through it to a third port connected to an Intrusion Detection System (IDS), allowing the IDS to passively monitor all traffic without acting as a bottleneck.

## Security Considerations
Hubs are an absolute security nightmare by modern standards.
- **Inherent Eavesdropping:** Because a hub broadcasts every packet to every port, isolation is impossible. An attacker plugging a laptop into a hub can open Wireshark and effortlessly capture every unencrypted password, email, and file transferred by anyone else connected to that hub. (Unlike a switch, which requires advanced MAC Flooding or ARP Spoofing to achieve the same result).
- **Rogue Device Threat:** If a user brings a cheap hub from home to split the single wall jack in their cubicle for multiple devices, they bypass switch port capacity planning and introduce a collision domain into a modern switched environment.

## Commands / Configuration Examples
Hubs are unmanaged Layer 1 devices. They have no IP address, no operating system, no console port, and zero configuration commands. You plug them in, and they work.

### Troubleshooting (Detecting a Hub on a Cisco Switch)
If a user secretly plugs a hub into a corporate switch port and connects multiple PCs, you can detect it on the switch by checking how many MAC addresses are originating from that single port.

```text
! View MAC addresses learned on a specific switch port
show mac address-table interface GigabitEthernet1/0/5

! If the output shows 4 different MAC addresses dynamically learned on 
! a port intended for a single user PC, they likely plugged in a hub or unmanaged switch.
```

## Troubleshooting
- **Massive Network Slowdowns:** Because hubs operate at half-duplex and share bandwidth, a 100Mbps hub with 10 heavy users means they are all fighting for slices of that 100Mbps. Network speeds will degrade exponentially as utilization rises due to constant data collisions and retransmissions (managed by CSMA/CD).
- **Late Collisions:** Connecting a modern full-duplex PC to a legacy half-duplex hub results in a duplex mismatch, causing late collisions and effectively breaking the connection.

## Interview Questions
- At what layer of the OSI model does a hub operate? (Answer: Layer 1).
- What is the difference between how a hub and a switch handle incoming traffic?
- Why does a hub create a single collision domain?
- From a security perspective, why is a hub dangerous?

## Summary
The network hub is the primitive ancestor of the modern switch. By understanding its brute-force method of blindly repeating electrical signals, engineers can better appreciate the performance, segmentation, and security benefits provided by Layer 2 switching technologies.

## References
- [Switch](switch.md)
- [Physical Layer](../02-osi-and-tcpip-models/physical-layer.md)
- [CSMA/CD](../03-ethernet-and-switching/csma-cd.md)
- [Network Reconnaissance](../13-network-pentesting/network-reconnaissance.md)
