# Switch Stacking

> Switch stacking allows multiple physical switches to be connected together and managed as if they were a single, high-capacity logical switch.

## Overview
In a large wiring closet, you might need 150 Ethernet ports to connect all the PCs. You could buy three 48-port switches, but then you have to manage three separate IP addresses, configure three sets of VLANs, and run Spanning Tree (STP) between them, wasting uplink ports.

**Switch Stacking** solves this. Using specialized high-speed backplane cables, you daisy-chain the switches together. They merge their brains: they share one management IP, one configuration file, and one routing table.

## Why It Matters
Stacking simplifies network management drastically and improves redundancy. For enterprise networks, it is the standard way to deploy access-layer switches in campus environments. Understanding stacking is crucial because it changes how you approach physical cabling, firmware upgrades, and high availability design.

## Core Concepts
- **Stack Master (or Active):** When a stack boots, the switches elect a boss. The Master handles the management plane (CLI, SSH) and routing protocols for the entire stack.
- **Stack Member (or Standby):** The other switches in the stack. They forward traffic normally, but take management orders from the Master.
- **Stackwise Cables:** Proprietary, high-bandwidth cables that connect the back of the switches in a closed ring.
- **Unified Control Plane:** Logically, the stack is one device. Port 1 on the first switch is `Gi1/0/1`, port 1 on the second switch is `Gi2/0/1`.

## How It Works
1. Three switches are physically cabled together in a ring topology using stacking cables (Switch 1 -> 2, Switch 2 -> 3, Switch 3 -> 1).
2. They are powered on. They communicate over the stacking cables and elect a Master based on priority settings or MAC address.
3. The Master syncs the global configuration file to the Members.
4. If a network admin SSHs into the stack, they are talking to the Master, but they can configure ports on any switch in the stack.
5. If the Master loses power, the Standby switch instantly assumes the Master role, and the network continues forwarding traffic with minimal disruption.

## Components / Types
- **StackWise / StackWise Virtual:** Cisco's traditional stacking technologies for Catalyst switches.
- **Virtual Chassis (VC):** Juniper's terminology for switch stacking.
- **VSS (Virtual Switching System) / StackWise Virtual:** Advanced technologies that allow core switches to be "stacked" over standard 10G/40G fiber optic links across long distances, rather than specialized short backplane cables.

## Practical Examples
- **Cross-Stack EtherChannel:** You have a server with two NICs. To protect against a switch hardware failure, you connect NIC 1 to Switch 1, and NIC 2 to Switch 2 (in the same stack). You bundle them using LACP. Because the stack acts as one logical switch, the LACP bundle works perfectly. If Switch 1 loses power, the server continues running via Switch 2.

## Security Considerations
- **Single Point of Failure (Logical):** While stacking provides hardware redundancy, it creates a logical single point of failure. A corrupted configuration or a severe software bug on the Master can crash the entire stack.
- **Firmware Upgrades:** Upgrading a stack usually requires rebooting all members simultaneously, causing downtime. (Advanced features like ISSU exist but can be complex).
- **Physical Access:** If an attacker gains physical access to the closet, plugging a rogue switch into the stack cable ring could severely disrupt the stack election process or take down the management plane.

## Commands / Configuration Examples
### Cisco IOS
```text
! View the status of the stack, identifying the Master and Standby
show switch

! Re-numbering a switch (if a replacement switch boots as switch 5 but needs to be switch 2)
switch 5 renumber 2

! Set a high priority to ensure a specific switch always wins the Master election
switch 1 priority 15

! Configuring a port on the third switch in the stack
interface GigabitEthernet3/0/24
 switchport mode access
```

## Troubleshooting
- **Split Brain / Stack Partition:** If the stacking cable ring breaks in two places, the stack splits in half. Both halves will elect a Master and try to use the same IP address and configuration, causing catastrophic network conflicts on the uplinks. Always cable stacks in a full ring.
- **Firmware Mismatch:** If you add a new replacement switch to a stack, and its firmware version differs from the Master, the new switch will refuse to join the stack (showing as `V-Mismatch`). It must be upgraded/downgraded first.

## Interview Questions
- What is the primary benefit of switch stacking in an enterprise environment?
- Explain the role of the Stack Master.
- How are interfaces numbered in a stacked environment?
- What happens if the Stack Master loses power?

## Summary
Switch stacking provides the perfect blend of high port density and simplified management. By merging multiple physical switches into a single logical entity with a unified control plane, it allows for resilient design architectures like Cross-Stack EtherChannel while reducing administrative overhead.

## References
- [EtherChannel](etherchannel.md)
- [Switch Operation](switch-operation.md)
- [High Availability](../12-enterprise-networking/high-availability.md)
