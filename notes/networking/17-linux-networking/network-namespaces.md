# Network Namespaces

> Network Namespaces are a fundamental Linux kernel feature that provides isolated network stacks, allowing multiple processes to have their own interfaces, IP addresses, routing tables, and firewall rules on a single host.

## Overview
Imagine running two separate web servers on a single Linux machine. You want one server to listen on port 80 for public internet traffic, and the other to listen on port 80 for internal network traffic, but neither should be able to see or interact with the other's network configuration. 

**Network Namespaces** make this possible. They are a lightweight virtualization technology that creates completely independent networking environments within the same Linux kernel. Each namespace has its own set of network devices, IP addresses, routing tables, and firewall rules.

## Why It Matters
Network Namespaces are the absolute foundation of container networking (Docker, Kubernetes). They provide the necessary isolation for each container or pod to have its own unique IP address and network configuration without conflicting with the host or other containers. For security professionals, understanding namespaces is critical for container security, micro-segmentation, and creating isolated testing environments.

## Core Concepts
- **Isolation:** Each network namespace is a completely self-contained network environment. Changes in one namespace do not affect others.
- **`lo` interface:** Every network namespace has its own loopback (`lo`) interface.
- **Virtual Ethernet Pairs (veth):** The primary mechanism for connecting different network namespaces (or a namespace to the host). A `veth` pair acts like a virtual Ethernet cable; anything sent out one end comes out the other.
- **Linux Bridge:** Used to connect multiple `veth` pairs to create a virtual switch that allows containers within the same namespace (or different namespaces) to communicate.

## How It Works
1. You create a new network namespace (e.g., `ns1`).
2. You create a `veth` pair (e.g., `veth0` and `veth1`).
3. You move `veth0` into `ns1`. You keep `veth1` in the host's default namespace.
4. You assign IP addresses to both `veth0` and `veth1`.
5. Now, anything sent to `veth0`'s IP address will appear on `veth1` in the host's default namespace, and vice-versa.
6. You can then connect `veth1` to a Linux Bridge on the host, which can be connected to the host's physical network interface.
7. The process is used to give a Docker container its own `eth0` interface and IP address, which communicates through a virtual bridge to the host's physical network.

## Components / Types
- **Default Namespace:** The initial network environment of the Linux system.
- **Custom Namespaces:** Created explicitly for isolation (e.g., for containers).
- **`ip netns` command:** The primary utility for managing network namespaces.
- **`veth` pairs:** The virtual cables.
- **Linux Bridges:** The virtual switches.

## Practical Examples
- **Docker Networking:** Every Docker container runs inside its own network namespace. Docker uses `veth` pairs to connect the container's namespace to the host's `docker0` bridge (a Linux bridge), allowing containers to communicate with each other and with the Internet via NAT.
- **Isolated Testing:** A security researcher wants to test a new piece of malware's network behavior. They create a dedicated network namespace, configure its routing to only allow traffic to a local logging server, and then execute the malware inside this isolated environment.

## Security Considerations
- **Container Isolation:** Network Namespaces provide strong Layer 3 isolation for containers. However, an attacker who compromises a container might exploit a kernel vulnerability to "escape" the namespace and gain access to the host's default network stack.
- **Privileged Containers:** If a Docker container is run with `--net=host`, it shares the host's default network namespace. This completely nullifies network isolation and grants the container full access to the host's network interfaces, including potentially sniffing all traffic. This should be avoided in production.
- **Traffic Interception:** Attackers who compromise the host machine can create their own network namespaces and `veth` pairs to intercept traffic flowing between legitimate containers.

## Commands / Configuration Examples
### Linux (Managing Network Namespaces)
```bash
# 1. Create a new network namespace named 'red'
sudo ip netns add red

# 2. List all active network namespaces
sudo ip netns list

# 3. Create a virtual Ethernet pair
sudo ip link add veth-red type veth peer name veth-host

# 4. Move one end of the pair into the 'red' namespace
sudo ip link set veth-red netns red

# 5. Bring up the interfaces and assign IP addresses
sudo ip netns exec red ip addr add 10.0.0.1/24 dev veth-red
sudo ip netns exec red ip link set veth-red up
sudo ip netns exec red ip link set lo up

sudo ip addr add 10.0.0.2/24 dev veth-host
sudo ip link set veth-host up

# 6. Run a command inside the 'red' namespace
sudo ip netns exec red ping -c 1 10.0.0.2
```

## Troubleshooting
- **No Internet in Container:** If a Docker container has an IP but cannot reach the Internet, check the host's default namespace for:
  1. The `docker0` bridge (or similar CNI bridge).
  2. The `veth` pairs connecting the container to the bridge.
  3. NAT rules (e.g., `iptables`) on the host forwarding container traffic to the outside world.
- **Interface Not Found:** If you create an interface and it doesn't appear in `ip a`, ensure it was correctly moved into or created within the namespace you are currently operating in.

## Interview Questions
- What is the primary purpose of Network Namespaces in Linux?
- How do Network Namespaces provide network isolation for Docker containers?
- Explain the role of a `veth` pair.
- What happens if you run a Docker container with `--net=host`? (Answer: The container shares the host's network namespace, nullifying network isolation).

## Summary
Network Namespaces are a powerful Linux kernel primitive that enable lightweight, software-defined network virtualization. By creating isolated network stacks, they provide the essential foundation for secure, scalable container networking and micro-segmentation on a single Linux host.

## References
- [Linux Networking](../../17-linux-networking/network-interfaces-linux.md)
- [Docker Networking (conceptual)](kubernetes-networking.md)
- [Microsegmentation](../09-network-security/microsegmentation.md)
- [ip Command](../10-monitoring-and-troubleshooting/ip-command.md)
