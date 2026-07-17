# SSL VPN (Secure Sockets Layer VPN)

> An SSL VPN uses the encryption and authentication protocols built into the web browser (TLS) to provide secure remote access to a corporate network, often without needing a dedicated VPN client.

## Overview
Traditional IPsec VPNs require specialized software to be installed on a user's computer and can be complex to configure. **SSL VPNs** were developed to simplify remote access. Instead of relying on Layer 3 IPsec, they operate at the Application and Presentation layers, leveraging the same **Transport Layer Security (TLS)** protocol (the successor to SSL) that secures HTTPS websites.

This allows users to connect to their corporate network through a simple web portal, making remote access much easier to deploy and manage for large workforces.

## Why It Matters
SSL VPNs are the dominant technology for user-based remote access today. Almost all major firewall vendors (Palo Alto, Fortinet, Cisco) have shifted their remote access solutions from IPsec to SSL VPN. Understanding the different modes of SSL VPN is critical for network engineers providing remote workforce connectivity and for pentesters attempting to bypass corporate perimeters.

## Core Concepts
- **TLS Foundation:** Relies entirely on the proven security of TLS, using digital certificates and strong encryption (AES) to create a secure tunnel.
- **Clientless vs. Client-based:** Can operate with or without installing a dedicated software client on the endpoint machine.
- **Port 443:** Because SSL VPNs use TLS, all their traffic is encapsulated inside standard HTTPS on TCP port 443. This makes them extremely firewall-friendly, as almost no company blocks outbound web traffic.

## How It Works
The operation depends on the mode:

### 1. Clientless (Web Portal)
1. A user at home opens their web browser and navigates to a special corporate URL (e.g., `https://vpn.mycompany.com`).
2. The user authenticates to the web portal using their Active Directory credentials and a Multi-Factor Authentication (MFA) token.
3. The portal displays a webpage with simple links to internal resources. When the user clicks on "Internal Web App," the SSL VPN gateway fetches the internal webpage on behalf of the user and relays it back to their browser inside the secure HTTPS session.

### 2. Full Tunnel (Client-based)
1. The user launches a lightweight VPN client (like Cisco AnyConnect or FortiClient).
2. The client establishes a TLS tunnel to the SSL VPN gateway on TCP 443.
3. Once authenticated, the client creates a virtual network interface on the user's computer and routes all of the computer's traffic through the encrypted tunnel into the corporate network. The user can now directly `ping` internal servers and access resources as if they were physically in the office.

## Components / Types
- **Clientless VPN (Portal):** Provides access only to web-based applications (HTTP/HTTPS) and sometimes RDP or SSH via browser plugins. It does not provide full network access. Best for contractors or low-privilege users.
- **Full Tunnel VPN:** The standard for corporate employees. It installs a virtual network adapter and routes all traffic through the corporate network. Provides a seamless "in-office" experience.
- **Split-Tunnel VPN:** An optimization. Corporate traffic (`10.0.0.0/8`) is sent through the secure tunnel. Non-corporate traffic (like Netflix or YouTube) is sent directly out the user's home internet connection to avoid wasting corporate bandwidth.

## Practical Examples
- **Remote Contractor Access:** A company hires a third-party developer. Instead of giving them a full corporate laptop, they provide an account on the clientless SSL VPN portal. The developer can securely access the one internal web-based development server they need, and nothing else.
- **Work From Home:** An employee on a company-managed laptop starts their AnyConnect client. A full tunnel is established. They can now use their local Outlook client to connect to the internal Exchange server and map network drives via SMB, just as if they were sitting at their desk.

## Security Considerations
- **Split-Tunneling Risks:** If a remote user is on a split-tunnel VPN, their laptop is connected to both the secure corporate network and the insecure home network simultaneously. If the user's laptop gets infected by malware from a personal email, that malware can use the VPN connection as a bridge to pivot directly into the corporate network. Many high-security environments forbid split-tunneling.
- **Endpoint Posture Checking:** Modern SSL VPNs will not allow a client to connect unless it passes a security health check. The VPN client checks: "Is Windows Defender running? Are the latest patches installed? Is the local firewall enabled?" If it fails, access is denied.

## Commands / Configuration Examples
SSL VPN configuration is highly vendor-specific and managed via GUI.

### Cisco ASA (Conceptual Configuration)
```text
! Enable the webvpn (SSL VPN) feature on the outside interface
webvpn
 enable outside

! Create a tunnel group and link it to an authentication server (RADIUS)
tunnel-group MySSLVPN type remote-access
tunnel-group MySSLVPN general-attributes
 authentication-server-group RADIUS_SERVER
```

## Troubleshooting
- **DTLS vs TLS:** Full-tunnel VPNs often try to use **DTLS** (Datagram TLS over UDP) for the data channel because it is faster for VoIP and real-time apps. If a firewall along the path blocks the high-numbered UDP traffic, the client will fall back to **TLS over TCP 443**, which is more reliable but slower.
- **Portal App Compatibility:** Not every web application works correctly through a clientless portal. The portal's URL rewriting engine can sometimes break complex JavaScript or API calls within the application.
- **Split-Tunnel DNS Issues:** If a user is on a split-tunnel VPN, how does the OS know whether to use the corporate DNS server or the public DNS server? This must be carefully configured by the VPN client to avoid DNS "leaks" or resolution failures.

## Interview Questions
- What is the main advantage of an SSL VPN over a traditional IPsec VPN? (Answer: It uses standard TCP Port 443, making it firewall-friendly, and it supports clientless browser-based access).
- Explain the difference between a Full-Tunnel and a Split-Tunnel VPN.
- What are the security risks associated with enabling Split-Tunneling?
- What does SSL "Offloading" or "Termination" mean on a Reverse Proxy?

## Summary
SSL VPNs have become the dominant standard for secure remote user access. By leveraging the ubiquity and firewall-friendliness of the TLS protocol, they provide flexible, easy-to-deploy access ranging from simple web portals for contractors to full, immersive network tunnels for corporate employees.

## References
- [VPNs](vpns.md)
- [IPsec](ipsec.md)
- [TLS](tls.md)
- [Next-Gen Firewalls](../07-network-devices/next-gen-firewalls.md)
