# Internet, Intranet, and Extranet

> The Internet is public, an intranet is private, and an extranet is a controlled extension of private access to trusted outside parties.

## Overview
These three terms describe access boundaries.

- The Internet is a public, global network.
- An intranet is an internal network used by an organization.
- An extranet is a restricted environment that allows selected external users or partners to reach specific internal resources.

This distinction is central to network design, identity management, and security policy.

## Why It Matters
If you do not define trust boundaries clearly, you will overexpose internal resources or overrestrict legitimate business traffic.

Examples:
- Public customer portals usually live on Internet-facing systems.
- HR, finance, and internal collaboration tools usually live on an intranet.
- Supplier portals, partner APIs, and B2B file exchanges often use extranet controls.

Security teams use these boundaries to decide where to place firewalls, authentication systems, reverse proxies, and monitoring.

## Core Concepts
- Internet: public network of interconnected networks
- Intranet: private network available only to internal users
- Extranet: private network segment exposed selectively to external parties
- Trust boundary: the point where security expectations change
- Identity-aware access: access should depend on user, device, and context

## How It Works
A typical enterprise setup might look like this:
1. Internet users connect to a public load balancer or reverse proxy.
2. The proxy forwards approved requests to an application tier.
3. Employees access internal systems over an intranet.
4. Partners reach a limited set of resources through an extranet gateway or VPN.

For a deeper view of how traffic moves through these environments, see [Network Devices](../07-network-devices/gateway.md) and [Network Security](../09-network-security/zero-trust.md).

## Components / Types
### Internet
Public, decentralized, and accessible through globally routable IP addresses.

### Intranet
Private, usually protected by authentication, network segmentation, and internal DNS.

### Extranet
A controlled subset of the intranet exposed to external stakeholders through secure access methods.

## Practical Examples
- A public e-commerce checkout page is Internet-facing.
- An employee payroll system is on the intranet.
- A logistics partner uploading shipping manifests into a shared portal uses an extranet.
- A contractor connecting via VPN may be granted access to a single application in the extranet zone.

## Security Considerations
- Do not treat intranet traffic as trusted by default.
- Extranet users should have least privilege.
- Public systems must assume hostile traffic.
- Internal DNS names and network routes should not be exposed unnecessarily.
- Strong authentication, segmentation, and logging are essential.

This is where concepts like [DMZ](../09-network-security/dmz.md), [Zero Trust](../09-network-security/zero-trust.md), and [TLS](../09-network-security/tls.md) become important.

## Commands / Configuration Examples
### Linux
```bash
dig internal.example.local
curl https://portal.example.com
```

### Windows
```powershell
Resolve-DnsName intranet.example.local
Test-NetConnection portal.example.com -Port 443
```

### Cisco IOS
```text
show ip route
show access-lists
show ip interface brief
```

## Troubleshooting
- Can the user resolve the correct DNS name?
- Is the request reaching the correct zone?
- Is the firewall allowing the connection?
- Is the client on a trusted network or VPN?
- Is the extranet gateway enforcing the correct policy?

## Interview Questions
- What is the difference between the Internet and an intranet?
- What is an extranet used for?
- Why should intranet traffic still be secured?
- How do you protect partner access to internal services?

## Summary
The Internet, intranet, and extranet are trust zones, not just network names. Clear boundary design improves usability and security at the same time.

## References
- [Network Types](network-types.md)
- [Zero Trust](../09-network-security/zero-trust.md)
- [DMZ](../09-network-security/dmz.md)
- [TLS](../09-network-security/tls.md)
