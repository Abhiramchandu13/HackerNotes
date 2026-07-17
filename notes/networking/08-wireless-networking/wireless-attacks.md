# Wireless Attacks

> Wireless attacks exploit the uncontained nature of radio waves and the inherent trust mechanisms of Wi-Fi protocols to intercept data, steal credentials, or disrupt connectivity.

## Overview
Unlike a wired network where an attacker must physically bypass security guards to plug into a switch port, wireless networks bleed into the public space. An attacker can sit in a car in a corporate parking lot with a high-gain directional antenna and a laptop, launching devastating attacks against the internal network without ever setting foot inside the building.

Understanding wireless attacks is the cornerstone of Wi-Fi security. Defending a network requires knowing exactly how attackers capture handshakes, spoof infrastructure, and weaponize protocol features like deauthentication.

## Why It Matters
Wireless networks are the most exposed perimeter of any organization. Penetration testers are frequently hired specifically to conduct "Wireless Assesments." For network engineers, understanding these attacks dictates why certain configurations (like PMF, WPA3, and certificate validation) are mandatory, moving them from "best practice" to critical defenses.

## Core Concepts
- **Promiscuous / Monitor Mode:** Normally, a Wi-Fi card ignores traffic not meant for it. In Monitor Mode, the card captures *every* radio frame flying through the air, allowing passive eavesdropping and targeted packet injection.
- **Offline Cracking:** Attackers prefer to capture a small piece of cryptographic data (like a handshake) quickly, leave the area, and use massive computing power (GPUs) at home to guess the password without touching the target network again.
- **Layer 2 Vulnerabilities:** Most wireless attacks exploit Layer 2 802.11 management frames, which historically lacked encryption or authentication.

## Common Attack Types

### 1. Deauthentication (Deauth) Attack
- **Mechanism:** The attacker spoofs the MAC address of the Access Point (BSSID) and sends a "Deauthentication" management frame to a connected user's laptop.
- **Result:** The laptop believes the router just hung up on it. It drops the connection instantly.
- **Purpose:** Used to create a targeted Denial of Service (DoS), or more commonly, to force the laptop to immediately reconnect. When the laptop reconnects, it transmits the WPA2 4-Way Handshake, which the attacker captures.

### 2. Offline WPA2-PSK Cracking
- **Mechanism:** After capturing the 4-Way Handshake (often aided by a Deauth attack), the attacker uses a wordlist (dictionary) and a tool like Hashcat.
- **Result:** The tool runs millions of password guesses through the cryptographic algorithm, checking if the resulting hash matches the captured handshake. If a match is found, the Wi-Fi password is revealed.

### 3. Evil Twin Attack
- **Mechanism:** The attacker sets up a rogue Access Point broadcasting the exact same SSID as a legitimate network (e.g., "Airport_Free_Wifi"). They boost the transmit power to be stronger than the real AP.
- **Result:** Nearby laptops and phones automatically connect to the attacker's stronger signal.
- **Purpose:** The attacker is now executing a Man-in-the-Middle (MitM) attack. They can capture DNS requests, downgrade HTTPS to HTTP (SSL Stripping), or present a fake "Login Portal" to steal corporate credentials.

### 4. PMKID Attack
- **Mechanism:** A modern alternative to the 4-Way Handshake capture. Attackers request the PMKID (a specific hash used for roaming) directly from an AP without needing any clients to be connected or forced off the network.
- **Result:** The attacker captures the hash in a single packet and cracks it offline using Hashcat.

## Security Considerations & Defense
Defending against wireless attacks requires modernizing infrastructure:
- **Defeating Deauths:** Enable **802.11w (Protected Management Frames - PMF)**. This encrypts the deauth frames. If an attacker sends a spoofed deauth, the client rejects it because it lacks the cryptographic signature. (Mandatory in WPA3).
- **Defeating Offline Cracking:** Migrate from WPA2-PSK to **WPA3-SAE**. The SAE handshake mathematically prevents offline dictionary attacks.
- **Defeating Evil Twins (Enterprise):** In WPA2-Enterprise environments, strictly configure client laptops (via Group Policy/MDM) to validate the RADIUS server's Digital Certificate. If a laptop connects to an Evil Twin, the attacker won't possess the trusted corporate certificate, and the laptop will silently abort the connection before transmitting the user's password.
- **WIPS/WIDS:** Deploy Wireless Intrusion Prevention Systems. Corporate APs dedicate a radio solely to scanning the airwaves for Evil Twins, rogue APs, and Deauth floods, triggering automated alerts.

## Commands / Configuration Examples (Pentesting Tools)
The `aircrack-ng` suite is the industry standard for wireless assessment on Linux.

```bash
# 1. Put the Wi-Fi adapter into Monitor Mode
sudo airmon-ng start wlan0

# 2. Discover networks and BSSIDs (Passive Sniffing)
sudo airodump-ng wlan0mon

# 3. Capture traffic on a specific channel, targeting a specific AP
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture_file wlan0mon

# 4. Inject Deauth packets to force a handshake capture
sudo aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF -c 11:22:33:44:55:66 wlan0mon
```

## Troubleshooting
- **Mysterious Disconnects:** If a user in a specific corner of the building constantly loses Wi-Fi for 5 seconds every few minutes, check the WIPS logs. An attacker (or a misconfigured neighboring network) might be spamming deauthentication frames.
- **Weak Passwords:** If your WPA2-PSK password is a dictionary word (e.g., "CompanyName2023"), an attacker who captures the handshake can crack it in less than a second. Always use 15+ character random strings for PSKs, or upgrade to WPA2-Enterprise.

## Interview Questions
- How does a Deauthentication attack work, and what is its primary goal during a pentest?
- Why is an Evil Twin attack so effective against public Wi-Fi networks?
- How does Protected Management Frames (PMF) mitigate wireless denial of service?
- Explain why capturing a WPA2 4-Way Handshake allows an attacker to crack the password offline.

## Summary
Wireless networks expand the attack surface from the physical switch port into the open air. By exploiting cleartext management frames, unvalidated SSIDs, and offline cryptographic weaknesses, attackers can compromise networks entirely remotely. Defending the airspace requires migrating to WPA3, enforcing certificate validation, and deploying continuous wireless intrusion monitoring.

## References
- [WPA Handshakes](wpa-handshakes.md)
- [WPA3](wpa3.md)
- [Enterprise Wi-Fi](enterprise-wifi.md)
- [BSSID](bssid.md)
