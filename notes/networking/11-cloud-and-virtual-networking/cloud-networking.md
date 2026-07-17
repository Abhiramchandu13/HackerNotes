# Cloud Networking

> Cloud Networking is the provisioning and management of network resources (like virtual networks, subnets, routers, firewalls, and load balancers) within a public or private cloud environment, typically delivered as a software-defined service.

## Overview
Moving your servers to the cloud (AWS, Azure, GCP) means you no longer buy physical hardware. It also means you no longer physically plug in cables or configure hardware switches. **Cloud Networking** replaces all of that with software-defined resources managed via API calls, web consoles, or Infrastructure-as-Code.

While the underlying physical network still exists in the cloud provider's data centers, the customer interacts entirely with a virtualized representation of switches, routers, and firewalls.

## Why It Matters
Cloud networking fundamentally changes how networks are designed, deployed, and secured. Understanding it is a mandatory skill for any modern network engineer, DevOps professional, or cloud security architect. Misconfigurations in cloud networks are the leading cause of data breaches in cloud environments.

## Core Concepts
- **VPC (Virtual Private Cloud):** The customer's isolated, private virtual network within the cloud provider's public cloud infrastructure. It acts like a traditional data center, but entirely in software.
- **Subnets:** Logical divisions within a VPC. Subnets are tied to specific availability zones (physical data centers) within a region.
- **Security Groups / Network ACLs:** Software-defined firewalls that control traffic in and out of virtual machines (EC2 instances) or subnets.
- **Managed Services:** Cloud providers offer managed versions of traditional network devices (e.g., AWS Transit Gateway, Azure Load Balancer). The customer configures the logic, and the cloud provider handles the underlying hardware.

## How It Works (AWS VPC Example)
1. You create a **VPC** in AWS and assign it a private IP range (e.g., `10.0.0.0/16`).
2. You define **Subnets** within that VPC, spanning different Availability Zones (physical data centers) for redundancy (e.g., `10.0.1.0/24` in AZ1, `10.0.2.0/24` in AZ2).
3. You create a **Security Group** for your web servers, allowing inbound TCP port 80 and 443 from anywhere (`0.0.0.0/0`).
4. You launch an **EC2 instance** (a virtual machine) into one of these subnets, assigning it a Private IP (e.g., `10.0.1.5`) and attaching the Security Group.
5. You attach an **Internet Gateway** to the VPC, and add a **Route Table** entry: "All traffic destined for `0.0.0.0/0` (the Internet) goes to the Internet Gateway."
6. The EC2 instance can now talk to the Internet.

## Components / Types
- **Internet Gateway:** Connects the VPC to the public Internet.
- **NAT Gateway:** Allows instances in private subnets to initiate outbound connections to the Internet without being directly exposed.
- **VPN Gateway:** Establishes secure IPsec VPN tunnels between your VPC and your on-premises data center.
- **Direct Connect / ExpressRoute:** Dedicated, private, high-bandwidth physical links between your on-premises data center and the cloud provider's network.
- **Load Balancers:** Software-defined load balancers distribute traffic across multiple instances (e.g., AWS ALB/NLB).

## Practical Examples
- **Hybrid Cloud Connectivity:** A company runs its core applications on-premises but uses AWS for overflow capacity. They establish a site-to-site IPsec VPN tunnel between their corporate firewall and their AWS VPC VPN Gateway, seamlessly extending their internal network into the cloud.
- **Serverless Networking:** When you deploy a serverless function (e.g., AWS Lambda), the cloud provider automatically provisions a minimal network interface within your VPC, allowing your function to securely access databases or APIs without you manually configuring IP addresses or subnets.

## Security Considerations
- **Misconfigured Security Groups:** The #1 cause of cloud data breaches. Forgetting to restrict inbound traffic to a database server (e.g., allowing `0.0.0.0/0` on port 3306) exposes the database directly to the Internet.
- **Default VPCs:** Cloud providers create a "default VPC" when you sign up. These are often highly permissive. Companies should always delete the default VPC and create custom VPCs with strict network ACLs and segmentation.
- **Shadow IT:** Developers can easily spin up cloud resources. If these resources are not properly integrated into the corporate security posture (e.g., lacking centralized logging or a VPN connection), they become "shadow IT" and a massive security blind spot.

## Commands / Configuration Examples
Cloud networking is primarily managed via Web Consoles, APIs, or Infrastructure-as-Code (like Terraform or CloudFormation).

### AWS CLI (Conceptual)
```bash
# Create a new VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create a subnet within the VPC
aws ec2 create-subnet --vpc-id vpc-12345 --cidr-block 10.0.1.0/24 --availability-zone us-east-1a

# Create a Security Group (firewall)
aws ec2 create-security-group --group-name "WebTraffic" --description "Allow HTTP/HTTPS" --vpc-id vpc-12345
aws ec2 authorize-security-group-ingress --group-id sg-12345 --protocol tcp --port 80 --cidr 0.0.0.0/0
```

## Troubleshooting
- **Cannot Reach Internet from EC2:** Check the **Route Table**. Does the subnet's route table have a default route (`0.0.0.0/0`) pointing to an Internet Gateway or NAT Gateway?
- **Cannot SSH to EC2:** Check the **Security Group**. Does the instance's Security Group allow inbound TCP port 22 from your source IP address?
- **Private Subnet Internet Access:** Instances in a private subnet cannot directly reach the Internet. They must route their outbound traffic through a **NAT Gateway** (for internet access) or an **Internet Gateway** (for publicly exposed servers).

## Interview Questions
- What is a VPC and what is its primary purpose?
- Explain the role of an Internet Gateway in AWS.
- What is the primary security risk associated with misconfigured Security Groups?
- What is "Direct Connect" (AWS) or "ExpressRoute" (Azure) used for?

## Summary
Cloud Networking transforms traditional network engineering into a software-defined discipline. By virtualizing every component and managing them via API, cloud networking enables unparalleled agility and scalability, but demands a fundamental shift in how security boundaries are defined and enforced.

## References
- [Virtual Networking](virtual-networking.md)
- [Hypervisors](hypervisors.md)
- [AWS Networking](aws-networking.md)
- [Security Groups](../13-advanced-network-security/aws-security-groups.md)
