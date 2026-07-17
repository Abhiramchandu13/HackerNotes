# Virtual Private Networks (VPNs)

> A VPN extends a private network across a public network, enabling users to send and receive data as if their devices were directly connected to the private network.

## Overview
Imagine you are working from a coffee shop on their public Wi-Fi. If you try to connect to your company's internal file server (`10.0.0.50`), your request will fail because that is a private, non-routable IP address. 

A **Virtual Private Network (VPN)** solves this by creating a secure, encrypted "tunnel" through the public Internet directly into the corporate network. Once connected, your laptop is virtually "inside" the office; it receives a corporate IP address and can access internal servers, printers, and resources just as if you were sitting at your desk.

## Why It Matters
VPNs are the foundational technology for secure remote access and site-to-site connectivity. They are a universal tool for enforcing **Confidentiality** across untrusted networks. Every network and security engineer is expected to know how to configure, deploy, and troubleshoot VPNs. For users, VPNs provide a critical layer of privacy, protecting their web traffic from snooping by ISPs or public Wi-Fi operators.

## Core Concepts
- **Tunneling:** The core process. VPNs take your private network packets and encapsulate them inside a new, public packet for transport across the Internet.
- **Encryption:** The VPN wraps the entire inner packet in strong encryption, making it unreadable to anyone who intercepts it.
- **Authentication:** The VPN gateway must verify your identity (via password, MFA, or certificate) before it allows you to build a tunnel.
- **Virtual Network Interface:** When you connect a VPN, the software creates a new virtual NIC on your computer (e.g., `tun0`). This interface is assigned an internal corporate IP address, and the OS routes traffic through it.

## How It Works (Remote Access Example)
1. You launch the VPN client software on your laptop at home.
2. The client establishes a secure, encrypted tunnel to the VPN Concentrator (a firewall or server) at your corporate headquarters.
3. You authenticate with your company username, password, and an MFA token.
4. The VPN Concentrator assigns your laptop a virtual IP address from the corporate pool (e.g., `10.0.50.12`).
5. Now, when you try to access the file server at `10.0.0.50`, your OS routes the traffic through the virtual `tun0` interface.
6. The VPN software encrypts the packet, wraps it in a new IP header destined for the VPN Concentrator's public IP, and sends it over your home internet.
7. The Concentrator decrypts the packet and forwards the original, clean packet to the internal file server.

## Components / Types
There are two major categories of VPN technology, defined by the layer at which they operate:

1. **IPsec VPN:**
   - **Layer:** Operates at the Network Layer (Layer 3).
   - **Use Case:** Primarily used for building permanent, always-on **Site-to-Site** tunnels connecting one office to another.
   - **Pros:** Highly secure, standardized, hardware-accelerated on most network devices.
   - **Cons:** Can be complex to configure; does not easily traverse NAT without extensions (NAT-T).

2. **SSL/TLS VPN:**
   - **Layer:** Operates at the Application/Presentation Layer (Layer 6/7).
   - **Use Case:** Primarily used for **Remote Access** for end-users.
   - **Pros:** Extremely firewall-friendly (uses TCP Port 443), supports clientless browser-based access.
   - **Cons:** Can have higher performance overhead than IPsec.

## Practical Examples
- **Site-to-Site (IPsec):** A retail company connects all 50 of its stores back to its main data center using automated IPsec VPN tunnels, allowing the stores' point-of-sale systems to securely transmit sales data to the central database.
- **Remote Access (SSL VPN):** A snowstorm hits. The entire company works from home by connecting to the corporate SSL VPN using the Cisco AnyConnect client, giving them full, secure access to their network drives and internal applications.

## Security Considerations
- **Split Tunneling:** If a remote user is on a split-tunnel VPN, their laptop is connected to both the secure corporate network and the insecure home network simultaneously. If they get malware from a personal email, that malware can use the VPN as a bridge to attack internal corporate servers.
- **Endpoint Security:** A VPN securely connects the endpoint, but if the endpoint itself is compromised with a keylogger, the attacker can steal the user's VPN credentials. VPN security is only as strong as the security of the connecting device.

## Commands / Configuration Examples
### Linux (Using OpenVPN, a popular SSL VPN)
```bash
# Connect to a VPN using a specific configuration file
sudo openvpn --config my_corp.ovpn

# Check the new virtual interface 'tun0' created by the VPN
ip addr show tun0
```

## Troubleshooting
- **VPN Won't Connect:** Verify the user's credentials are correct. Check firewalls to ensure the required VPN ports are open (e.g., UDP 500/4500 for IPsec, TCP 443 for SSL VPN).
- **Connected but No Traffic:** The tunnel is up, but you can't ping internal servers. This is often a routing issue. Check the routing table on your local PC to ensure traffic for the corporate subnet is being correctly directed into the tunnel interface. It could also be a firewall rule on the corporate side blocking your new virtual IP address.

## Interview Questions
- What are the two primary types of VPN protocols, and what are their main use cases?
- Explain the security risk of enabling split-tunneling on a remote access VPN.
- How does a VPN allow you to access a private IP address across the public Internet?
- What does NAT-T solve for IPsec VPNs? (Answer: It allows IPsec's ESP packets to traverse firewalls that perform Port Address Translation by encapsulating them in UDP).

## Summary
A VPN is a foundational security technology that creates a private, encrypted data path over a public, untrusted network. By leveraging robust cryptographic protocols like IPsec and TLS, VPNs enable the secure remote work and inter-office connectivity that modern business depends on.

## References
- [IPsec](ipsec.md)
- [SSL VPN](ssl-vpn.md)
- [TLS](tls.md)
- [Encapsulation](../02-osi-and-tcpip-models/encapsulation-and-decapsulation.md)
