# Active Directory Networking

> Active Directory (AD) is Microsoft's centralized directory service that relies on strict networking protocols (like DNS and LDAP) to manage identities and permissions across a corporate environment.

## Overview
Active Directory is the nervous system of an enterprise network. While physical switches and routers provide the paths for data to travel, AD provides the identity and authorization rules governing *who* can access that data. 

At its core, AD is not a single program, but a highly complex database distributed across multiple servers (Domain Controllers). For these servers to replicate data, authenticate users, and apply security policies, they rely on a fragile and exact sequence of networking protocols. If the networking is broken, Active Directory fails completely.

## Why It Matters
For network engineers, AD is often the reason you must configure specific firewall rules and DNS forwards. If a branch office router cannot pass Kerberos or LDAP traffic to headquarters, nobody in that branch can log into their computers. For cybersecurity professionals, AD is the ultimate target; compromising it means gaining "Keys to the Kingdom." Understanding how AD uses the network is essential for defending it.

## Core Concepts
- **Domain Controller (DC):** The Windows Server that hosts the Active Directory database. It acts as the central authority for the network.
- **DNS Dependency:** Active Directory absolutely cannot function without DNS. PCs use DNS SRV (Service) records to literally find out where the Domain Controllers are physically located on the network.
- **Replication:** If a company has three DCs, they must constantly synchronize their databases (e.g., when a user changes their password). This requires robust, unhindered network connectivity between the DCs.
- **Ports & Protocols:** AD uses a massive array of ports, including DNS (53), Kerberos (88), LDAP (389/636), SMB (445), and a wide range of dynamic RPC ports.

## How It Works
1. You turn on your corporate laptop. It connects to the network and gets an IP via DHCP. The DHCP server *must* assign the laptop the IP address of the Domain Controller as its DNS server.
2. The laptop sends a DNS query: "Where is the LDAP server for `corp.local`?"
3. The DC replies with its own IP address.
4. The user types their password. The laptop initiates a Kerberos ticket request (TCP/UDP 88) to the DC.
5. The DC verifies the password and issues a Ticket Granting Ticket (TGT).
6. The laptop downloads Group Policy Objects (GPOs) from the DC over SMB (TCP 445).
7. The user is logged in.

## Components / Types
- **LDAP (Lightweight Directory Access Protocol):** Used to query and read the AD database.
- **Kerberos:** The primary authentication protocol. It is highly sensitive to time; if the network clock (NTP) is off by more than 5 minutes, Kerberos tickets are rejected, and logins fail.
- **Global Catalog (GC):** A specialized AD role running on TCP 3268/3269, used to quickly search for objects across an entire massive corporate "Forest."

## Practical Examples
- **Branch Office Deployment:** A company opens a new office. Instead of having 50 employees authenticate over a slow WAN link back to headquarters (which would prevent logins if the internet dropped), the network engineer places a secondary Domain Controller physically in the branch office. The engineer configures the firewall to allow AD replication traffic between the branch DC and the HQ DC.

## Security Considerations
- **Cleartext LDAP:** By default, simple LDAP queries are sent in cleartext. Attackers on the network can sniff these queries to map the internal network. All AD environments should enforce LDAPS (LDAP over TLS on port 636).
- **SMB Signing:** AD relies heavily on SMB for file sharing and policy downloads. If SMB signing is not required, attackers can perform NTLM Relay attacks to intercept and abuse authentication sessions.
- **Pentesting:** Attackers use tools like BloodHound to perform massive LDAP queries against the Domain Controller, extracting the entire permission structure of the company to find the shortest path to Domain Admin.

## Commands / Configuration Examples
### Windows
```powershell
# Verify which Domain Controller the PC is currently communicating with
echo %LOGONSERVER%

# Force the PC to contact the DC and update its Group Policies over the network
gpupdate /force

# Test basic LDAP connectivity to a Domain Controller on port 389
Test-NetConnection -ComputerName dc01.corp.local -Port 389
```

### Linux
```bash
# Query an Active Directory server from a Linux machine using LDAP
ldapsearch -x -H ldap://10.0.0.5 -b "DC=corp,DC=local" "(sAMAccountName=jsmith)"
```

## Troubleshooting
- **"The trust relationship between this workstation and the primary domain failed."** The PC's secure channel password has fallen out of sync with the DC, often because the PC was offline for months, or network connectivity issues prevented password rotation.
- **Cannot Join Domain:** The #1 cause is DNS. If a PC's network card is configured to use Google DNS (`8.8.8.8`) instead of the internal Domain Controller, it will never find the SRV records required to locate the domain, and the join will fail immediately.
- **Time Sync Errors:** If Kerberos authentication is randomly failing, check the system clocks. Ensure the Domain Controller is syncing from a reliable external NTP source, and all clients are syncing from the Domain Controller.

## Interview Questions
- Why is DNS considered the most critical network service for Active Directory? (Answer: Because AD relies on DNS SRV records for clients and servers to locate Domain Controllers and services).
- Which port and protocol are primarily used by Kerberos for authentication? (Answer: TCP/UDP 88).
- Explain the role of NTP in an Active Directory environment.
- What tool would a penetration tester use to map the permissions and trust relationships within an Active Directory network? (Answer: BloodHound).

## Summary
Active Directory is not just a database; it is a complex, distributed network application. It relies entirely on flawless DNS resolution, precise time synchronization, and open communication across numerous specific TCP and UDP ports. Understanding this interaction is the key to successfully managing and securing Windows enterprise environments.

## References
- [DNS in Windows](dns-in-windows.md)
- [LDAP Enumeration](../15-network-pentesting/ldap-enumeration.md)
- [NTP](../06-network-protocols/ntp.md)
- [SMB](../06-network-protocols/smb.md)
