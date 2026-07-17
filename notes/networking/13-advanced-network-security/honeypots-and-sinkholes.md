# Honeypots and Sinkholes

> Honeypots are decoy systems designed to lure and detect attackers, while Sinkholes are routing mechanisms used to redirect malicious network traffic into a controlled, harmless destination.

## Overview
Traditional network security focuses on building massive walls (firewalls, IPS) to keep attackers out. But what happens when an attacker slips past the wall, or a piece of malware is brought inside the network on an infected USB drive? 

**Honeypots** and **Sinkholes** represent an active defense strategy. Instead of just blocking traffic, they intentionally manipulate the attacker's environment. They act as alarms, traps, and containment mechanisms for threats that have already breached the perimeter.

## Why It Matters
In a large enterprise, it is impossible to detect every single malicious action in the sea of billions of legitimate network packets. Honeypots create environments with a zero-percent false-positive rate: because no legitimate user should *ever* touch a honeypot, any interaction with it is an immediate, high-fidelity security alert. Sinkholes provide network engineers with a rapid, scalable method to neutralize massive automated attacks (like botnet C2 beacons) across the entire enterprise with a single routing change.

## Core Concepts
### Honeypots
- **Decoy Systems:** A server or service deployed explicitly to be probed, attacked, and compromised.
- **No Production Value:** A honeypot has no legitimate business purpose. It contains no real data and runs no real applications.
- **High Fidelity:** If a honeypot generates a log (e.g., someone tried to log into it via SSH), it is a guaranteed incident. 

### Sinkholes (DNS and IP)
- **Traffic Redirection:** Forcing specific network traffic to route into a "black hole" or a controlled logging server, rather than its intended destination.
- **DNS Sinkholing:** Intercepting DNS requests for known malicious domains (e.g., `evil-malware.com`) and returning a fake, internal IP address (the sinkhole) instead of the real Internet IP.
- **IP Sinkholing (Null Routing):** Configuring a router to drop all traffic destined for a specific malicious IP address by sending it to `Null0`.

## How It Works
### The Honeypot Scenario
1. A SOC analyst deploys a small Linux VM on the internal server VLAN. They name it `FINANCE-DB-01` but do not announce it to the company.
2. The VM is running a special Honeypot software that mimics an unpatched MySQL database.
3. An attacker breaches an employee's laptop and begins scanning the server VLAN for databases.
4. The attacker finds `FINANCE-DB-01` and attempts to run a SQL exploit against it.
5. The Honeypot records the exploit payload, the attacker's IP, and immediately alerts the SOC. The SOC isolates the employee's laptop before the attacker can find the *real* finance database.

### The Sinkhole Scenario
1. Threat intelligence informs the company that a new ransomware strain always reaches out to `c2-server.hacker.com` to get its encryption keys.
2. The network admin logs into the corporate internal DNS server and creates a fake zone for `c2-server.hacker.com`.
3. They configure the zone to resolve to an internal sinkhole IP: `10.99.99.99`.
4. When an infected PC inside the company tries to contact the C2 server, DNS lies to it, directing the traffic to `10.99.99.99` instead of the Internet.
5. The ransomware fails to get its keys and cannot encrypt the files. The sinkhole server logs the IP of the infected PC, alerting the security team to clean it.

## Components / Types
- **Low-Interaction Honeypot:** Mimics specific services (like opening port 22 and presenting a fake SSH banner). Easy to deploy, low risk, but sophisticated attackers easily realize it's fake. (e.g., *Cowrie*).
- **High-Interaction Honeypot:** A real, fully functional operating system left intentionally vulnerable. Captures vast amounts of intelligence (like the actual malware the attacker uploads), but poses a high risk if the attacker uses it to pivot further into the network.
- **Honeynets:** An entire network of multiple interconnected honeypots, simulating a complex corporate environment.

## Security Considerations
- **Honeypot Pivoting:** If a high-interaction honeypot is compromised, the attacker essentially owns a server on your network. The honeypot must be strictly isolated (via firewalls or micro-segmentation) so the attacker cannot use it as a launchpad to attack real production servers.
- **Entrapment/Legal Risks:** In some jurisdictions, setting up systems specifically to "entrap" attackers without proper legal authorization can violate wiretapping laws or company policy. Always consult legal before deploying high-interaction traps on public networks.

## Commands / Configuration Examples
### Routing Sinkhole (Cisco IOS)
Also known as a "Blackhole Route" or "Null Route".
```text
! Force all traffic destined for a known malicious IP to instantly drop
ip route 203.0.113.99 255.255.255.255 Null0

! (Advanced) Using BGP Remote Triggered Black Hole (RTBH)
! A central router advertises this route to the entire network via BGP, 
! neutralizing the threat across all enterprise routers simultaneously.
```

### DNS Sinkhole (Pi-hole / BIND)
Security appliances (like Palo Alto firewalls or Pi-hole DNS servers) specialize in this.
```text
# Example BIND DNS zone file concept for sinkholing
zone "malware-domain.com" {
    type master;
    file "/etc/bind/db.sinkhole";
};
# The db.sinkhole file resolves all records to 127.0.0.1 or an internal logging IP.
```

## Troubleshooting
- **Sinkhole Collateral Damage:** The most common danger. If an administrator accidentally sinkholes a legitimate, shared domain (like `aws.amazon.com` or a shared CDN domain), they will instantly break thousands of legitimate internal applications. Sinkholing requires extreme precision and verified threat intelligence.
- **Honeypot Fingerprinting:** Modern malware and automated attack scripts will often check for specific registry keys, MAC addresses, or software behaviors that are unique to common honeypot software. If detected, the malware simply goes to sleep, evading detection.

## Interview Questions
- What is the primary difference between a honeypot and a standard intrusion detection system (IDS)? (Answer: An IDS analyzes all production traffic and generates false positives; a honeypot has no production traffic, so any interaction is highly likely to be malicious).
- Describe the difference between a low-interaction and a high-interaction honeypot.
- How does a DNS Sinkhole prevent malware from functioning?
- What is a Null Route (Blackhole route), and how is it used defensively?

## Summary
Honeypots and Sinkholes shift network security from a purely defensive, reactive posture into a proactive, deceptive strategy. By intentionally manipulating the routing and resolution landscape, defenders can force attackers to reveal their presence, waste their time on fake targets, and effortlessly neutralize their automated command-and-control infrastructure.

## References
- [DNS](../06-network-protocols/dns.md)
- [Routing Table](../05-routing/routing-table.md)
- [Static Routing](../05-routing/static-routing.md)
- [Network Reconnaissance](../14-network-pentesting/network-reconnaissance.md)
