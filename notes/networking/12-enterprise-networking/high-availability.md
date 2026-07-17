# High Availability

> High Availability (HA) is a design principle and set of technologies that maximize network and system uptime by eliminating single points of failure, ensuring services remain accessible even during hardware or software malfunctions.

## Overview
A "single point of failure" is any component whose failure immediately stops the entire system from working. In critical enterprise networks, avoiding single points of failure is paramount. **High Availability (HA)** strategies involve deploying redundant hardware (like two firewalls, two routers, two switches), duplicate power supplies, and duplicate network links.

If one component fails, another immediately takes over, ensuring that applications and network services continue to function without interruption.

## Why It Matters
For mission-critical applications (e.g., financial trading, hospital systems, e-commerce), any downtime directly translates to massive financial losses, reputational damage, or even threats to human life. HA design is mandatory for any enterprise infrastructure. Understanding HA is crucial for network architects and system administrators, as it fundamentally changes how every device in the network is deployed and configured.

## Core Concepts
- **Redundancy:** Duplicating critical hardware components or software services.
- **Failover:** The automatic process of switching from a primary, failed component to a secondary, working component.
- **Service Continuity:** The ultimate goal of HA. Ensuring that applications remain accessible to users during a failure.
- **Recovery Time Objective (RTO):** The maximum acceptable delay before an application or service must be restored after a disaster. HA aims for very low RTO.
- **Recovery Point Objective (RPO):** The maximum acceptable amount of data loss that can occur when an application or service is restored. HA often involves data replication to minimize RPO.

## How It Works
HA can be implemented at various layers of the network and system stack:

### 1. Network Device HA (Active/Standby)
- Two firewalls are deployed. Firewall A is "Active," processing all traffic. Firewall B is "Standby," constantly monitoring Firewall A.
- If Firewall A fails, Firewall B detects the failure and automatically takes over the Active role, inheriting Firewall A's IP address and MAC address.
- Protocols like HSRP, VRRP, or GLBP provide transparent default gateway failover for client subnets.

### 2. Network Path HA (Redundant Links)
- Two switches are connected via two separate physical Ethernet links.
- Spanning Tree Protocol (STP) blocks one link to prevent a loop. If the primary link fails, STP immediately unblocks the secondary link.
- EtherChannel (Link Aggregation) bundles multiple physical links into one logical link, so if one physical cable fails, the logical link remains up.

### 3. Server/Application HA (Clustering)
- Two web servers are deployed behind a Load Balancer.
- The Load Balancer continuously health-checks both servers. If one fails, the Load Balancer stops sending traffic to it.
- Applications run in a cluster, sharing data. If one server goes down, another takes over its workload.

## Components / Types
- **FHRP (First Hop Redundancy Protocols):** HSRP, VRRP, GLBP. Provide default gateway redundancy for client subnets.
- **HA Clustering:** Physical pairing of devices (firewalls, load balancers, SANs) that share state and failover automatically.
- **Load Balancers:** Distribute traffic and perform health checks, directing users away from failed servers.
- **Redundant Power Supplies / UPS / Generators:** Ensure devices have continuous power.
- **Redundant Network Links:** Multiple physical cables between devices and to ISPs.

## Practical Examples
- **Core Router Pair:** Two Cisco routers are configured as an HSRP Active/Standby pair. If the Active router loses power, the Standby router instantly takes over its Virtual IP and MAC address. Clients continue sending traffic to the same IP address without interruption.
- **Clustered Firewalls:** Two Palo Alto firewalls are deployed in an Active/Passive HA cluster. The Active firewall processes traffic and mirrors its connection state table to the Passive firewall. If the Active firewall fails, the Passive firewall instantly becomes Active. All active user connections remain alive because the new Active firewall has the full connection state.

## Security Considerations
- **Fail-Open vs. Fail-Closed:** A critical decision for security appliances. If a firewall fails, should it:
    - *Fail-Open:* Let all traffic through (prioritizing Availability over Security)?
    - *Fail-Closed:* Block all traffic (prioritizing Security over Availability)?
- **HA Controller Compromise:** If an attacker compromises the centralized HA management interface, they could potentially force a failover, causing a denial of service or redirecting traffic.
- **Testing Failover:** HA configurations are complex. If they are not regularly tested, a perceived redundant system can fail catastrophically during a real outage.

## Commands / Configuration Examples
See specific FHRP notes for detailed configuration. HA clustering is usually configured via GUI or vendor-specific CLI.

### Cisco IOS (Configuring a Redundant EtherChannel)
```text
! Bundle two physical links between switches for combined bandwidth and redundancy
interface Port-channel 1
 switchport mode trunk
 switchport trunk allowed vlan all
```

## Troubleshooting
- **Split-Brain Scenario:** The worst-case HA scenario. If two firewalls in an HA cluster lose contact with each other but *both* believe they are the Active firewall (e.g., due to a broken HA link), they will both try to use the same IP addresses. This creates massive IP conflicts and network chaos.
- **HA Link Failure:** The dedicated cable connecting two HA devices (which mirrors state and sends heartbeats) is critical. If this link fails, the HA pair may lose communication, triggering an unwanted failover or a split-brain condition.

## Interview Questions
- What is the primary goal of High Availability in network design?
- Name two First Hop Redundancy Protocols (FHRPs).
- Explain the difference between RTO and RPO.
- What is a "single point of failure" in a network?

## Summary
High Availability is the ultimate goal of enterprise network design. By strategically deploying redundant components, configuring automatic failover mechanisms, and continuously monitoring their health, organizations can ensure that their critical applications remain accessible and resilient against inevitable hardware and software failures.

## References
- [Network Redundancy](network-redundancy.md)
- [HSRP](hsrp.md)
- [VRRP](vrrp.md)
- [GLBP](glbp.md)
- [Load Balancer](../07-network-devices/load-balancer.md)
