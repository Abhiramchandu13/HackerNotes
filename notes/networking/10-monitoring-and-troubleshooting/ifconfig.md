# ifconfig

> ifconfig is a legacy command-line utility used to view and configure network interfaces on Unix and Linux operating systems.

## Overview
For over 30 years, **ifconfig** (Interface Configurator) was the definitive command Linux administrators typed to check their IP address. It query-displays active interfaces, allows you to assign IPs, change MTU sizes, and enable promiscuous mode.

However, `ifconfig` is legacy software. It has been officially deprecated in modern Linux distributions (such as Ubuntu 18.04+ and RHEL 7+) and replaced by the unified `ip` command (part of the `iproute2` package).

## Why It Matters
Although deprecated, `ifconfig` remains a critical tool to know. You will still find it in older corporate servers, legacy embedded devices, and routers that haven't been updated in a decade. Furthermore, "ifconfig" is still the default native command for Unix variants like FreeBSD and macOS. 

For cybersecurity, if you compromise an older system, you must know how to use `ifconfig` for local network reconnaissance.

## Core Concepts
- **Legacy Interface Mapping:** Displays physical and logical details (IP, MAC, MTU, packet counts) in a text-block format.
- **ioctls interface:** `ifconfig` communicates with the kernel using old system calls (`ioctls`), which is slower and less flexible than the modern Netlink socket API used by the `ip` command.
- **Standard Toolset:** Historically belonged to the `net-tools` package, alongside `route`, `netstat`, and `arp`.

## How It Works
1. When you type `ifconfig`, the binary queries the kernel via legacy system calls.
2. It requests the list of active network interfaces.
3. It prints a structured block of information for each interface, including:
   - Interface name (e.g., `eth0`, `wlan0`).
   - Flags (e.g., `UP`, `BROADCAST`, `RUNNING`, `PROMISC`).
   - IPv4 address (`inet`) and Netmask.
   - MAC address (`ether` or `HWaddr`).
   - Statistics on received (RX) and transmitted (TX) packets, including errors and drops.

## Components / Types
- **Interface Configuration:** Enabling/disabling adapters.
- **Address Configuration:** Binding IPs.
- **Promiscuous Mode:** Enabling raw packet capture.

## Practical Examples
- **Reconnaissance on Legacy Server:** You compromise a legacy CentOS 6 server. Running `ifconfig` reveals the internal IP is `192.168.50.12`, the subnet mask is `/24`, and the interface name is `eth0`. You also see `RX packets` rising rapidly, indicating heavy incoming traffic.

## Security Considerations
- **Reconnaissance:** Attackers look for `ifconfig` to map out the network structure of a newly compromised machine.
- **Promiscuous Mode Detection:** Pentesters and security auditors check if the `PROMISC` flag is present on any interface. If an interface is in promiscuous mode without authorization, it indicates an attacker or malware is actively sniffing the network traffic.

## Commands / Configuration Examples
### Legacy Linux / macOS / FreeBSD
```bash
# 1. View all active network interfaces
ifconfig

# 2. View all interfaces (including inactive/down ones)
ifconfig -a

# 3. Bring an interface (eth0) down and up
sudo ifconfig eth0 down
sudo ifconfig eth0 up

# 4. Assign an IP address and subnet mask to eth0
sudo ifconfig eth0 192.168.1.50 netmask 255.255.255.0

# 5. Enable Promiscuous Mode (for sniffing)
sudo ifconfig eth0 promisc

# 6. Disable Promiscuous Mode
sudo ifconfig eth0 -promisc
```

## Troubleshooting
- **Command Not Found:** If you type `ifconfig` on a modern Linux server and get `bash: ifconfig: command not found`, the package is not installed. You should use the modern `ip addr` command instead. (If you absolutely need `ifconfig`, you must install `net-tools` via `apt` or `yum`).
- **Temporary Changes:** Just like the `ip` command, any changes made via `ifconfig` are temporary and will be wiped upon reboot. Permanent configurations must be written to network interface files (like `/etc/network/interfaces` or `/etc/sysconfig/network-scripts/ifcfg-eth0`).

## Interview Questions
- Why has `ifconfig` been deprecated in modern Linux distributions? (Answer: Because it uses legacy kernel interfaces and has been replaced by the more powerful and unified `ip` command from the `iproute2` package).
- What flag in the `ifconfig` output indicates a network card is actively sniffing traffic? (Answer: `PROMISC`).
- How do you temporarily change an IP address using `ifconfig`?
- What package must you install on a modern Linux system to run legacy commands like `ifconfig` and `netstat`? (Answer: `net-tools`).

## Summary
`ifconfig` is the classic, legacy utility for network configuration. While it has been replaced by the `ip` command on modern Linux systems, its presence on macOS, FreeBSD, and legacy systems makes it an essential tool to know for administration, troubleshooting, and penetration testing.

## References
- [ip Command](ip-command.md)
- [netstat](netstat.md)
- [ss](ss.md)
- [Packet Capture](packet-capture.md)
