# AWS Networking

> AWS Networking encompasses the vast suite of services that allow users to build isolated, scalable, and secure virtual networks within Amazon's global cloud infrastructure.

## Overview
When you deploy resources in Amazon Web Services (AWS), you don't physically plug in servers or routers. Instead, you define your network entirely in software using services like **Amazon Virtual Private Cloud (VPC)**. AWS Networking provides a flexible, API-driven platform to provision virtual switches, routers, firewalls, and load balancers, allowing you to create complex network topologies that integrate seamlessly with your on-premises data centers.

## Why It Matters
AWS is the largest public cloud provider. Almost every modern enterprise utilizes AWS in some capacity. Understanding AWS Networking is a mandatory skill for cloud architects, DevOps engineers, and cloud security professionals. Misconfigurations in AWS networks are the leading cause of cloud data breaches, making proper design and security paramount.

## Core Concepts
- **Region:** A geographical area (e.g., `us-east-1` in N. Virginia). Each Region is completely independent.
- **Availability Zone (AZ):** One or more discrete data centers within a Region. Resources spread across AZs provide high availability.
- **VPC (Virtual Private Cloud):** Your isolated virtual network within an AWS Region. You define its IP range (e.g., `10.0.0.0/16`).
- **Subnet:** A logical segment of your VPC's IP range (e.g., `10.0.1.0/24`). Each subnet must reside entirely within a single Availability Zone.
- **Security Groups:** Stateful, instance-level virtual firewalls that control traffic in and out of EC2 instances (VMs).
- **Network ACLs (NACLs):** Stateless, subnet-level virtual firewalls that control traffic in and out of subnets.

## How It Works (Basic VPC Setup)
1. You create a **VPC** (`10.0.0.0/16`) in `us-east-1`.
2. You create two **Subnets**: `10.0.1.0/24` in `us-east-1a` (Public) and `10.0.2.0/24` in `us-east-1b` (Private).
3. You attach an **Internet Gateway (IGW)** to your VPC. This allows resources with Public IPs or Elastic IPs in your VPC to communicate with the Internet.
4. You create **Route Tables** for each subnet. The Public Subnet's route table points `0.0.0.0/0` to the IGW. The Private Subnet's route table points `0.0.0.0/0` to a **NAT Gateway**.
5. You launch an **EC2 instance** into the Public Subnet and attach a **Security Group** allowing SSH (Port 22) and HTTPS (Port 443).
6. The EC2 instance now has a Private IP (`10.0.1.5`) and a Public IP. It can reach the Internet and be reached from the Internet.

## Components / Types
- **Route 53:** AWS's highly available and scalable DNS web service.
- **Elastic Load Balancing (ELB):** Distributes traffic across multiple EC2 instances (Application Load Balancer - ALB, Network Load Balancer - NLB).
- **AWS Transit Gateway:** A central hub to connect thousands of VPCs and on-premises networks, simplifying routing and reducing the number of VPN connections.
- **VPC Peering:** Connects two VPCs together with a direct network connection, allowing instances in either VPC to communicate using private IP addresses.
- **AWS Direct Connect:** A dedicated, private network connection from your premises to AWS.

## Practical Examples
- **Multi-Tier Web Application:** A web application uses an ALB to distribute traffic to EC2 instances in a Public Subnet. These web servers then securely connect to database instances in a Private Subnet. The database instances use a NAT Gateway to download OS updates from the Internet, but cannot be directly accessed from the Internet.
- **Inter-Region Failover:** An application runs in `us-east-1` with a hot standby in `us-west-2`. DNS queries for the application are routed to the nearest healthy AWS Region using Route 53's latency-based routing.

## Security Considerations
- **Security Group Misconfigurations:** The #1 cause of cloud breaches. Overly permissive inbound rules (e.g., `Allow All from 0.0.0.0/0`) on sensitive resources like databases or SSH can be devastating.
- **Network ACLs (NACLs) vs. Security Groups:** Remember NACLs are stateless (both inbound and outbound rules required for replies), while Security Groups are stateful. NACLs are primarily used as a coarse-grained subnet firewall, Security Groups for fine-grained instance filtering.
- **Shared Responsibility Model:** AWS secures the "cloud itself" (physical security of data centers, hypervisor). The customer is responsible for security *in* the cloud (configuring VPCs, subnets, Security Groups, IAM roles).
- **VPC Flow Logs:** Critical for security monitoring. They capture metadata about all IP traffic going to/from network interfaces in your VPC, providing NetFlow-like visibility for threat hunting.

## Commands / Configuration Examples
AWS Networking is primarily managed via the AWS Console (GUI), AWS CLI, or Infrastructure-as-Code (Terraform, CloudFormation).

### AWS CLI (Creating a VPC and Subnet)
```bash
# Create a new VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query Vpc.VpcId --output text

# Create a public subnet within the VPC
aws ec2 create-subnet --vpc-id vpc-0abcdef1234567890 --cidr-block 10.0.1.0/24 --availability-zone us-east-1a --query Subnet.SubnetId --output text
```

## Troubleshooting
- **Cannot Reach EC2 Instance:**
  - **Ping Fails:** Ensure the instance's Security Group allows inbound ICMP.
  - **SSH Fails:** Ensure the instance's Security Group allows inbound TCP port 22 from your source IP. Check the Route Table for the subnet.
  - **Public IP Missing:** Did you attach an Internet Gateway to the VPC? Is the subnet explicitly associated with the correct Route Table?
- **Private Instance Cannot Reach Internet:** Does the subnet's Route Table point `0.0.0.0/0` to a NAT Gateway? Is the NAT Gateway deployed in a public subnet with a route to the IGW?

## Interview Questions
- What is an AWS VPC and what is its purpose?
- Explain the difference between an AWS Security Group and a Network ACL.
- What is the function of an Internet Gateway?
- How do you allow instances in a private subnet to access the Internet for updates without exposing them to inbound connections? (Answer: Use a NAT Gateway).

## Summary
AWS Networking provides a robust, software-defined infrastructure for building virtual data centers in the cloud. By understanding its core services—VPCs, Subnets, Security Groups, and Route Tables—architects can design highly scalable, resilient, and secure cloud applications, but must remain vigilant against common misconfigurations.

## References
- [Cloud Networking](cloud-networking.md)
- [Hybrid Cloud Connectivity](hybrid-cloud-connectivity.md)
- [Security Groups](../13-advanced-network-security/aws-security-groups.md)
- [Kubernetes Networking](kubernetes-networking.md)
