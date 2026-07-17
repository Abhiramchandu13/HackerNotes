# nslookup

> nslookup is a legacy network administration tool available on both Windows and Linux, used to query the Domain Name System (DNS) to obtain domain name or IP address mapping.

## Overview
Before `dig` became the standard on Unix systems, **nslookup** (Name Server Lookup) was the universal tool for interrogating DNS. It is built natively into almost all operating systems, most notably Windows. 

While Linux administrators generally prefer `dig` for its detailed, standard-compliant output, `nslookup` remains heavily used because it is universally available on every Windows machine you will ever encounter, making it an essential, on-the-spot troubleshooting tool.

## Why It Matters
When a user says "I can't reach the server," the first step is proving whether it's a network routing issue or a DNS failure. `nslookup` proves if DNS is working. For Windows System Administrators and Helpdesk technicians, it is the primary tool used to verify that Active Directory DNS records are propagating correctly across the domain.

## Core Concepts
- **Interactive vs. Non-Interactive:** `nslookup` can be run as a single, one-line command (non-interactive), or you can type `nslookup` and hit Enter to drop into an interactive prompt where you can issue multiple sequential queries.
- **System Resolver Bypass:** Like `dig`, `nslookup` bypasses the local OS DNS cache and speaks directly to the DNS server, ensuring you see the actual live record on the server, not a stale cached result.

## How It Works
1. You open Command Prompt and type `nslookup example.com`.
2. The tool reads your network adapter settings to find your Default DNS Server.
3. It prints the name and IP of the server it is about to ask.
4. It sends the UDP port 53 query.
5. It prints the "Non-authoritative answer" (if your local server pulled it from a cache) or the "Authoritative answer" (if you directly asked the server that owns the domain).

## Components / Types
- **A / AAAA Records:** Used to resolve a name to an IP.
- **PTR Records (Reverse Lookup):** Resolving an IP to a name.
- **Server Selection:** Easily switching which DNS server you are asking during troubleshooting.

## Practical Examples
- **Verifying Public Records:** A web developer claims they updated the company's DNS to point to a new web server. An IT admin types `nslookup mycompany.com 8.8.8.8` to ask Google's DNS if the change has hit the public internet yet.
- **Active Directory Troubleshooting:** A PC is failing to join a Windows Domain. The admin uses `nslookup` to ensure the PC can actually resolve the domain controller's SRV records.

## Security Considerations
- **Reconnaissance:** Pentesters on a compromised Windows machine use `nslookup` to enumerate the internal domain structure, find mail servers (`set type=mx`), and attempt zone transfers.
- **DNS Exfiltration Testing:** During a pentest, `nslookup` can be used to manually trigger specific DNS queries to an attacker-controlled domain to test if outbound port 53 is monitored or blocked by corporate firewalls.

## Commands / Configuration Examples
### Windows / Linux (Non-Interactive Mode)
```cmd
# Standard lookup using the default DNS server
nslookup google.com

# Standard lookup asking a specific DNS server (Cloudflare)
nslookup google.com 1.1.1.1

# Reverse lookup (IP to Name)
nslookup 8.8.8.8
```

### Windows / Linux (Interactive Mode)
```cmd
C:\> nslookup
Default Server:  dc01.corp.local
Address:  10.0.0.10

# Change the query type to look for Mail Servers
> set type=mx
> example.com

# Change the server you are asking to Google
> server 8.8.8.8
> example.com

# Exit the interactive prompt
> exit
```

## Troubleshooting
- **"DNS request timed out":** The tool could not reach the DNS server. The server is offline, or a firewall is blocking UDP Port 53.
- **"Non-existent domain":** (NXDOMAIN). The DNS server is working perfectly, but it searched the internet and proved the domain name you typed does not exist or is not registered.
- **"Non-authoritative answer":** This is completely normal. It simply means the DNS server you asked does not *own* the domain; it just went and fetched the answer for you and served it from its cache.

## Interview Questions
- What is `nslookup` used for?
- How do you query a specific DNS server (like `8.8.8.8`) using `nslookup` instead of your default server?
- In `nslookup` interactive mode, how do you change the query to search for Text (TXT) records instead of IP addresses? (Answer: `set type=txt`).
- Why might an administrator see a "Non-authoritative answer" in their `nslookup` output?

## Summary
While `dig` is the modern standard for Linux, `nslookup` remains the ubiquitous, built-in DNS diagnostic tool for Windows environments. Its ability to quickly query specific records and shift between targeted nameservers makes it a mandatory utility for validating web traffic and Active Directory health.

## References
- [DNS](../06-network-protocols/dns.md)
- [dig](dig.md)
- [host Command](host-command.md)
