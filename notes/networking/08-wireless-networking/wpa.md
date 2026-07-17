# WPA (Wi-Fi Protected Access)

> WPA was a transitional security protocol introduced as an emergency fix to secure wireless networks after the original Wi-Fi security standard (WEP) was completely broken.

## Overview
When Wi-Fi was first invented, it used a security protocol called **WEP (Wired Equivalent Privacy)**. By the early 2000s, cryptographic flaws in WEP were discovered that allowed anyone with a laptop to crack a network password in less than a minute. The industry was in a crisis.

Developing a robust new standard (WPA2) would take years and require new hardware. As a stopgap, the Wi-Fi Alliance released **Wi-Fi Protected Access (WPA)** in 2003. It fixed the fatal flaws of WEP via software updates, allowing existing legacy hardware to remain secure until WPA2 was finalized.

## Why It Matters
Today, WPA is obsolete and highly insecure. You should never configure a network to use original WPA. However, understanding the history of WEP and WPA is a mandatory rite of passage in cybersecurity. The mechanisms introduced in WPA (like TKIP and dynamic keying) laid the mathematical foundation for all modern wireless security protocols.

## Core Concepts
- **RC4 Cipher:** To ensure old WEP hardware could run the new WPA update, WPA was forced to use the exact same underlying encryption cipher as WEP: RC4.
- **TKIP (Temporal Key Integrity Protocol):** This was WPA's magic fix. WEP failed because it reused the same encryption keys too often. TKIP wrapped around RC4 and mathematically generated a brand new, unique encryption key for *every single packet* transmitted.
- **MIC (Message Integrity Code):** WEP had a flaw where attackers could secretly alter packets in the air without invalidating them. WPA introduced "Michael" (a MIC) to cryptographically guarantee that a packet hadn't been tampered with.

## How It Works
1. A user connects to a WPA network using a Pre-Shared Key (a standard password).
2. Instead of using that password to encrypt data directly (which WEP did), WPA uses the password to generate a Master Key.
3. Using the 4-Way Handshake, the AP and the client negotiate a temporary set of session keys.
4. As data flows, TKIP mathematically mixes the session keys with the client's MAC address and a sequential packet counter to ensure every single packet gets a 100% unique encryption key.

## Components / Types
- **WPA-Personal (WPA-PSK):** Designed for homes. Everyone uses the same password to connect.
- **WPA-Enterprise (WPA-802.1X):** Designed for businesses. Replaces the shared password with a RADIUS server, requiring a unique username and password for every employee.

## Practical Examples
- **The 2003 Transition:** A business had just spent $50,000 on 802.11b Access Points using WEP. When WEP was cracked, they couldn't afford to buy all new hardware. They simply ran a firmware update on the APs, switching them from WEP to WPA (TKIP). The network was instantly secured without replacing a single piece of hardware.

## Security Considerations
WPA (TKIP) is officially deprecated and considered broken.
- **RC4 Vulnerabilities:** Because WPA was forced to rely on the RC4 cipher, it inherited mathematical weaknesses. 
- **Beck-Tews / ChopChop Attacks:** Cryptographers discovered methods to decrypt small portions of WPA/TKIP traffic and even inject malicious packets into the stream (though full password recovery was harder than WEP).
- **The WPA2 Requirement:** The Wi-Fi Alliance strictly forbids modern devices from using WPA/TKIP. If you configure a modern router to use WPA, newer Windows 11 or iOS devices may outright refuse to connect, displaying security warnings.

## Commands / Configuration Examples
You should never configure WPA on a modern network. If auditing a legacy system, look for the TKIP keyword.

### Cisco IOS (Identifying Legacy WPA Configurations)
```text
! A highly insecure, legacy configuration that should be flagged in an audit
dot11 ssid Guest_Legacy
 authentication open
 authentication key-management wpa
 ! The presence of TKIP indicates WPA1 is in use
 cipher tkip
```

## Troubleshooting
- **Connection Refused:** If an older IoT device (like an early 2010s barcode scanner) refuses to connect to a modern Wi-Fi 6 router, it is likely because the scanner only supports WPA/TKIP, and the router strictly enforces WPA2/AES. The hardware must be replaced.

## Interview Questions
- Why was WPA created as an interim standard before WPA2? (Answer: To provide a software-upgradeable security fix for legacy WEP hardware that lacked the processing power for AES).
- What encryption cipher and protocol combination defines original WPA? (Answer: RC4 and TKIP).
- Why is WPA considered insecure today?

## Summary
WPA was an emergency triage protocol that saved the wireless industry from the disaster of WEP. By introducing per-packet dynamic keying (TKIP), it established the modern framework for Wi-Fi authentication, paving the way for the robust security of WPA2.

## References
- [WPA2](wpa2.md)
- [WPA3](wpa3.md)
- [WPA Handshakes](wpa-handshakes.md)
- [Wireless Attacks](wireless-attacks.md)
