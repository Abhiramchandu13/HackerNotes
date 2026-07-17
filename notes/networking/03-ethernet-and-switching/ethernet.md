# Ethernet

> Ethernet is the dominant foundational technology for wired local area networks (LANs), defining how devices physically connect and format data for transmission.

## Overview
Ethernet is a family of wired networking technologies standardized under IEEE 802.3. Originally developed in the 1970s using coaxial cables, it has evolved into a highly robust system utilizing twisted-pair copper and fiber optic cables, capable of speeds from 10 Mbps up to 400 Gbps and beyond.

Ethernet operates at the Physical (Layer 1) and Data Link (Layer 2) layers of the OSI model, making it the bedrock upon which higher-level protocols like IPv4 and TCP run on local networks.

## Why It Matters
As the undisputed king of LAN technologies, virtually every wired corporate endpoint, server, and networking device utilizes Ethernet. Understanding Ethernet is mandatory for grasping how data moves locally before it is routed globally. For cybersecurity professionals, Ethernet is the medium where local attacks (like sniffing, spoofing, and rogue device insertion) occur.

## Core Concepts
- **IEEE 802.3:** The official standard defining Ethernet protocols.
- **Baseband Transmission:** Ethernet uses the entire bandwidth of the wire to send a single digital signal at a time.
- **Media Access Control (MAC):** The mechanism Ethernet uses to determine which device is allowed to transmit on the wire at a given time.
- **Speed Evolution:** Ethernet (10 Mbps), Fast Ethernet (100 Mbps), Gigabit Ethernet (1 Gbps), and 10-Gigabit Ethernet (10 Gbps).

## How It Works
1. **Formatting:** An application generates data, which moves down the OSI stack. When it hits Layer 2, Ethernet packages the data into an **Ethernet Frame**.
2. **Addressing:** The frame includes the source MAC address and the destination MAC address to ensure local delivery.
3. **Transmission:** Ethernet passes the frame to Layer 1, where it is serialized into electrical impulses (or light pulses) and sent across the physical cable.
4. **Reception:** The receiving device's Network Interface Card (NIC) listens to the wire. If it sees a frame addressed to its MAC address (or a broadcast address), it accepts the frame, checks for errors, and passes it up to Layer 3.

## Components / Types
- **Ethernet Standards:**
  - `10BASE-T`: 10 Mbps over twisted-pair copper.
  - `100BASE-TX`: 100 Mbps (Fast Ethernet).
  - `1000BASE-T`: 1 Gbps (Gigabit Ethernet) over copper.
  - `10GBASE-SR`: 10 Gbps over short-range multimode fiber.
- **Hardware:** Network Interface Cards (NICs), Switches, Ethernet Cables (Cat5e, Cat6, Fiber).

## Practical Examples
- **Plugging in a Laptop:** When you connect an RJ-45 cable from your laptop to a wall jack, you are establishing an Ethernet connection. The NICs on both ends automatically negotiate the highest mutually supported speed (e.g., 1000BASE-T at Full Duplex).
- **Data Center Backbones:** Server racks are connected to core switches using 10 Gbps or 40 Gbps Ethernet fiber optic links to handle massive traffic loads.

## Security Considerations
Ethernet was designed for reliability, not inherent security.
- **Physical Access:** Ethernet lacks physical authentication by default. Anyone who plugs into an active wall jack has local network access.
- **Packet Sniffing:** If an attacker gains access to a span port, network tap, or forces a switch into "hub mode" via MAC flooding, they can capture all unencrypted Ethernet frames.
- **Pentesting Relevance:** Local attacks like ARP Poisoning and VLAN Hopping rely entirely on abusing Ethernet's inherent trust mechanisms.

## Commands / Configuration Examples
### Linux
```bash
# View Ethernet interface settings, speed, and link status
ethtool eth0

# Show network interface statistics (dropped frames, errors)
ip -s link show eth0
```

### Windows
```powershell
# Get physical Ethernet adapter properties
Get-NetAdapter | Where-Object {$_.MediaType -eq "802.3"}
```

### Cisco IOS
```text
! View the operational status of an Ethernet interface
show interfaces GigabitEthernet0/1

! Manually setting speed and duplex on a switchport
interface GigabitEthernet0/1
 speed 1000
 duplex full
```

## Troubleshooting
- **No Link Light:** The most common Ethernet issue. Usually a bad cable, disconnected patch panel, or administrative shutdown.
- **Auto-Negotiation Failure:** If two connected devices fail to negotiate speed/duplex, one might fall back to half-duplex, causing massive performance drops and "late collisions."
- **Cable Length:** Standard copper Ethernet is limited to 100 meters (328 feet). Exceeding this causes signal attenuation and frame drops.

## Interview Questions
- What IEEE standard governs Ethernet?
- Explain the difference between Fast Ethernet and Gigabit Ethernet.
- What is the maximum distance for a standard twisted-pair Ethernet cable?
- At which two layers of the OSI model does Ethernet operate?

## Summary
Ethernet is the universal standard for wired local area networking. By combining physical cabling specifications with logical frame structures, Ethernet provides a fast, standardized, and reliable way for devices to communicate on the same network segment.

## References
- [Frames](frames.md)
- [CSMA/CD](csma-cd.md)
- [IEEE 802.3 Standards](https://standards.ieee.org/)
- [Cables and Connectors](../01-networking-foundations/cables-and-connectors.md)
