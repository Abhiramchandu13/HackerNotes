# WPA2 (Wi-Fi Protected Access 2)

> WPA2 is the robust, long-standing security standard that uses military-grade AES encryption to secure wireless networks globally.

## Overview
If WPA was the emergency band-aid, **WPA2** is the permanent cure. Released in 2004 (based on the finalized IEEE 802.11i standard), WPA2 completely abandoned the mathematically flawed RC4 ciphers of the past. It mandated the use of **Advanced Encryption Standard (AES)**, the same encryption algorithm trusted by the US Government for classified data. 

For nearly two decades, WPA2 has been the mandatory baseline for every Wi-Fi network in the world.

## Why It Matters
WPA2 is universally deployed. Every enterprise network, home router, and smartphone relies on it. For network engineers, understanding the difference between WPA2-Personal and WPA2-Enterprise is the foundation of network access control. For pentesters, cracking WPA2 networks (by capturing handshakes and cracking offline) remains one of the most common and effective ways to breach a corporate perimeter.

## Core Concepts
- **CCMP (Counter Mode Cipher Block Chaining Message Authentication Code Protocol):** This is the heavy-duty protocol WPA2 uses to wrap the data. It handles both the encryption (making it unreadable) and the integrity (proving it wasn't tampered with).
- **AES (Advanced Encryption Standard):** The actual mathematical cipher used inside CCMP. AES requires dedicated hardware processors to encrypt data fast enough for Wi-Fi speeds, which is why WPA2 required everyone to buy new routers in the 2000s.
- **The 4-Way Handshake:** The cryptographic process where the client and the Access Point exchange mathematically generated nonces to safely create a temporary session key, without ever transmitting the actual Wi-Fi password over the air.

## How It Works (WPA2-Personal / PSK)
1. You select the network and type the password (the Pre-Shared Key, or PSK).
2. The AP and your laptop initiate the **4-Way Handshake**.
3. They mathematically combine the Wi-Fi password, the SSID name, and random numbers (nonces) to generate a **PTK (Pairwise Transient Key)**.
4. From the PTK, they generate a temporary session key used only for this specific connection.
5. All subsequent traffic is encrypted using AES. Even if another user on the same Wi-Fi network captures your packets, they cannot decrypt them because their session key is entirely different from yours.

## Components / Types
- **WPA2-Personal (PSK):** Uses a single password shared by everyone.
- **WPA2-Enterprise (802.1X):** Ditches the shared password. Integrates with a RADIUS server. Users log in with their corporate Active Directory usernames and passwords (or digital certificates). This provides massive security benefits: if an employee leaves, you simply disable their AD account; you don't have to change the Wi-Fi password for the entire company.

## Practical Examples
- **Home Networking:** You unbox a modern router, set the security to WPA2/AES, and set a strong password. Your home is now secured by WPA2-Personal.
- **Corporate Branch:** A retail store provides employee tablets. To meet PCI-DSS compliance, they configure the Wi-Fi for WPA2-Enterprise. When a tablet connects, it silently presents a digital certificate to the central RADIUS server, gaining secure access without the user ever typing a password.

## Security Considerations
While AES encryption is virtually unbreakable, WPA2 has weaknesses in its implementation:
- **Offline Dictionary Attacks:** In WPA2-PSK, an attacker can passively capture the 4-Way Handshake using Wireshark. They take that capture home, load it into a tool like Hashcat, and guess millions of passwords a second against the captured handshake. If the Wi-Fi password is "Summer2024", it will be cracked in seconds. *Defense: Use passwords longer than 15 random characters.*
- **KRACK (Key Reinstallation Attacks):** A severe vulnerability discovered in 2017. Attackers manipulated the 3rd step of the 4-Way Handshake to force the client to reinstall an already-used encryption key, allowing the attacker to decrypt the traffic. It was patched via software updates across the industry.

## Commands / Configuration Examples
### Cisco WLC (Standard Corporate WLAN)
```text
! When creating a WLAN via CLI or GUI, enforcing AES is standard
config wlan security wpa enable 1
config wlan security wpa wpa2 enable 1
config wlan security wpa wpa2 ciphers aes enable 1
```

### Linux (Pentesting - Capturing a WPA2 Handshake)
```bash
# Listen on the specific channel of the target AP
sudo airodump-ng -c 6 --bssid 00:11:22:33:44:55 -w capture_file wlan0mon

# Force a client to disconnect, generating a new 4-way handshake upon reconnection
sudo aireplay-ng -0 2 -a 00:11:22:33:44:55 -c 99:88:77:66:55:44 wlan0mon
```

## Troubleshooting
- **AES vs TKIP Mismatch:** If a client fails to connect, verify the router is set to "WPA2-AES only". If it is set to "WPA2 Mixed Mode (TKIP/AES)", older client drivers often get confused and fail the negotiation.
- **Enterprise Authentication Fails:** In WPA2-Enterprise, if a user cannot connect, the issue is almost never the Access Point. The AP is simply passing the credentials to the RADIUS server. You must check the logs on the RADIUS server (like Cisco ISE or Windows NPS) to see why the authentication was rejected.

## Interview Questions
- What encryption cipher is mandated by WPA2? (Answer: AES).
- What is the difference between WPA2-Personal and WPA2-Enterprise?
- Explain how an attacker cracks a WPA2-PSK network. (Answer: By capturing the 4-Way Handshake and performing an offline dictionary attack).
- What does CCMP stand for and what is its role?

## Summary
WPA2 fundamentally stabilized wireless networking. By enforcing hardware-accelerated AES encryption and standardizing the 4-Way Handshake, it provided a framework secure enough for the world's most sensitive data, remaining the dominant standard nearly two decades after its creation.

## References
- [WPA3](wpa3.md)
- [WPA Handshakes](wpa-handshakes.md)
- [Enterprise Wi-Fi](enterprise-wifi.md)
- [Wireless Attacks](wireless-attacks.md)
