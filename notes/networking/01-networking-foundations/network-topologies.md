# Network Topologies

> Network topology describes how devices are arranged physically and logically in a network.

## Overview
Topology is the shape of a network. Some topologies describe cable layout, while others describe how traffic actually flows.

In practice, physical and logical topology are often different. A switch-based office may look like a star physically but behave like a segmented logical design with VLANs and routing boundaries.

## Why It Matters
Topology affects:
- Fault tolerance
- Performance
- Ease of troubleshooting
- Cost of deployment
- Security segmentation

A bad topology can create single points of failure or make attacks easier to spread.

## Core Concepts
Common topologies include:
- Bus
- Star
- Ring
- Mesh
- Hybrid
- Tree
- Spine-leaf

Physical topology is the actual wiring or radio layout. Logical topology is the traffic path and forwarding behavior.

## How It Works
### Bus
All devices share the same medium. Rare in modern enterprise networks.

### Star
All devices connect to a central point such as a switch or hub.

### Ring
Each device connects to two neighbors, forming a loop.

### Mesh
Devices connect to multiple other devices for resilience.

### Hybrid
A mix of multiple topologies.

### Spine-Leaf
A modern data center design where leaf switches connect to spine switches for predictable latency and scale. See [Spine-Leaf Architecture](../12-enterprise-networking/spine-leaf-architecture.md).

## Components / Types
- Physical topology
- Logical topology
- Access layer topology
- Distribution topology
- Core topology
- Data center topology

## Practical Examples
- A home network is often a simple star topology around a router or switch.
- A campus network may use hierarchical tree design.
- A cloud or data center network may use spine-leaf.
- A WAN with redundant circuits can resemble a partial mesh.

## Security Considerations
- Star topologies can expose a central switch as a critical failure point.
- Mesh topologies can provide resilience but complicate monitoring.
- Loops in a topology require protocols such as STP to prevent broadcast storms.
- Flat logical topologies increase lateral movement risk.

## Commands / Configuration Examples
### Linux
```bash
ip route
traceroute 8.8.8.8
```

### Windows
```powershell
route print
tracert 8.8.8.8
```

### Cisco IOS
```text
show spanning-tree
show cdp neighbors
show lldp neighbors
```

## Troubleshooting
- Is there a loop in the switching topology?
- Is the design using redundant links correctly?
- Does the logical topology match the intended VLAN layout?
- Are routing boundaries where you expect them?

## Interview Questions
- What is the difference between physical and logical topology?
- Why is star topology common in Ethernet networks?
- Why is mesh topology useful in enterprise or cloud environments?
- What problem does STP solve in switched topologies?

## Summary
Topology determines how a network is built and how it behaves under failure or load. Good topology is a mix of performance, resilience, and simplicity.

## References
- [Ethernet](../03-ethernet-and-switching/ethernet.md)
- [STP](../03-ethernet-and-switching/stp.md)
- [Spine-Leaf Architecture](../12-enterprise-networking/spine-leaf-architecture.md)
