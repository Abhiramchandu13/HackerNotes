# dig

> dig is a highly flexible, modern command-line tool used in Linux and macOS to query DNS servers and troubleshoot domain name resolution.

## Overview
When you type a web address, your computer uses DNS to find the IP. But when DNS breaks—or when you need to verify an obscure DNS record like an MX or TXT record—you need a tool that can interrogate the DNS system directly. 

**Domain Information Groper (dig)** is that tool. While `nslookup` is older and available on Windows, `dig` is vastly preferred by Unix/Linux engineers because it provides cleaner, more detailed, and standard-compliant output.

## Why It Matters
For system administrators, `dig` is the primary tool for verifying domain migrations, setting up email servers, and proving that a website's outage is a DNS failure rather than a server crash. For security analysts, `dig` is heavily used to inspect DNS TXT records for SPF/DKIM data during email spoofing investigations, and for performing automated DNS reconnaissance against target domains.

## Core Concepts
- **Direct Querying:** `dig` bypasses the operating system's local DNS resolver cache and speaks directly to DNS servers over UDP/TCP port 53.
- **Specific Record Types:** You can ask `dig` for exactly what you want: an `A` record (IPv4), `AAAA` (IPv6), `MX` (Mail), `TXT` (Text), or `NS` (Name Server).
- **Targeting Servers:** You can force `dig` to ask a specific DNS server (like Google's `8.8.8.8`) rather than your ISP's default server, allowing you to test if a DNS record has propagated globally.

## How It Works
1. You run `dig example.com`.
2. `dig` crafts a raw UDP DNS request.
3. It sends it to your `/etc/resolv.conf` default nameserver.
4. The server replies with the raw DNS response.
5. `dig` prints the raw response to your terminal, dividing it into sections:
   - **HEADER:** Status of the query (e.g., `NOERROR` or `NXDOMAIN`).
   - **QUESTION SECTION:** What you asked for.
   - **ANSWER SECTION:** The actual IP or record returned.
   - **AUTHORITY SECTION:** Which name server provided the answer.

## Components / Types
Important command line syntax:
- `@server`: Tells `dig` which DNS server to ask (e.g., `@8.8.8.8`).
- `-t type`: The type of record (e.g., `-t MX`, though usually you can just append the type to the end of the command).
- `+short`: Strips out all the verbose headers and prints *only* the answer (extremely useful for bash scripting).
- `+trace`: Instructs `dig` to perform a full recursive trace from the Root servers down to the Authoritative server, showing you every step of the DNS hierarchy.

## Practical Examples
- **Checking Global Propagation:** You updated a website's IP address. You want to see if the world sees the new IP yet. You run `dig @8.8.8.8 mywebsite.com` to ask Google, and `dig @1.1.1.1 mywebsite.com` to ask Cloudflare.
- **Verifying Email Security:** A client complains their emails are going to spam. You run `dig mycompany.com TXT` to verify their SPF record is correctly published in DNS.

## Security Considerations
- **Zone Transfers (AXFR):** A massive security risk. Pentesters use `dig axfr @ns1.target.com target.com` to request a full copy of the target's entire DNS database. If the server is misconfigured, it will dump every single internal server name and IP address to the attacker.
- **Information Disclosure:** `dig +trace` can reveal the underlying nameserver infrastructure of a target, helping attackers map cloud provider relationships.

## Commands / Configuration Examples
### Linux / macOS
```bash
# Standard query (Defaults to A record)
dig google.com

# Query a specific record type (MX for mail servers)
dig example.com MX

# Ask a specific DNS server (Cloudflare) for the answer
dig @1.1.1.1 example.com

# Get just the IP address, nothing else (perfect for scripts)
dig +short example.com

# Perform a Reverse DNS lookup (IP to Name)
dig -x 8.8.8.8

# Perform a full recursive trace from the Root servers
dig +trace example.com
```

## Troubleshooting
- **NXDOMAIN:** If the status header says `status: NXDOMAIN`, it means "Non-Existent Domain." You spelled it wrong, or the domain is not registered.
- **SERVFAIL:** Indicates the DNS server you asked tried to find the answer, but the upstream authoritative server was broken or refused to reply.
- **No Answer Section:** If the query completes but there is no "ANSWER SECTION," it means the domain exists, but it doesn't have the specific record you asked for (e.g., you asked for an IPv6 `AAAA` record, but the site only supports IPv4).

## Interview Questions
- Why do Linux administrators prefer `dig` over `nslookup`? (Answer: `dig` provides detailed, standard-compliant output showing the exact raw DNS response sections, and does not use interactive modes).
- How do you query a specific DNS server using `dig` instead of the system default?
- What does the `+short` flag do?
- Explain how to perform a DNS Zone Transfer using `dig` and why it is a security risk.

## Summary
`dig` is the definitive tool for DNS interrogation on Unix systems. By providing granular control over query types, target servers, and output formatting, it strips away the mystery of domain resolution, giving engineers direct access to the "phonebook of the Internet."

## References
- [DNS](../06-network-protocols/dns.md)
- [nslookup](nslookup.md)
- [host Command](host-command.md)
- [DNS Enumeration](../13-network-pentesting/dns-enumeration.md)
