# TCP/IP Model

> The TCP/IP model is the practical, 4-layer framework that actually runs the modern Internet and enterprise networks.

## Overview
While the OSI model is a theoretical 7-layer framework used for teaching and design, the **Transmission Control Protocol/Internet Protocol (TCP/IP) model** is the actual protocol suite that networks use. Developed by the Department of Defense (DoD) before the OSI model existed, it is leaner, more practical, and defines the rules of the Internet.

## Why It Matters
When you configure a computer or router, you configure TCP/IP settings (IP addresses, subnet masks, default gateways), not OSI settings. Understanding this model is essential because it groups functions exactly how real operating systems handle them. Modern certifications (like CCNA) heavily emphasize the TCP/IP model alongside OSI.

## Core Concepts
The traditional TCP/IP model consists of 4 layers. (Note: Many modern textbooks use a 5-layer version that splits the bottom layer to align better with OSI, but the original DoD model uses 4).

4. **Application Layer:** Represents data to the user, plus encoding and dialog control.
3. **Transport Layer:** Supports communication between diverse devices across diverse networks.
2. **Internet Layer:** Determines the best path through the network.
1. **Network Access Layer:** Controls the hardware devices and media that make up the network.

## How It Works
The TCP/IP model operates via a strict protocol stack. Data is passed from the Application layer, chunked and assigned reliability parameters at the Transport layer, given logical addressing at the Internet layer, and finally pushed onto the wire at the Network Access layer. 

The success of TCP/IP comes from its "hourglass" shape: dozens of protocols exist at the Application layer, dozens of physical mediums exist at the Network Access layer, but almost *everything* converges into just IP (Internet Layer) and TCP/UDP (Transport Layer) in the middle.

## Components / Types
Matching the 4 Layers to their real-world protocols:

1. **Application:** HTTP, FTP, DNS, SMTP, SSH.
2. **Transport:** TCP, UDP.
3. **Internet:** IPv4, IPv6, ICMP, IPsec.
4. **Network Access:** Ethernet, Wi-Fi (802.11), MAC addressing, cabling.

## Practical Examples
- **Sending an Email:** Your email client generates data (Application - SMTP). It is handed to TCP to ensure reliable delivery (Transport). It is given the destination IP of the mail server (Internet). The NIC converts this to electrical signals for the switch (Network Access).
- **TCP/IP Stack:** In operating systems, the "TCP/IP Stack" refers to the literal software code inside the OS kernel that implements these layers.

## Security Considerations
The TCP/IP suite was designed for resilience and routing, not security. 
- **Inherent Weaknesses:** Protocols like IPv4 and ARP have no built-in authentication, leading to spoofing and Man-in-the-Middle attacks.
- **Retrofitting Security:** Security was added later as separate protocols. IPsec was created to secure the Internet layer. TLS was created to secure the top of the Transport/Application layer.
- **TCP/IP Fingerprinting:** Attackers and security scanners (like Nmap) analyze subtle, OS-specific differences in how a host's TCP/IP stack responds to malformed packets to determine if the target is running Windows, Linux, or Cisco IOS.

## Commands / Configuration Examples
Checking your TCP/IP configuration is the most common IT task.

### Linux
```bash
# View Internet and Network Access layer info
ip addr show
```

### Windows
```powershell
# View the TCP/IP stack configuration
ipconfig /all

# Reset the TCP/IP stack if networking software is corrupted
netsh int ip reset
```

### Cisco IOS
```text
# Configure TCP/IP on a router interface
interface GigabitEthernet0/1
 ip address 192.168.1.1 255.255.255.0
 no shutdown
```

## Troubleshooting
Because the TCP/IP model combines the top three OSI layers into one Application layer, troubleshooting is simplified:
- If a web page won't load, but you can SSH into the server, the Transport, Internet, and Network Access layers are perfectly fine. The issue is localized entirely to the HTTP software in the Application layer.
- Use the standard IP suite tools: `ping` (Internet Layer) and `traceroute` (Internet Layer) to isolate faults.

## Interview Questions
- How many layers are in the original TCP/IP model?
- What OSI layers correspond to the TCP/IP Application layer?
- Explain why the TCP/IP model is more relevant to actual network configuration than the OSI model.
- At which TCP/IP layer do IPv4 and IPv6 operate?

## Summary
The TCP/IP model is the practical architecture of the Internet. By grouping theoretical concepts into four actionable layers, it provides a straightforward, robust framework for how software actually communicates over physical hardware.

## References
- [OSI Model Overview](osi-model-overview.md)
- [OSI vs TCP/IP Model](osi-vs-tcpip-model.md)
- [TCP](../06-network-protocols/tcp.md)
- [IPv4 Addressing](../04-ip-addressing/ipv4-addressing.md)
