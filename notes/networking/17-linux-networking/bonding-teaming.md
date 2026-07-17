# Bonding and Teaming

> Bonding (Linux) and Teaming (Windows/Networking) are technologies that logically combine multiple physical network interfaces into a single virtual interface, providing increased bandwidth, fault tolerance, and load balancing.

## Overview
A server may have two physical Ethernet ports. If you configure them with separate IP addresses, they act as two distinct connections. But what if you want them to act as one giant, highly available connection? **Bonding** (in Linux) or **Teaming** (in Windows and networking terminology) achieves this.

By merging two or more NICs, the operating system or switch treats them as a single logical interface. If one physical cable breaks, the traffic automatically fails over to the other. If both are healthy, traffic is load-balanced across them.

## Why It Matters
Bonding and Teaming are crucial for servers and network devices that require continuous uptime and high network throughput. In a data center, every physical server running virtual machines or critical applications will have its network interfaces bonded for resilience. Understanding the different bonding modes is essential for designing highly available network infrastructure.

## Core Concepts
- **Active-Backup (Mode 1):** Only one NIC is active at a time. The other sits idle. If the active NIC fails, the backup takes over instantly. Provides fault tolerance, but no load balancing.
- **LACP (Link Aggregation Control Protocol - Mode 4):** The IEEE 802.3ad standard. The NICs actively negotiate with a switch that supports LACP. This bundles the links for both fault tolerance and load balancing across the physical links.
- **Round-Robin (Mode 0):** Traffic is sent sequentially across all available NICs. Provides basic load balancing, but can cause out-of-order packet delivery, which is bad for TCP.
- **Load Balancing:** Traffic is distributed across the bonded interfaces using a hashing algorithm (e.g., based on source/destination MAC, IP, or port) to ensure packets from the same flow don't arrive out of order.

## How It Works (LACP Example)
1. A Linux server has two physical Ethernet interfaces: `eth0` and `eth1`.
2. An administrator configures a "bond" interface (`bond0`) in LACP mode, binding `eth0` and `eth1` to it.
3. The server's `bond0` interface sends LACP negotiation packets to the switch.
4. The switch is also configured with an LACP EtherChannel.
5. They successfully negotiate. The switch now sees `bond0` as a single, logical interface with 2x the bandwidth.
6. The server receives an IP address (`10.1.1.50`) on `bond0`.
7. When the server sends traffic, the `bond0` driver hashes the packet and sends it out either `eth0` or `eth1`.
8. If `eth0`'s cable breaks, the `bond0` driver detects the link loss and instantly redirects all traffic to `eth1`.

## Components / Types
- **Bonding Driver (Linux):** A kernel module that manages the logical interface.
- **EtherChannel / Link Aggregation Group (LAG):** The switch-side configuration that corresponds to LACP bonding.
- **NIC Teaming (Windows):** The Windows equivalent of bonding, managed via PowerShell or the Server Manager GUI.

## Practical Examples
- **Database Server Uplinks:** A critical PostgreSQL database server has two 10Gbps NICs. They are bonded in LACP mode to a core switch. This provides 20Gbps of theoretical bandwidth and ensures that if one 10Gbps link or switch port fails, the database remains online and accessible.
- **Virtual Machine Hosts:** VMware ESXi or Microsoft Hyper-V hosts bond their physical NICs. This ensures that the thousands of virtual machines running on the host have a highly available and high-bandwidth connection to the physical network.

## Security Considerations
- **Misconfigured Bonding (DoS):** If LACP bonding is misconfigured on either the server or the switch, it can cause routing loops or severe packet loss, leading to a Denial of Service for the server.
- **Lack of Visibility (Troubleshooting):** During an incident, if an administrator assumes a bond is providing 20Gbps, but one of the 10Gbps links silently failed, they might misdiagnose a performance bottleneck, overlooking the fact that the server is actually running on half bandwidth.
- **ARP Spoofing (Active-Backup):** In Active-Backup mode, if the active NIC fails, the backup NIC takes over its MAC address. If an attacker knows this, they might send Gratuitous ARPs to claim the MAC address of a failed server, potentially intercepting traffic meant for the server.

## Commands / Configuration Examples
### Linux (Configuring a Bond Interface - RHEL/CentOS)
```text
# Example /etc/sysconfig/network-scripts/ifcfg-bond0
DEVICE=bond0
IPADDR=192.168.1.50
NETMASK=255.255.255.0
GATEWAY=192.168.1.1
BOOTPROTO=none
ONBOOT=yes
# LACP Mode 4, using eth0 and eth1
BONDING_OPTS="mode=4 miimon=100 lacp_rate=1" 

# Example /etc/sysconfig/network-scripts/ifcfg-eth0
DEVICE=eth0
BOOTPROTO=none
ONBOOT=yes
MASTER=bond0
SLAVE=yes
```

### Windows (NIC Teaming via PowerShell)
```powershell
# Create a new NIC Team named "Team01" using adapters "Ethernet1" and "Ethernet2"
New-NetLbfoTeam -Name "Team01" -TeamMembers "Ethernet1", "Ethernet2" -LoadBalancingAlgorithm Dynamic -TeamingMode LACP
```

## Troubleshooting
- **Link Up, but No Traffic:** If the bonding interface shows as `UP`, but traffic isn't flowing, check the switch-side configuration. Is the EtherChannel configured correctly? Are the ports set to `channel-group <ID> mode active` for LACP?
- **Load Imbalance:** If one physical link is constantly at 100% utilization while others are idle, the load balancing algorithm is likely poor for the traffic type. Change the hashing algorithm to use more packet fields (e.g., source/destination IP and port) to distribute flows more evenly.
- **`miimon` Failures:** The `miimon` parameter (monitor interval) checks the link status. If the network is heavily congested, `miimon` might incorrectly detect a link as down, causing unnecessary failovers.

## Interview Questions
- What is the primary purpose of NIC Bonding or Teaming?
- Explain the difference between Active-Backup bonding and LACP bonding.
- Why is LACP preferred for load balancing over simpler modes like Round-Robin? (Answer: Because LACP ensures packets belonging to the same flow are always sent down the same physical link, preventing out-of-order packet delivery for TCP sessions).
- What is an "EtherChannel" in the context of switch configuration?

## Summary
Bonding and Teaming are essential for building resilient and high-performance network connections for servers and network devices. By logically bundling multiple physical interfaces, these technologies deliver increased bandwidth and transparent failover, forming the bedrock of highly available infrastructure in data centers and cloud environments.

## References
- [Network Redundancy](../12-enterprise-networking/network-redundancy.md)
- [EtherChannel](../03-ethernet-and-switching/etherchannel.md)
- [High Availability](../12-enterprise-networking/high-availability.md)
- [Linux Networking](../../17-linux-networking/network-interfaces-linux.md)
