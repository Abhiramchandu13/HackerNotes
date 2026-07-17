# Linux Networking Labs

> Linux Networking Labs provide hands-on experience in configuring, managing, and troubleshooting network services and interfaces on Linux operating systems using command-line tools.

## Overview
Linux servers underpin the vast majority of the Internet, cloud infrastructure, and enterprise data centers. Proficiency in Linux networking is a fundamental skill for system administrators, DevOps engineers, and cybersecurity professionals. **Linux Networking Labs** offer a practical environment to master essential commands, understand network configurations, and diagnose connectivity issues in real-world scenarios.

## Why It Matters
While theoretical knowledge of networking protocols is important, practical experience in configuring a Linux machine's network stack is invaluable. These labs help you:
- Understand how to assign IP addresses and configure routing.
- Set up firewalls (`firewalld`, `ufw`).
- Configure DNS and DHCP clients/servers.
- Diagnose network outages using standard Linux tools (`ip`, `ss`, `dig`).
- Prepare for certifications like RHCSA, RHCE, and Linux Foundation Certified Engineer.

## Core Concepts
-   **`iproute2` utilities:** `ip addr`, `ip route`, `ip link`, `ip neigh`.
-   **Host-based firewalls:** `firewalld`, `ufw`, `nftables`.
-   **DNS configuration:** `/etc/resolv.conf`, `/etc/hosts`, `systemd-resolved`.
-   **DHCP client/server:** `dhclient`, `isc-dhcp-server`, `dnsmasq`.
-   **Network namespaces:** For container networking and isolation.
-   **Bonding:** Combining multiple NICs for redundancy and bandwidth.

## How It Works
1.  You create a virtual machine (e.g., in VirtualBox, VMware, or cloud instance) running a Linux distribution (Ubuntu, CentOS, Fedora).
2.  You access the VM's command-line interface (CLI) via SSH or directly through the hypervisor console.
3.  You use Linux networking commands to implement lab objectives (e.g., assign a static IP, configure a firewall rule to open port 80, set up a DHCP server).
4.  You verify your configuration using diagnostic tools (`ping`, `curl`, `ss`) and troubleshoot any issues.

## Components / Types
-   **Virtual Machines (VMs):** Using VirtualBox, VMware Workstation, or KVM to create isolated Linux instances.
-   **Containerization (Docker/Kubernetes):** Setting up labs to understand container networking.
-   **Cloud Instances:** Utilizing AWS EC2, Azure VMs, or GCP Compute Engine for Linux server labs.
-   **Network Simulators:** While primarily for routing protocols, tools like GNS3/EVE-NG can also integrate Linux VMs for end-to-end testing.

## Practical Examples
-   **Static IP Configuration Lab:** Assign a static IPv4 address, subnet mask, default gateway, and DNS servers to a Linux server.
-   **Web Server Firewall Lab:** Configure `firewalld` to allow inbound HTTP/HTTPS traffic while blocking all other connections.
-   **DHCP Server Lab:** Set up an ISC DHCP server on a Linux VM to hand out IP addresses to other virtual clients.
-   **Network Troubleshooting Lab:** Diagnose a broken internet connection on a Linux VM using `ip`, `ping`, `traceroute`, and `dig`.
-   **Bonding Lab:** Combine two virtual network interfaces into a single LACP bond for a highly available web server.

## Security Considerations
-   **Lab Isolation:** Always ensure your lab VMs are isolated from your production network or sensitive local machines. A misconfigured DHCP server in a lab can wreak havoc on your home network.
-   **Firewalling:** Practice configuring host-based firewalls on your Linux lab machines. This is a critical security control.
-   **SSH Hardening:** For remote access, ensure SSH is configured securely (e.g., disable password authentication, use key-based authentication, disable root login).

## Commands / Configuration Examples
### Common Linux Networking Commands
```bash
# View IP configuration
ip a

# View routing table
ip r

# View firewall status (firewalld)
sudo firewall-cmd --list-all

# Check active connections
sudo ss -tulpn

# Configure a static IP (Netplan example for Ubuntu)
sudo nano /etc/netplan/01-netcfg.yaml
sudo netplan apply
```

## Troubleshooting
-   **Network Not Coming Up:** Check `ip a` for interface status (`UP`, `DOWN`, `NO-CARRIER`). Verify network configuration files for typos.
-   **No Internet Access:** Check `ip r` for a default route. Ping your gateway, then an external IP (e.g., `8.8.8.8`). Check DNS resolution (`dig google.com`).
-   **Service Unreachable:** Verify service is listening (`ss -tulpn`). Check host firewall (`sudo firewall-cmd --list-all`) and network firewall.

## Interview Questions
-   How do you configure a static IP address on a Linux server?
-   What are the modern Linux commands for checking network interfaces and routing tables?
-   How do you verify if the host-based firewall is active and what rules are applied?
-   Walk me through the steps you would take to troubleshoot a Linux server that cannot reach the Internet.

## Summary
Linux Networking Labs provide essential hands-on training for managing the network stack of the world's most ubiquitous operating system. By working through practical scenarios with `iproute2`, host firewalls, and DNS tools, administrators build the confidence and expertise required to operate and secure mission-critical Linux infrastructure.

## References
- [Network Interfaces in Linux](../17-linux-networking/network-interfaces-linux.md)
- [Linux Firewalld and nftables](../17-linux-networking/linux-firewalld-nftables.md)
- [Network Configuration Files](../17-linux-networking/network-configuration-files.md)
- [ip Command](../10-monitoring-and-troubleshooting/ip-command.md)
