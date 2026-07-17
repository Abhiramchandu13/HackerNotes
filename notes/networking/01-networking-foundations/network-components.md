# Network Components

> Network components are the building blocks that move, control, protect, and observe traffic.

## Overview
A network is not just wires and Wi-Fi. It includes devices, services, interfaces, and policies that work together to deliver communication.

If you understand the major components, you can design a network, locate faults faster, and reason about security boundaries.

## Why It Matters
Network components determine:
- How traffic enters and exits a network
- Where addresses are assigned
- Where inspection and filtering happen
- How users authenticate
- How logs and telemetry are collected

A misconfigured component can become an outage or a security incident.

## Core Concepts
Common network components include:
- Endpoints: laptops, servers, phones, printers
- NICs: network interface cards or embedded adapters
- Switches: forward frames inside LANs
- Routers: move packets between networks
- Firewalls: enforce security policy
- Access points: provide wireless access
- Load balancers: distribute traffic across servers
- DNS servers: resolve names to IPs
- DHCP servers: assign IP configuration dynamically
- VPN concentrators: terminate encrypted tunnels
- IDS/IPS sensors: inspect and alert on traffic

## How It Works
A simple enterprise flow might look like this:
1. A user device connects to a switch or access point.
2. DHCP provides an IP address, gateway, and DNS server.
3. The client resolves a service using DNS.
4. A router forwards the packet to another network.
5. A firewall or load balancer may inspect or redirect traffic.

For deeper details on each component, see [Network Devices](../07-network-devices/router.md) and [Network Protocols](../06-network-protocols/dhcp.md).

## Components / Types
### Endpoint Components
- Workstations
- Servers
- Virtual machines
- Mobile devices
- IoT devices

### Infrastructure Components
- Switches
- Routers
- Firewalls
- Access points
- Load balancers
- VPN gateways

### Service Components
- DNS
- DHCP
- NTP
- RADIUS / TACACS+
- Monitoring platforms

## Practical Examples
- A new employee connects a laptop to Wi-Fi, receives DHCP settings, and authenticates to the network.
- A web application sits behind a load balancer and reverse proxy.
- A security team monitors firewall logs and NetFlow to detect suspicious traffic.

## Security Considerations
- Every component is a potential attack surface.
- Management interfaces should not be publicly exposed.
- Default credentials and weak SNMP settings are common issues.
- Misplaced trust in internal components leads to lateral movement.

## Commands / Configuration Examples
### Linux
```bash
ip link show
ip addr show
ss -tulpn
```

### Windows
```powershell
Get-NetAdapter
Get-NetIPConfiguration
Get-DnsClientServerAddress
```

### Cisco IOS
```text
show interfaces status
show ip interface brief
show vlan brief
```

## Troubleshooting
- Is the endpoint NIC enabled?
- Is the switch port up and in the right VLAN?
- Is DHCP responding?
- Is DNS resolving the service name?
- Is the firewall blocking traffic?

## Interview Questions
- What are the main components of a network?
- What is the role of a router versus a switch?
- Why are DNS and DHCP considered network components?
- Which components should never be exposed to the public Internet?

## Summary
Network components are the physical and logical pieces that make communication possible. Once you know their roles, troubleshooting and security analysis become much easier.

## References
- [Network Types](network-types.md)
- [Network Devices](../07-network-devices/router.md)
- [DNS](../06-network-protocols/dns.md)
- [DHCP](../06-network-protocols/dhcp.md)
