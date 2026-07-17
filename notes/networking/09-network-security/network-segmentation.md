# Network Segmentation

> Network segmentation is the architectural practice of splitting a large network into smaller, isolated sub-networks to improve security, performance, and manageability.

## Overview
A "flat" network where every device—from the CEO's laptop to the guest Wi-Fi to the database server—lives on the same subnet is a security nightmare. A single compromised device can instantly see and attack every other asset in the company. **Network Segmentation** is the solution.

Using routers, firewalls, and VLANs, administrators divide the network into distinct logical zones. Traffic between these zones is forced to pass through a Layer 3 device, providing a choke point where security policies (like Access Control Lists) can be strictly enforced.

## Why It Matters
Segmentation is the physical embodiment of the "Defense-in-Depth" security principle. By creating multiple layers of separation, you ensure that if an attacker breaches the outer perimeter (e.g., a web server), they are trapped in an isolated DMZ and cannot immediately access high-value internal assets. It is a foundational practice required by nearly all compliance frameworks (PCI-DSS, HIPAA).

## Core Concepts
- **Broadcast Domain Isolation:** The primary goal of segmentation. By using VLANs, you stop broadcast traffic (like ARP and DHCP) from flooding the entire enterprise, which improves performance and reduces the attack surface for local network attacks.
- **Trust Zones:** The network is carved into zones based on risk and function (e.g., Guest, Corporate Users, Servers, IoT, Management).
- **Least Privilege Access:** The firewall rules between zones are configured to "Default Deny." Traffic is only permitted if there is an explicit business justification.
- **East-West vs. North-South Traffic:**
  - *North-South:* Traffic entering or leaving the network (e.g., user to internet).
  - *East-West:* Traffic moving *laterally* within the network (e.g., server to server). Segmentation focuses heavily on controlling East-West traffic.

## How It Works
1. **Design:** The architect decides on logical zones. VLAN 10 for Users, VLAN 20 for Servers, VLAN 99 for Guests.
2. **Implementation (Layer 2):** Switches are configured with these VLANs. User ports are assigned to VLAN 10, server ports to VLAN 20.
3. **Implementation (Layer 3):** A core firewall or Layer 3 switch is configured with gateway interfaces for each VLAN.
4. **Policy Enforcement:** An ACL is applied to the VLAN 10 interface.
   - `Permit TCP from VLAN_10_Subnet to Server_VLAN_Subnet on port 443` (Allow web access).
   - The implicit `deny all` rule at the end blocks all other traffic (like SSH or RDP) from users to the servers.
5. **Result:** An attacker who compromises a user's PC cannot directly scan or attack the database server; the firewall drops the traffic.

## Components / Types
- **Macro-segmentation:** Traditional, large-scale segmentation using VLANs and firewalls to create broad zones (e.g., separating the entire User network from the entire Server network).
- **Micro-segmentation:** A modern, granular approach (often used in data centers and cloud) where you create tiny segments, sometimes down to the individual application or workload. This provides the ultimate Zero Trust posture.

## Practical Examples
- **Guest Wi-Fi:** The most common form of segmentation. The "Guest" SSID is mapped to a dedicated VLAN. The firewall has one rule for that VLAN: `permit all traffic to the Internet`. A second rule, `deny all traffic to any internal corporate network`, isolates guests completely.
- **PCI-DSS Compliance:** A retail company must protect its credit card processing servers. These servers are placed in their own highly-restricted "PCI VLAN." The firewall rules are extremely strict: only the point-of-sale terminals are allowed to talk to the servers, and only on the specific required database port.

## Security Considerations
- **Rule Complexity:** As the number of segments grows, the firewall rule base can become thousands of lines long. Misconfigurations (like a single overly-permissive "allow any" rule) can accidentally bridge two high-security zones.
- **"Hairpinning":** If all inter-VLAN routing is forced through a single central firewall, traffic between two servers in the same rack might have to travel all the way to the core firewall and back again, adding unnecessary latency.
- **East-West Traffic Blindspot:** Historically, security teams focused heavily on inspecting North-South traffic entering from the internet. Attackers realized that once inside, they could move laterally between servers (East-West) with impunity. Modern security focuses on segmenting and monitoring this internal traffic.

## Commands / Configuration Examples
### Cisco IOS (ACL for Inter-VLAN Routing)
```text
! Create an ACL to control traffic from the USER_VLAN
access-list 110 permit tcp any host 10.1.20.10 eq 443
access-list 110 deny   ip any 10.1.20.0 0.0.0.255

! Apply the ACL inbound on the USER_VLAN's SVI
interface Vlan10
 ip access-group 110 in
```

## Troubleshooting
- **Blocked Legitimate Traffic:** The most common segmentation problem. A developer deploys a new application that needs to talk to a database on a different port. The firewall, operating on a "default deny" principle, blocks the connection. The network engineer must add a specific new `permit` rule to the ACL.
- **Asymmetric Routing:** If traffic from VLAN 10 to VLAN 20 is allowed, but the return traffic is not, the TCP handshake will fail and connections will time out. Ensure ACLs account for both directions of a conversation where needed.

## Interview Questions
- What is network segmentation and why is it a critical security principle?
- Explain the difference between North-South and East-West traffic.
- How do VLANs and Firewalls work together to achieve segmentation?
- What is micro-segmentation?

## Summary
Network segmentation is the foundational practice of "divide and conquer." By breaking a flat, vulnerable network into small, isolated security zones and enforcing strict access control at the boundaries, organizations can drastically limit the blast radius of a security breach and ensure attackers cannot move laterally across the enterprise undetected.

## References
- [Micro-segmentation](microsegmentation.md)
- [VLANs and Trunks](../03-ethernet-and-switching/vlans-and-trunks.md)
- [Firewall](../07-network-devices/firewall.md)
- [ACLs](acl.md)
- [Zero Trust](zero-trust.md)
