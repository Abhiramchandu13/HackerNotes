# CIA in Networking

> The CIA Triad is the foundational security model that guides how to protect information. It dictates that security systems must ensure Confidentiality, Integrity, and Availability.

## Overview
Every decision in cybersecurity can be measured against the **CIA Triad**. It is not a technology, but a mental model for identifying security risks and evaluating controls. In networking, it serves as the ultimate litmus test for every firewall rule, VPN tunnel, and access control policy.

- **Confidentiality:** Is the data secret? (Preventing unauthorized disclosure).
- **Integrity:** Is the data unaltered? (Preventing unauthorized modification).
- **Availability:** Is the data accessible? (Preventing disruption of access).

## Why It Matters
When a security control fails, it fails in one of these three ways. Understanding the triad allows professionals to speak a common language when describing threats and incidents. A DDoS attack is an attack on Availability. A man-in-the-middle sniffing attack is a breach of Confidentiality. Ransomware that encrypts files is an attack on both Integrity and Availability.

## Core Concepts
### Confidentiality
- **Goal:** Keep data secret from those who shouldn't see it.
- **Network Mechanism:** Encryption (e.g., HTTPS, SSH, VPNs).
- **Attack Example:** A network administrator uses cleartext Telnet to manage a router. An attacker captures the password with Wireshark. Confidentiality is lost.

### Integrity
- **Goal:** Ensure data has not been tampered with or corrupted in transit.
- **Network Mechanism:** Hashing and Message Authentication Codes (e.g., TLS records, IPsec AH).
- **Attack Example:** An attacker intercepts a software update being downloaded by a user and injects a virus into the executable file. Integrity is lost.

### Availability
- **Goal:** Ensure authorized users can access the network and data when they need to.
- **Network Mechanism:** Redundancy (multiple links, high availability firewalls) and resiliency against denial of service.
- **Attack Example:** An attacker launches a SYN Flood against a web server, exhausting its resources so legitimate customers cannot connect. Availability is lost.

## How It Works
The CIA Triad works as a system of checks and balances. Sometimes, improving one pillar comes at the cost of another.
- **Example:** Implementing a complex, multi-layered firewall rule set (increasing Confidentiality and Integrity) might accidentally block legitimate business traffic or slow down the network (decreasing Availability). A successful security architecture finds the right balance for the business's risk appetite.

## Components / Types
Different network security tools prioritize different aspects of the triad:
- **VPNs:** Primarily focus on **Confidentiality** (encryption).
- **Intrusion Prevention Systems (IPS):** Primarily focus on **Integrity** (stopping known attack payloads).
- **Load Balancers & DDoS Mitigation:** Primarily focus on **Availability**.

## Practical Examples
- **PCI-DSS Compliance:** To protect customer credit card data, the standard mandates strong encryption for data in transit (Confidentiality), file integrity monitoring on servers (Integrity), and redundant systems to prevent outages (Availability).
- **Ransomware Impact:** A ransomware attack encrypts a hospital's patient database. Confidentiality is breached if the attacker exfiltrates the data. Integrity is lost because the original files have been altered. Availability is lost because doctors can no longer access patient records.

## Security Considerations
- **The "Weakest Link" Principle:** Your network's overall security is only as strong as its weakest pillar. Perfect encryption is useless if the server has a weak password that can be brute-forced (a failure of authentication, which protects confidentiality).
- **Business Context:** The "A" in CIA is often forgotten by junior security analysts. Blocking an IP address that appears to be port scanning might seem wise, but if that IP belongs to a critical business partner performing a health check, you have caused a business outage.

## Commands / Configuration Examples
The CIA triad is a framework, not a configurable technology. However, commands often map to its principles.

### Verifying Confidentiality (Linux)
```bash
# Check if a website is using strong encryption (TLS)
openssl s_client -connect www.example.com:443
```

### Verifying Integrity (Linux)
```bash
# Generate a cryptographic hash of a downloaded file to verify its integrity
sha256sum software_update.iso
# Compare the output to the hash published on the vendor's website.
```

## Troubleshooting
- **Troubleshooting Confidentiality:** If data is being leaked, use packet captures to determine if applications are using unencrypted protocols like HTTP or Telnet.
- **Troubleshooting Integrity:** If files are arriving corrupted, investigate potential Man-in-the-Middle proxies or network hardware issues that might be altering data in transit.
- **Troubleshooting Availability:** If a service is unreachable, use tools like `ping` and `traceroute` to determine where in the network path the availability is being lost.

## Interview Questions
- What do the letters C, I, and A stand for in the CIA triad?
- Give an example of a network attack that targets each pillar of the triad.
- How can a security control designed to improve Confidentiality negatively impact Availability?
- Where does authentication (proving who you are) fit into the CIA model? (Answer: It is a mechanism that enforces Confidentiality).

## Summary
The CIA Triad is the guiding philosophy of information security. By framing every action and vulnerability in terms of its impact on Confidentiality, Integrity, and Availability, network and security professionals can make informed, risk-based decisions to protect critical data and systems.

## References
- [Firewall](../07-network-devices/firewall.md)
- [VPNs](vpns.md)
- [TLS](tls.md)
- [IPsec](ipsec.md)
