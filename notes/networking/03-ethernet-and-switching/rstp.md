# RSTP (Rapid Spanning Tree Protocol)

> RSTP is the modern, significantly faster version of Spanning Tree Protocol, recovering from network link failures in milliseconds rather than nearly a minute.

## Overview
The original Spanning Tree Protocol (802.1D) was revolutionary, but it had a fatal flaw for modern networks: it was slow. If a primary cable broke, legacy STP took 30 to 50 seconds to transition a backup port from Blocking to Forwarding. In an era of VoIP and instant financial transactions, 50 seconds of downtime is unacceptable.

**Rapid Spanning Tree Protocol (IEEE 802.1w)** was developed to solve this. It introduces new port roles and proactive communication mechanisms that allow a network to reconverge almost instantly after a failure.

## Why It Matters
RSTP is the default spanning tree protocol in almost all modern enterprise networks. Understanding the difference between STP and RSTP is critical for network design, as relying on legacy STP can lead to application timeouts and severe user disruption during routine maintenance or minor hardware failures.

## Core Concepts
RSTP improves speed by abandoning legacy STP's passive timers (waiting 20 seconds to be sure no loops exist) and replacing them with active negotiations (switches explicitly agreeing that a link is safe).

- **Backward Compatibility:** RSTP will seamlessly fall back to slow legacy STP if it detects an older switch on the line.
- **Port Roles:** RSTP expands port roles to provide immediate backups:
  - *Root Port:* Best path to the Root Bridge.
  - *Designated Port:* Forwarding port for a segment.
  - *Alternate Port:* A backup for the Root Port. If the Root Port fails, this transitions to Forwarding instantly.
  - *Backup Port:* A backup for a Designated Port (rare, usually involves hubs).

## How It Works
1. **Proposal and Agreement:** Instead of waiting on passive timers, when a new link comes up, an RSTP switch sends a "Proposal" BPDU to its neighbor, temporarily blocking other ports.
2. The neighbor accepts, sending an "Agreement" BPDU back.
3. Because both switches have explicitly agreed the link will not cause a loop, they instantly transition the port to the **Forwarding** state.
4. **Link Failure:** If a Root Port goes down, the switch checks if it has an **Alternate Port**. Because the Alternate Port has been continuously receiving BPDUs and knows it's a valid backup path, it transitions to Forwarding immediately, bypassing the slow listening/learning phases.

## Components / Types
- **Edge Port:** RSTP's official name for a port connected to an end device (PC/Server). Operates identically to Cisco's proprietary `PortFast` feature, transitioning to Forwarding instantly because a PC cannot cause a loop.
- **Point-to-Point Link:** A full-duplex link directly between two switches. The rapid "Proposal/Agreement" handshake *only* works on Point-to-Point links.

## Practical Examples
- **Data Center Maintenance:** An engineer accidentally unplugs the primary fiber uplink from an access switch. With legacy STP, the 500 users on that switch lose network access for 50 seconds while the backup link activates. With RSTP, the Alternate Port takes over in less than 2 seconds, resulting in a barely noticeable blip.

## Security Considerations
RSTP shares the exact same vulnerabilities as legacy STP:
- **Root Bridge Hijacking:** Attackers can still inject superior BPDUs to alter traffic flow.
- **BPDU Guard:** You must still configure BPDU Guard on all Edge Ports to prevent rogue switches or malicious software (like `Scapy`) from injecting BPDUs and disrupting the rapid topology.

## Commands / Configuration Examples
### Cisco IOS
```text
! Change the switch mode from legacy STP/PVST to Rapid PVST+
spanning-tree mode rapid-pvst

! Verify the mode and view port roles (look for 'Altn' for Alternate ports)
show spanning-tree

! Configure a port connected to a PC as an RSTP Edge Port
interface GigabitEthernet1/0/10
 spanning-tree portfast edge
```

## Troubleshooting
- **Slow Convergence:** If you enable RSTP, but your links are still taking 30 seconds to come up, check the link duplex. RSTP's rapid handshake *requires* Full Duplex. If a link falls back to Half Duplex, RSTP treats it as a shared hub connection and reverts to slow legacy STP timers.
- **Legacy Neighbors:** If an RSTP switch receives an 802.1D (legacy) BPDU, it will drop down to legacy speeds for that specific port to maintain compatibility.

## Interview Questions
- What is the IEEE standard for RSTP?
- Explain the purpose of the Alternate Port in RSTP.
- Why is RSTP able to transition ports to a forwarding state much faster than legacy STP? (Answer: Proposal/Agreement handshake instead of passive timers).
- What physical link condition is required for RSTP to negotiate rapidly? (Answer: Full-Duplex / Point-to-Point).

## Summary
RSTP takes the essential loop-prevention mathematics of Spanning Tree and modernizes it. By utilizing active handshakes and pre-calculated backup ports, RSTP provides the high availability and sub-second convergence required by today's continuous-uptime enterprise networks.

## References
- [STP](stp.md)
- [MSTP](mstp.md)
- [Duplex](../01-networking-foundations/duplex.md)
