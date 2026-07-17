# Micro-segmentation

> Micro-segmentation is an advanced security technique that breaks the data center network into extremely granular segments, often down to the individual workload or application, to enforce Zero Trust policies.

## Overview
Traditional Network Segmentation creates large "zones" (like a User VLAN and a Server VLAN). **Micro-segmentation** takes this to the logical extreme. Instead of segmenting buildings, it segments applications. Every component of an application (its web server, its API server, its database server) can be wrapped in its own tiny, isolated security bubble.

This enforces a "Zero Trust" security model where no traffic is trusted by default, even traffic moving between two servers sitting in the exact same rack.

## Why It Matters
In a traditional data center, if an attacker compromises one web server, they can freely scan and attack every other server on that same VLAN. With micro-segmentation, if the attacker compromises that same web server, they are trapped. The firewall rules for that server's segment state: "This web server is ONLY allowed to talk to the API server on port 8080. All other traffic is dropped." The attacker cannot pivot, cannot perform reconnaissance, and is completely contained.

## Core Concepts
- **Workload-Centric:** Policies are tied to the identity of the application workload (the VM or container), not the IP address of the physical server it's running on.
- **Identity-Based Rules:** Rules are written in plain English: "Allow `App=WebServer` to talk to `App=Database` on `Port=3306`."
- **Hypervisor Enforcement:** Micro-segmentation is typically enforced by a virtual firewall built directly into the server's hypervisor (like VMware NSX or vSphere Distributed Firewall), not by a physical appliance.
- **East-West Traffic Focus:** The primary goal is to secure and visualize server-to-server traffic *within* the data center, a massive blind spot in legacy security.

## How It Works
1. An administrator deploys VMware NSX across their virtualization cluster.
2. The admin goes into the NSX dashboard and creates security tags and groups: a group for all "Web Servers," a group for "Database Servers," etc.
3. The admin writes a single rule: "`Source=Web-Servers`, `Destination=Database-Servers`, `Service=MySQL`, `Action=Allow`."
4. When a web VM tries to connect to a database VM, the request hits the virtual switch inside the hypervisor. 
5. The NSX distributed firewall inspects the packet. It sees that the source and destination VMs are in the correct groups and the port is allowed. The packet is permitted.
6. If that same web VM tries to SSH into the database VM, the firewall sees the `Destination Port=22` does not match the rule, and drops the packet before it ever touches the physical network.

## Components / Types
- **Agent-Based:** Security software is installed directly inside the guest operating system of each server (e.g., Illumio).
- **Network-Based (Hypervisor):** The firewall is integrated into the virtual switch layer of the hypervisor. This is the most common approach (VMware NSX, Cisco ACI).
- **Cloud-Native:** Cloud providers offer this as a service (e.g., AWS Security Groups, Azure Network Security Groups).

## Practical Examples
- **Ransomware Containment:** A ransomware worm infects a single server in the data center via a zero-day exploit. The worm tries to spread by scanning the local network for other servers with open SMB (Port 445) shares. Because the compromised server is in a micro-segment where its firewall policy only allows outbound HTTPS, every single attempt to scan for port 445 is dropped by the hypervisor firewall. The ransomware is completely trapped and cannot spread.

## Security Considerations
- **Orchestration Complexity:** Micro-segmentation requires a complete and accurate inventory of every application flow in the data center. If the "Permit" rules are incomplete, deploying micro-segmentation will break applications in unpredictable ways.
- **Policy Management:** Managing rules for thousands of individual workloads requires sophisticated automation and a strong DevOps culture. It cannot be managed manually via spreadsheets.
- **Agent Overhead:** Agent-based solutions consume CPU and memory on every protected server, which must be accounted for in capacity planning.

## Commands / Configuration Examples
Micro-segmentation is managed almost exclusively via complex GUIs (like VMware vCenter/NSX Manager) or via Infrastructure-as-Code tools like Terraform.

### Terraform Example (Conceptual AWS Security Group)
```hcl
resource "aws_security_group" "database_sg" {
  name        = "database-access"
  description = "Allow DB traffic from web tier"
  vpc_id      = "vpc-12345"

  ingress {
    description     = "MySQL from Web Servers"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    # The source is NOT an IP range, but the ID of another security group
    security_groups = [aws_security_group.webserver_sg.id] 
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

## Troubleshooting
- **Blocked Legitimate Traffic:** The most common issue. Developers deploy a new feature where the web server now needs to call a new internal API server. Because no rule exists for this flow, the micro-segmentation firewall drops the traffic. The security team must analyze the firewall logs, see the denied packets, and create a new `permit` rule for that specific flow.
- **IP Address Irrelevance:** Troubleshooting cannot be done by looking at IP addresses, because VMs move. You must use the management tools to find the workload by its Name or Tag and view the security policies applied directly to that object.

## Interview Questions
- What is the difference between traditional network segmentation and micro-segmentation?
- What problem does micro-segmentation solve that VLANs cannot? (Answer: It controls East-West traffic between servers on the *same* VLAN/subnet).
- Where are micro-segmentation security policies typically enforced? (Answer: At the hypervisor level / virtual switch).
- How does micro-segmentation support a Zero Trust security model?

## Summary
Micro-segmentation is the evolution of network security, moving from broad, IP-based perimeter controls to granular, identity-based workload controls. By assuming all internal traffic is untrusted and enforcing policy at the hypervisor level, it provides an unparalleled ability to contain lateral movement and stop the spread of modern data center attacks.

## References
- [Network Segmentation](network-segmentation.md)
- [Zero Trust](zero-trust.md)
- [Virtual Networking](../11-cloud-and-virtual-networking/virtual-networking.md)
- [Firewall](../07-network-devices/firewall.md)
