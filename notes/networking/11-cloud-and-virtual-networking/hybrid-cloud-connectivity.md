# Hybrid Cloud Connectivity

> Hybrid Cloud Connectivity refers to the technologies and strategies used to seamlessly integrate on-premises data centers with public cloud environments, creating a unified IT infrastructure.

## Overview
Many enterprises operate in a **Hybrid Cloud** model, meaning they run some applications in their own traditional data centers (on-premises) and other applications (or parts of applications) in public clouds like AWS, Azure, or GCP. To make these two environments function as a single, cohesive entity, robust and secure network connectivity is paramount.

Hybrid Cloud Connectivity is about extending your corporate network—your IP address space, your routing tables, your security policies—seamlessly across the internet into the cloud provider's Virtual Private Cloud (VPC).

## Why It Matters
Hybrid Cloud offers the best of both worlds: leveraging the scalability and agility of the cloud for new applications, while retaining sensitive data or legacy systems on-premises. For network engineers, designing and implementing this connectivity is a complex task involving IPsec VPNs, dedicated physical links, and advanced routing protocols like BGP. For cloud security architects, securing the "seams" between on-prem and cloud is a critical defense against data exfiltration and lateral movement.

## Core Concepts
- **VPC (Virtual Private Cloud):** Your isolated network in the public cloud.
- **On-premises Network:** Your traditional data center.
- **Interconnection:** The secure link connecting these two environments.
- **Routing Integration:** Ensuring that both on-premises and cloud routers know how to find workloads in each other's networks.
- **Shared Security Model:** Responsibility for security is split between the cloud provider and the customer.

## How It Works (Common Methods)

### 1. Site-to-Site IPsec VPN
- **Mechanism:** An encrypted IPsec tunnel is established over the public Internet between your on-premises firewall/router and the cloud provider's VPN Gateway.
- **Use Case:** Cost-effective for non-critical workloads, development environments, or smaller bandwidth requirements (typically up to 1.25 Gbps).
- **Pros:** Relatively inexpensive, fast to deploy.
- **Cons:** Performance can be inconsistent due to public Internet congestion; relies on Internet availability.

### 2. Dedicated Cloud Connect (AWS Direct Connect / Azure ExpressRoute / GCP Cloud Interconnect)
- **Mechanism:** A private, physical fiber optic circuit is established between your on-premises data center and the cloud provider's network, bypassing the public Internet entirely.
- **Use Case:** Critical production workloads, large data transfers, low-latency applications, or strict compliance requirements.
- **Pros:** Consistent high performance, predictable low latency, enhanced security, more reliable.
- **Cons:** Significantly more expensive, longer deployment times (weeks to months).

## Components / Types
- **On-premises VPN Appliance:** Your firewall or router (e.g., Cisco ASA, Palo Alto, FortiGate) that terminates the VPN tunnel.
- **Cloud VPN Gateway:** The cloud provider's virtual router/firewall that terminates the VPN tunnel in the VPC.
- **BGP Routing:** Used to dynamically exchange routes between your on-premises routers and your cloud routers, ensuring both sides know about all subnets in both environments.
- **Transit Gateway (AWS/Azure/GCP):** A centralized cloud router that simplifies connectivity between multiple VPCs and on-premises networks.

## Practical Examples
- **Bursting to Cloud:** A retail company runs its e-commerce website on-premises. During peak holiday seasons (Black Friday), they "burst" additional web servers into AWS. A Direct Connect circuit provides the high-bandwidth link to seamlessly integrate the cloud servers into their existing network.
- **Disaster Recovery:** A bank hosts its primary applications in its own data center. For disaster recovery, they replicate their databases to a cold standby in an Azure VPC. An ExpressRoute circuit provides the reliable, high-speed link for continuous data synchronization.

## Security Considerations
- **Firewall Rules (On-Prem & Cloud):** Security policies must be consistent and enforced at both the on-premises firewall and the cloud security groups/network ACLs. Misconfigured rules can create unauthorized pathways between environments.
- **IP Address Overlap:** If your on-premises network uses `10.0.0.0/16` and your cloud VPC also uses `10.0.0.0/16`, traffic will not route correctly. Careful IP address planning (using Private IP addresses) is essential.
- **DDoS Mitigation:** Hybrid environments can complicate DDoS defense. Attackers may target the public cloud portion, consuming cloud provider bandwidth, or target the on-premises link, overwhelming the dedicated circuit.
- **Encryption In Transit:** All traffic traversing the public internet between on-premises and cloud (VPN) *must* be encrypted. Even dedicated circuits should use IPsec encryption if data is sensitive, as you don't fully control the physical fiber path.

## Commands / Configuration Examples
Configuration involves both on-premises (Cisco IOS, Palo Alto) and cloud provider (AWS CLI, Azure Portal) specific commands.

### Cisco IOS (Configuring IPsec VPN to AWS)
```text
! Sample crypto map configuration to establish an IPsec tunnel
crypto map AWS_VPN 10 ipsec-isakmp
 set peer 52.1.1.1                ! AWS VPN Gateway Public IP
 set transform-set MY_TRANSFORM_SET
 match address 101                 ! ACL defining on-prem traffic for encryption
```

### AWS CLI (Creating a Site-to-Site VPN)
```bash
# Create a Customer Gateway (representing your on-premises firewall)
aws ec2 create-customer-gateway --bgp-asn 65000 --public-ip 203.0.113.10 --type ipsec.1

# Create a Virtual Private Gateway (on the AWS side)
aws ec2 create-vpn-gateway --type ipsec.1 --amazon-side-asn 64512

# Create the VPN Connection (the tunnel itself)
aws ec2 create-vpn-connection --type ipsec.1 --customer-gateway-id cgw-123 --vpn-gateway-id vgw-456
```

## Troubleshooting
- **VPN Tunnel Down:** The most common issue. Verify the pre-shared keys, IPsec/IKE parameters, and firewall rules on both the on-premises and cloud VPN gateways are identical. Check logs on both sides for negotiation failures.
- **Traffic Not Routing:** Even if the VPN tunnel is up, traffic won't flow if routing tables on both sides don't know about the remote subnets. Verify BGP adjacencies or manually configure static routes.
- **Latency/Performance:** If a dedicated circuit (Direct Connect) is showing high latency, check physical layer issues on the circuit itself or congestion within the cloud provider's network.

## Interview Questions
- What are the two primary methods for connecting an on-premises data center to a public cloud VPC?
- Explain the difference between a Site-to-Site VPN and a dedicated physical connection (Direct Connect/ExpressRoute).
- Why is BGP commonly used in hybrid cloud connectivity?
- What are the primary security considerations when extending your internal network into the public cloud?

## Summary
Hybrid Cloud Connectivity provides the essential bridges that unify traditional and cloud infrastructure. By leveraging IPsec VPNs for flexibility and dedicated circuits for performance, organizations can build scalable, resilient, and secure hybrid environments, but they must carefully manage the complex network and security policies at the junction points.

## References
- [Cloud Networking](cloud-networking.md)
- [IPsec](ipsec.md)
- [BGP](../05-routing/bgp.md)
- [AWS Networking](aws-networking.md)
