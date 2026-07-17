# Group Policy for Networking

> Group Policy is a hierarchical infrastructure in Active Directory used by administrators to deploy, enforce, and manage network settings, security policies, and software configurations across thousands of Windows computers simultaneously.

## Overview
If a company has 5,000 Windows computers, manually configuring the firewall, Wi-Fi passwords, and proxy settings on each one is impossible. **Group Policy Objects (GPOs)** solve this. They are the centralized mechanism Windows administrators use to push configurations from a Domain Controller out to every machine in the enterprise.

For networking, Group Policy is the primary tool used to deploy 802.1X certificates, map network drives, enforce Windows Defender Firewall rules, and configure Internet Explorer/Edge proxy settings.

## Why It Matters
Group Policy ensures consistency and security at scale. It is the reason why every computer in an office automatically connects to the "Corp_WiFi" network without the user ever typing a password. For security professionals, misconfigured GPOs are a massive vulnerability; if an attacker can manipulate a GPO, they instantly control the firewall and security settings of every machine in the company.

## Core Concepts
- **GPO (Group Policy Object):** A collection of settings created in the Group Policy Management Console (GPMC).
- **Linking:** A GPO does nothing until it is "linked" to an Organizational Unit (OU), a Domain, or a Site. Once linked, the settings apply to all computers or users within that container.
- **Client Pull:** The Domain Controller does not "push" policies. The Windows client connects to the DC over SMB (TCP 445) upon boot or login and *pulls* the latest policies down.
- **Refresh Interval:** By default, Windows computers check for new or updated GPOs every 90 minutes (with a randomized offset of up to 30 minutes to prevent crashing the DC).

## How It Works (Deploying a Wi-Fi Profile)
1. The Network Admin creates a new GPO named "Deploy Corporate Wi-Fi".
2. They edit the GPO: `Computer Configuration -> Policies -> Windows Settings -> Security Settings -> Wireless Network (IEEE 802.11) Policies`.
3. They configure the SSID ("Corp_Secure"), set the authentication type to WPA2-Enterprise (PEAP), and specify which RADIUS server to trust.
4. They link the GPO to the "Laptops" OU.
5. A user's laptop boots up. It contacts the Domain Controller, downloads the GPO, and automatically creates the Wi-Fi profile in the OS.
6. The laptop seamlessly connects to the Wi-Fi.

## Components / Types
GPOs are divided into two main configurations:
- **Computer Configuration:** Settings that apply to the physical machine, regardless of who logs in (e.g., Windows Firewall rules, Wi-Fi profiles, Startup scripts). Applied during computer boot.
- **User Configuration:** Settings that apply to the human being, regardless of which machine they sit at (e.g., Mapped network drives, Proxy settings, Desktop wallpaper). Applied during user login.

## Practical Examples
- **Deploying Firewall Rules:** An admin creates a GPO to deploy Windows Defender Firewall rules to all workstations, blocking inbound RDP (Port 3389) from all IP addresses *except* the IT Helpdesk subnet, instantly securing 5,000 computers from lateral movement attacks.
- **Mapping Network Drives:** A GPO is linked to the "Accounting" OU. When Bob from Accounting logs in, the GPO executes a Group Policy Preference that maps the `Z:` drive to `\\Fileserver\FinanceData`.

## Security Considerations
- **SYSVOL Exposure:** GPOs are stored in a shared folder on the Domain Controller called `SYSVOL`. Every authenticated user on the network has read access to `SYSVOL`. Historically, admins would put passwords in GPO scripts (e.g., mapping a drive with credentials). Pentesters would search `SYSVOL`, extract the passwords (often using tools to crack Group Policy Preferences cpassword hashes), and compromise the domain.
- **GPO Abuse:** If an attacker compromises an account with "Write" access to a GPO, they can create a malicious Scheduled Task GPO that deploys ransomware to every computer in the domain simultaneously.

## Commands / Configuration Examples
### Windows Client (Troubleshooting and Forcing GPOs)
```powershell
# Force the computer to immediately check the Domain Controller for new GPOs
# (Bypassing the 90-minute wait)
gpupdate /force

# Generate a detailed HTML report showing exactly which GPOs are applied 
# to this specific computer and user, and which settings "won" any conflicts.
gpresult /h C:\temp\gpo_report.html

# View a quick summary of applied GPOs in the terminal
gpresult /R
```

## Troubleshooting
- **GPO Not Applying:** 
  1. Did you run `gpupdate /force`?
  2. Is the GPO linked to the correct OU? (If you linked a "Computer Configuration" GPO to an OU that only contains "Users", nothing will happen).
  3. Security Filtering: Does the computer or user have "Read" and "Apply Group Policy" permissions on the GPO?
- **DNS Issues:** Group Policy relies entirely on DNS to find the Domain Controller. If a PC has a static DNS setting pointing to `8.8.8.8` instead of the internal DC, `gpupdate` will fail completely.
- **Time Synchronization:** If the client's clock is more than 5 minutes out of sync with the Domain Controller, Kerberos authentication fails, and the client cannot download GPOs over SMB.

## Interview Questions
- What is the difference between Computer Configuration and User Configuration in a GPO?
- By default, how often do Windows clients refresh their Group Policy settings? (Answer: Every 90 minutes, plus a randomized offset).
- What command do you run on a client machine to force it to download the latest Group Policies immediately? (Answer: `gpupdate /force`).
- Explain why storing passwords inside Group Policy startup scripts or Preferences is a severe security vulnerability. (Answer: Because all users have read access to the SYSVOL share where GPOs are stored).

## Summary
Group Policy is the orchestration engine for Windows environments. By providing a centralized, hierarchical mechanism to deploy complex network configurations, firewall rules, and security baselines, it ensures massive fleets of computers remain standardized, secure, and compliant.

## References
- [Active Directory Networking](active-directory-networking.md)
- [Windows Firewall](windows-firewall.md)
- [Enterprise Wi-Fi](../08-wireless-networking/enterprise-wifi.md)
- [SMB](../06-network-protocols/smb.md)
