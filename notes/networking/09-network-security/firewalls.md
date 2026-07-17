# Firewall

> A firewall is a network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules, acting as a barrier between trusted and untrusted networks.

## Overview
If a router's job is to forward traffic, a **Firewall's** job is to stop it. Operating traditionally at **Layer 3 (Network)** and **Layer 4 (Transport)**, firewalls inspect the Source IP, Destination IP, and TCP/UDP ports of every passing packet. 

If you connect a corporate network directly to the Internet without a firewall, malicious bots will scan and exploit vulnerable internal servers within minutes. The firewall establishes a perimeter, ensuring that only explicitly authorized traffic can enter or leave the enterprise.

## Why It Matters
Firewalls are the foundation of network security. Without them, concepts like the DMZ or secure remote access (VPNs) cannot exist. For network engineers, firewalls are the choke points where routing policy meets security policy. For penetration testers, bypassing, evading, or tunneling through firewalls is the core challenge of external network exploitation.

## Core Concepts
- **Default Deny:** The golden rule of firewalls. If there is not a specific rule explicitly *allowing* the traffic, the firewall must drop it.
- **Stateful Inspection:** Modern firewalls are "stateful." If an internal PC makes an outbound request to Google (Port 80), the firewall remembers that connection "state." When Google replies, the firewall dynamically allows the return traffic through, even if there is no explicit inbound allow rule.
- **Stateless (Packet Filtering):** Older technology (like basic Router ACLs). Every packet is evaluated individually. You must write two rules: one allowing traffic out, and a separate rule allowing the reply traffic back in.
- **Ingress vs. Egress Filtering:** Ingress means filtering incoming traffic (protecting servers from the internet). Egress means filtering outbound traffic (stopping compromised internal PCs from calling out to hacker command-and-control servers).

## How It Works
1. A packet arrives at the firewall's external interface.
2. The firewall checks its active "State Table." If the packet is a reply to an already established outbound connection, it passes it through immediately.
3. If it is a new connection attempt (e.g., a TCP SYN packet), the firewall checks its Rule Base, reading from top to bottom.
4. **Rule 1:** `Deny IP from Bad-IP-List` -> No match.
5. **Rule 2:** `Permit TCP from Any to WebServer_IP on Port 443` -> Match!
6. The firewall stops evaluating rules, creates a new entry in its State Table, and forwards the packet to the internal web server.
7. If the packet reaches the bottom of the list without matching a rule, it hits the invisible "Implicit Deny All" rule and is dropped.

## Components / Types
- **Network Firewalls:** Hardware appliances or virtual machines protecting the entire network perimeter (e.g., Cisco ASA, Palo Alto, pfSense).
- **Host-Based Firewalls:** Software firewalls running directly on end-user operating systems (e.g., Windows Defender Firewall, Linux `iptables`/`ufw`). They protect the laptop itself, regardless of what network it connects to.
- **Next-Generation Firewalls (NGFW):** Advanced firewalls that go beyond Port/IP blocking and inspect Layer 7 Application data (discussed fully in the [Next-Gen Firewalls note](../07-network-devices/next-gen-firewalls.md)).

## Practical Examples
- **The DMZ (Demilitarized Zone):** A company hosts an email server. They place the server in a special firewall zone called the DMZ. The firewall rules allow the Internet to reach the email server. However, if hackers compromise the email server, the firewall aggressively blocks the email server from initiating connections into the sensitive internal corporate LAN.
- **NAT (Network Address Translation):** Almost all edge firewalls simultaneously perform NAT, hiding internal private IP addresses behind a single public IP.

## Security Considerations
- **Rule Bloat:** Over years, administrators add hundreds of temporary rules and forget to delete them. This "rule bloat" slows down firewall processing and inevitably creates accidental holes allowing attackers inside. Regular firewall auditing is required.
- **Egress Neglect:** Many junior admins strictly filter inbound traffic but allow all outbound traffic (`Allow Any Any Out`). If an employee downloads malware via email, that malware easily opens a reverse-shell outbound through the firewall to the attacker, bypassing all inbound protections.
- **ICMP Blocking:** Overzealous admins sometimes block all ICMP traffic. Blocking ICMP Type 3 (Fragmentation Needed) completely breaks Path MTU Discovery, causing encrypted VPN connections and large file transfers to mysteriously fail.

## Commands / Configuration Examples
### Linux (Host-Based Firewall via UFW)
```bash
# Enable the Uncomplicated Firewall
sudo ufw enable

# Set the Default Deny policy
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Explicitly allow SSH (Port 22) and HTTPS (Port 443)
sudo ufw allow 22/tcp
sudo ufw allow 443/tcp

# View the active rules
sudo ufw status verbose
```

### Cisco ASA (Network Firewall)
```text
! Create an object for the internal web server
object network WebServer
 host 10.1.1.50

! Create an Access Control List (ACL) to permit HTTPS
access-list OUTSIDE_IN extended permit tcp any object WebServer eq 443

! Apply the ACL to the physical Outside interface
access-group OUTSIDE_IN in interface outside
```

## Troubleshooting
- **Connection Timed Out:** If a user tries to access a service and it times out, the firewall is likely "Dropping" the packet silently. 
- **Connection Refused:** If the connection is refused immediately, the firewall might be "Rejecting" the packet (sending a TCP RST back), or the traffic successfully passed the firewall, but the target server's service isn't actually running.
- **Reading the Logs:** Firewalls are useless if you don't read the logs. If traffic is failing, query the firewall's real-time traffic log for the Source IP and Destination IP. The log will explicitly state which Rule ID caused the packet to be dropped.

## Interview Questions
- What is the difference between a stateless packet filter and a stateful firewall?
- Explain the concept of the "Implicit Deny" rule.
- What is the difference between a network firewall and a host-based firewall?
- Why is Egress filtering just as important as Ingress filtering?

## Summary
The firewall is the fundamental access control mechanism of networking. By utilizing stateful inspection to permit only explicitly authorized traffic, firewalls define the perimeter, enforce trust boundaries, and separate secure internal resources from the hostile public Internet.

## References
- [Next-Gen Firewalls (NGFW)](../07-network-devices/next-gen-firewalls.md)
- [Router](../07-network-devices/router.md)
- [NAT and PAT](../04-ip-addressing/nat-and-pat.md)
- [Network Segmentation](network-segmentation.md)
