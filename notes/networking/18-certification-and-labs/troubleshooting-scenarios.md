# Troubleshooting Scenarios

> Troubleshooting scenarios provide practical, real-world problems that test a network professional's ability to apply diagnostic methodologies and command-line tools to identify and resolve network issues.

## Overview
Reading about networking is one thing; actually fixing a broken network is another. **Troubleshooting Scenarios** are case studies that simulate common network problems. They force you to think critically, apply a structured methodology, and utilize diagnostic commands to pinpoint the root cause of an outage or performance degradation.

Practicing these scenarios is the single best way to prepare for network certification exams, technical interviews, and real-world incidents.

## Why It Matters
Technical skills are measured by your ability to solve problems. In an interview, a hiring manager doesn't just want to know if you can *define* OSPF; they want to know if you can *fix* an OSPF adjacency that is stuck in the `EXSTART` state. Troubleshooting scenarios build the practical muscle memory and layered diagnostic thinking required to rapidly restore network services when they fail.

## Core Concepts
Every troubleshooting scenario should follow a methodology:
1.  **Identify the Problem:** What are the symptoms? Who is affected? When did it start? (Gather information).
2.  **Establish a Theory of Probable Cause:** Based on the symptoms, hypothesize what might be wrong. (e.g., "This sounds like a DNS issue").
3.  **Test the Theory:** Use specific commands to prove or disprove your theory. (e.g., `dig google.com` and `ping 8.8.8.8`).
4.  **Establish a Plan of Action:** How will you fix it? (e.g., "Add a missing static route").
5.  **Implement the Solution:** Execute the plan carefully.
6.  **Verify Functionality:** Ensure the fix worked and didn't break anything else.
7.  **Document:** Record the problem, solution, and preventative measures.

## How It Works
Scenarios typically start with a problem description (e.g., "Users in the Sales VLAN cannot reach the Internet"). You then work through the troubleshooting steps using the tools and commands you have learned.

### Example Problem Statement
"Users on VLAN 20 (`192.168.20.0/24`) cannot access websites, but they can ping other devices in VLAN 20."

### Your Troubleshooting Process
1.  **Identify Problem:** Users in VLAN 20 cannot reach the Internet. Local VLAN 20 connectivity is okay. This implies a problem outside the local subnet.
2.  **Theory:** Default gateway issue, routing issue, or firewall blocking.
3.  **Test Theory:**
    -   `ipconfig /all` or `ip a`: Verify correct IP, subnet, and **Default Gateway** (`192.168.20.1`). (User has it).
    -   `ping 192.168.20.1`: Ping the default gateway. (Success).
    -   `ping 8.8.8.8`: Ping a public internet IP. (Fail).
    -   `tracert 8.8.8.8`: Trace to internet. (Times out at the default gateway).
    -   *Conclusion:* The issue is at the default gateway router or beyond.
4.  **Refine Theory:** Router has no route to the Internet, or a firewall on the router is blocking it.
5.  **Test Theory (on Router):**
    -   `show ip interface brief`: Verify interface `Vlan20` is up and has `192.168.20.1`.
    -   `show ip route`: Check if there is a `0.0.0.0/0` default route pointing to the ISP. (Missing!).
    -   *Conclusion:* The router has no path to the Internet.
6.  **Plan:** Add a default static route to the router.
7.  **Implement:** `ip route 0.0.0.0 0.0.0.0 <ISP_Next_Hop_IP>`.
8.  **Verify:** Users in VLAN 20 can now reach the Internet.
9.  **Document:** Update network diagram, log change.

## Components / Types
Scenarios can cover various network domains:
-   **Routing Issues:** Missing routes, routing loops, OSPF/BGP adjacencies.
-   **Switching Issues:** VLAN mismatches, STP loops, Port Security violations.
-   **IP Addressing:** DHCP failures, IP conflicts, subnet mask errors.
-   **DNS Issues:** Name resolution failures, incorrect DNS servers.
-   **Firewall/ACL Issues:** Blocked ports, misconfigured rules.
-   **Wireless Issues:** Signal interference, authentication failures, roaming problems.
-   **Performance Issues:** Latency, jitter, packet loss.

## Practical Examples (Briefs)
-   **Scenario 1: Web Server Unreachable:** Ping works, but `curl` returns a 500 error. (Likely application/Layer 7).
-   **Scenario 2: Slow Internet in Branch Office:** `ping` to Google shows high latency, `traceroute` shows delay at ISP hop. (Likely WAN link congestion/ISP issue).
-   **Scenario 3: VoIP Calls are Choppy:** `ping` shows no loss, but `mtr` shows high jitter. (Likely QoS misconfiguration or bandwidth saturation).
-   **Scenario 4: Cannot SSH into new Linux VM:** VM has IP, but connection times out. (Likely host firewall or SSH daemon not running).

## Security Considerations
-   **Compromise vs. Configuration Error:** Sometimes a "network problem" is actually an attacker performing an ARP spoofing attack or a DNS hijacking. Troubleshooting should always consider security implications.
-   **Access Control:** Ensure you have appropriate access and credentials to troubleshoot devices (e.g., SSH access to routers, Administrator on servers).
-   **Change Management:** Never make unauthorized or undocumented changes in a production environment, even during an emergency.

## Commands / Configuration Examples
See [Common Commands](common-commands.md) and specific protocol notes for detailed command examples.

## Troubleshooting
-   **Don't Jump to Conclusions:** Gather all facts before hypothesizing.
-   **Start at a Logical Point:** Don't check the web server logs if `ping` to the default gateway is failing.
-   **Check the Obvious First:** Is the cable plugged in? Is the device powered on? Is the interface `up`?
-   **Isolate:** Break the problem down. Is it one user, one application, one server, one subnet, one site, or everyone?

## Interview Questions
-   Walk me through your troubleshooting process for a user who reports "the Internet is down."
-   Describe a difficult network troubleshooting problem you have solved in the past. What was the problem, how did you diagnose it, and what was the solution?
-   A user can ping an external IP address but cannot reach `google.com`. What is the most likely cause, and how would you verify it?
-   You have two routers that should be forming an OSPF adjacency, but they are stuck in the `EXSTART` state. What are three common causes?

## Summary
Troubleshooting scenarios are the ultimate test of a network professional's skills. By methodically applying diagnostic tools and a layered approach, engineers can efficiently navigate complex network failures, restoring services and minimizing business impact. Practice is key to mastery.

## References
- [Troubleshooting Methodology](../10-monitoring-and-troubleshooting/troubleshooting-methodology.md)
- [Common Commands](common-commands.md)
- [OSI Model Overview](../02-osi-and-tcpip-models/osi-model-overview.md)
- [Ping](../10-monitoring-and-troubleshooting/ping.md)
- [Traceroute](../10-monitoring-and-troubleshooting/traceroute.md)
