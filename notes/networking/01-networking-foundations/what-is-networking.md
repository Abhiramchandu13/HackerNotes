# What is Networking

> Networking is the practice of connecting computers, devices, and services so they can exchange data reliably and securely.

## Overview
Networking is the foundation of modern IT. Every login, website visit, file transfer, cloud workload, and remote support session depends on networking. In simple terms, networking is how systems talk to each other using agreed rules, addresses, and transport mechanisms.

For cybersecurity professionals, networking is not optional knowledge. You need it to find exposed services, understand trust boundaries, interpret logs, detect lateral movement, and troubleshoot infrastructure issues.

## Why It Matters
A security tool is only as useful as your understanding of the network underneath it. If you can read packet flows, understand routing, and recognize normal device behavior, you can detect attacks much faster.

Networking matters because it helps you:
- Diagnose connectivity problems quickly
- Understand where data travels and where it can be intercepted
- Identify misconfigurations that create attack paths
- Build and defend enterprise and cloud environments
- Communicate effectively with network, systems, and security teams

## Core Concepts
- A network is a system of connected devices that exchange data.
- Data travels using protocols, addressing, and transmission media.
- Networks can be small, like a home LAN, or global, like the Internet.
- Devices often rely on multiple layers of networking, from physical links to application protocols.
- Security controls are often network controls: firewalls, ACLs, VPNs, segmentation, and monitoring.

## How It Works
At a high level, networking works like this:
1. A device creates data to send.
2. The data is broken into packets or frames depending on the layer.
3. Addresses such as MAC and IP identify where the data should go.
4. Switches, routers, and other devices forward the traffic.
5. The destination reassembles and processes the data.

This process is the basis of [OSI and TCP/IP models](../02-osi-and-tcpip-models/osi-model-overview.md), [Ethernet and Switching](../03-ethernet-and-switching/ethernet.md), and [IP Addressing](../04-ip-addressing/ipv4-addressing.md).

## Components / Types
Common networking components include:
- End devices such as laptops, servers, phones, and printers
- Switching devices such as switches and bridges
- Routing devices such as routers and layer 3 switches
- Security devices such as firewalls and VPN gateways
- Services such as DNS, DHCP, NTP, and directory services

## Practical Examples
- A user opens a browser and resolves a domain name through DNS before connecting to a web server.
- A laptop in a corporate office receives an IP address from DHCP and authenticates to Wi-Fi using 802.1X.
- A cloud application connects to an API across a WAN or VPN tunnel.
- A SOC analyst reviews flow logs to determine whether a host is beaconing to an external IP address.

## Security Considerations
Networking creates both visibility and risk.

Security implications include:
- Open ports can expose services to the Internet
- Flat networks allow attackers to move laterally more easily
- Weak segmentation can expose sensitive systems to untrusted traffic
- Misconfigured DNS, DHCP, or routing can redirect traffic
- Unencrypted protocols can leak credentials or data

Attackers often abuse networking basics such as spoofing, scanning, routing manipulation, and trust relationships. These concepts show up later in [Network Pentesting](../15-network-pentesting/network-attack-methodology.md) and [Network Security](../09-network-security/cia-in-networking.md).

## Commands / Configuration Examples
### Linux
```bash
ip addr show
ip route show
ss -tulpn
ping -c 4 8.8.8.8
```

### Windows
```powershell
ipconfig /all
route print
netstat -ano
Test-NetConnection 8.8.8.8
```

### Cisco IOS
```text
show ip interface brief
show ip route
show interfaces status
ping 8.8.8.8
```

## Troubleshooting
When networking fails, start with the basics:
- Is the link up?
- Does the device have a valid IP address?
- Can it reach the default gateway?
- Can it resolve DNS?
- Can it reach the destination by IP?
- Is a firewall or ACL blocking traffic?

Use a layered approach. Validate physical, then data link, then IP, then transport, then application behavior.

## Interview Questions
- What is networking in simple terms?
- Why is networking important for cybersecurity?
- What devices are commonly found in a network?
- How does a client communicate with a server?
- What is the difference between a network and the Internet?

## Summary
Networking is the language and plumbing of IT. Once you understand how devices connect, address each other, and move traffic, every other networking topic becomes easier.

## References
- [OSI Model Overview](../02-osi-and-tcpip-models/osi-model-overview.md)
- [IPv4 Addressing](../04-ip-addressing/ipv4-addressing.md)
- [Routing Fundamentals](../05-routing/routing-fundamentals.md)
- [Cisco Documentation](https://www.cisco.com/)
- [CompTIA Network+](https://www.comptia.org/certifications/network)
