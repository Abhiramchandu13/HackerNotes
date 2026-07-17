# IPsec (Internet Protocol Security)

> IPsec is a suite of protocols that secures IP network communications at Layer 3 by authenticating and encrypting each IP packet.

## Overview
When data traverses the public Internet, it passes through dozens of untrusted routers controlled by different ISPs and governments. Anyone controlling one of those routers can intercept and read unencrypted data. **Internet Protocol Security (IPsec)** solves this by creating a secure "tunnel" across the hostile Internet. 

IPsec operates at the **Network Layer (Layer 3)**, wrapping entire IP packets in a protective shell of encryption. It is the global standard for building site-to-site Virtual Private Networks (VPNs).

## Why It Matters
IPsec is the backbone of modern enterprise connectivity. When a company's New York office needs to connect to its London datacenter, they do not use a private, expensive physical cable across the ocean. They build an IPsec VPN tunnel over their existing public Internet circuits. Understanding the complex negotiation phases and protocols of IPsec is essential for any network security engineer.

## Core Concepts
IPsec uses two distinct phases and two main protocols to build its secure tunnel:
- **Phase 1 (IKEv1/IKEv2):** The "management" tunnel. The two firewalls at each end of the tunnel authenticate each other (using pre-shared keys or digital certificates) and negotiate the security parameters to build the actual data tunnel. This is the Internet Key Exchange (IKE) process.
- **Phase 2:** The "data" tunnel. Using the secure parameters agreed upon in Phase 1, the firewalls build the actual IPsec tunnel through which user data flows.
- **Authentication Header (AH):** Provides *integrity* and *authentication*. It mathematically guarantees the packet has not been tampered with and comes from a trusted source. It does **not** provide confidentiality (encryption).
- **Encapsulating Security Payload (ESP):** The modern workhorse. It provides confidentiality (encryption) *and* integrity.

## How It Works (Tunnel Mode)
1. A PC in New York (`10.1.1.5`) sends a packet to a server in London (`10.2.2.5`).
2. The packet hits the New York firewall. The firewall has a rule: "Traffic from 10.1.1.0/24 to 10.2.2.0/24 must be sent through the IPsec tunnel."
3. The firewall establishes the **IKE Phase 1** and **IKE Phase 2** connections with the London firewall.
4. The firewall takes the original IP packet, encrypts it completely using AES (the **ESP** protocol), and wraps it inside a *brand new* IP packet. The new packet has the Public IP of the New York firewall as the source and the Public IP of the London firewall as the destination.
5. This new, outer packet is sent across the public Internet. When it arrives at the London firewall, the firewall strips the outer header, decrypts the ESP payload, and forwards the original, clean packet to the internal server.

## Components / Types
- **Tunnel Mode:** The standard for site-to-site VPNs. The entire original IP packet is encapsulated.
- **Transport Mode:** Only the payload of the IP packet is encrypted; the original IP headers are left intact. Used for host-to-host security where routing information must be preserved.
- **IKEv1:** The legacy negotiation protocol. Complex and has known flaws.
- **IKEv2:** The modern, simpler, and more secure standard for negotiating IPsec tunnels.

## Practical Examples
- **Site-to-Site VPN:** The most common use case. Two corporate offices in different cities establish a permanent, always-on IPsec tunnel between their firewalls. To the internal routers, the remote office appears to be just another local route, even though the traffic is securely crossing the public Internet.
- **Remote Access VPNs:** While less common than SSL VPNs for user access today, some clients (like the Cisco AnyConnect client) can establish an IPsec-based tunnel from a user's laptop back to the corporate firewall.

## Security Considerations
- **Weak Pre-Shared Keys:** In IKE Phase 1, firewalls often authenticate each other using a simple password (a Pre-Shared Key, or PSK). If an attacker can guess this PSK (e.g., "Cisco123"), they can impersonate one of the firewalls, build a tunnel, and intercept all cross-site traffic.
- **NAT Traversal (NAT-T):** The ESP protocol has no port numbers, which historically made it incompatible with PAT firewalls. Modern IPsec solves this by encapsulating the entire ESP packet inside a UDP packet on port 4500, "tricking" the firewall into treating it like standard traffic.
- **Firewall Rule Complexity:** Because IPsec encrypts the original packet (including the TCP/UDP ports), traditional firewalls *cannot* inspect the traffic inside an IPsec tunnel. Any security rules must be applied before the traffic enters the tunnel or after it exits.

## Commands / Configuration Examples
### Cisco IOS
```text
! Phase 1 Configuration (IKE)
crypto isakmp policy 10
 encr aes
 hash sha
 authentication pre-share
 group 5
crypto isakmp key SecretPassword123 address 203.0.113.10

! Phase 2 Configuration (IPsec Transform Set)
crypto ipsec transform-set MY_TRANSFORM_SET esp-aes esp-sha-hmac

! Tie it all together in a Crypto Map
crypto map MY_MAP 10 ipsec-isakmp
 set peer 203.0.113.10
 set transform-set MY_TRANSFORM_SET
 match address 101  ! (ACL 101 defines what traffic to encrypt)

! Verify the tunnel status
show crypto isakmp sa
show crypto ipsec sa
```

## Troubleshooting
- **Phase 1 Fails to Come Up:** The most common issue. Verify both sides have the exact same Pre-Shared Key, encryption algorithms, hashing algorithms, and Diffie-Hellman group configured. A single mismatch will cause the IKE negotiation to fail.
- **Phase 2 Fails, Phase 1 is Up:** The management tunnel is up, but the data tunnel isn't. Usually caused by an ACL mismatch. Firewall A might be trying to build a tunnel for `10.1.1.0/24`, but Firewall B is configured to expect traffic from `10.1.2.0/24`.

## Interview Questions
- What layer of the OSI model does IPsec operate on? (Answer: Layer 3).
- Explain the difference between Tunnel Mode and Transport Mode.
- What are the two main protocols used in IPsec, and what does each one provide? (Answer: AH for integrity, ESP for encryption and integrity).
- What is the purpose of IKE (Internet Key Exchange)?

## Summary
IPsec is the enterprise workhorse for creating secure, permanent tunnels between trusted network locations over the untrusted Internet. By encapsulating and encrypting traffic at the IP layer, it provides a robust, standardized framework for building secure Wide Area Networks.

## References
- [VPNs](vpns.md)
- [SSL VPNs](ssl-vpn.md)
- [Network Layer](../02-osi-and-tcpip-models/network-layer.md)
