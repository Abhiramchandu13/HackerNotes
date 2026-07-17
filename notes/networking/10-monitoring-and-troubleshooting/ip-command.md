# ip Command

> The ip command is the modern Linux CLI utility used to configure, view, and troubleshoot network interfaces, IP addresses, routing tables, and ARP neighbors.

## Overview
For decades, Linux administrators used `ifconfig` and `route` to manage networking. However, those legacy tools have been officially deprecated in modern Linux distributions. They have been replaced by the powerful, unified **ip** utility (part of the `iproute2` package). 

The `ip` command communicates directly with the Linux kernel's networking stack via Netlink sockets, making it faster, more capable, and the standard tool for all modern Linux systems.

## Why It Matters
If you manage Linux servers, containers (Docker/Kubernetes), or cloud instances, the `ip` command is your primary tool for network administration. You must know how to view IP assignments, bring interfaces up or down, add static routes, and inspect the ARP cache. For cybersecurity professionals, using `ip` is the first step in host network reconnaissance after gaining shell access to a Linux machine.

## Core Concepts
The `ip` command uses a hierarchical object-oriented syntax:
`ip [OPTIONS] OBJECT {COMMAND}`

Common objects include:
- **address (addr / a):** Manage IP addresses.
- **link (l):** Manage physical network interfaces (bringing them up/down, setting MTU).
- **route (r):** Manage the kernel routing table.
- **neigh (n):** Manage the Neighbor Cache (the IPv4 ARP and IPv6 NDP tables).

*Note: You can abbreviate commands (e.g., `ip addr show` becomes `ip a s` or simply `ip a`).*

## How It Works
When you issue an `ip` command:
1. The `ip` utility parses your command syntax.
2. It opens a Netlink socket to the Linux kernel.
3. It requests or modifies the kernel's internal networking structures (like the routing table or interface state).
4. The kernel applies the change or returns the requested data.
5. The `ip` utility formats the output and prints it to your terminal.

## Components / Types
- **ip link:** Controls the physical layer (Layer 1/2) representation.
- **ip address:** Controls logical IP Layer 3 configurations.
- **ip route:** Controls routing.
- **ip neighbor:** Controls local MAC translation mappings.

## Practical Examples
- **Verifying IP Assignment:** You log into a web server and need to verify its IP address. Running `ip a` displays all interfaces, their physical status, and their assigned IPv4/IPv6 addresses.
- **Checking the ARP Cache:** You suspect an IP conflict or spoofing attack on the LAN. Running `ip neigh` lists all learned IP-to-MAC mappings.

## Security Considerations
- **Reconnaissance:** Attackers who compromise a Linux system immediately run `ip a` and `ip route` to map out the network segments the machine can reach, looking for targets for lateral movement.
- **Unauthorized Changes:** Modifying network configurations (like adding an IP or route) requires root/sudo privileges. Restricting sudo access to the `ip` binary is crucial to prevent users from altering network routing.
- **Interface Promiscuity:** Attackers can use `ip link` to set a NIC into promiscuous mode to sniff traffic. Monitoring link state changes is a standard host security audit practice.

## Commands / Configuration Examples
### Common Linux CLI Tasks
```bash
# 1. View all IP addresses on all interfaces
ip a

# 2. View only active physical interfaces (link layer)
ip link show

# 3. Bring an interface (eth0) down and then up
sudo ip link set dev eth0 down
sudo ip link set dev eth0 up

# 4. Assign an IP address to eth0 (using CIDR notation)
sudo ip addr add 192.168.1.50/24 dev eth0

# 5. View the routing table
ip route show

# 6. Add a static route to a network via a gateway
sudo ip route add 10.5.5.0/24 via 192.168.1.1

# 7. View the ARP cache / Neighbor table
ip neigh show
```

## Troubleshooting
- **Interface Down:** If `ip a` shows an interface as `state DOWN`, the link is administratively disabled. Run `ip link set dev <interface> up` to enable it.
- **Missing Route:** If the server cannot reach a specific subnet, run `ip route` to verify a default gateway (`default via ...`) or a specific route exists for the target network.
- **Dynamic IP Reset:** Remember that changes made using the `ip` command are **temporary**. If you reboot the server, all manual IP assignments and routes are lost. For permanent changes, you must edit the distribution's network configuration files (e.g., Netplan on Ubuntu, NetworkManager on RHEL).

## Interview Questions
- What command utility has replaced the deprecated `ifconfig` in modern Linux?
- How do you view the Linux routing table using the `ip` command? (Answer: `ip route` or `ip r`).
- What `ip` object is used to view the local ARP table? (Answer: `ip neighbor` or `ip neigh`).
- How do you temporarily assign an IP address to a Linux interface?

## Summary
The `ip` command is the modern, unified tool for Linux network administration. By providing direct Netlink communication with the kernel and organizing operations into intuitive objects (link, addr, route, neigh), it simplifies the management of Layer 1 through Layer 3 networking on all Linux-based infrastructure.

## References
- [ifconfig](ifconfig.md)
- [ss](ss.md)
- [Routing Table](../05-routing/routing-table.md)
- [ARP](../03-ethernet-and-switching/arp.md)
