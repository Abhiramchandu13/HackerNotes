# IDS / IPS (Intrusion Detection and Prevention Systems)

> An IDS monitors network traffic for malicious activity and sends alerts, while an IPS actively blocks or drops traffic that it identifies as an attack.

## Overview
A firewall is like a bouncer at a club who only checks the guest list (IPs and Ports). An **Intrusion Detection System (IDS)** or **Intrusion Prevention System (IPS)** is like the undercover security guard inside the club who is actively looking for people trying to start a fight. 

These systems perform deep packet inspection to analyze the *content* of network traffic, comparing it against a massive database of known attack signatures (like specific malware patterns or exploit attempts).

## Why It Matters
Modern cyber attacks easily bypass traditional firewalls by hiding within legitimate-looking traffic (e.g., a SQL injection attack sent over standard HTTPS port 443). An IPS is necessary to detect and stop these application-layer threats. For a Security Operations Center (SOC), IPS alerts are a primary source of actionable intelligence, indicating that an active exploit attempt is underway on the network.

## Core Concepts
- **IDS (Detection):** Operates "out-of-band." It receives a copy of the traffic (from a network tap or a switch's SPAN port). It can see an attack, but it can only send an alert; it cannot stop the packet. Think of it like a security camera system.
- **IPS (Prevention):** Sits "inline," directly in the path of the traffic. It acts like a stateful firewall, but with a powerful inspection engine. If it detects a malicious packet, it can drop the packet before it ever reaches the target server.
- **Signature-Based Detection:** The primary method. The system has a database of thousands of known attack patterns (e.g., "if you see the string `UNION SELECT` in a URL, that is a SQL injection attack").
- **Anomaly-Based Detection:** More advanced systems build a baseline of what "normal" network traffic looks like, and then alert on any strange deviations from that baseline.

## How It Works
1. An attacker attempts to exploit a known vulnerability in a corporate web server. They send a specially crafted packet to the server's public IP.
2. The packet passes through the edge router and hits the **IPS**, which sits between the router and the internal network.
3. The IPS inspects the payload of the packet. It compares the data to its signature database.
4. It finds a match: "Signature #12345 - Apache Struts Remote Code Execution Attempt".
5. The IPS **drops the packet** silently. It also generates a high-severity syslog alert and sends it to the SIEM, containing the attacker's source IP and the target server's IP.
6. The web server never even receives the malicious packet.

## Components / Types
- **NIDS / NIPS (Network-based):** The traditional form. A dedicated hardware appliance or virtual machine that monitors traffic for an entire network segment.
- **HIDS / HIPS (Host-based):** Software agents installed directly on endpoints (servers, workstations). They can monitor not just network traffic, but also system calls, file integrity, and local processes. (e.g., CrowdStrike Falcon, Carbon Black).
- **NGFW Integration:** Today, nearly all Next-Generation Firewalls (NGFWs) have a fully integrated IPS module, blurring the lines between the two devices.

## Practical Examples
- **Preventing Log4Shell:** An attacker sends an HTTP request containing the malicious `${jndi:ldap...}` string. The corporate Palo Alto firewall (with its IPS module enabled) inspects the HTTP headers, matches the string against its Log4Shell signature, and drops the packet on the spot.

## Security Considerations
- **False Positives:** An aggressive IPS can be its own worst enemy. Sometimes, legitimate custom application traffic can accidentally match the pattern of an old attack signature. The IPS will block the legitimate traffic, causing an application outage. Tuning and creating exceptions are a constant operational task for SOC teams.
- **Evasion:** Attackers are constantly inventing new ways to disguise their payloads to evade IPS signatures. This includes using encryption, breaking attacks into tiny fragmented packets, or encoding characters in unusual ways (e.g., using Unicode instead of ASCII).
- **SSL Decryption Requirement:** An IPS cannot inspect what it cannot see. If traffic is encrypted with HTTPS, the IPS sees nothing but gibberish. For an IPS to be effective on modern internet traffic, it must be placed behind a device (like an NGFW or a proxy) that performs SSL/TLS decryption.

## Commands / Configuration Examples
IPS/IDS systems are complex graphical tools (like Snort, Suricata, or commercial platforms). Configuration is not done via a single command but through extensive policy rule sets.

### Snort (Example Rule)
```text
# This is a conceptual example of a Snort rule that would detect a specific attack
alert tcp any any -> $HOME_NET 80 (msg:"WEB-ATTACKS SQL Injection attempt"; flow:to_server,established; content:"UNION SELECT"; nocase; sid:1000001;)
```

## Troubleshooting
- **Application Performance Issues:** If a new application is performing terribly, check if it is being inspected by an IPS. The deep packet inspection can add significant latency, especially for traffic that involves many small packets. You may need to create a policy exception.
- **Asymmetric Routing:** If traffic leaves via a path that does *not* have an IPS, but the return traffic comes back through the IPS, the IPS will drop the return traffic because it never saw the start of the conversation and has no state for it.

## Interview Questions
- What is the fundamental difference between an IDS and an IPS?
- What is "signature-based detection"?
- Why must an IPS be placed "inline" in the network path?
- How does SSL/TLS encryption impact the effectiveness of a network-based IPS?

## Summary
Intrusion Detection and Prevention Systems are the active security engines of a modern network. By moving beyond simple port and IP filtering to analyze the actual content of data streams, they provide a critical layer of defense against known exploits and application-layer attacks.

## References
- [Firewall](firewall.md)
- [Next-Gen Firewalls](../07-network-devices/next-gen-firewalls.md)
- [Network Reconnaissance](../13-network-pentesting/network-reconnaissance.md)
- [Application Layer](../02-osi-and-tcpip-models/application-layer.md)
