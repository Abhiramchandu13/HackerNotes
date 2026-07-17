# ARP (Address Resolution Protocol)

> ARP translates logical Layer 3 IP addresses into physical Layer 2 MAC addresses so devices can communicate on a local network.

## Overview
For data to travel across the globe, it relies on IP addresses. But for data to travel across the actual wire in your office, it relies on MAC addresses. **Address Resolution Protocol (ARP)** is the bridge between these two worlds. When a computer knows the IP address it wants to reach but doesn't know the hardware MAC address of that device, it uses ARP to find out.

## Why It Matters
Without ARP, modern local networking over Ethernet would not function. IP packets would sit on your computer, unable to be encapsulated into Ethernet frames. For cybersecurity, ARP is fundamentally flawed regarding authentication. This lack of security makes ARP Poisoning one of the most common and effective local network attacks in a pentester's toolkit.

## Core Concepts
- **ARP Request:** "Who has IP 192.168.1.5? Tell 192.168.1.10." (Sent as a broadcast to `FF:FF:FF:FF:FF:FF`).
- **ARP Reply:** "I have 192.168.1.5, and my MAC is AA:BB:CC:11:22:33." (Sent as a unicast directly back to the requester).
- **ARP Cache (Table):** A temporary memory store on a device that saves IP-to-MAC mappings so it doesn't have to send an ARP request for every single packet.
- **Local Only:** ARP only functions on the local subnet. It does not cross routers.

## How It Works
Scenario: PC-A (`10.0.0.5`) wants to ping PC-B (`10.0.0.9`).
1. **Check Cache:** PC-A checks its internal ARP cache. Does it already know PC-B's MAC? If yes, it builds the frame. If no, proceed to step 2.
2. **ARP Request:** PC-A crafts an ARP Request frame. The Destination MAC is the broadcast address (`FF:FF...`). The switch receives this and floods it out of all ports.
3. **Processing:** Every device on the VLAN receives the request. They check the target IP. Devices that are not `10.0.0.9` drop the frame.
4. **ARP Reply:** PC-B sees the request is for its IP. It crafts an ARP Reply containing its MAC address and sends it directly back to PC-A.
5. **Update Cache:** PC-A receives the reply, saves the mapping in its ARP cache, and can now construct the final Ethernet frame to send the ICMP Ping packet.

*Note: If PC-A wants to reach Google (`8.8.8.8`), it knows Google isn't local. It will ARP for the MAC address of its **Default Gateway** (router) instead.*

## Components / Types
- **Dynamic ARP Entries:** Learned automatically via Requests/Replies. They time out and are deleted if not used (usually after a few minutes on PCs, or a few hours on routers).
- **Static ARP Entries:** Manually entered by an administrator. They never time out.
- **Proxy ARP:** When a router answers an ARP request on behalf of a device situated on another network.
- **Gratuitous ARP:** An unprompted ARP reply broadcasted to update other devices' ARP caches (often used in High Availability setups).

## Practical Examples
- **Initial Connection:** When you first boot your laptop and connect to Wi-Fi, it uses ARP to find the MAC address of the local router so it can access the Internet.
- **Wireshark:** Filtering by `arp` in Wireshark will show constant background chatter of "Who has X? Tell Y" as devices maintain their local topologies.

## Security Considerations
ARP assumes everyone on the network is telling the truth. It has no mechanism to verify identities.
- **ARP Spoofing / Poisoning:** An attacker sends forged ARP Replies to the network. They tell the Gateway, "I am the PC," and tell the PC, "I am the Gateway." Both devices update their ARP caches with the attacker's MAC address.
- **Man-in-the-Middle (MitM):** All traffic between the PC and the Internet now physically flows through the attacker's machine, allowing them to sniff, drop, or modify traffic.
- **Defense:** Enterprise switches use **Dynamic ARP Inspection (DAI)**, which checks ARP packets against a trusted database (like DHCP snooping bindings) and drops forged replies.

## Commands / Configuration Examples
### Windows
```powershell
# View the local ARP cache
arp -a

# Clear the ARP cache (requires Admin)
arp -d *
```

### Linux
```bash
# View the ARP cache
ip neigh show
# or the older command
arp -n

# Clear an ARP entry
sudo ip neigh flush all
```

### Cisco IOS
```text
! View the router's ARP table
show ip arp

! Clear the ARP cache
clear arp-cache
```

## Troubleshooting
- **Incorrect IP-to-MAC mapping:** If a device receives a new IP but other devices still have the old mapping cached, communication will fail. Clearing the ARP cache resolves this.
- **Duplicate IP Addresses:** If two devices have the same IP, they will both reply to ARP requests for that IP. Other devices' ARP caches will constantly overwrite each other, causing intermittent connection drops.
- **Cannot reach the Internet:** Ensure the device can successfully resolve the MAC address of its default gateway.

## Interview Questions
- Explain the exact purpose of the ARP protocol.
- Does an ARP request use a unicast or broadcast MAC address?
- If a computer wants to reach a server on the Internet, what device does it send an ARP request for?
- Explain how an ARP poisoning attack works.

## Summary
ARP is the critical translation layer that binds logical IP networks to physical Ethernet networks. By caching IP-to-MAC mappings, it ensures efficient local communication, though its trust-based nature requires additional security controls in enterprise environments.

## References
- [MAC Addresses](mac-addresses.md)
- [IPv4 Addressing](../04-ip-addressing/ipv4-addressing.md)
- [Gratuitous ARP](gratuitous-arp.md)
- [Network Attack Methodology](../15-network-pentesting/network-attack-methodology.md)
