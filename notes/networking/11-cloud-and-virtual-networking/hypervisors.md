# Hypervisors

> A hypervisor is a layer of software that creates and runs virtual machines, allowing multiple operating systems to share a single physical hardware platform.

## Overview
Before virtualization, every server application (e.g., a web server, a database server) required its own dedicated physical computer. This was inefficient, wasted power, and made hardware management complex. A **Hypervisor** (also known as a Virtual Machine Monitor - VMM) solves this by taking a single physical server and creating multiple isolated virtual machines (VMs) on it.

Each VM acts like a complete, separate computer with its own virtual CPU, memory, storage, and **network interface**. The hypervisor manages and allocates these underlying physical resources to the VMs.

## Why It Matters
Hypervisors are the foundation of modern data centers and cloud computing. Understanding them is critical for anyone managing virtualized infrastructure. For network engineers, hypervisors host the entire virtual network stack (virtual switches, virtual routers). For cybersecurity professionals, the security of the hypervisor is paramount; if an attacker compromises the hypervisor, they control every VM running on that physical hardware.

## Core Concepts
- **Virtual Machine (VM):** A software-defined computer. It encapsulates a guest operating system and its applications.
- **Guest Operating System:** The OS running inside a VM (e.g., Windows Server 2019, Ubuntu Linux).
- **Host Operating System:** The OS (if any) running directly on the physical hardware beneath the hypervisor.
- **Virtualization Layer:** The hypervisor software itself.
- **Resource Management:** The hypervisor allocates CPU cycles, RAM, disk I/O, and network bandwidth to each VM.

## How It Works
1. You install a hypervisor (e.g., VMware ESXi) onto a powerful physical server.
2. You create multiple virtual machines (e.g., 3 Windows VMs and 2 Linux VMs) using the hypervisor's management interface.
3. Each VM is configured with its own virtual network adapter (vNIC).
4. All vNICs are connected to a virtual switch (vSwitch) running inside the hypervisor.
5. The vSwitch has an "uplink" to one of the physical network cards (pNIC) of the host server.
6. When a VM sends a packet, it goes through its vNIC, across the vSwitch, out the pNIC, and onto the physical network.

## Components / Types
- **Type 1 Hypervisor (Bare-Metal):** Installs directly onto the physical server hardware, replacing the host OS. This is the enterprise standard for data centers and cloud providers because it is highly efficient and secure.
  - *Examples:* VMware ESXi, Microsoft Hyper-V, Citrix XenServer.
- **Type 2 Hypervisor (Hosted):** Runs as an application *on top of* an existing traditional operating system (like Windows or macOS). Less efficient because it shares resources with the host OS.
  - *Examples:* VMware Workstation, Oracle VirtualBox.

## Practical Examples
- **Data Center Consolidation:** A company replaces 20 aging physical servers (each running a single application) with one powerful server running VMware ESXi. They then migrate all 20 applications into virtual machines on that single physical server, drastically saving power, cooling, and rack space.
- **Cloud Computing:** When you provision a "virtual server" (EC2 instance) in AWS or an "Azure VM" in Microsoft Azure, you are being given a virtual machine running on a massive Type 1 hypervisor cluster managed by the cloud provider.

## Security Considerations
- **Hypervisor Escape:** The ultimate nightmare. An attacker compromises a guest VM and then finds a vulnerability in the hypervisor itself, allowing them to "escape" the VM and gain control over the underlying physical server and all other VMs on it.
- **Virtual Network Isolation:** Hypervisors must be securely configured to prevent VMs in different virtual networks (e.g., a DMZ VM and a database VM) from communicating directly unless explicitly allowed by virtual firewall rules.
- **Resource Exhaustion:** If an attacker can force a single VM to consume all the physical server's CPU or memory, it can cause a Denial of Service (DoS) for all other VMs running on that same hypervisor.

## Commands / Configuration Examples
Hypervisors are managed through their own GUIs (e.g., VMware vCenter, Hyper-V Manager) or APIs.

### Linux (KVM - Kernel-based Virtual Machine)
KVM is a Type 1 hypervisor built directly into the Linux kernel. It is managed via `libvirt`.
```bash
# View all running virtual machines
virsh list

# View the network interfaces and virtual switches for a VM
virsh domiflist my_vm
```

### Windows (Hyper-V PowerShell)
```powershell
# Get all running virtual machines
Get-VM

# View the virtual network adapters of a specific VM
Get-VMNetworkAdapter -VMName "WebServer01"
```

## Troubleshooting
- **Network Performance:** If a VM's network is slow, check the physical host server's CPU and memory. Hypervisors must have enough available resources to handle the total load of all VMs.
- **VM Cannot Connect to Network:** Verify the VM's vNIC is connected to the correct vSwitch. Verify the vSwitch's uplink is connected to an active physical NIC.

## Interview Questions
- What is a hypervisor and what is its primary function?
- Explain the difference between a Type 1 and a Type 2 hypervisor.
- How does a hypervisor contribute to the "East-West traffic blindspot" in traditional network security?
- What is a "hypervisor escape" and why is it considered a critical security vulnerability?

## Summary
Hypervisors are the unsung heroes of modern IT, transforming expensive, underutilized physical hardware into flexible, scalable, and resilient virtualized infrastructure. By efficiently abstracting physical resources, they enable the on-demand provisioning and dynamic management that defines cloud computing.

## References
- [Virtual Networking](virtual-networking.md)
- [Micro-segmentation](../09-network-security/microsegmentation.md)
- [Cloud Networking](cloud-networking.md)
- [Kubernetes Networking](kubernetes-networking.md)
