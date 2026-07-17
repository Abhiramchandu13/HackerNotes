# Kubernetes Networking

> Kubernetes Networking is the set of rules and components that enable communication between containers, pods, services, and external networks within a Kubernetes cluster.

## Overview
Kubernetes is an open-source platform for automating the deployment, scaling, and management of containerized applications. While a virtual machine gets one IP address, a Kubernetes Pod can run multiple containers, and each Pod gets its own IP address. Containers inside a Pod share the same IP.

**Kubernetes Networking** defines how these hundreds or thousands of ephemeral Pod IPs communicate securely and efficiently, both internally within the cluster and externally to the Internet or other services.

## Why It Matters
For DevOps and Cloud Engineers, Kubernetes networking is the critical plumbing that makes microservices work. Understanding its core components is essential for designing scalable, resilient, and secure containerized applications. For security professionals, Kubernetes introduces a new layer of network segmentation and a new set of challenges for traffic inspection and threat detection.

## Core Concepts
Kubernetes networking adheres to four fundamental principles:
1. **Every Pod gets its own IP address:** This IP is routable within the cluster.
2. **Pods on a node can communicate with all Pods on all other nodes without NAT.**
3. **Agents on a node (e.g., system daemons) can communicate with all Pods on that node.**
4. **The IP a Pod sees of itself is the same IP that others see it as.** (No NAT inside Pods).

## How It Works
Kubernetes relies on a **CNI (Container Network Interface)** plugin to implement its networking model. The CNI provides the actual software-defined network (SDN) that connects the Pods.

1. **Pod Creation:** A user deploys an application (a Pod). Kubernetes assigns it a unique IP address (e.g., `10.244.1.5`).
2. **Virtual Ethernet Pairs (veth):** The CNI plugin creates a virtual Ethernet cable, one end connected to the Pod's network namespace, the other to the host machine's virtual network.
3. **Bridge / Overlay:** The Pod's veth is connected to a Linux Bridge or a VXLAN overlay network (managed by the CNI).
4. **Service Discovery:** Pods are ephemeral; their IPs change frequently. Kubernetes uses **Services** (stable internal IP addresses or DNS names) to provide a consistent front-end for a group of Pods.
5. **Ingress:** External traffic enters the cluster via an Ingress Controller, which acts as a reverse proxy, routing HTTP/HTTPS requests to the correct internal Services.

## Components / Types
- **CNI Plugins:** The actual network implementers (e.g., Calico, Flannel, Cilium, Weave Net). Each implements different features and networking models (e.g., Layer 2, Layer 3, Overlay).
- **Service:** An abstraction that defines a logical set of Pods and a policy by which to access them (a stable IP/DNS).
  - *ClusterIP:* Internal-only stable IP for internal load balancing.
  - *NodePort:* Exposes a Service on a static port on each Node's IP.
  - *LoadBalancer:* Integrates with cloud provider load balancers to expose Services externally.
  - *ExternalName:* Maps a Service to an arbitrary external DNS name.
- **Ingress:** Manages external access to Services, typically providing HTTP/HTTPS routing.
- **NetworkPolicy:** Kubernetes' native firewall. Allows you to specify how Pods are allowed to communicate with each other (micro-segmentation).

## Practical Examples
- **Microservices Communication:** A "Frontend" Pod needs to talk to a "Backend" Pod. Instead of hardcoding IPs, the Frontend connects to the "Backend Service" (e.g., `http://backend-service.default.svc.cluster.local`). Kubernetes handles the routing and load balancing of requests to the healthy Backend Pods.
- **Exposing a Web App:** A web application running in a Pod needs to be accessible from the Internet. An Ingress resource is configured to expose the application on `www.example.com`, routing traffic to the correct Service.

## Security Considerations
- **Flat Network by Default:** By default, all Pods can talk to all other Pods. This "flat network" model is a security risk. NetworkPolicy resources *must* be deployed to micro-segment Pods and enforce least privilege.
- **CNI Plugin Vulnerabilities:** The CNI plugin runs with high privileges on the Kubernetes worker nodes. A vulnerability in the CNI could lead to a compromise of the entire node.
- **Ingress Controller Security:** The Ingress Controller is often the perimeter of the cluster. It must be hardened, regularly patched, and integrate with a Web Application Firewall (WAF).
- **DNS Exfiltration:** Pods often rely heavily on DNS. Attackers can leverage DNS tunneling to exfiltrate data from compromised containers.

## Commands / Configuration Examples
### kubectl (Kubernetes CLI)
```bash
# View all services in the current namespace
kubectl get svc

# View all pods and their IPs
kubectl get pods -o wide

# Check the network policy rules in effect
kubectl get networkpolicy
```

### Linux (Host Level)
```bash
# View the virtual bridges and interfaces created by the CNI
ip link show

# View the routing table on a Kubernetes node (Pod IPs are routed)
ip route show
```

## Troubleshooting
- **Pod Not Getting IP:** The CNI plugin is misconfigured, or the DHCP server (if used by the CNI) is not reachable. Check CNI logs.
- **Pod Cannot Reach External Service:** Check NetworkPolicy rules first. Is there an egress rule allowing outbound traffic? Check Service DNS resolution. Check the host's firewall rules.
- **External Users Cannot Reach Service:** Check Ingress rules. Is the LoadBalancer Service provisioned correctly by the cloud provider?

## Interview Questions
- What are the four fundamental principles of Kubernetes Networking?
- What is a CNI plugin, and what is its role?
- How does Kubernetes provide a stable IP address for ephemeral Pods? (Answer: Through Services).
- What is a Kubernetes `NetworkPolicy` and why is it essential for security?

## Summary
Kubernetes Networking is a complex, software-defined ecosystem that enables seamless communication for containerized applications. By combining CNI plugins, Services, Ingress, and NetworkPolicies, it provides a highly agile, scalable, and secure platform for deploying modern microservices.

## References
- [Virtual Networking](virtual-networking.md)
- [SDN](sdn.md)
- [VXLAN](vxlan.md)
- [Micro-segmentation](../09-network-security/microsegmentation.md)
