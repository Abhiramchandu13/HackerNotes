# Network Standards Organizations

> Standards organizations define the rules, formats, and best practices that make networks interoperable.

## Overview
Networking works because vendors follow shared standards. Without standards, one device would not reliably communicate with another.

These organizations influence Ethernet, Wi-Fi, TCP/IP behavior, cabling, and security practices.

## Why It Matters
Standards help you:
- Build interoperable networks
- Understand protocol behavior
- Read vendor documentation correctly
- Validate design choices
- Spot deprecated or insecure features

For security teams, standards often define the baseline for secure deployment and response.

## Core Concepts
Important organizations include:
- IEEE: local and metropolitan networking standards such as Ethernet and Wi-Fi
- IETF: Internet protocols published as RFCs
- ISO: broad international standards, including OSI concepts
- ITU-T: telecom and wide-area standards
- TIA/EIA: cabling and physical layer guidance
- NIST: security guidance and best practices
- Wi-Fi Alliance: certification and interoperability for wireless gear

## How It Works
A standard is proposed, reviewed, revised, and published. Vendors implement the standard in products. Engineers then design networks around the supported features and limitations.

Some standards are formal protocol specifications. Others are operational guidance or testing frameworks.

## Components / Types
### IEEE
Defines standards such as 802.3 Ethernet and 802.11 wireless.

### IETF
Publishes RFCs that define TCP/IP protocols, DNS, DHCP, HTTP, and many more.

### NIST
Provides cybersecurity and operational guidance for network design and defense.

### TIA/EIA
Guides cable categories, wiring, and structured cabling practices.

## Practical Examples
- Ethernet switching behavior is based on IEEE standards.
- DNS runs on protocols defined in RFCs.
- A firewall deployment may follow NIST security guidance.
- Structured cabling closets often follow TIA/EIA recommendations.

## Security Considerations
- Deprecated standards may still be supported for compatibility.
- Weak wireless modes or old encryption methods are often phased out slowly.
- Security baselines should reference authoritative standards, not vendor marketing.
- Compliance does not guarantee strong security, but it improves consistency.

## Commands / Configuration Examples
### Linux
```bash
dig +short RFC editor.org
```

### Windows
```powershell
Resolve-DnsName ietf.org
```

### Cisco IOS
```text
show version
show inventory
```

## Troubleshooting
- Is the feature supported by the standard and by the device?
- Is a deprecated mode still enabled?
- Are you mixing vendor-specific behavior with open standards?
- Is cabling or wireless design aligned with the intended standard?

## Interview Questions
- What is the difference between IEEE and IETF?
- Why are RFCs important?
- How do standards help network interoperability?
- Why should security teams care about standards organizations?

## Summary
Standards organizations make networking predictable and vendor-neutral. Knowing who defines what helps you design, secure, and troubleshoot more effectively.

## References
- [OSI Model Overview](../02-osi-and-tcpip-models/osi-model-overview.md)
- [Ethernet](../03-ethernet-and-switching/ethernet.md)
- [Wi-Fi Standards](../08-wireless-networking/wi-fi-standards.md)
- [NIST](https://www.nist.gov/)
