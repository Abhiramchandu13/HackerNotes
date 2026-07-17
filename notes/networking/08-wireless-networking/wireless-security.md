# Wireless Security

> Wireless Security encompasses the encryption protocols, authentication frameworks, and architectural designs used to protect Wi-Fi networks from unauthorized access and interception.

## Overview
Because radio waves travel through walls and into public spaces, physical security (locked doors) cannot protect a wireless network. **Wireless Security** relies entirely on cryptography and authentication to create a logical boundary. It ensures that only authorized personnel can join the network, and that even if someone intercepts the radio waves, the data remains mathematically unreadable.

This topic serves as the synthesis of all wireless defense mechanisms, tying together encryption standards, enterprise architecture, and operational monitoring.

## Why It Matters
A compromised wireless network is a direct bridge into the corporate LAN. If an attacker cracks a Wi-Fi password, they bypass perimeter firewalls completely. For network administrators, selecting the correct security posture balances user convenience with robust defense. For security analysts, reviewing wireless controller logs and configuring WIPS (Wireless Intrusion Prevention Systems) is a daily operational requirement.

## Core Concepts
Wireless security is divided into two primary pillars:
1. **Authentication (Who can connect?):** Validating the identity of the device or user before granting network access.
2. **Encryption (Is the data safe?):** Scrambling the data in transit to ensure confidentiality and integrity over the airwaves.

## How It Works (The Security Evolution)
The industry has progressed through several eras of security:
- **WEP (Wired Equivalent Privacy):** 1999. Used RC4 encryption. Deeply flawed mathematically. Crackable in minutes. Completely obsolete.
- **WPA (Wi-Fi Protected Access):** 2003. An emergency patch. Used RC4 but added TKIP (Temporal Key Integrity Protocol) to dynamically change keys. Deprecated and highly vulnerable.
- **WPA2:** 2004. The long-standing standard. Introduced AES-CCMP encryption. Highly secure data transit, but vulnerable to offline dictionary attacks if weak passwords are used.
- **WPA3:** 2018. The modern standard. Replaced the 4-way handshake with SAE to eliminate offline password cracking and mandated the encryption of control frames (PMF).

## Components / Types
### Authentication Frameworks
- **Personal (PSK - Pre-Shared Key):** A single password shared by everyone. Suitable only for homes or highly isolated guest networks.
- **Enterprise (802.1X / EAP):** The corporate standard. Integrates the Access Point with a RADIUS server (like Cisco ISE). Users authenticate with individual Active Directory credentials or digital certificates.
- **Captive Portal:** An open network that intercepts the user's first HTTP request and redirects them to a web page asking for agreement to terms or payment (e.g., Hotel Wi-Fi). Provides zero encryption over the air.

### Defense Mechanisms
- **MAC Filtering:** An administrative hassle where only whitelisted MAC addresses can join. *Not a security boundary*, as MAC addresses are transmitted in cleartext and easily spoofed by attackers.
- **PMF (Protected Management Frames - 802.11w):** Encrypts disconnect/deauth frames, preventing attackers from launching localized DoS attacks or forcing handshakes.
- **WIPS (Wireless Intrusion Prevention System):** Infrastructure that actively monitors the airwaves for Rogue APs, Evil Twins, and deauth floods, and can automatically retaliate (e.g., deauthing clients connected to a rogue AP).

## Practical Examples
- **Corporate Deployment:** A company deploys WPA3-Enterprise. Employees are issued laptops by IT. The laptops have a hidden digital certificate installed. When the laptop enters the building, it uses EAP-TLS to present the certificate to the RADIUS server. The laptop connects securely and automatically without the user ever typing a password, rendering phishing attacks useless.

## Security Considerations
- **Transition Modes:** Setting a network to "WPA2/WPA3 Mixed Mode" allows older devices to connect but opens the network to "Downgrade Attacks," where an attacker jams the WPA3 signals and forces a modern client to connect via vulnerable WPA2.
- **Guest Isolation:** Guest Wi-Fi must be strictly isolated. Access Points should be configured for "Client Isolation" (preventing two laptops on the guest network from pinging each other) and mapped to a dedicated VLAN that routes straight to the Internet, completely bypassing the corporate firewall's internal interfaces.
- **Rogue APs:** The greatest threat. A misconfigured router plugged into an office ethernet jack bypasses all enterprise wireless security. Continuous physical and WIPS auditing is required to find them.

## Commands / Configuration Examples
### Cisco WLC (Enabling Strict Security)
```text
! Configure a highly secure Enterprise WLAN
config wlan create 1 CorpNet CorpNet
config wlan security wpa akm 802.1x enable 1
config wlan security wpa wpa3 enable 1
! Mandate Protected Management Frames
config wlan security pmf require 1
! Point to the RADIUS server
config wlan radius_server auth add 1 10.0.0.50
```

## Troubleshooting
- **Certificate Warnings:** In WPA2-Enterprise (PEAP), if users are constantly prompted to "Accept this Certificate" when connecting, the MDM/Group Policy is failing to push the trusted Root CA to their devices. This conditions users to click "Accept" on everything, making them vulnerable to Evil Twin attacks.
- **Legacy Device Failures:** If older devices cannot see the network, ensure PMF is set to "Optional" rather than "Required", or deploy a separate, hidden legacy SSID.

## Interview Questions
- Why is MAC Filtering considered an ineffective security control? (Answer: Because MAC addresses are sent in cleartext and are trivial for an attacker to spoof).
- Contrast WPA2-Personal with WPA2-Enterprise.
- What specific attack vector does WPA3's SAE handshake neutralize? (Answer: Offline dictionary/brute-force attacks against captured handshakes).
- Why is Client Isolation important on a Guest Wi-Fi network?

## Summary
Wireless security requires a layered defense. Because the physical medium cannot be secured, engineers must rely on unbreakable encryption (AES), robust, individualized authentication (802.1X), and continuous airwave monitoring (WIPS) to ensure the wireless perimeter remains as secure as the wired backbone.

## References
- [WPA2](wpa2.md)
- [WPA3](wpa3.md)
- [Enterprise Wi-Fi](enterprise-wifi.md)
- [Wireless Attacks](wireless-attacks.md)
