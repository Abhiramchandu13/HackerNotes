# LDAP (Lightweight Directory Access Protocol)

> LDAP is an open, industry-standard protocol used to query, manage, and authenticate against centralized directory services over a network.

## Overview
Imagine a company with 5,000 employees. Managing 5,000 separate usernames and passwords on 50 different servers, printers, and firewalls is impossible. A **Directory Service** solves this by centralizing all user accounts, passwords, and permissions into one master database. 

**Lightweight Directory Access Protocol (LDAP)** is the language applications use to talk to that database. Operating primarily over **TCP port 389**, LDAP allows a firewall, a VPN gateway, or a web application to quickly ask the directory: "Is this username and password correct?" or "Is Bob a member of the 'Admins' group?"

## Why It Matters
LDAP is the backbone of enterprise Identity and Access Management (IAM). Microsoft's **Active Directory (AD)**, the most dominant identity system in the world, relies heavily on LDAP under the hood. Understanding LDAP is crucial for integrating third-party software (like Jira, Cisco VPNs, or Wi-Fi authentication) into a corporate environment. For security professionals, LDAP is a massive target; querying it allows attackers to map the entire structure of a company.

## Core Concepts
LDAP organizes data hierarchically, like a tree. Entries are identified by a specific syntax:
- **DN (Distinguished Name):** The absolute, unique path to a specific object. (e.g., `CN=Bob Smith,OU=IT,DC=example,DC=com`).
- **DC (Domain Component):** Represents the top of the tree (the domain name, like `example` and `com`).
- **OU (Organizational Unit):** A folder used to group objects (like `IT` or `HR`).
- **CN (Common Name):** The specific object itself (like a user's name or a server's name).
- **Bind:** The LDAP term for "logging in" or authenticating to the directory.
- **Attributes:** The properties of an object (e.g., `mail`, `telephoneNumber`, `memberOf`).

## How It Works
1. A user attempts to log into a corporate VPN using the username `jsmith`.
2. The VPN gateway does not know jsmith's password. It acts as an LDAP Client.
3. The VPN opens a TCP connection to the corporate LDAP Server (Domain Controller).
4. The VPN initiates an **LDAP Bind** request, passing `jsmith` and the provided password.
5. The LDAP Server checks its database. If the password matches, it returns a "Bind Successful" message.
6. The VPN grants the user access.

## Components / Types
- **LDAP (Port 389):** The standard protocol. Unencrypted. 
- **LDAPS (LDAP over SSL/TLS - Port 636):** The secure version. Encrypts the entire query and response process to prevent password sniffing.
- **Global Catalog (Ports 3268 / 3269):** A specialized Active Directory feature that allows rapid searching across multiple domains within a large corporate forest using LDAP syntax.
- **Implementations:** Microsoft Active Directory, OpenLDAP, Red Hat Directory Server.

## Practical Examples
- **Wi-Fi Authentication:** When connecting to corporate WPA2-Enterprise Wi-Fi, the wireless controller takes your credentials and queries the backend LDAP server to verify you are a current employee before letting you on the network.
- **Address Books:** When you open Microsoft Outlook and type a coworker's name, Outlook uses LDAP (or MAPI) to query the global directory and instantly fetch their email address and phone number.

## Security Considerations
- **Cleartext Passwords (LDAP vs LDAPS):** Standard LDAP (port 389) transmits the initial Bind request (the user's password) in plain text. A pentester sniffing network traffic can capture domain credentials effortlessly. Security mandates disabling standard LDAP binds and enforcing LDAPS (port 636).
- **Anonymous Binds:** Historically, some directories allowed "Anonymous Binds," meaning anyone on the network could query the server and download a list of every user, email, and group without a password. This is an information disclosure vulnerability.
- **LDAP Injection:** Similar to SQL Injection, if a web application builds an LDAP query based on unsanitized user input, an attacker can manipulate the query string to bypass authentication or extract hidden data.

## Commands / Configuration Examples
### Linux (Querying an LDAP Server)
The `ldapsearch` tool is standard for testing directory connections and exploring AD environments.
```bash
# Perform a basic query against an LDAP server (requires an authorized 'bind' user)
ldapsearch -x -H ldap://10.0.0.5 -D "CN=admin,DC=example,DC=com" -w "password" -b "DC=example,DC=com" "(sAMAccountName=jsmith)"

# The query asks: Connect to 10.0.0.5, log in as admin, search the base domain example.com, and find the object where the username is jsmith.
```

## Troubleshooting
- **Cannot Bind:** If an application (like a firewall) fails to authenticate users via LDAP, check the "Bind DN" configured in the firewall. It must be the exact, complex path to a valid service account (e.g., `CN=ldap_service,OU=ServiceAccounts,DC=corp,DC=com`).
- **Timeout / Port Issues:** If LDAPS fails, ensure the server actually has a valid SSL certificate installed and that the firewall allows TCP 636.
- **Wrong Search Base:** If authentication works but the application can't find specific users, the "Search Base" (the folder where it starts looking) might be too narrow (e.g., pointing to the HR folder when the user is in the IT folder).

## Interview Questions
- What does LDAP stand for and what is its primary purpose?
- Explain the difference between LDAP and LDAPS, including their default port numbers.
- What do the abbreviations CN, OU, and DC stand for in an LDAP distinguished name?
- Why is it a security risk to allow standard LDAP binds over an untrusted network?

## Summary
LDAP is the universal translator for identity. By providing a structured, hierarchical method for querying centralized databases, it allows disparate systems across an enterprise—from firewalls to web apps to printers—to rely on a single source of truth for user authentication and authorization.

## References
- [TCP](tcp.md)
- [Active Directory Basics](../../ad-pentesting/01-foundations/active-directory-basics.md)
- [TLS](../09-network-security/tls.md)
- [LDAP Enumeration](../14-network-pentesting/ldap-enumeration.md)
