# Public IP Addresses

> Public IP addresses are globally unique, registered addresses that are routable across the public Internet.

## Overview
If a Private IP address is like the room number of your desk in a corporate building (only meaningful to people inside the building), a **Public IP address** is the street address of the building itself. It is unique across the entire globe. Every device, website, or service that needs to be directly reachable by anyone on the Internet must have a Public IP address.

Because there is a mathematical limit to IPv4 addresses (roughly 4.3 billion), Public IPv4 addresses are a strictly controlled and exhausted resource.

## Why It Matters
Public IPs are the lifeblood of external communication. For network engineers, managing Public IP allocations is necessary for establishing internet circuits, publishing web servers, and building site-to-site VPNs. For cybersecurity professionals, a Public IP represents your organization's external attack surface. Any service bound to a Public IP is constantly scanned and attacked by automated bots worldwide.

## Core Concepts
- **Global Uniqueness:** No two devices on the Internet can share the same Public IP address at the same time.
- **IANA and RIRs:** The Internet Assigned Numbers Authority (IANA) sits at the top. It delegates blocks of Public IPs to Regional Internet Registries (RIRs like ARIN for North America, RIPE for Europe), which then lease them to ISPs and large corporations.
- **Routable:** Core Internet backbone routers (using BGP) maintain massive routing tables containing all valid Public IP blocks to direct traffic globally.
- **IPv4 Exhaustion:** The pool of unallocated Public IPv4 addresses officially ran out in the 2010s. You can no longer "get" new ones; you must buy or lease them on a secondary market (often at a high cost).

## How It Works
1. You request Internet service for your business. Your ISP assigns you a single Public IP (e.g., `203.0.113.5`) or a small block (e.g., a `/29`).
2. You configure this Public IP on the external-facing interface of your edge firewall/router.
3. Internal users have Private IPs (`10.x.x.x`). When they browse the web, the firewall uses NAT to translate their Private IP into the Public IP `203.0.113.5`.
4. The web server on the Internet sees the request coming from `203.0.113.5` and sends the reply back to that globally unique address.
5. Your firewall receives the reply, untranslates it, and hands it back to the internal user.

## Components / Types
- **Static Public IP:** The IP address never changes. Required for hosting web servers, mail servers (SMTP), or establishing fixed VPN endpoints.
- **Dynamic Public IP:** The IP address changes periodically. Commonly assigned to residential home internet connections by the ISP via DHCP.
- **Reserved/Documentation Blocks:** Specialized public blocks (like `203.0.113.0/24`, `198.51.100.0/24`, and `192.0.2.0/24` - known as TEST-NET) which are guaranteed to never route on the real Internet, used exclusively for writing documentation and examples (like this one!).

## Practical Examples
- **Hosting a Website:** You spin up an EC2 instance in AWS to host a blog. AWS assigns an Elastic IP (a static Public IPv4 address) to the instance so users worldwide can reach it.
- **Finding Your IP:** When you go to a website like `whatismyip.com` from your home network, the site displays your home router's Public IP address, not your laptop's internal Private IP.

## Security Considerations
- **External Attack Surface:** Anything with a Public IP is exposed. Within minutes of a server coming online with a Public IP, it will be hit by SSH brute-force attempts and web vulnerability scanners.
- **EIP/IP Takeover:** In cloud environments, if you release a Public IP but forget to remove the DNS record pointing to it, an attacker can claim that IP from the cloud provider pool and hijack your subdomain (Subdomain Takeover).
- **IP Reputation:** If a Public IP is used for spam or malware hosting, it gets placed on DNS Blacklists (DNSBL). If an enterprise inherits a blacklisted IP, all their outbound emails will be rejected by other companies.

## Commands / Configuration Examples
### Linux
```bash
# View all IP addresses (you will see the Public IP if the server is directly on the internet)
ip addr

# Check what Public IP the Internet sees you as (from behind NAT)
curl ifconfig.me
```

### Windows
```powershell
# Query a public service to find your Public IP
Invoke-RestMethod -Uri "https://ifconfig.me"
```

## Troubleshooting
- **No Inbound Connectivity:** If a web server has a Private IP, external users cannot reach it. You must configure Port Forwarding (Destination NAT) on the firewall to map a specific port on the Public IP to the internal server's Private IP.
- **Dynamic IP Changes:** If your home ISP changes your Dynamic Public IP, your site-to-site VPN to the office will drop until the configuration is updated. Use Dynamic DNS (DDNS) to mitigate this.

## Interview Questions
- What is the difference between a Public IP and a Private IP?
- Why is it necessary to use NAT for typical enterprise internet access?
- Who manages the global distribution of Public IP addresses?
- Explain the security implications of binding a database directly to a Public IP address.

## Summary
Public IP addresses are the globally routable identifiers that make the Internet function. Because they are globally accessible, they represent both the gateway for business connectivity and the primary external attack surface evaluated by cybersecurity teams.

## References
- [Private IP Addresses](private-ip.md)
- [NAT and PAT](nat-and-pat.md)
- [BGP](../05-routing/bgp.md)
- [Network Attack Methodology](../15-network-pentesting/network-attack-methodology.md)
