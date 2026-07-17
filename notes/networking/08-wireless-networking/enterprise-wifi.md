# Enterprise Wi-Fi

> Enterprise Wi-Fi replaces shared network passwords with centralized identity systems, requiring every user to authenticate with their own unique credentials or digital certificates before joining the network.

## Overview
In a home environment, everyone uses the same Wi-Fi password (WPA2-Personal). If you fire an employee in a 500-person company, and the company uses a shared password, you must change the password on 500 laptops and phones immediately to secure the network. This is administratively impossible.

**Enterprise Wi-Fi (WPA2/WPA3-Enterprise)** solves this by utilizing the **802.1X** standard. Instead of authenticating the connection with a pre-shared key, the Access Point forces the client to talk to a backend RADIUS server (like Cisco ISE or Microsoft NPS). Users log in using their personal corporate username and password. When the employee is fired, IT disables their Active Directory account, instantly revoking their Wi-Fi access without affecting anyone else.

## Why It Matters
WPA2-Enterprise is the mandatory baseline for corporate wireless security. Understanding how the Access Point delegates authentication to a backend server is essential for network engineers integrating wireless infrastructure with Active Directory. For security professionals, Enterprise Wi-Fi introduces the concept of EAP (Extensible Authentication Protocol) and the complex certificate validations required to prevent devastating credential-theft attacks.

## Core Concepts
- **802.1X:** The IEEE standard for Port-Based Network Access Control. It applies to both wired switch ports and wireless SSIDs.
- **Supplicant:** The client device (laptop, phone) asking for access.
- **Authenticator:** The Access Point. It acts as a bouncer. It doesn't know any passwords; it just passes messages between the Supplicant and the Authentication Server.
- **Authentication Server (RADIUS):** The backend server that actually checks the username and password against a database (like Active Directory) and returns an "Accept" or "Reject" message.
- **EAP (Extensible Authentication Protocol):** The framework used to carry the authentication messages securely.

## How It Works
1. A laptop tries to connect to "Corp_WiFi".
2. The AP (Authenticator) blocks all network traffic except EAP authentication messages.
3. The AP asks the laptop: "Who are you?"
4. The laptop replies with an EAP response: "I am jsmith."
5. The AP encapsulates this message into a RADIUS packet and sends it to the backend RADIUS server over the wired network.
6. The RADIUS server challenges the laptop (often building a secure TLS tunnel first), verifying the password or digital certificate.
7. The RADIUS server verifies the credentials against Active Directory.
8. The RADIUS server sends a "RADIUS Access-Accept" message back to the AP. It includes a unique Master Key for that specific user.
9. The AP uses that key to perform the standard 4-Way Handshake, opening the port and granting the laptop full internet access.

## Components / Types
Because EAP is "Extensible," there are many different flavors used in Enterprise Wi-Fi:
- **PEAP-MSCHAPv2:** The most common standard. The server presents a digital certificate to prove its identity, creating a secure TLS tunnel. The user then sends their standard Active Directory username and password securely inside that tunnel.
- **EAP-TLS:** The most secure standard. Both the server *and* the client must present digital certificates. No passwords are typed. If the device does not possess a hidden corporate certificate installed by IT, it cannot connect. Unbeatable by phishing.
- **EAP-TTLS:** Similar to PEAP but more flexible in how it handles the internal credential exchange.

## Practical Examples
- **Dynamic VLAN Assignment:** A powerful feature of Enterprise Wi-Fi. When the RADIUS server sends the "Accept" message to the AP, it can include extra instructions: "This user is in the HR group. Put them on VLAN 20." When the CEO logs into the exact same SSID, the RADIUS server tells the AP: "Put him on VLAN 10." One SSID dynamically isolates users into correct subnets based on their identity.

## Security Considerations
Enterprise Wi-Fi is highly secure, but misconfigurations are lethal.
- **Evil Twin / EAP Downgrade:** If an IT department configures laptops to *not* strictly validate the RADIUS server's digital certificate, an attacker can set up an "Evil Twin" AP broadcasting "Corp_WiFi". The laptop connects. The attacker presents a fake certificate. Because the laptop doesn't check it, the user's laptop happily sends the employee's username and hashed password (MSCHAPv2) directly to the attacker, who cracks it offline.
- **Defense:** Endpoint deployment tools (MDM/Group Policy) must strictly configure laptops to "Validate Server Certificate" and specify the exact name of the corporate RADIUS server.

## Commands / Configuration Examples
Configuring Enterprise Wi-Fi requires pointing the Wireless Controller to the RADIUS server.

### Cisco WLC
```text
! Define the backend RADIUS server
radius server ISE-Server
 address ipv4 10.0.0.50 auth-port 1812 acct-port 1813
 key SecretRadiusKey123

! Apply WPA2-Enterprise (802.1X) to a WLAN
config wlan security wpa akm 802.1x enable 1
config wlan radius_server auth add 1 ISE-Server
```

### Windows (Client Settings via PowerShell)
Corporate environments push XML profiles to configure the supplicant securely.
```powershell
# View the detailed configuration of a wireless profile to ensure 
# server certificate validation is enforced
netsh wlan show profile name="Corp_WiFi"
```

## Troubleshooting
- **Cannot Connect (NPS/RADIUS Logs):** When Enterprise Wi-Fi fails, the AP is rarely the problem. You must log into the RADIUS server (like Windows Network Policy Server) and read the Event Viewer. The logs will tell you exactly why it failed: "Bad Password," "Account Disabled," or "Certificate Expired."
- **Clock Sync Issues:** Because EAP-TLS and PEAP rely entirely on digital certificates, if the laptop's clock is wildly out of sync, it will believe the RADIUS server's certificate is invalid/expired and silently drop the connection.
- **RADIUS Timeout:** If the AP cannot reach the RADIUS server (e.g., the firewall is blocking UDP port 1812), the AP will give up and clients will simply sit spinning at "Connecting..."

## Interview Questions
- What are the three main components of the 802.1X framework? (Answer: Supplicant, Authenticator, Authentication Server).
- Why is EAP-TLS considered significantly more secure than PEAP? (Answer: EAP-TLS relies on mutual certificate authentication, rendering stolen passwords useless and making Evil Twin attacks practically impossible).
- Explain Dynamic VLAN Assignment in a wireless context.
- In Enterprise Wi-Fi, what device actually verifies the user's password? (Answer: The Authentication Server / RADIUS server, not the Access Point).

## Summary
Enterprise Wi-Fi shifts wireless security from a perimeter-based shared secret to a centralized, identity-driven access model. By leveraging 802.1X and RADIUS, organizations achieve granular access control, dynamic network segmentation, and individualized encryption, establishing the foundation of secure corporate mobility.

## References
- [WPA2](wpa2.md)
- [NAC and 802.1X](../09-network-security/nac-and-8021x.md)
- [Wireless Attacks](wireless-attacks.md)
- [Active Directory Basics](../../ad-pentesting/01-foundations/active-directory-basics.md)
