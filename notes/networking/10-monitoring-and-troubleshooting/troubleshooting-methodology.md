# Troubleshooting Methodology

> A structured, step-by-step process used to identify, isolate, and resolve network issues efficiently, preventing guesswork and minimizing downtime.

## Overview
Network troubleshooting is the process of diagnosing and resolving connectivity, performance, and configuration issues. Without a structured methodology, technicians often guess, make random changes that introduce new bugs, or waste hours looking at the wrong layer of the network stack.

A standardized, industry-accepted troubleshooting methodology (such as the CompTIA Network+ or Cisco CCNA process) ensures that issues are resolved systematically, safely, and with minimal impact on business operations.

## Why It Matters
When a critical enterprise network fails, every minute of downtime costs money, disrupts users, and impacts customer trust.
- **Efficiency:** A systematic approach isolates the root cause faster than guessing.
- **Safety:** Prevents engineers from making rash changes that degrade stability or expand a security incident.
- **Documentation:** Recording the issue, cause, and resolution prevents future occurrences and helps build a robust internal knowledge base.

## Core Concepts
The industry-standard troubleshooting methodology consists of the following steps:
1. **Identify the problem:** Gather information, identify symptoms, duplicate the issue if possible, and determine if anything has changed.
2. **Establish a theory of probable cause:** Question the obvious, consider multiple layers, and research symptoms.
3. **Test the theory to determine the cause:** If the theory is confirmed, plan the resolution. If not, establish a new theory or escalate.
4. **Establish a plan of action and implement the solution:** Determine the impact on users, schedule maintenance windows, and make changes.
5. **Verify full system functionality and implement preventive measures:** Ensure the user is satisfied, check other services, and configure safeguards.
6. **Document findings, actions, outcomes, and lessons learned:** Write down the solution in tickets or wiki pages.

## How It Works
Troubleshooting is heavily guided by the **OSI model**. Engineers choose a starting point to test:
- **Bottom-Up:** Start at Layer 1 (Physical links, cables) and move up to Layer 7. Good for hardware or raw connection issues.
- **Top-Down:** Start at Layer 7 (Application logic, web pages) and move down. Good for software or DNS issues.
- **Divide-and-Conquer:** Start in the middle (Layer 3 - Ping/routing). If Ping works, the problem is above Layer 3. If Ping fails, the problem is below Layer 3. This is highly efficient.

## Components / Types
- **Administrative Context:** Change control logs must be reviewed first. "What changed in the last 24 hours?" is the most common resolution shortcut.
- **User vs. System issues:** Determine if a problem affects one user (local PC), one department (switch/VLAN), or the whole company (WAN/Firewall).

## Practical Examples
- **Scenario:** A user reports they cannot access the intranet web portal.
  - *Identify:* Admin asks if anyone else has the issue (no) and if anything changed (user got a new docking station).
  - *Theory:* Docking station Ethernet cable is unplugged or disabled (Layer 1).
  - *Test:* Check link lights. They are off.
  - *Action:* Reseat the cable. Link lights turn green.
  - *Verify:* User can load the page.
  - *Document:* Documented in the helpdesk ticket that the docking station port was loose.

## Security Considerations
- **Incidents Disguised as Outages:** A sudden loss of network availability might not be an operational failure; it could be a DDoS attack or an attacker poisoning ARP tables.
- **Change Control:** Unauthorized modifications made during an "emergency fix" can create severe security vulnerabilities (e.g., leaving a temporary "allow any" firewall rule active).
- **Incident Preservation:** If a security breach is suspected, do *not* reboot the compromised device. This destroys ephemeral RAM evidence that incident responders need.

## Commands / Configuration Examples
Use a structured command set during the "Identify" phase:

### Linux
```bash
# Test Layer 3 reachability to local gateway
ping -c 4 192.168.1.1

# Trace the Layer 3 path to identify routing bottlenecks
traceroute 8.8.8.8

# View local routing table and interface configuration
ip route show
ip addr show
```

### Windows
```powershell
# View full IP configuration
ipconfig /all

# Verify DNS resolution
nslookup internal.corp.local
```

### Cisco IOS
```text
! View interface status to verify physical and data link layers
show interfaces status
show ip interface brief
```

## Troubleshooting
- **Isolate the scope:** If multiple users are down, don't waste time troubleshooting the desktop settings. Go directly to the shared switch or router.
- **Avoid "Scope Creep":** Stick to the current theory and test. Don't make multiple unrelated changes at the same time, or you won't know which one fixed the issue.
- **Escalate early:** If you reach the limit of your technical access or expertise, escalate to the senior team rather than guessing.

## Interview Questions
- Walk me through the steps of the troubleshooting methodology.
- Explain the difference between divide-and-conquer, bottom-up, and top-down troubleshooting.
- A user cannot reach `google.com` but can ping `8.8.8.8`. What layer of the OSI model is failing? (Answer: Layer 7 - DNS).
- Why is checking recent network changes the first step when troubleshooting a sudden outage?

## Summary
A structured troubleshooting methodology is the difference between a professional network engineer and a hobbyist. By systematically identifying problems, establishing theories, testing, implementing changes, verifying functionality, and documenting the results, outages are resolved quickly and permanently.

## References
- [OSI Model Overview](../02-osi-and-tcpip-models/osi-model-overview.md)
- [Ping](ping.md)
- [Traceroute](traceroute.md)
- [CompTIA Network+ Certification Standards](https://www.comptia.org/)
