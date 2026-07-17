# Network Monitoring

> Network Monitoring is the continuous observation of device health, bandwidth use, traffic flows, errors, and service availability to detect problems before users report them.

## Overview
Troubleshooting is reactive: something broke, and you fix it. **Network Monitoring** is proactive: it continuously watches the environment so you can detect performance degradation, security anomalies, and failing hardware before they become outages.

Enterprise monitoring platforms pull metrics from routers, switches, firewalls, servers, and applications, consolidating everything into dashboards, alerts, and trend reports.

## Why It Matters
Without monitoring, organizations operate blind. They only discover problems after users complain. Monitoring allows teams to:
- Detect failures instantly
- Track long-term bandwidth growth
- Spot packet loss and interface errors
- Monitor VPN and WAN health
- Identify unusual activity that may indicate compromise

## Core Concepts
- **Availability Monitoring:** Is the service up or down?
- **Performance Monitoring:** How fast is it running?
- **Capacity Monitoring:** How close are we to running out of resources?
- **Event Monitoring:** What changed or failed?
- **Security Monitoring:** Are there suspicious flows, denied connections, or rogue devices?

## How It Works
Monitoring systems collect data using multiple methods:
1. **Polling:** Query devices at intervals using protocols like SNMP.
2. **Flow Export:** Collect NetFlow/IPFIX flow summaries.
3. **Log Ingestion:** Centralize Syslog and Windows Event data.
4. **Synthetic Probes:** Run periodic pings, HTTP checks, or DNS checks.
5. **Packet Capture:** Record traffic for forensic deep dives.

## Components / Types
Common monitoring categories include:
- Interface monitoring
- CPU and memory monitoring
- Bandwidth and flow monitoring
- Wireless client and AP monitoring
- Firewall session monitoring
- Certificate expiration monitoring
- Availability and SLA dashboards

## Practical Examples
- **WAN Saturation:** A branch office reports slow cloud access every day at 2 PM. Monitoring shows a backup job saturates the WAN link during that time.
- **Rogue Device Detection:** A switch suddenly learns dozens of MAC addresses on a single user port. Monitoring alerts the team, who discover someone plugged in an unauthorized mini-switch.
- **ISP Outage Detection:** Synthetic probes to public IPs fail from all branches simultaneously, confirming an upstream provider outage.

## Security Considerations
- **Detection of Malicious Traffic:** Monitoring can reveal unusual destinations, traffic spikes, or denied firewall flows.
- **Visibility Gaps:** If monitoring only covers north-south traffic, attackers may move laterally without detection.
- **Credential Security:** Monitoring platforms often use SNMP, SSH, API tokens, or domain service accounts. These credentials are highly sensitive.

## Commands / Configuration Examples
### Cisco IOS
```text
# Basic interface health checks
show interfaces
show interfaces counters errors
show processes cpu
```

### Linux
```bash
# Basic host network monitoring
ip -s link
ss -s
sar -n DEV 1 5
```

### Windows
```powershell
Get-NetAdapterStatistics
Get-Counter '\Network Interface(*)\Bytes Total/sec'
```

## Troubleshooting
- **Alert Noise:** Too many low-value alerts train engineers to ignore the system. Thresholds and severities must be tuned.
- **Polling Gaps:** Polling every 5 minutes may miss brief outages or spikes.
- **Clock Drift:** Logs and metrics are difficult to correlate if devices are not synchronized with NTP.

## Interview Questions
- What is the difference between monitoring and troubleshooting?
- Why is NetFlow not a replacement for packet capture?
- What should you monitor on a core switch interface?
- Why is NTP important for network monitoring systems?

## Summary
Network monitoring gives engineers and security teams continuous visibility into device health, performance, and anomalies. It is the foundation of reliable operations and early threat detection.

## References
- [SNMP Monitoring](snmp-monitoring.md)
- [NetFlow and IPFIX](netflow-and-ipfix.md)
- [Syslog](../06-network-protocols/syslog.md)
- [NTP](../06-network-protocols/ntp.md)
- [Troubleshooting Methodology](troubleshooting-methodology.md)
