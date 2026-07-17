# Bridges and NAT Networks

> Virtual bridges create Layer 2 connectivity for VMs, while virtual NAT networks provide private IP addressing and Internet access for isolated virtual environments.

## Overview
When you install a hypervisor (like VMware Workstation or VirtualBox) on your laptop, your virtual machines (VMs) need to talk to each other and to the outside world. This is achieved by creating virtual networks using two primary models: **Bridged Networking** and **NAT Networking**. These models configure how the VM's virtual network adapter (vNIC) connects to your physical network.

## Why It Matters
Understanding bridged vs. NAT networking is fundamental for setting up virtual labs, deploying development environments, and comprehending how container networking (Docker) operates. For security professionals, knowing the isolation boundaries of these virtual networks is critical for containing malware in sandboxes or building secure testing environments.

## Core Concepts
- **Virtual Network Interface (vNIC):** The software network adapter inside the VM.
- **Virtual Switch (vSwitch):** A software switch running inside the host.
- **Host Network Adapter:** The physical network card (pNIC) of your laptop.

## How It Works
### 1. Bridged Networking
- **Analogy:** The VM is like a new physical computer plugged directly into your home router.
- **Connectivity:** The VM's vNIC connects to a **Virtual Bridge** (a vSwitch configured as a bridge) on the host. This bridge acts like a transparent Layer 2 switch, directly connecting the VM's vNIC to the host's physical network adapter (pNIC).
- **IP Addressing:** The VM gets its own IP address directly from your home router's DHCP server.
- **Traffic Flow:** Traffic from the VM appears directly on your physical home network. Other devices on your home network can directly "see" and talk to the VM.
- **Use Case:** When you want the VM to be a full participant in your physical network, with its own IP visible to others.

### 2. NAT Networking (Network Address Translation)
- **Analogy:** The VM is like a computer sitting behind a home router.
- **Connectivity:** The VM's vNIC connects to a **Virtual NAT Device** (a vSwitch with NAT and DHCP services) running inside the host.
- **IP Addressing:** The VM gets a private IP address from the host's internal DHCP server (e.g., `192.168.100.x`).
- **Traffic Flow:** The VM can reach the Internet. However, other devices on your physical network *cannot* directly "see" or talk to the VM. All its outbound traffic is hidden behind the host's physical IP address via NAT.
- **Use Case:** When you want to isolate the VM from the physical network but still grant it Internet access. Ideal for malware analysis sandboxes.

## Components / Types
- **Host-Only Networking:** A third option, creates a completely isolated private network between the host machine and its VMs. The VMs can talk to each other and the host, but cannot reach the Internet or the physical LAN. Ideal for development or testing where no external connectivity is desired.

## Practical Examples
- **Web Development VM (NAT):** A developer is building a web application on a Linux VM. They configure the VM for NAT networking. The VM can access software updates from the Internet, but local network security scanners cannot see the potentially vulnerable development web server running inside the VM.
- **Homelab Server (Bridged):** A user wants to set up a Plex Media Server on a VM to be accessible by all devices on their home network. They configure the VM for bridged networking, giving it an IP directly from the home router, making it visible to the Smart TV.

## Security Considerations
- **VM-to-Host Communication:** In NAT mode, the host usually has an internal interface on the same virtual network as the VM. An attacker who compromises the VM may be able to pivot and attack the host's internal virtual interface.
- **Guest-to-Guest Isolation:** Even if two VMs are in different virtual NAT networks on the same host, a compromised VM might attempt to scan the host's network interfaces to find other VMs.
- **Malware Sandboxing:** For analyzing malware, a VM is configured for "Host-Only" networking. The malware can run, but it can never reach the Internet or any other physical machines, preventing it from phoning home to a C2 server or infecting other devices.

## Commands / Configuration Examples
These settings are typically configured in the hypervisor's GUI (e.g., VirtualBox, VMware Workstation).

### Linux (Creating a Software Bridge for VMs)
```bash
# Using 'brctl' (bridge control) to create a bridge, add a physical interface, and assign an IP.
# This makes your Linux machine act as a bridge for VMs.
sudo brctl addbr br0
sudo brctl addif br0 eth0
sudo ifconfig br0 192.168.1.10/24 up
```

## Troubleshooting
- **VM Cannot Access Internet (NAT):** Ensure the host machine's physical network interface has internet access. Check if the host's firewall is blocking traffic from the virtual NAT adapter.
- **VM Cannot See Other LAN Devices (NAT):** This is expected behavior. The VM is behind a NAT, just like a home router. Other physical devices cannot initiate connections directly to the VM's private IP. You need to configure Port Forwarding on the host to expose specific VM services.
- **VM Receives Wrong IP (Bridged):** If a VM is set to bridged mode but receives a `169.254.x.x` (APIPA) address, it means the host's physical NIC is not getting an IP from DHCP, or the VM is not receiving the DHCP offer from the physical network.

## Interview Questions
- What is the primary difference between Bridged and NAT networking for virtual machines?
- When would you use "Host-Only" networking for a VM?
- If you are running malware in a VM, which network mode would you configure, and why?
- Can a VM configured for NAT networking directly receive an inbound connection initiated from a physical host on the LAN? Why or why not? (Answer: No, because it's behind NAT; port forwarding would be required).

## Summary
Virtual bridges and NAT networks provide the essential Layer 2 and Layer 3 connectivity for virtual machines. By carefully selecting the appropriate network mode, administrators can balance the need for isolation, external access, and seamless integration into physical networks.

## References
- [Virtual Networking](virtual-networking.md)
- [Hypervisors](hypervisors.md)
- [NAT and PAT](../04-ip-addressing/nat-and-pat.md)
- [Linux Networking](../../17-linux-networking/network-interfaces-linux.md)
