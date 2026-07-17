# Spanning Tree Protocol (STP)

> Spanning Tree Protocol (STP) prevents devastating broadcast loops in a network by finding redundant paths and mathematically blocking them.

## Overview
Redundancy is good; if a cable breaks, you want a backup cable. However, in Layer 2 Ethernet networks, physical redundancy creates a fatal problem: **Switching Loops**. Because Ethernet frames do not have a "Time to Live" (TTL) mechanism to kill them, a broadcast frame caught in a loop will circulate endlessly, duplicating itself until it consumes 100% of network bandwidth and crashes the switches. 

STP (IEEE 802.1D) solves this by examining the physical topology, finding the loops, and placing redundant ports into a "Blocking" state.

## Why It Matters
Without STP, plugging two cables between the same two unmanaged switches will bring down an entire corporate network in seconds (a Broadcast Storm). Understanding STP is a core requirement for any network engineer, as misconfigurations here cause the most catastrophic network outages.

## Core Concepts
- **Broadcast Storm:** The catastrophic result of a Layer 2 loop, where broadcast frames multiply infinitely.
- **BPDU (Bridge Protocol Data Unit):** The multicast messages switches send to each other to share STP information.
- **Root Bridge:** The single "king" switch of the topology. All path calculations are made based on the shortest distance to the Root Bridge.
- **Bridge ID (BID):** A value comprising a Priority number (default 32768) + the switch's MAC address. The switch with the lowest BID becomes the Root Bridge.
- **Port States:** A port transitions through states (Blocking, Listening, Learning) before finally reaching the **Forwarding** state where data can pass.

## How It Works
When switches are powered on, the STP algorithm runs:
1. **Elect the Root Bridge:** All switches send BPDUs. The switch with the lowest Bridge ID wins. (Network admins should manually set the core switch priority to `4096` to ensure it wins).
2. **Find the Root Ports:** Every non-root switch finds the single fastest path back to the Root Bridge. That port becomes the Root Port (RP) and stays unblocked (Forwarding).
3. **Find the Designated Ports:** For every network segment (wire), one port must be responsible for sending traffic toward the Root. This is the Designated Port (DP) and it stays unblocked.
4. **Block the Rest:** Any port that is not a Root Port or a Designated Port is put into a **Blocking** state. No data passes through it, effectively breaking the physical loop.
5. **Convergence:** If a forwarding cable breaks, STP realizes the topology has changed, unblocks the backup port, and restores traffic. (Original STP takes about 30-50 seconds to converge).

## Components / Types
- **STP (802.1D):** The original, legacy protocol. Very slow convergence (up to 50 seconds).
- **RSTP (802.1w):** Rapid Spanning Tree Protocol. The modern standard. Converges in under 2 seconds.
- **PVST+ (Per-VLAN Spanning Tree):** Cisco's proprietary version that runs a separate instance of STP for every single VLAN, allowing for load balancing.
- **MSTP (802.1s):** Multiple Spanning Tree Protocol. Groups multiple VLANs into a single STP instance to save switch CPU cycles.

## Practical Examples
- **Redundant Links:** You connect Switch B and Switch C to your core Router. For backup, you connect a cable directly between Switch B and Switch C. STP detects the triangle, realizes traffic can loop, and blocks the B-to-C link.
- **PortFast / Edge Port:** Connecting a PC to a switch takes 30 seconds for the port to turn green because STP is listening for loops. Enabling `PortFast` tells STP "This is a PC, not a switch, skip the listening phase and turn on instantly."

## Security Considerations
STP is vulnerable to manipulation if edge ports aren't secured.
- **Root Guard Bypass / DoS:** An attacker connects a laptop to a wall jack, runs a tool like `Yersinia`, and generates fake BPDUs claiming a Priority of 0. The network thinks the attacker is the new Root Bridge, rerouting all traffic through the attacker's laptop (causing a massive DoS or MitM).
- **BPDU Guard:** A crucial defense mechanism. If you configure a port for a PC (PortFast), you should also enable **BPDU Guard**. If a BPDU is received on that port, the switch immediately shuts the port down (ErrDisable), neutralizing the attacker.

## Commands / Configuration Examples
### Cisco IOS
```text
! Force this switch to become the Root Bridge for VLAN 1
spanning-tree vlan 1 root primary

! View the STP topology and see which ports are blocked/forwarding
show spanning-tree

! Configure a user-facing port to bypass STP delays and block malicious BPDUs
interface GigabitEthernet1/0/10
 spanning-tree portfast
 spanning-tree bpduguard enable
```

## Troubleshooting
- **Broadcast Storms:** If the entire network grinds to a halt and switch activity lights are solid green (not blinking), you have a broadcast storm. Someone likely disabled STP or plugged a dumb hub into two ports simultaneously.
- **Unpredictable Traffic Paths:** If traffic is flowing through a slow 100Mbps edge switch instead of the 10Gbps core, the edge switch probably has a lower MAC address and accidentally became the Root Bridge because priorities were left at default.

## Interview Questions
- What exact problem does Spanning Tree Protocol solve?
- Why do Ethernet networks suffer from loops while IP networks do not? (Answer: IP packets have a TTL field, Ethernet frames do not).
- How is the Root Bridge elected?
- What is BPDU Guard and why is it important for security?

## Summary
Spanning Tree Protocol transforms a physically chaotic, redundant web of cables into a safe, loop-free logical tree. While legacy STP is slow, its underlying logic of Root Bridges, BPDUs, and port blocking remains the foundation of modern Layer 2 resiliency.

## References
- [RSTP](rstp.md)
- [MSTP](mstp.md)
- [Ethernet Frames](frames.md)
- [Network Reconnaissance](../15-network-pentesting/network-reconnaissance.md)
