# Access Control Lists (ACLs)

> An ACL is a set of rules applied to a network device interface that inspects passing traffic and decides whether to permit or deny it based on IP addresses, ports, and protocols.

## Overview
A router's primary job is to forward traffic, but it must do so intelligently and securely. **Access Control Lists (ACLs)** are the router's bouncers. They are a sequential list of `permit` and `deny` statements that act as a stateless packet filter. When a packet enters or exits an interface, the router checks it against the ACL from top to bottom. The very first rule that matches determines the packet's fate.

## Why It Matters
ACLs are the most fundamental form of network security filtering. While less sophisticated than modern NGFWs, they are universally available on every router, switch, and operating system. Understanding how to write a precise ACL is a mandatory skill for any network engineer looking to protect the management plane of their devices or implement basic inter-VLAN security.

## Core Concepts
- **Sequential Processing:** The router reads the ACL from the top down. As soon as a packet matches a line, the router stops reading and executes that rule.
- **First Match Wins:** The order of ACL statements is critical. A broad `permit` rule placed at the top will completely negate a specific `deny` rule placed below it.
- **Implicit Deny:** Every ACL ends with an invisible, unwritten rule: `deny any any`. If a packet does not match any of the `permit` rules you have written, it is dropped by default.
- **Inbound vs. Outbound:** ACLs are applied in a specific direction on an interface. An `in` ACL filters traffic as it enters the router. An `out` ACL filters traffic as it leaves.

## How It Works
1. A packet with Source IP `10.0.1.5` and Destination Port `80` arrives at Router Interface `Gi0/1`.
2. An ACL is applied to this interface in the `in` direction. The router begins reading:
   - `deny tcp 10.0.1.5 any eq 22`: No match (ports are different).
   - `deny ip 10.0.1.0 0.0.0.255 any`: No match. Wait, yes it is! The source IP is inside this range. **The packet is dropped.** The router stops processing.
3. If the second rule were `permit ip 10.0.1.0 0.0.0.255 any`, the packet would have been allowed.

## Components / Types
### Standard ACLs (Numbered 1-99)
- **Extremely Basic:** Can ONLY filter based on the **Source IP Address**.
- **Rule of Thumb:** Because they are so simplistic and lack port information, they are placed as close to the *destination* as possible to avoid accidentally blocking legitimate traffic.

### Extended ACLs (Numbered 100-199)
- **Highly Granular:** The enterprise standard. Can filter based on:
  - Source IP Address
  - Destination IP Address
  - Protocol (TCP, UDP, ICMP, etc.)
  - Source Port and Destination Port
- **Rule of Thumb:** Because they are so specific, they are placed as close to the *source* of the traffic as possible to drop unwanted packets before they consume network bandwidth.

## Practical Examples
- **Securing VTY Lines:** An administrator wants to ensure only the IT department's subnet (`192.168.50.0/24`) can SSH into the core router. They apply a standard ACL to the router's virtual management lines (`line vty 0 4`).
- **Inter-VLAN Filtering:** A Layer 3 switch has SVIs for VLAN 10 (Users) and VLAN 20 (Servers). The admin applies an Extended ACL to the VLAN 10 interface in the `in` direction. The ACL permits traffic destined for the Server VLAN on port 443 (HTTPS) but denies all other traffic, preventing users from trying to SSH into the servers.

## Security Considerations
- **"Permit Any Any":** A common mistake made by junior admins trying to troubleshoot an issue is to place a `permit ip any any` rule at the top of an ACL. This instantly renders every single security rule below it useless.
- **Wildcard Masks:** Cisco ACLs use inverted subnet masks called "wildcard masks" (e.g., `0.0.0.255` instead of `255.255.255.0`), which is a massive source of configuration errors that can lead to unintentionally open security policies.
- **Asymmetric Routing:** ACLs are stateless. If traffic leaves via Router A (and is permitted by its ACL), but the reply comes back via Router B, Router B's ACL must also have a specific rule permitting that return traffic, complicating network design.

## Commands / Configuration Examples
### Cisco IOS
```text
! Creating an Extended ACL to allow web traffic but deny telnet
access-list 101 permit tcp 10.1.1.0 0.0.0.255 any eq www   ! eq www is shorthand for port 80
access-list 101 permit tcp 10.1.1.0 0.0.0.255 any eq 443
access-list 101 deny   tcp any any eq telnet
! Note: The implicit 'deny ip any any' is at the end

! Applying the ACL inbound on an interface
interface GigabitEthernet0/1
 ip access-group 101 in

! View the ACL and its hit counters
show access-lists 101
```

## Troubleshooting
- **Hit Counters:** The `show access-lists` command is the #1 troubleshooting tool. It shows a "hit count" next to every line, telling you exactly how many packets have matched that specific rule. If traffic is failing and the hit counter on the `deny` line is rapidly increasing, you have found the problem.
- **ACL Order:** If a `permit` rule is not working, check if a more general `deny` rule is placed above it in the list. Remember: first match wins.

## Interview Questions
- What is the difference between a Standard and an Extended ACL?
- What is the "implicit deny" in an ACL?
- If you want to block SSH traffic from a specific subnet, where should you place the extended ACL for maximum efficiency? (Answer: As close to the source as possible, on the inbound interface).
- What is a wildcard mask?

## Summary
Access Control Lists are the original, fundamental tool for network packet filtering. By sequentially processing traffic against a user-defined ruleset of `permit` and `deny` statements, ACLs provide a fast, efficient, and universally available mechanism to enforce basic network security policy directly on routers and switches.

## References
- [Firewall](firewall.md)
- [Network Layer](../02-osi-and-tcpip-models/network-layer.md)
- [Routing Table](../05-routing/routing-table.md)
- [IPv4 Addressing](../04-ip-addressing/ipv4-addressing.md)
