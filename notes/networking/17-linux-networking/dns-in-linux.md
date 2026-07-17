# DNS in Linux

> DNS in Linux involves configuring the system to use specific Domain Name System servers for hostname resolution, enabling the system to find network services and Internet resources by name.

## Overview
Just like Windows, Linux systems need to convert human-readable hostnames (e.g., `www.google.com`) into machine-readable IP addresses. **DNS in Linux** is configured primarily through text files that tell the system which DNS servers to query and how to prioritize local lookups versus external servers.

Understanding how DNS resolution works in Linux is critical for managing servers, troubleshooting application connectivity, and securing system access to internal and external resources.

## Why It Matters
For system administrators, accurate DNS resolution is fundamental. If DNS fails, a Linux server cannot find its NTP server to sync time, its LDAP server to authenticate users, or its remote package repositories to download updates. For security professionals, misconfigured DNS can lead to services connecting to attacker-controlled IPs, or DNS leaks exposing internal network structures.

## Core Concepts
- **Resolver:** The part of the operating system that handles DNS queries.
- **`/etc/resolv.conf`:** The primary configuration file for the resolver. It lists the IP addresses of the DNS servers the system should query.
- **`/etc/nsswitch.conf`:** Controls the order in which the system looks up various information (like hostnames, passwords, groups). It dictates whether `files` (like `/etc/hosts`) or `dns` is checked first.
- **`systemd-resolved`:** The modern DNS resolver service used in many contemporary Linux distributions (like Ubuntu and Fedora). It acts as a local caching DNS server and manages `/etc/resolv.conf`.

## How It Works
When a Linux application (e.g., `curl`) needs to resolve a hostname (`example.com`):
1. The application queries the system's resolver.
2. The resolver consults `/etc/nsswitch.conf` to determine the lookup order. Typically, it checks `/etc/hosts` first, then DNS.
3. If not found in `/etc/hosts`, the resolver reads the `nameserver` entries from `/etc/resolv.conf`.
4. The resolver sends a UDP DNS query to the first listed nameserver (e.g., `10.0.0.5`).
5. The DNS server replies with the IP address (e.g., `93.184.216.34`).
6. The resolver returns the IP to the application.

## Components / Types
- **Static DNS Configuration:** Manually editing `/etc/resolv.conf` to list fixed nameservers. This can be overwritten by DHCP clients or `systemd-resolved`.
- **Dynamic DNS Configuration:** Receiving DNS server IPs via DHCP.
- **Local Caching DNS Servers:** Services like `systemd-resolved` or `dnsmasq` that run on the Linux machine itself. They cache DNS queries, speeding up lookups and reducing traffic to external DNS servers.

## Practical Examples
- **Server DNS Configuration:** A Linux web server needs to communicate with internal database servers (`db.corp.local`) and external APIs (`api.external.com`). Its `/etc/resolv.conf` is configured to point to the corporate Active Directory DNS server (`10.0.0.5`) for internal queries, and that server is configured to forward external queries to `8.8.8.8`.

## Security Considerations
- **DNS Leakage:** If a Linux VPN client is misconfigured, it might accidentally use the ISP's DNS servers instead of the VPN tunnel's secure DNS servers. This "leaks" the user's web browsing activity to their ISP.
- **Malicious DNS Server:** An attacker compromises a Linux machine and changes `/etc/resolv.conf` to point to their own malicious DNS server. This allows them to redirect traffic to phishing sites or block security updates.
- **Host Firewall Impact:** The Linux host firewall (`firewalld` or `ufw`) must allow outbound UDP port 53 traffic (or TCP 53 for zone transfers) for DNS resolution to function.

## Commands / Configuration Examples
### Linux (Viewing DNS Configuration)
```bash
# View the configured DNS servers
cat /etc/resolv.conf

# View the DNS search order
cat /etc/nsswitch.conf | grep hosts
```

### Linux (Temporarily Changing DNS Server)
```bash
# Manually add Google DNS servers for temporary testing
sudo echo "nameserver 8.8.8.8" > /etc/resolv.conf
sudo echo "nameserver 8.8.4.4" >> /etc/resolv.conf
```
*Note: This might be overwritten by NetworkManager or systemd-resolved.*

### Linux (Using `systemd-resolved` to manage DNS)
```bash
# View current status of systemd-resolved
resolvectl status

# Query DNS using systemd-resolved
resolvectl query google.com
```

## Troubleshooting
- **Cannot Resolve Hostnames (but can ping IP):** This is the hallmark symptom of a DNS issue.
  1.  Check `/etc/resolv.conf`: Are the `nameserver` entries correct and reachable?
  2.  Check `/etc/nsswitch.conf`: Is `dns` listed in the `hosts` line?
  3.  Check host firewall: Is outbound UDP port 53 allowed?
  4.  Clear local cache: `sudo systemd-resolve --flush-caches`.
- **Slowness:** If DNS lookups are slow, ensure the primary nameserver is close by and responsive. Consider configuring a local caching DNS server (like `dnsmasq`).

## Interview Questions
- What is the primary configuration file for DNS resolution on Linux? (Answer: `/etc/resolv.conf`).
- Explain the purpose of `/etc/hosts` and when it is consulted during DNS resolution.
- How do you query a specific DNS server from the Linux command line? (Answer: `dig @<server_ip> <hostname>`).
- What is `systemd-resolved`?

## Summary
DNS in Linux is a critical service managed primarily through text files. By configuring the correct nameservers and understanding the resolution order, administrators ensure that Linux systems can reliably locate resources, from local services to global Internet domains.

## References
- [DNS](../06-network-protocols/dns.md)
- [dig](../10-monitoring-and-troubleshooting/dig.md)
- [Network Configuration Files](network-configuration-files.md)
- [DHCP in Linux](dhcp-in-linux.md)
