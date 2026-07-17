# AAA Framework

> The AAA Framework (Authentication, Authorization, and Accounting) is the foundational security model used to control who is allowed on a network, what they are allowed to do, and tracking what they actually did.

## Overview
Securing a network requires more than just blocking bad traffic with a firewall; you must also manage the good traffic. The **AAA Framework** provides a standardized, scalable method for handling user access across an entire enterprise. 

Whether a user is logging into a Cisco router to configure it, connecting their phone to the corporate Wi-Fi, or dialing into a VPN, the AAA framework ensures their identity is verified, their permissions are checked, and their actions are logged to a central server.

## Why It Matters
Without AAA, an administrator would have to create local usernames and passwords on every single router, switch, and firewall in the company. If an employee leaves, IT would have to manually delete their account from 500 different devices. The AAA framework centralizes this process, tying network access directly to corporate identity systems (like Active Directory). For security operations, the "Accounting" portion of AAA provides the indisputable audit trail required for forensic investigations and compliance audits.

## Core Concepts
- **Authentication (Who are you?):** The process of verifying a user's identity. Usually achieved via a username and password, digital certificate, or multi-factor authentication (MFA).
- **Authorization (What can you do?):** Once verified, this determines the user's privileges. Can they execute configuration commands on the router? Can they access the Finance VLAN or only the Guest VLAN?
- **Accounting (What did you do?):** Recording the user's activity. When did they log in? How much data did they transfer? Exactly which configuration commands did they type?

## How It Works
1. **Authentication:** A network engineer connects to a core switch via SSH and enters their credentials. The switch does not check its local database. It encapsulates the credentials and sends them to a central AAA server (like Cisco ISE). The AAA server verifies the credentials against Active Directory and sends an "Access-Accept" message back to the switch.
2. **Authorization:** The AAA server also includes instructions in the "Accept" message: "This user is a Junior Admin. Grant them Privilege Level 5." The switch allows the engineer to log in, but restricts them from executing destructive commands like `reload`.
3. **Accounting:** The engineer types `show running-config`. The switch sends an Accounting message to the AAA server, logging the exact timestamp, the user's ID, and the command executed.

## Components / Types
The AAA framework is a concept implemented by specific protocols and servers:
- **RADIUS (Remote Authentication Dial-In User Service):** The most common AAA protocol, used heavily for network access (Wi-Fi, VPNs, 802.1X).
- **TACACS+ (Terminal Access Controller Access-Control System Plus):** A Cisco-proprietary AAA protocol used almost exclusively for device administration (logging into routers/switches).
- **Identity Services Engine (ISE) / Network Policy Server (NPS):** The central software servers that act as the "brain" of the AAA system, receiving the RADIUS/TACACS+ requests and making the policy decisions.

## Practical Examples
- **WPA2-Enterprise Wi-Fi:** When an employee connects to the corporate Wi-Fi, the Access Point acts as the AAA client. It uses the AAA framework to pass the employee's credentials to the central RADIUS server. If authenticated, the RADIUS server authorizes the connection and assigns the employee to the correct VLAN.

## Security Considerations
- **Fallback Mechanisms:** If the central AAA server goes offline (e.g., due to a severed network link), no one can log into the routers to fix the problem. AAA configurations must include a "fallback" method, allowing administrators to use a local, emergency account on the router if the AAA server is unreachable.
- **Protocol Encryption:** Standard RADIUS only encrypts the password field; the rest of the packet (including the username) is sent in cleartext. Pentesters can capture this traffic to enumerate valid usernames. TACACS+ encrypts the entire payload.
- **Insider Threat Detection:** The Accounting logs are critical for detecting insider threats. If a senior engineer accesses a database server at 3:00 AM and downloads 50GB of data, the AAA accounting logs provide the alerts and evidence required for the SOC to investigate.

## Commands / Configuration Examples
### Cisco IOS (Configuring AAA for Device Administration)
```text
! 1. Enable the AAA framework globally
aaa new-model

! 2. Define the central TACACS+ server
tacacs server ISE-SERVER
 address ipv4 10.0.0.50
 key SecretTacacsKey123

! 3. Create an Authentication list (Try TACACS first, fallback to local database if TACACS is dead)
aaa authentication login default group tacacs+ local

! 4. Create an Authorization list (Check commands against TACACS)
aaa authorization exec default group tacacs+ local

! 5. Create an Accounting list (Log all commands typed to TACACS)
aaa accounting commands 15 default start-stop group tacacs+
```

## Troubleshooting
- **Lockouts:** The most common AAA issue is locking yourself out of a device during initial configuration. If you configure `aaa authentication` to rely on a RADIUS server, but you have a typo in the RADIUS secret key, the router will reject your login, and you will be locked out. Always leave an active SSH session open while testing AAA changes.
- **Time Sync:** AAA servers (especially those issuing certificates) rely heavily on precise time. If the switch and the AAA server have clocks that are skewed by more than a few minutes (NTP failure), the AAA server will often reject the authentication requests as potential replay attacks.

## Interview Questions
- What do the three A's stand for in the AAA framework?
- Describe a scenario where Authorization is used after successful Authentication. (Answer: Assigning a user to a specific VLAN after they connect to Wi-Fi, or restricting the commands a junior admin can type on a router).
- Why is the Accounting aspect of AAA critical for cybersecurity?
- Name the two primary protocols used to implement the AAA framework. (Answer: RADIUS and TACACS+).

## Summary
The AAA framework transforms network security from a fragmented, unmanageable chore into a unified, scalable system. By strictly defining identity, privileges, and an unalterable audit trail, AAA provides the operational control necessary to secure everything from edge wireless access to the deepest core infrastructure.

## References
- [RADIUS and TACACS+](radius-and-tacacs-plus.md)
- [Enterprise Wi-Fi](../08-wireless-networking/enterprise-wifi.md)
- [NAC and 802.1X](../09-network-security/nac-and-8021x.md)
