# DMZ (Demilitarized Zone)

> A DMZ is a small, isolated network segment positioned between the untrusted public Internet and the trusted internal corporate network.

## Overview
Companies need to host services that are accessible to the public, like their corporate website or email server. Placing these servers directly on the internal network is extremely risky; if the web server gets hacked, the attacker has a direct line into the entire corporate LAN.

A **Demilitarized Zone (DMZ)** solves this by creating a security buffer zone. The DMZ is a separate physical or logical network connected to a firewall. The firewall rules are configured to strictly control traffic flow:
1. The Internet is allowed to talk to servers *in* the DMZ.
2. Servers in the DMZ are strictly **forbidden** from initiating connections *into* the internal LAN.

## Why It Matters
The DMZ is a classic, foundational security architecture. It ensures that even if a public-facing server is completely compromised, the attacker is trapped in an isolated network segment. They cannot immediately pivot and attack the high-value internal assets like domain controllers or employee databases. All modern enterprise firewalls are built around the concept of creating Inside, Outside, and DMZ zones.

## Core Concepts
- **The Buffer Zone:** The DMZ is neither fully trusted nor fully untrusted. It is a semi-trusted zone.
- **Firewall Enforcement:** The logic of a DMZ is enforced entirely by the firewall's rule set.
- **Directional Rules:** The key is the directionality. Traffic can flow *in* from the Internet, and *out* to the Internet, but not *inward* from the DMZ to the LAN.
- **"Single-Homed" vs "Dual-Homed" DMZ:** A simple DMZ might use one firewall with three interfaces (Inside, Outside, DMZ). A highly secure design might use two separate firewalls back-to-back, creating an even stronger logical separation.

## How It Works
1. A user on the Internet sends a request to the corporate website, `www.example.com`.
2. The firewall receives the packet. It sees the destination IP belongs to the web server, which is located in the DMZ network.
3. The firewall checks its ACLs. The rule `Permit TCP from ANY to WebServer_IP on port 443` matches. The packet is allowed.
4. Later, the web server gets compromised. The attacker tries to launch an SMB scan from the web server into the internal `10.0.0.0/8` corporate network.
5. The scan traffic hits the firewall. The firewall sees the packet originated in the DMZ zone and is destined for the `TRUST` zone.
6. The firewall matches the "Implicit Deny" rule (`deny ip any any`) and silently drops the attacker's traffic, logging the attempt.

## Components / Types
Any service that must be initiated by external, untrusted users is a candidate for the DMZ:
- **Web Servers (HTTP/HTTPS)**
- **Email Servers (SMTP)**
- **Public DNS Servers**
- **VPN Termination Gateways**
- **Secure FTP Servers**

## Practical Examples
- **The Physical Analogy:** A DMZ is like the front lobby of a secure building. The public can freely enter the lobby to speak to the receptionist. However, to get past the lobby and into the actual corporate offices, you must pass through a locked door controlled by a security guard (the firewall) who verifies your credentials.

## Security Considerations
- **Split-Brain DNS:** For DNS to work correctly with a DMZ, you often need two DNS servers. The *External DNS* server tells the public that `www.example.com` is at your Public IP. The *Internal DNS* server tells internal employees that `www.example.com` is at the server's Private IP, allowing them to access it directly without their traffic leaving the LAN and re-entering through the public firewall.
- **Data Exfiltration:** While a DMZ stops attackers from initiating *inbound* connections, a compromised DMZ server can still initiate *outbound* connections to the Internet. Strict Egress filtering is required on the DMZ to prevent the attacker from establishing a reverse shell to a C2 server.

## Commands / Configuration Examples
### Cisco ASA (Classic DMZ Configuration)
```text
! Configure the three interfaces with different security levels
! (ASA automatically blocks traffic from a lower number to a higher number)
interface GigabitEthernet0/0
 nameif outside
 security-level 0
 ip address 203.0.113.2 255.255.255.0

interface GigabitEthernet0/1
 nameif inside
 security-level 100
 ip address 10.1.1.1 255.255.255.0
 
interface GigabitEthernet0/2
 nameif dmz
 security-level 50
 ip address 172.16.1.1 255.255.255.0

! Create an ACL to allow web traffic from the Internet to the DMZ server
access-list OUTSIDE_IN permit tcp any host 172.16.1.10 eq 443
access-group OUTSIDE_IN in interface outside
```

## Troubleshooting
- **No Inbound Connectivity:** If external users cannot reach the web server, check the firewall logs to ensure the inbound NAT rule and the security policy are correctly configured to allow traffic *to* the DMZ.
- **DMZ Server Cannot Patch:** A common problem. The web server in the DMZ needs to reach out to the Internet (e.g., to `windowsupdate.com`) to download patches, but the firewall rules were written too strictly. You must create an outbound rule that allows the DMZ servers to access specific required external services.

## Interview Questions
- What is a DMZ and what security problem does it solve?
- Why is it a bad idea to place a public web server directly on the internal corporate LAN?
- Explain the flow of traffic when an internal user accesses a server in the DMZ.
- Does a router or a firewall create a DMZ? (Answer: A firewall).

## Summary
The Demilitarized Zone is a foundational security architecture that provides a controlled buffer between the untrusted outside world and the trusted internal network. By strictly segmenting public-facing services and enforcing rigid, directional firewall rules, the DMZ ensures that the compromise of a web server does not automatically lead to the compromise of the entire enterprise.

## References
- [Firewall](../07-network-devices/firewall.md)
- [Network Segmentation](network-segmentation.md)
- [NAT and PAT](../04-ip-addressing/nat-and-pat.md)
- [Private IP](../04-ip-addressing/private-ip.md)
