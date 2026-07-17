# EDR Integration

> EDR Integration involves connecting Endpoint Detection and Response tools with network security infrastructure to provide a unified, automated response to cyber threats across both hosts and the network.

## Overview
Historically, network security (firewalls, IPS) and endpoint security (antivirus, host firewalls) were separate silos. The firewall didn't know if a laptop was infected, and the laptop didn't know if the firewall was blocking its traffic. 

**Endpoint Detection and Response (EDR)** tools (like CrowdStrike, SentinelOne, or Microsoft Defender for Endpoint) monitor the internal processes and behaviors of the individual computers. **EDR Integration** bridges these silos, allowing the network infrastructure to directly query the EDR agent for health status, and allowing the EDR platform to command the network switches and firewalls to quarantine infected machines dynamically.

## Why It Matters
In a Zero Trust architecture, identity and device health are everything. If an employee clicks a malicious link and their laptop is compromised, the EDR tool detects the malware. Without integration, that laptop remains connected to the corporate LAN. With integration, the EDR tool instantly signals the network access control system (like Cisco ISE) to shut down the physical switch port, containing the threat in milliseconds before it can move laterally.

## Core Concepts
- **Telemetry Sharing:** The EDR agent continuously feeds data (running processes, network connections made by specific applications) into a central SIEM or network controller.
- **Automated Quarantine:** The ability of the security ecosystem to automatically isolate a host from the network without human intervention.
- **Micro-segmentation Sync:** Network hypervisors (like VMware NSX) rely on EDR tags. If an EDR agent tags a VM as "Compromised," the hypervisor instantly applies a micro-segmentation firewall rule dropping all traffic to and from that VM.
- **Zero Trust Posture Checking:** Before a VPN or ZTNA gateway allows a connection, it queries the EDR platform to verify the endpoint is clean, patched, and running the latest signatures.

## How It Works (The Automated Quarantine Workflow)
1. An employee downloads a zero-day ransomware payload hidden in a PDF.
2. The network IPS misses it because the download occurred over an encrypted HTTPS connection.
3. The PDF executes on the laptop. The **EDR Agent** (e.g., CrowdStrike) detects the ransomware attempting to encrypt files.
4. The EDR Agent instantly blocks the process locally and sends a critical alert to the central EDR Cloud Console.
5. **The Integration:** The EDR Cloud Console triggers a webhook (API call) to the corporate **Network Access Control (NAC)** server (e.g., Cisco ISE).
6. The NAC server looks up the MAC address of the infected laptop, finds that it is plugged into Switch 5, Port 12.
7. The NAC server sends a RADIUS Change of Authorization (CoA) command to the switch.
8. The switch immediately drops the port from the "Corporate VLAN" into the isolated "Quarantine VLAN." The ransomware cannot spread laterally to the servers.

## Components / Types
- **API (Application Programming Interface):** The primary method by which EDR tools and network controllers (firewalls, NACs, SD-WAN orchestrators) exchange intelligence and commands.
- **XDR (Extended Detection and Response):** The evolution of EDR. XDR is an overarching platform that natively ingests logs from EDR, firewalls, email gateways, and cloud infrastructure, correlating them into a single timeline and executing automated responses across all systems simultaneously.

## Practical Examples
- **Palo Alto & Cortex XDR:** A Palo Alto firewall detects an employee attempting to connect to a known Command & Control (C2) IP address. The firewall blocks the connection and sends the log to the XDR platform. The XDR platform queries the EDR agent on the employee's laptop to identify exactly *which* background process initiated the connection, discovers a hidden trojan, and automatically terminates the process.

## Security Considerations
- **The "God Mode" Risk:** EDR integration gives automated systems the power to disconnect servers and users. A false positive or a misconfigured automation rule can result in a self-inflicted Denial of Service, bringing down critical business systems automatically.
- **API Authentication:** The API keys used to connect the EDR platform to the firewall or NAC system are incredibly sensitive. If an attacker steals these keys, they could theoretically issue API commands to un-quarantine systems or disable network defenses.
- **Agent Bypass:** Advanced malware often attempts to silently disable or blind the EDR agent on the host machine. Network-level monitoring (like NetFlow or IPS) is still mandatory to detect threats if the endpoint agent fails.

## Commands / Configuration Examples
EDR integration is heavily reliant on REST APIs and webhooks, often configured via GUIs or Python automation scripts, rather than traditional networking CLI commands.

### Conceptual Python Script (EDR to Firewall Automation)
```python
import requests

# Simulated script where an EDR webhook triggers a firewall block
def quarantine_ip(infected_ip):
    firewall_api_url = "https://firewall.corp.local/api/v1/address-objects"
    headers = {"Authorization": "Bearer SECREt_API_KEY"}
    
    # Create an address object for the infected IP
    payload = {
        "name": "Quarantined_Host",
        "value": infected_ip,
        "description": "Auto-quarantined by EDR"
    }
    
    # POST to the firewall API to add the IP to a pre-configured 'Block' group
    response = requests.post(firewall_api_url, json=payload, headers=headers)
    if response.status_code == 200:
        print(f"Successfully quarantined {infected_ip} at the firewall level.")
```

## Troubleshooting
- **API Rate Limiting:** During a massive malware outbreak, an EDR tool might try to send 5,000 API requests to the firewall to block IPs. The firewall's management plane may rate-limit or crash under the API load, causing the automation to fail.
- **VLAN Assignment Failures:** If the NAC server attempts to push an infected machine to the Quarantine VLAN, but the switch port is statically hardcoded or the Quarantine VLAN does not exist on that edge switch, the port will simply error out, potentially dropping the connection but breaking remediation workflows.

## Interview Questions
- What is the difference between EDR (Endpoint Detection and Response) and a traditional Network IPS?
- Explain how a Zero Trust architecture relies on EDR integration.
- What is XDR (Extended Detection and Response)?
- What is the primary operational risk of configuring automated network quarantines based on EDR alerts? (Answer: False positives leading to self-inflicted business outages).

## Summary
EDR Integration represents the breakdown of traditional security silos. By linking deep, process-level endpoint visibility with the broad enforcement capabilities of network switches and firewalls, organizations can achieve automated, split-second threat containment that is impossible with isolated systems.

## References
- [Zero Trust](zero-trust.md)
- [NAC and 802.1X](nac-and-8021x.md)
- [Next-Gen Firewalls](../07-network-devices/next-gen-firewalls.md)
- [SOAR Principles](soar-principles.md)
