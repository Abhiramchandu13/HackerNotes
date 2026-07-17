# VXLAN (Virtual Extensible LAN)

> VXLAN is a Layer 2 overlay network technology that encapsulates Ethernet frames within UDP packets, allowing virtual networks to span large Layer 3 routed infrastructures.

## Overview
Traditional VLANs (Layer 2) are limited to 4094 IDs and cannot easily span across Layer 3 IP routed networks. As data centers grew massive, stretching across multiple physical buildings, or into hybrid cloud environments, a new technology was needed to extend Layer 2 domains seamlessly.

**VXLAN (Virtual Extensible LAN)** is the solution. It takes an entire Ethernet frame from a virtual machine (VM) or container, wraps it inside a standard UDP packet, and sends it across a normal Layer 3 IP network. This "tunnel" allows VMs on the same virtual network to communicate directly at Layer 2, even if they are physically sitting in different data centers thousands of miles apart.

## Why It Matters
VXLAN is a foundational technology for modern cloud data centers, software-defined networking (SDN), and multi-tenancy environments. It provides the scale and flexibility required to rapidly deploy thousands of isolated virtual networks without manually reconfiguring physical network hardware. For security professionals, understanding VXLAN is critical for securing cloud environments and inspecting encapsulated traffic.

## Core Concepts
- **Overlay Network:** VXLAN creates a virtual Layer 2 network *over* an existing Layer 3 physical network. The underlying Layer 3 network is called the "Underlay."
- **VNI (VXLAN Network Identifier):** A 24-bit ID that replaces the 12-bit VLAN ID. This allows for 16 million unique virtual networks, solving the VLAN ID exhaustion problem.
- **VTEP (VXLAN Tunnel Endpoint):** A physical or virtual network device (router, switch, hypervisor) that performs the VXLAN encapsulation and decapsulation.
- **UDP Encapsulation:** VXLAN uses UDP port **4789** to carry the encapsulated Ethernet frames. This allows VXLAN traffic to be routed across any standard Layer 3 IP network.

## How It Works
1. VM1 (on Hypervisor A in Datacenter 1) sends an Ethernet frame for VM2 (on Hypervisor B in Datacenter 2). Both VMs are part of VXLAN 5000.
2. Hypervisor A's VTEP intercepts VM1's Ethernet frame.
3. The VTEP adds a VXLAN header (containing VNI 5000) to the Ethernet frame.
4. The VTEP then wraps this entire structure inside a standard UDP header (Source VTEP IP, Dest VTEP IP, Port 4789) and an outer IP header.
5. This UDP/IP packet is then routed across the standard Layer 3 IP network (the Underlay) from Datacenter 1 to Datacenter 2.
6. Hypervisor B's VTEP receives the UDP packet, strips the outer IP and UDP headers, removes the VXLAN header, and presents the original Ethernet frame to VM2.

## Components / Types
- **Distributed Control Plane (EVPN/BGP):** In large deployments, a routing protocol like BGP with EVPN extensions is used to dynamically distribute VTEP reachability information, avoiding the need for noisy broadcast/multicast methods.
- **Software VTEP:** Integrated directly into hypervisors (e.g., VMware ESXi, Open vSwitch for KVM/Docker).
- **Hardware VTEP:** Supported by modern physical switches and routers (e.g., Cisco Nexus, Arista) to handle VXLAN traffic at wire speed.

## Practical Examples
- **Multi-tenant Cloud:** A cloud provider uses VXLAN to create thousands of isolated, private Layer 2 networks for different customers, all running simultaneously on the same physical server hardware. Each customer gets their own VNI.
- **Data Center Interconnect (DCI):** A company extends a Layer 2 domain (e.g., a specific production VLAN) from their primary data center to a geographically separate disaster recovery data center. VXLAN tunnels allow these two data centers to appear as one giant Layer 2 network over a standard IP routed WAN.

## Security Considerations
- **Traffic Visibility:** Because VXLAN encapsulates Layer 2 traffic within UDP, traditional firewalls and IDS/IPS systems (which primarily inspect Layer 3/4 headers) will have difficulty inspecting the inner Ethernet frame unless they are VXLAN-aware.
- **Underlay Attacks:** Compromising the underlying Layer 3 IP network can disrupt all VXLAN overlay networks. An attacker might manipulate BGP routes in the underlay to redirect VXLAN traffic.
- **Misconfigured VNIs:** If a VTEP is misconfigured to join the wrong VNI, it can expose a virtual machine to an unintended Layer 2 network.

## Commands / Configuration Examples
VXLAN configuration is typically done via SDN controllers (like VMware NSX or Cisco ACI) or directly on switches/hypervisors.

### Cisco Nexus Switch (Conceptual)
```text
! Create a NVE (Network Virtualization Edge) interface (the VTEP)
interface nve1
 no shutdown
 source-interface loopback0
 member vni 5000 associate-vrf

! Map a VLAN to a VNI
vlan 1000
 vn-segment 5000
```

### Linux (Open vSwitch for KVM/Docker)
```bash
# Add a VXLAN port to an OVS bridge, defining the remote VTEP IP and VNI
sudo ovs-vsctl add-port br-int vxlan-5000 -- set interface vxlan-5000 type=vxlan options:remote_ip=10.0.0.10 options:key=5000
```

## Troubleshooting
- **VXLAN Tunnel Down:** Verify Layer 3 IP reachability between the VTEPs (the Underlay). If the VTEPs cannot ping each other, the VXLAN tunnel will not form.
- **VMs in Same VXLAN Cannot Communicate:** Check if the VNI IDs match on both VTEPs. A single digit mismatch (`5000` vs `5001`) will prevent communication.
- **Multicast Configuration:** In older VXLAN deployments, the VTEPs relied on multicast (IGMP) to discover remote MAC addresses. Misconfigured multicast on the Underlay will break VXLAN. Modern deployments use BGP EVPN to avoid this.

## Interview Questions
- What problem does VXLAN solve that traditional VLANs cannot?
- How many unique virtual networks can VXLAN support?
- What is the primary purpose of the VTEP?
- Explain the concept of an "overlay network" in the context of VXLAN.

## Summary
VXLAN is the key enabler of large-scale, multi-tenant cloud data centers. By encapsulating Layer 2 Ethernet frames in standard UDP packets, it allows virtual networks to effortlessly span massive Layer 3 routed infrastructures, providing unparalleled scalability and agility for modern applications.

## References
- [Virtual Networking](virtual-networking.md)
- [SDN (Software-Defined Networking)](sdn.md)
- [Cloud Networking](cloud-networking.md)
- [VLANs and Trunks](../03-ethernet-and-switching/vlans-and-trunks.md)
