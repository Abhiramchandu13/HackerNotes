# SDN (Software-Defined Networking)

> SDN is a network architecture approach that decouples the network control plane from the data plane, enabling centralized, programmable management of network devices and traffic flow.

## Overview
Traditional networks are like individual light switches. Each router and switch has its own operating system (like Cisco IOS) and configuration file. To change a routing policy, you have to log into dozens of individual devices one by one.

**Software-Defined Networking (SDN)** is like replacing all those individual light switches with a central smart home controller. The network's "brain" (the **Control Plane**) is moved to a centralized software application, which then dictates how the individual network devices (the **Data Plane**) should forward traffic.

## Why It Matters
SDN allows network engineers to manage and automate an entire network as a single logical entity via software, rather than configuring individual hardware boxes. This dramatically reduces human error, speeds up network provisioning, and enables cloud-like agility in on-premises data centers. For security, SDN allows for dynamic, real-time security policy enforcement across an entire fabric.

## Core Concepts
- **Control Plane:** The "brain" of the network. Makes decisions about where traffic should go (e.g., routing protocols, security policies). In SDN, this is centralized in a software controller.
- **Data Plane (Forwarding Plane):** The "muscle" of the network. Physically forwards the packets based on instructions from the control plane. This remains distributed on individual switches and routers.
- **Southbound API:** The communication interface between the central SDN controller and the network devices (e.g., OpenFlow).
- **Northbound API:** The interface applications use to program the SDN controller (e.g., REST APIs).

## How It Works
1. An administrator wants to create a new virtual network for a development team.
2. Instead of logging into dozens of individual switches and routers, the admin logs into the central SDN Controller.
3. The admin uses a simple GUI or an API call to define the new network, its IP addresses, and its security policies.
4. The SDN Controller translates this high-level policy into low-level forwarding rules.
5. Using the Southbound API (e.g., OpenFlow), the Controller pushes these new rules down to all the physical and virtual switches and routers in the network.
6. Traffic for the new development network is instantly routed and secured across the entire data center, without any manual CLI configuration on individual boxes.

## Components / Types
- **SDN Controller:** The central brain (e.g., OpenDaylight, VMware NSX Manager, Cisco APIC).
- **Network Devices (Data Plane):** Physical switches and routers that support SDN protocols (e.g., OpenFlow-enabled switches, virtual switches in hypervisors).
- **OpenFlow:** An early, influential Southbound API that allowed controllers to directly program the forwarding tables (FIB) of switches.
- **Whitebox Switching:** Using generic, off-the-shelf hardware switches and loading custom SDN-compatible operating systems onto them, rather than buying expensive proprietary vendor hardware.

## Practical Examples
- **Automated Network Provisioning:** When a developer spins up a new application in a cloud or data center, the orchestration platform (like Kubernetes) uses a Northbound API to tell the SDN Controller, "Create a new /24 network for this app and connect it to the Internet Gateway, with these firewall rules." The network is provisioned automatically in seconds.
- **Dynamic Security Policy:** A security team detects a compromised server. They use the SDN controller's Northbound API to instantly push a rule to all network devices: "Block all traffic to and from Server X," effectively quarantining the server in real-time across the entire data center.

## Security Considerations
- **Centralized Vulnerability:** The SDN Controller becomes the single, critical point of failure. If an attacker compromises the controller, they gain complete control over the entire network infrastructure, including all routing, switching, and security policies.
- **Northbound API Security:** Applications that program the SDN Controller must be highly secured, as a compromised app could instruct the network to forward sensitive data to an attacker.
- **Visibility:** Troubleshooting requires integrating monitoring tools that can query both the Control Plane (the controller's decisions) and the Data Plane (the actual forwarding hardware).

## Commands / Configuration Examples
SDN is primarily managed via GUI controllers or API calls. Direct CLI configuration of the data plane often happens during setup, but ongoing management is abstracted.

### Conceptual OpenFlow Rule (Pushed by Controller)
```text
# This is a hypothetical low-level rule pushed by an OpenFlow controller
# Matches incoming packet on port 1, with src_ip=10.0.0.10
# Action: Forward to port 2
```

### Linux (Open vSwitch)
Open vSwitch is a software-defined virtual switch widely used in virtualization and cloud environments.
```bash
# Create a new OVS bridge (virtual switch)
sudo ovs-vsctl add-br ovsbr0

# Add a physical interface to the OVS bridge (uplink)
sudo ovs-vsctl add-port ovsbr0 eth0

# Connect a Docker container to the OVS bridge
```

## Troubleshooting
- **Controller Unreachable:** If the network devices lose connection to the central SDN controller, they usually revert to a default forwarding state (often dropping all traffic) or continue operating based on their last received instructions.
- **Policy Mismatches:** If the high-level policy defined in the controller doesn't translate correctly into low-level forwarding rules on the network devices, traffic will be misrouted or dropped.
- **Performance Bottlenecks:** The SDN controller itself can become a bottleneck if it is undersized or overwhelmed by the number of devices it has to manage.

## Interview Questions
- What is the fundamental concept behind Software-Defined Networking (SDN)?
- Explain the separation of the Control Plane and the Data Plane in SDN.
- What are the advantages of using SDN for network management and automation?
- What is the primary security risk associated with a centralized SDN controller?

## Summary
SDN transforms network management from a manual, device-by-device process into a centralized, programmable, and automated system. By decoupling the network's intelligence from its forwarding hardware, SDN enables the agile, API-driven network infrastructures that are essential for private and public cloud environments.

## References
- [Virtual Networking](virtual-networking.md)
- [NFV (Network Function Virtualization)](nf-virtualization.md)
- [Cloud Networking](cloud-networking.md)
- [Kubernetes Networking](kubernetes-networking.md)
