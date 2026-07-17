# GCP Networking

> GCP Networking is the extensive suite of services that allow users to build isolated, scalable, and secure virtual networks within Google Cloud's global infrastructure.

## Overview
Google Cloud Platform (GCP) provides a unique, globally distributed network architecture that allows customers to build and manage their virtual networks. **GCP Networking** enables users to provision virtual switches, routers, firewalls, and load balancers entirely in software, offering unparalleled global reach and scalability.

## Why It Matters
GCP is a growing force in the public cloud market, known for its strong networking foundation and advanced AI/ML capabilities. Understanding GCP Networking is essential for cloud architects, DevOps professionals, and security engineers working within Google's ecosystem. Proper network design and security configurations in GCP are critical to leverage its global infrastructure effectively and securely.

## Core Concepts
- **Global Network:** Unlike AWS or Azure, GCP's Virtual Private Clouds (VPCs) are inherently global. A single VPC can span multiple regions and zones, allowing subnets to be created anywhere in the world and communicate using private IP addresses.
- **VPC Network:** Your isolated virtual network in GCP. You define its global IP range(s).
- **Subnet:** Logical divisions within your VPC network. Each subnet is regional, meaning it's available across all zones within a given region.
- **Firewall Rules:** GCP's distributed virtual firewalls that control traffic flow at the instance (VM) level. These are stateful and globally consistent.
- **Cloud Router:** A fully distributed and managed routing service that establishes BGP peering with your on-premises routers via VPN or Interconnect.

## How It Works (Basic VPC Setup)
1. You create a **VPC Network** in GCP (e.g., `my-global-vpc`).
2. You create **Subnets** within that VPC, spanning different regions (e.g., `us-east1-subnet` with `10.0.1.0/24`, `europe-west1-subnet` with `10.0.2.0/24`).
3. You create **Firewall Rules** at the VPC network level, allowing inbound TCP port 80 and 443 from anywhere (`0.0.0.0/0`) to specific VM instances via network tags.
4. You launch **Compute Engine VMs** into these subnets. Each VM gets a Private IP (e.g., `10.0.1.5`). You can optionally assign an External IP (Public IP) to a VM.
5. The VMs can now communicate with each other using their private IPs globally within the VPC, and publicly via assigned External IPs.

## Components / Types
- **Cloud DNS:** Managed DNS service for internal and external domain name resolution.
- **Cloud Load Balancing:** A single, global IP address for web applications. It distributes traffic across instances in multiple regions, providing massive scalability and automatic failover.
- **Cloud VPN:** Establishes secure IPsec VPN tunnels between your GCP VPC and your on-premises network.
- **Cloud Interconnect:** A dedicated, private connection from your on-premises data center to Google's network, similar to AWS Direct Connect.
- **VPC Network Peering:** Connects two VPC networks together, allowing resources in either network to communicate using private IP addresses.
- **Shared VPC:** Allows an organization to connect projects to a common VPC network, enabling centralized network administration and distributed application development.

## Practical Examples
- **Global Web Application:** A web application needs to serve users worldwide with low latency. It is deployed on Compute Engine VMs across multiple regions (e.g., `us-east1`, `europe-west1`, `asia-southeast1`). A single GCP Global HTTP(S) Load Balancer is placed in front of these VMs, automatically routing users to the nearest healthy instance.
- **Hybrid Connectivity with On-Prem:** A company uses Cloud VPN to create IPsec tunnels between their corporate data center and their GCP VPC. Cloud Router dynamically exchanges routes via BGP, allowing internal users to securely access services running in GCP using private IP addresses.

## Security Considerations
- **Firewall Rules and Network Tags:** GCP's firewall rules are powerful but complex. They use "network tags" (`web-server`, `db-server`) to apply rules to groups of VMs, similar to Security Groups. Misconfigured tags or rules can create significant security gaps.
- **Global Reach, Global Impact:** A misconfiguration (e.g., an overly permissive firewall rule) can have a global impact across all regions within your VPC, not just a single local data center.
- **Shared Security Model:** Google is responsible for the security *of* the cloud; the customer is responsible for security *in* the cloud. This includes proper network segmentation, firewall rules, and IAM policies.
- **Private Google Access:** Allows instances in private subnets to reach Google APIs and services (e.g., Cloud Storage) without exposing them to the Internet, enhancing security.

## Commands / Configuration Examples
GCP Networking is primarily managed via the Google Cloud Console (GUI), `gcloud` CLI, or Infrastructure-as-Code (Terraform, Cloud Deployment Manager).

### gcloud CLI (Creating a VPC Network and Subnet)
```bash
# Create a new global VPC network
gcloud compute networks create my-global-vpc --subnet-mode custom

# Create a regional subnet within the global VPC network
gcloud compute networks subnets create us-east1-subnet \
  --network my-global-vpc \
  --region us-east1 \
  --range 10.0.1.0/24
```

## Troubleshooting
- **VM Cannot Access Internet:** Check the Firewall Rules at the VPC network level. Ensure an egress rule (`0.0.0.0/0`) exists and that the VM has an External IP or routes through a Cloud NAT instance.
- **Cannot SSH to VM:** Ensure a Firewall Rule allows inbound TCP port 22 to the VM's network tag from your source IP.
- **Inter-Region Latency:** While GCP VPCs are global, traffic between regions still traverses physical fiber. High latency might indicate the application's architecture is not optimized for global distribution.

## Interview Questions
- What is a key architectural difference between GCP VPCs and AWS VPCs/Azure VNets? (Answer: GCP VPCs are global; others are regional).
- Explain the role of GCP Firewall Rules.
- How does GCP's Global HTTP(S) Load Balancer improve application performance and reliability?
- What is "Cloud Interconnect" used for?

## Summary
GCP Networking leverages a unique global architecture to provide highly scalable and performant virtual networks. By understanding its global VPC model, firewall rules, and managed services, architects can build applications that seamlessly span continents, but they must carefully manage security policies across this vast, software-defined infrastructure.

## References
- [Cloud Networking](cloud-networking.md)
- [Hybrid Cloud Connectivity](hybrid-cloud-connectivity.md)
- [Kubernetes Networking](kubernetes-networking.md)
- [AWS Networking](aws-networking.md)
- [Azure Networking](azure-networking.md)
