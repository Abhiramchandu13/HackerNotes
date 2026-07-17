# WPA3 (Wi-Fi Protected Access 3)

> WPA3 is the newest wireless security standard, introducing mandatory management frame encryption and a revolutionary handshake that mathematically prevents offline password cracking.

## Overview
While WPA2 served the industry well for 15 years, it had a fatal flaw: if you captured the handshake, you could take it home and run billions of password guesses per second against it using a supercomputer until you cracked the Wi-Fi password. 

**WPA3**, introduced in 2018 alongside Wi-Fi 6, completely eliminates this vulnerability. It replaces the old 4-Way Handshake with a modern cryptographic exchange called **SAE (Simultaneous Authentication of Equals)**. With WPA3, no matter how weak your Wi-Fi password is, an attacker cannot crack it offline.

## Why It Matters
WPA3 represents a massive shift in perimeter security. For network architects, migrating to WPA3 requires careful hardware auditing, as many legacy devices do not support the complex mathematics required by SAE. For penetration testers, the advent of WPA3 means the era of easily cracking pre-shared keys (WPA2-PSK) is coming to an end, forcing a pivot to rogue access points and social engineering.

## Core Concepts
- **SAE (Simultaneous Authentication of Equals):** Also known as the "Dragonfly Key Exchange." It replaces the WPA2 PSK handshake. It utilizes Forward Secrecy, meaning if an attacker records your encrypted traffic today, and steals the Wi-Fi password tomorrow, they *still* cannot decrypt the recorded traffic.
- **Offline Dictionary Attack Immunity:** Because SAE requires live, back-and-forth interaction with the Access Point for every single password guess, an attacker can only guess passwords as fast as the AP can respond (perhaps 10 guesses a second), making brute-forcing mathematically impossible.
- **PMF (Protected Management Frames):** In WPA2, control frames (like Deauthentication) were sent in cleartext, allowing attackers to kick users off the network trivially. WPA3 *mandates* that these frames be encrypted (802.11w), completely killing standard deauth attacks.

## How It Works (The SAE Exchange)
1. **Commit Phase:** The client and the AP both use the Wi-Fi password to generate a complex cryptographic curve. They exchange public values based on this curve. Because of the math, they prove to each other that they both know the password, *without ever generating a hash that an attacker can capture and crack later*.
2. **Confirm Phase:** They verify the exchange and generate the unique session keys.
3. The connection is established. Even if an eavesdropper captures the entire exchange, the mathematical structure of SAE yields zero information about the password itself.

## Components / Types
- **WPA3-Personal:** Uses SAE to secure networks utilizing standard passwords.
- **WPA3-Enterprise:** Upgrades the underlying encryption strength for RADIUS-backed networks, supporting optional 192-bit cryptographic suites (CNSA) required for top-secret government networks.
- **OWE (Opportunistic Wireless Encryption):** A companion feature often bundled with WPA3 deployments. For "Open" networks (like a coffee shop without a password), OWE transparently establishes an encrypted tunnel between the user and the AP. You still don't need a password, but people in the cafe can no longer sniff your web traffic.

## Practical Examples
- **Coffee Shop Security (OWE):** You connect to an open airport Wi-Fi. In the past, the person sitting next to you could read your HTTP traffic in Wireshark. With an AP supporting Enhanced Open (OWE), your traffic is seamlessly encrypted over the air, protecting you from casual eavesdropping despite the lack of a network password.
- **Corporate Upgrades:** A financial firm upgrades to WPA3-Enterprise, ensuring that all wireless traffic meets NSA-level Suite B cryptographic requirements, rendering interception by advanced persistent threats (APTs) virtually impossible.

## Security Considerations
WPA3 is incredibly secure, but the *transition* to WPA3 is dangerous.
- **Transition Mode:** Because an office can't replace 500 legacy laptops overnight, admins deploy "WPA2/WPA3 Transition Mode." The AP broadcasts support for both. 
- **Downgrade Attacks:** In Transition Mode, an attacker can actively jam the WPA3 negotiations, forcing modern clients to fall back and connect using vulnerable WPA2, which the attacker can then capture and crack. For true security, the network must be set to "WPA3 Only".

## Commands / Configuration Examples
WPA3 requires modern hardware and modern OS support (Windows 10 1903+, iOS 13+).

### Cisco WLC (Enabling WPA3 Transition Mode)
```text
! On a modern Cisco 9800 series controller via CLI
wlan Guest-WiFi 1
 security wpa wpa2
 security wpa wpa3
 ! PMF must be set to 'optional' for transition mode to support legacy clients
 security pmf optional
```

## Troubleshooting
- **Devices Failing to Connect:** The most common issue when deploying WPA3. Old devices (like early 2010s smart TVs or old barcode scanners) do not understand the SAE handshake or the PMF requirement. If they see a WPA3-only network, they will outright ignore it. You must maintain a separate legacy WPA2 SSID for these devices.
- **PMF Disconnects:** If a client driver is buggy and fails to negotiate Protected Management Frames properly, it will drop off the network repeatedly. 

## Interview Questions
- What fundamental flaw in WPA2-Personal does WPA3 fix? (Answer: It prevents offline dictionary attacks by replacing the 4-way handshake with SAE).
- What does SAE stand for, and what protocol uses it?
- Explain PMF (Protected Management Frames) and what specific attack it prevents. (Answer: It encrypts control frames, preventing forced deauthentication attacks).
- What is Opportunistic Wireless Encryption (OWE)?

## Summary
WPA3 closes the final glaring loopholes in wireless security. By mathematically eliminating offline password cracking and mandating the encryption of control frames, it forces attackers away from passive sniffing and brute-forcing, drastically raising the barrier to entry for wireless compromise.

## References
- [WPA2](wpa2.md)
- [WPA Handshakes](wpa-handshakes.md)
- [Wireless Attacks](wireless-attacks.md)
- [Enterprise Wi-Fi](enterprise-wifi.md)
