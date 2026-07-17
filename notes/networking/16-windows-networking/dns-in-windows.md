# DNS in Windows

> Windows DNS is a robust, enterprise-grade Domain Name System implementation deeply integrated with Active Directory, essential for locating domain controllers, resolving internal hostnames, and routing Internet traffic.

## Overview
While the Internet relies heavily on Linux-based DNS servers (like BIND or Unbound), corporate internal networks are dominated by **Windows DNS**. Installed almost exclusively on Domain Controllers, Windows DNS is the primary directory service that allows client PCs to find Active Directory services.

If a Windows PC cannot reach a functional Windows DNS server, it cannot join the domain, log in a new user, apply Group Policy, or find internal file shares.

## Why It Matters
DNS is the most common cause of Active Directory failures. "It's always DNS" is a famous IT joke because it is universally true. For system administrators, mastering Windows DNS zones, forwarding, and dynamic updates is non-negotiable. For penetration testers, misconfigured Windows DNS servers (allowing zone transfers or dynamic updates from untrusted clients) are prime targets for network reconnaissance and spoofing attacks.

## Core Concepts
- **Active Directory Integrated Zones:** The gold standard in Windows. Instead of storing DNS records in a simple text file on one server, the DNS records are stored directly *inside* the Active Directory database. This means the DNS records automatically, securely replicate to every other Domain Controller in the company.
- **Dynamic Updates:** Computers joined to the domain automatically update their own DNS records (e.g., when they get a new IP from DHCP).
- **Forward Lookup Zone:** Translates a name to an IP address (e.g., `server01.corp.local` -> `10.1.1.50`).
- **Reverse Lookup Zone:** Translates an IP address to a name (e.g., `10.1.1.50` -> `server01.corp.local`).
- **SRV (Service) Records:** Extremely critical for AD. These records tell a client *exactly* which server is acting as the Domain Controller or Global Catalog.

## How It Works (The Login Process)
1. A user sits at a laptop and types their username and password.
2. The laptop needs to authenticate, but it doesn't know the IP of the Domain Controller.
3. The laptop asks the Windows DNS server: "Do you have any `_ldap._tcp.dc._msdcs.corp.local` SRV records?"
4. The DNS server replies: "Yes, `dc01.corp.local` handles LDAP authentication, and its IP is `10.0.0.5`."
5. The laptop now securely connects to `10.0.0.5` to verify the user's password.

## Components / Types
- **Forwarders:** If a Windows DNS server is asked for `google.com`, it doesn't own that domain. A "Forwarder" is configured to send all unknown queries out to the ISP or a public DNS provider (like `8.8.8.8`).
- **Root Hints:** If Forwarders are not configured, the Windows DNS server uses "Root Hints"—a built-in list of the 13 Root Servers of the Internet—to resolve public domains from scratch.
- **Conditional Forwarders:** A rule saying, "If anyone asks for `partner-company.com`, do NOT go to the Internet. Forward the request securely over the VPN to `10.50.0.5`." Crucial for corporate mergers and B2B VPNs.

## Practical Examples
- **Migrating a Server:** An administrator builds a new database server to replace an old one. They simply update the A record in Windows DNS. Because it's an AD-Integrated Zone, within minutes, every PC in the company is seamlessly routing their database queries to the new IP address.
- **Split-Brain DNS:** A company has a public website `www.company.com`. They want external users to hit the public web firewall (`203.0.113.5`), but they want internal employees to access the web server directly (`10.0.0.80`) to save internet bandwidth. They create a zone for `company.com` on the internal Windows DNS server and manually add an A record pointing `www` to `10.0.0.80`.

## Security Considerations
- **Secure Dynamic Updates:** By default, Windows DNS allows clients to update their own records. If set to "Nonsecure and Secure", an attacker plugging into the network could overwrite the DNS record for the corporate intranet site, pointing it to their own malicious web server. Always enforce "Secure Only" updates.
- **Zone Transfers (AXFR):** If a Windows DNS server is misconfigured to "Allow zone transfers to any server," an attacker running `nslookup` or `dig` can download a complete list of every server, printer, and PC in the company. Zone transfers must be strictly limited to explicitly defined secondary DNS servers.

## Commands / Configuration Examples
### PowerShell (Managing Windows DNS)
```powershell
# Add a new A record to a DNS Zone
Add-DnsServerResourceRecordA -ZoneName "corp.local" -Name "WebServ02" -IPv4Address "10.0.0.55"

# View all records in a specific zone
Get-DnsServerResourceRecord -ZoneName "corp.local"

# Clear the server's DNS cache
Clear-DnsServerCache
```

### Windows Client Diagnostics
```cmd
# Force the client to re-register its IP and Hostname with the Windows DNS Server
ipconfig /registerdns

# Query specifically for SRV records using nslookup
nslookup
> set type=srv
> _ldap._tcp.dc._msdcs.corp.local
```

## Troubleshooting
- **Cannot Browse the Internet, but Internal Sites Work:** Check the "Forwarders" tab in the DNS Server properties. If the forwarder IPs are unreachable (e.g., firewall blocking UDP 53 outbound), the server cannot resolve external domains.
- **Stale Records / Scavenging:** Sometimes, a laptop gets a new IP from DHCP, but the old DNS record remains. When you ping the laptop by name, it fails. Ensure **DNS Scavenging** is enabled on the server to automatically delete old, stale records after a set period (e.g., 7 days).
- **DNS Cache Poisoning:** If users are being redirected to wrong sites, clear the local client cache (`ipconfig /flushdns`) and clear the server cache.

## Interview Questions
- Why are SRV records critical in a Windows Active Directory environment? (Answer: They allow clients to locate services like Domain Controllers, Global Catalogs, and LDAP).
- Explain the benefit of using an "Active Directory Integrated" DNS zone over a standard primary zone. (Answer: Multi-master replication, secure dynamic updates, and automatic redundancy across all DCs).
- What is a Conditional Forwarder and when would you use it?
- How do you prevent an attacker from modifying DNS records on a Windows DNS server? (Answer: Enforce "Secure Only" dynamic updates so only authenticated AD computers can modify records).

## Summary
Windows DNS is the navigational engine of the Microsoft enterprise. By integrating tightly with Active Directory to provide secure updates, multi-master replication, and precise service location via SRV records, it ensures that users, computers, and authentication services can effortlessly find each other across complex corporate networks.

## References
- [DNS](../06-network-protocols/dns.md)
- [Active Directory Networking](active-directory-networking.md)
- [nslookup](../10-monitoring-and-troubleshooting/nslookup.md)
- [DNS Enumeration](../15-network-pentesting/dns-enumeration.md)
