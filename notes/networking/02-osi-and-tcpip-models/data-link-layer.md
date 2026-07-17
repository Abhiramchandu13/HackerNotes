# Layer 2 - Data Link Layer

> The Data Link Layer (Layer 2) enables node-to-node data transfer on the same local network and handles error detection.

## Overview
Layer 2 provides reliable transit of data across a physical network link. While Layer 1 just sends raw bits blindly, Layer 2 organizes those bits into logical chunks called **Frames**. It uses physical hardware addresses to ensure frames are delivered to the correct device on the local area network (LAN).

## Why It Matters
Without Layer 2, devices would not know how to distinguish their data from background noise or data meant for other devices on a shared medium. Understanding Layer 2 is critical for managing switches, configuring VLANs, and defending against local network attacks like ARP spoofing or MAC flooding.

## Core Concepts
- **Frames:** The Protocol Data Unit (PDU) for Layer 2.
- **MAC Addresses:** Media Access Control addresses are 48-bit unique hardware addresses burned into every Network Interface Card (NIC).
- **Error Detection:** Uses a Frame Check Sequence (FCS) in the frame trailer to detect if bits were corrupted in transit.
- **Two Sublayers:**
  1. **Logical Link Control (LLC):** Identifies the Network layer protocol (like IPv4 or IPv6) and encapsulates it.
  2. **Media Access Control (MAC):** Controls how devices access the physical media and defines hardware addressing.

## How It Works
1. The Data Link Layer receives a Packet from Layer 3 (Network).
2. It encapsulates the packet by adding a **Header** (containing Source MAC and Destination MAC) and a **Trailer** (containing the FCS for error checking).
3. The resulting Frame is passed to Layer 1 for physical transmission.
4. When a switch receives the frame, it reads the Destination MAC address, consults its MAC address table (CAM table), and forwards the frame out the specific port where that device resides.

## Components / Types
- **Switches:** The primary Layer 2 device. They learn MAC addresses and intelligently forward frames.
- **Bridges:** Older devices used to connect two LAN segments.
- **NICs (Network Interface Cards):** Operate at both L1 (physical signaling) and L2 (MAC addressing).
- **Protocols:** Ethernet (802.3), Wi-Fi (802.11), Point-to-Point Protocol (PPP), HDLC.

## Practical Examples
- Your laptop connects to a corporate switch via Wi-Fi or Ethernet. When sending a print job to a local printer, the switch looks at the printer's MAC address in your Layer 2 frame and sends the data only to the printer's switch port.
- VLANs (Virtual LANs) are implemented at Layer 2 to logically divide a physical switch into multiple isolated broadcast domains.

## Security Considerations
Because Layer 2 implicitly trusts devices on the local network, it is vulnerable to internal attacks:
- **MAC Flooding:** Flooding a switch with fake MAC addresses to exhaust its memory, forcing it to act like a hub and broadcast all traffic (aiding in packet sniffing).
- **ARP Spoofing/Poisoning:** An attacker sends forged ARP messages to associate their MAC address with the IP address of the default gateway, enabling Man-In-The-Middle (MitM) attacks.
- **VLAN Hopping:** Exploiting misconfigured trunk ports to access a VLAN the attacker is not authorized to see.

## Commands / Configuration Examples
### Linux
```bash
ip link show         # Displays MAC addresses of interfaces
bridge fdb show      # View the forwarding database (MAC table) on a Linux bridge
```

### Windows
```powershell
getmac               # Shows the MAC address for local adapters
arp -a               # Shows the ARP cache mapping IP to MAC addresses
```

### Cisco IOS
```text
show mac address-table       ! Displays the Layer 2 forwarding table
show interfaces trunk        ! Displays Layer 2 VLAN trunking status
```

## Troubleshooting
When troubleshooting Layer 2:
- **Check the MAC table:** Is the switch actually learning the MAC address of the device?
- **Verify VLAN assignment:** Are the source and destination devices in the same VLAN?
- **Check trunk links:** If traffic must pass between switches, ensure the VLAN is permitted on the trunk.
- **Look for input errors:** High CRC or FCS errors indicate frames are getting corrupted, often pointing back to a Layer 1 issue like a bad cable.

## Interview Questions
- What is the PDU of the Data Link Layer?
- What are the two sublayers of the Data Link Layer?
- How does a switch differ from a hub at the OSI layer level?
- What is the purpose of the FCS in an Ethernet frame?

## Summary
The Data Link Layer transforms raw physical bits into organized, addressable frames. By utilizing MAC addresses and switches, Layer 2 ensures efficient, directed communication between nodes on the same local network segment.

## References
- [Physical Layer](physical-layer.md)
- [Network Layer](network-layer.md)
- [Ethernet and Switching](../03-ethernet-and-switching/ethernet.md)
- [MAC Addresses](../03-ethernet-and-switching/mac-addresses.md)
