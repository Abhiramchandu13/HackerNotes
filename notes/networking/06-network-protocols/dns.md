# DNS (Domain Name System)

> DNS is the "phonebook of the Internet," a hierarchical system that translates human-readable domain names (like google.com) into machine-readable IP addresses.

## Overview
Computers strictly communicate using IP addresses (e.g., `142.250.190.46`). Humans are terrible at remembering strings of numbers, but excellent at remembering names. **Domain Name System (DNS)** bridges this gap. Operating primarily over **UDP port 53** at the Application Layer, DNS takes a domain name and returns the corresponding IP address, allowing your browser to successfully route traffic to the intended destination.

## Why It Matters
Without DNS, the Internet as we know it would cease to function. In enterprise networking, internal DNS (Active Directory) is the glue that binds servers, clients, and services together. For cybersecurity professionals, DNS is a critical attack vector, a primary method for malware Command & Control (C2) beaconing, and an essential dataset for threat hunting and incident response.

## Core Concepts
- **Hierarchical Structure:** DNS reads right-to-left. 
  - `.` (Root): The top of the tree.
  - `.com` (TLD - Top Level Domain).
  - `google.com` (Second-level Domain).
  - `www.google.com` (Subdomain / Host).
- **Resolver / Client:** The OS component that asks the question.
- **Recursive Server:** Usually run by your ISP or IT department (like `8.8.8.8`). It takes the client's query and does the heavy lifting of hunting down the answer across the global internet.
- **Authoritative Server:** The server that officially owns and hosts the DNS records for a specific domain.

## How It Works (The Recursive Lookup)
1. You type `www.example.com` into your browser. The OS checks its local cache. No answer.
2. The OS asks its configured Recursive DNS server (e.g., your home router or `1.1.1.1`): "Where is www.example.com?"
3. The Recursive server checks its cache. No answer. It asks a **Root Server**: "Who handles .com?"
4. Root Server replies: "Go ask the .com TLD Server at this IP."
5. Recursive server asks the **TLD Server**: "Who handles example.com?"
6. TLD Server replies: "Go ask the Authoritative Server for example.com at this IP."
7. Recursive server asks the **Authoritative Server**: "What is the IP for www.example.com?"
8. Authoritative Server replies: "It is `93.184.216.34`."
9. The Recursive server caches this answer for future use and returns the IP to your PC.

## Components / Types
Common DNS Record Types:
- **A Record:** Maps a name to an IPv4 address.
- **AAAA Record:** Maps a name to an IPv6 address.
- **CNAME:** An alias; points a name to another name (e.g., `blog.example.com` points to `example.com`).
- **MX Record:** Mail Exchange. Tells the world which server handles email for the domain.
- **TXT Record:** Text data. Used heavily for domain verification and email security (SPF, DKIM, DMARC).
- **PTR Record:** A Reverse Lookup. Maps an IP address *back* to a domain name.

## Practical Examples
- **Internal Domains:** A company uses internal DNS so employees can type `http://intranet` instead of remembering `10.5.50.22`.
- **Load Balancing:** Large sites like YouTube use "Round Robin DNS." If you ask for the A record for youtube.com, the DNS server hands back a list of 10 different IP addresses, rotating the order for each user to spread the traffic load.

## Security Considerations
DNS was built for resilience, not security, making it highly exploitable.
- **DNS Spoofing / Cache Poisoning:** An attacker injects a fake record into a recursive server's cache. When a user asks for `bank.com`, the poisoned cache returns the IP of the attacker's phishing server. (Mitigated by **DNSSEC**).
- **DNS Tunneling (Exfiltration):** Malware encapsulates stolen data into the subdomain of a DNS request (e.g., `creditcard_data.evil-domain.com`). Because almost all firewalls allow outbound port 53, the data sneaks past security controls entirely disguised as standard DNS queries.
- **DoH / DoT (DNS over HTTPS/TLS):** Modern protocols that encrypt DNS queries. While excellent for user privacy against ISP snooping, they break enterprise visibility, preventing SOC analysts from inspecting malicious DNS queries.

## Commands / Configuration Examples
### Linux
```bash
# Query an A record (modern command)
dig example.com

# Query a specific record type (MX) using a specific server (8.8.8.8)
dig @8.8.8.8 example.com MX

# Flush the local DNS cache (systemd systems)
resolvectl flush-caches
```

### Windows
```powershell
# Legacy but ubiquitous query tool
nslookup example.com

# Modern PowerShell equivalent
Resolve-DnsName example.com

# Clear the local DNS cache
ipconfig /flushdns
```

## Troubleshooting
- **"Cannot reach website" vs "Ping IP works":** The ultimate DNS test. If `ping google.com` fails, but `ping 8.8.8.8` works and you can browse to IPs directly, your network connection is fine, but your configured DNS server is dead or unreachable.
- **Propagation Delay:** When an admin updates an A record, users across the world might still be directed to the old IP address because their local ISPs have cached the old record based on its Time-To-Live (TTL) value.

## Interview Questions
- What port and protocol does standard DNS use? (Answer: UDP port 53. TCP port 53 is used for zone transfers and excessively large responses).
- Explain the difference between an A record and a CNAME record.
- What is a Recursive DNS query compared to an Iterative query?
- How is DNS used by attackers for data exfiltration?

## Summary
DNS is the indispensable directory of the Internet, translating human-friendly names into routable IP addresses. Understanding the hierarchy of resolution, the various record types, and the inherent security flaws of cleartext UDP queries is foundational for both network administration and cybersecurity defense.

## References
- [UDP](udp.md)
- [TCP](tcp.md)
- [DNS Enumeration](../14-network-pentesting/dns-enumeration.md)
- [Application Layer](../02-osi-and-tcpip-models/application-layer.md)
