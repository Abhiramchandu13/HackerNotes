# Azure Networking

> Azure Networking is the comprehensive suite of services that allow users to build isolated, scalable, and secure virtual networks within Microsoft's global cloud infrastructure.

## Overview
Microsoft Azure, a leading public cloud provider, offers a vast array of networking services that enable customers to build virtual data centers entirely in software. **Azure Networking** provides software-defined virtual switches, routers, firewalls, and load balancers, allowing for complex network topologies that integrate seamlessly with on-premises environments.

## Why It Matters
Azure is a dominant player in the enterprise cloud market. For any network engineer, DevOps professional, or cloud security architect working with Microsoft technologies, understanding Azure Networking is a mandatory skill. Misconfigurations in Azure networks are a primary cause of cloud data breaches, emphasizing the need for robust design and security.

## Core Concepts
- **Azure Region:** A geographical area (e.g., `East US`).
- **Availability Zone (AZ):** Physically separate, fault-tolerant data centers within an Azure region.
- **Virtual Network (VNet):** Your isolated private network in Azure, similar to AWS VPC. You define its IP address space (e.g., `10.0.0.0/16`).
- **Subnet:** Logical divisions within your VNet (e.g., `10.0.1.0/24`). Each subnet is tied to an Availability Zone.
- **Network Security Groups (NSGs):** Stateful, instance-level virtual firewalls that control inbound and outbound traffic to Azure resources (VMs, subnets).
- **Application Security Groups (ASGs):** Allows grouping VMs by application role (e.g., "Web Servers") and defining network security policies based on these groups, simplifying rule management.

## How It Works (Basic VNet Setup)
1. You create a **Virtual Network (VNet)** (`10.0.0.0/16`) in `East US`.
2. You create two **Subnets** within that VNet: `Frontend Subnet` (`10.0.1.0/24`) and `Backend Subnet` (`10.0.2.0/24`).
3. You create a **Network Security Group (NSG)** for your web servers, allowing inbound TCP port 80 and 443 from anywhere.
4. You launch an **Azure Virtual Machine (VM)** into the `Frontend Subnet` and attach the NSG.
5. You deploy a **Public IP Address** resource and associate it with the VM's Network Interface Card (NIC).
6. The VM now has a Private IP (`10.0.1.5`) and a Public IP. It can reach the Internet and be reached from the Internet.

## Components / Types
- **Azure DNS:** Managed DNS service for domain name resolution.
- **Azure Load Balancer:** Distributes incoming traffic across healthy VMs within a subnet.
- **Azure Application Gateway:** A web traffic load balancer that enables Layer 7 application delivery, acting as a WAF and SSL offloader.
- **Azure Virtual WAN:** A unified networking service that provides a single operational interface for hybrid cloud connectivity (VPN, ExpressRoute).
- **ExpressRoute:** A dedicated, private connection from your on-premises data center to Azure, bypassing the public Internet.
- **Azure Private Link:** Provides private connectivity from your VNet to Azure PaaS services (like Azure Storage or Azure SQL Database) over a private endpoint, avoiding public internet exposure.

## Practical Examples
- **Multi-Tier Application Deployment:** A web application uses an Application Gateway to distribute traffic to VMs in a Frontend Subnet. These web servers then securely connect to database VMs in a Backend Subnet. Network Security Groups are applied at both subnet and VM NIC level to enforce strict micro-segmentation.
- **Hybrid Cloud for Disaster Recovery:** A company uses Azure Site Recovery to replicate its on-premises virtual machines to Azure. An ExpressRoute circuit provides the high-bandwidth, low-latency private connection for continuous data synchronization, ensuring rapid failover in case of a disaster.

## Security Considerations
- **NSG Misconfigurations:** The primary cause of cloud breaches in Azure. Overly permissive inbound rules (e.g., `Allow Any Any`) on NSGs can expose sensitive VMs to the Internet.
- **Just-in-Time (JIT) VM Access:** For highly secure VMs, Azure Security Center can configure JIT access, which dynamically opens management ports (like SSH 22 or RDP 3389) only when an authorized administrator requests it, and for a limited time.
- **Azure Firewall:** A managed, stateful, network-as-a-service firewall that can span multiple VNets and subscriptions, providing centralized network segmentation and threat protection.

## Commands / Configuration Examples
Azure Networking is primarily managed via the Azure Portal (GUI), Azure CLI, Azure PowerShell, or Infrastructure-as-Code (Terraform, Azure Resource Manager - ARM templates).

### Azure CLI (Creating a VNet and Subnet)
```bash
# Create a new Azure Virtual Network
az network vnet create \
  --resource-group MyResourceGroup \
  --name MyVNet \
  --address-prefix 10.0.0.0/16 \
  --location eastus

# Add a subnet to the VNet
az network vnet subnet create \
  --resource-group MyResourceGroup \
  --vnet-name MyVNet \
  --name FrontendSubnet \
  --address-prefix 10.0.1.0/24
```

## Troubleshooting
- **VM Cannot Connect to Internet:** Check the NSGs applied to the VM NIC and the subnet. Ensure outbound rules allow access to the Internet (`0.0.0.0/0`). Verify the VNet's default route points traffic correctly (e.g., to an Internet Gateway).
- **Cannot SSH to VM:** Ensure the NSG attached to the VM's NIC (and potentially the VNet subnet) allows inbound TCP port 22 from your source IP.
- **PaaS Service Not Accessible:** If a VM cannot reach an Azure PaaS service (e.g., Azure SQL), check if Azure Private Link is configured. If not, ensure the service's public endpoint is reachable and not blocked by NSGs.

## Interview Questions
- What is an Azure Virtual Network (VNet)?
- Explain the role of Network Security Groups (NSGs) in Azure.
- How does Azure's "ExpressRoute" facilitate hybrid cloud connectivity?
- What are Application Security Groups (ASGs)?

## Summary
Azure Networking provides a comprehensive, software-defined ecosystem for building robust, scalable, and secure cloud infrastructures. By leveraging VNets, NSGs, and managed services, organizations can seamlessly extend their on-premises networks into the cloud, but they must remain vigilant about security best practices to prevent misconfigurations.

## References
- [Cloud Networking](cloud-networking.md)
- [Hybrid Cloud Connectivity](hybrid-cloud-connectivity.md)
- [Network Security Groups](../13-advanced-network-security/aws-security-groups.md) (Conceptual overlap with AWS Security Groups)
- [Virtual Networking](virtual-networking.md)
