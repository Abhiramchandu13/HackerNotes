# NAC and 802.1X

> Network Access Control (NAC) is a security solution that enforces policy on devices as they connect to the network, and 802.1X is the IEEE standard for providing port-based authentication to achieve this.

## Overview
What happens when a new device plugs into your network? Without **Network Access Control (NAC)**, the switch port is wide open. The device can instantly access resources, regardless of whether it's a corporate laptop, an unauthorized employee's personal iPad, or an attacker's Raspberry Pi.

NAC acts as a digital bouncer at the switch port or Wi-Fi connection. It intercepts the device and forces it to prove its identity before the port is fully enabled. The **IEEE 802.1X** standard is the framework that dictates how this authentication conversation happens.

## Why It Matters
NAC is the ultimate defense against rogue devices and unauthorized physical access. While Port Security relies on easily-spoofed MAC addresses, 802.1X ties network access directly to a user's corporate identity (their Active Directory username/password or a digital certificate). This provides an incredibly granular and secure method for controlling exactly who and what is allowed on the network.

## Core Concepts
The 802.1X framework has three main components:
- **Supplicant:** The client device trying to connect (e.g., a Windows laptop).
- **Authenticator:** The network device acting as the bouncer (e.g., a Cisco switch or a Wireless LAN Controller).
- **Authentication Server:** The central brain that actually checks the credentials, almost always a **RADIUS** server (like Cisco ISE or Microsoft NPS).

## How It Works
1. A user plugs their laptop into an 802.1X-enabled switch port. The switch port is currently in an "unauthorized" state, blocking all traffic except authentication messages.
2. The switch (Authenticator) sends an **EAP-Request/Identity** packet to the laptop.
3. The laptop (Supplicant) replies with its username.
4. The switch encapsulates this username into a **RADIUS** packet and sends it to the central Authentication Server.
5. The RADIUS server now takes over, challenging the laptop to prove its identity (e.g., by creating a secure TLS tunnel and asking for a password or certificate).
6. The user's machine provides its credentials.
7. The RADIUS server verifies the credentials against Active Directory and sends a **RADIUS Access-Accept** message back to the switch.
8. The switch receives the "Accept" message and transitions the physical port into a fully "authorized," open state.

## Components / Types
- **RADIUS (Remote Authentication Dial-In User Service):** The de facto protocol used for centralized Authentication, Authorization, and Accounting (AAA). The RADIUS server is the brain of a NAC deployment.
- **Dynamic VLAN Assignment:** A powerful NAC feature. The RADIUS server can tell the switch, "This user is Bob from HR. Put his port into VLAN 20." When the CEO logs in, the RADIUS server says, "Put her port into the Executive VLAN 10."
- **Posture Assessment:** Advanced NAC systems can check if the connecting device complies with corporate policy. "Does this laptop have up-to-date antivirus? Is the corporate firewall enabled?" If it fails the check, it is placed into a "Remediation" VLAN with limited internet access to get patched.

## Practical Examples
- **Wired 802.1X:** A consultant brings their personal laptop into a corporate office and plugs into an empty wall jack. The switch detects an unauthorized device, receives no 802.1X credentials, and keeps the port completely shut down, preventing the consultant from accessing the internal network.
- **Wireless 802.1X (WPA2-Enterprise):** See the [Enterprise Wi-Fi](enterprise-wifi.md) note. The exact same Supplicant/Authenticator/Authentication Server logic applies, just over the airwaves instead of a physical port.

## Security Considerations
- **Supplicant Vulnerabilities:** If the software on the client machine that handles EAP requests is vulnerable, an attacker could potentially bypass authentication by sending malformed packets.
- **Fail-Open vs. Fail-Closed:** If the switch cannot reach the RADIUS server, what should it do? A "Fail-Open" policy will open the port and let anyone on (prioritizing access over security). A "Fail-Closed" policy will keep the port shut down (prioritizing security over availability). This is a critical architectural decision.
- **MAB (MAC Authentication Bypass):** Some "dumb" devices like printers or security cameras do not support 802.1X. For these, NAC systems can be configured to fall back to MAC Authentication Bypass. The switch simply sends the device's MAC address to the RADIUS server, which checks it against a whitelist. This is less secure as MACs can be spoofed.

## Commands / Configuration Examples
### Cisco IOS Switch
```text
! Enable 802.1X globally
dot1x system-auth-control

! Configure the switch to talk to the RADIUS server
radius server RADIUS_SERVER_1
 address ipv4 10.0.0.99
 key SecretRadiusKey123

! Apply the 802.1X configuration to a user-facing port
interface GigabitEthernet1/0/1
 switchport mode access
 authentication port-control auto
 dot1x pae authenticator
```

## Troubleshooting
- **Supplicant Not Responding:** On Windows, if the "Wired AutoConfig" service is disabled, the PC will not respond to EAP requests from the switch, and the port will remain down.
- **RADIUS Timeouts:** If the switch shows authentication attempts are timing out, there is a connectivity issue between the switch and the RADIUS server. Check firewalls to ensure UDP ports 1812 and 1813 are allowed.
- **Certificate Errors:** If using certificate-based authentication (EAP-TLS), ensure the client's certificate is valid and that the RADIUS server trusts the issuing Certificate Authority.

## Interview Questions
- What are the three components of the 802.1X framework? (Answer: Supplicant, Authenticator, Authentication Server).
- What protocol is typically used between the Authenticator and the Authentication Server? (Answer: RADIUS).
- Explain the concept of Dynamic VLAN Assignment.
- What is the difference between Port Security and 802.1X? (Answer: Port Security is Layer 2 MAC-based. 802.1X is Layer 3+ identity-based).

## Summary
Network Access Control (NAC) via 802.1X is the ultimate implementation of Zero Trust at the network edge. By treating every connection as untrusted and forcing it to prove its identity against a centralized authority before granting access, 802.1X provides the most granular, secure, and scalable method for controlling who and what gets onto the corporate network.

## References
- [Enterprise Wi-Fi](../08-wireless-networking/enterprise-wifi.md)
- [RADIUS and TACACS+](../13-advanced-network-security/radius-and-tacacs-plus.md)
- [Port Security](../03-ethernet-and-switching/port-security.md)
- [Zero Trust](zero-trust.md)
