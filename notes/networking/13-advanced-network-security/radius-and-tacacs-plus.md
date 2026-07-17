# RADIUS and TACACS+

> RADIUS and TACACS+ are the two primary network protocols used to implement the AAA (Authentication, Authorization, and Accounting) framework, communicating between network devices and central identity servers.

## Overview
When you configure a router or a Wi-Fi Access Point to use centralized logins, it doesn't speak directly to Microsoft Active Directory. Active Directory speaks LDAP. The network device needs a middleman. 

**RADIUS (Remote Authentication Dial-In User Service)** and **TACACS+ (Terminal Access Controller Access-Control System Plus)** are the protocols that act as that middleman. The network device (the Client) sends the user's credentials to the central identity server using one of these two protocols. The server validates the credentials and replies with a definitive "Yes" or "No".

## Why It Matters
While both protocols achieve the same broad goal (centralized AAA), they are designed for entirely different use cases. Understanding when to use RADIUS versus when to use TACACS+ is a fundamental architectural decision. Using the wrong protocol will result in either massive security vulnerabilities or a complete inability to properly authorize network administrators.

## Core Concepts & Differences

### RADIUS
- **Standard:** Open industry standard (IETF RFCs). Supported by every vendor on Earth.
- **Primary Use Case:** **Network Access.** (e.g., Users authenticating to Wi-Fi, 802.1X switch ports, or VPNs).
- **Transport:** Operates over **UDP** (Ports 1812 for Auth, 1813 for Accounting).
- **Encryption:** Only encrypts the *password* in the packet payload. The username, MAC address, and other attributes are sent in plain text.
- **Architecture:** Combines Authentication and Authorization into a single process. If you are authenticated, you are authorized.

### TACACS+
- **Standard:** Originally Cisco proprietary, but now widely adopted by other enterprise networking vendors.
- **Primary Use Case:** **Device Administration.** (e.g., IT staff SSHing into routers, switches, and firewalls to manage them).
- **Transport:** Operates over **TCP** (Port 49).
- **Encryption:** Encrypts the *entire payload* of the packet, hiding the username and all configuration data.
- **Architecture:** Strictly separates Authentication, Authorization, and Accounting.

## How It Works
### The TACACS+ Authorization Advantage
The reason TACACS+ is used for device administration is its separation of AAA. 
If an administrator logs into a router via TACACS+:
1. **Authentication:** The router asks the TACACS+ server: "Is this password correct?" (Server: Yes).
2. **Authorization:** The admin types `configure terminal`. Before executing the command, the router pauses and asks the TACACS+ server: "Is this specific user allowed to run the `configure terminal` command?" (Server: Yes or No).
3. This allows extreme granularity. You can permit a junior admin to type `show ip route`, but block them from typing `configure terminal`. RADIUS cannot do this; it only provides a simple "Yes/No" at the initial login.

## Components / Types
- **Authenticator (Client):** The network device (Switch, AP, VPN Gateway) that receives the user's request and forwards it.
- **Authentication Server:** The central server running the software (e.g., Cisco ISE, Aruba ClearPass, Windows Network Policy Server (NPS), FreeRADIUS).
- **Shared Secret:** A complex password configured on both the Client and the Server. It is used to cryptographically hash the communications and prove trust between the two devices.

## Practical Examples
- **The Corporate Wi-Fi (RADIUS):** An employee brings their smartphone to the office and connects to the corporate SSID. The Access Point uses RADIUS to send the employee's credentials to the Windows NPS server. The NPS server verifies the credentials against Active Directory and sends a RADIUS Access-Accept message back, containing a specific RADIUS attribute that tells the AP to place the user on VLAN 20.
- **The Core Router (TACACS+):** A network engineer SSHs into the core router. The router uses TACACS+ to authenticate the engineer against Cisco ISE. Because the engineer is in the "Senior Admins" AD group, ISE sends a TACACS+ message back assigning the engineer "Privilege Level 15," granting them full administrative rights.

## Security Considerations
- **RADIUS Cleartext Vulnerability:** Because standard RADIUS only encrypts the password, an attacker sniffing the network can capture the RADIUS packets and easily read the usernames of all employees connecting to the Wi-Fi. 
- **RADIUS/TLS (RadSec):** A modern security enhancement that wraps the entire UDP RADIUS communication inside a secure TLS tunnel over TCP, fixing the cleartext vulnerability.
- **Shared Secret Protection:** If an attacker discovers the Shared Secret used between the AP and the RADIUS server, they can forge "Access-Accept" messages, bypassing all network authentication. Shared Secrets must be strong and rotated regularly.

## Commands / Configuration Examples
### Cisco IOS (Configuring RADIUS for 802.1X)
```text
! Define the RADIUS server
radius server ISE-NODE-1
 address ipv4 10.0.0.50 auth-port 1812 acct-port 1813
 key MySuperSecretKey123

! Tell the AAA framework to use this server for 802.1X network access
aaa authentication dot1x default group radius
```

### Cisco IOS (Configuring TACACS+ for Device Admin)
```text
! Define the TACACS+ server
tacacs server ISE-NODE-2
 address ipv4 10.0.0.51
 key MySuperSecretKey456

! Tell the AAA framework to use this server for SSH logins
aaa authentication login default group tacacs+ local
```

## Troubleshooting
- **Cannot Connect to Server:** If the network device cannot reach the AAA server, check firewalls. Remember RADIUS uses UDP (1812/1813) and TACACS+ uses TCP (49). 
- **"Invalid Authenticator" Errors:** If you see this error in the AAA server logs, the Shared Secret key configured on the network device does not perfectly match the key configured on the AAA server.
- **RADIUS Timeouts:** Because RADIUS uses UDP, it has no built-in reliability. If the network is congested and the UDP packet is dropped, the authentication attempt simply times out and fails. 

## Interview Questions
- Compare the transport protocols and ports used by RADIUS and TACACS+. (Answer: RADIUS uses UDP 1812/1813; TACACS+ uses TCP 49).
- Which protocol encrypts the entire payload, and which encrypts only the password?
- Why is TACACS+ preferred over RADIUS for managing router administrators? (Answer: Because TACACS+ separates authentication and authorization, allowing for per-command authorization and tracking).
- What is a RADIUS Shared Secret used for?

## Summary
RADIUS and TACACS+ translate the conceptual AAA framework into operational reality. By relying on the ubiquitous, lightweight RADIUS protocol for millions of end-user network connections, and utilizing the highly secure, granular TACACS+ protocol for critical infrastructure management, enterprises achieve scalable and precise identity enforcement.

## References
- [AAA Framework](aaa-framework.md)
- [Enterprise Wi-Fi](../08-wireless-networking/enterprise-wifi.md)
- [NAC and 802.1X](../09-network-security/nac-and-8021x.md)
- [UDP](../06-network-protocols/udp.md)
