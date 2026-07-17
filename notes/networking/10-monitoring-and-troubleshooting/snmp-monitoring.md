# SNMP Monitoring

> SNMP Monitoring uses the Simple Network Management Protocol to collect status, counters, and health metrics from network devices in a centralized management system.

## Overview
Routers, switches, firewalls, printers, UPS systems, and APs all know a lot about themselves: interface errors, CPU load, memory usage, fan failures, power supply alerts, and uptime. **Simple Network Management Protocol (SNMP)** provides a standard way for monitoring software to read this information remotely.

SNMP is one of the oldest and most widely used management protocols in networking.

## Why It Matters
For operations teams, SNMP makes network observability possible at scale. A monitoring platform can poll 1,000 switches every minute and alert when interface errors spike or a power supply fails. Without SNMP, engineers would have to SSH into devices one by one.

## Core Concepts
- **Manager:** The monitoring server that asks questions.
- **Agent:** The software running on the device that answers them.
- **OIDs (Object Identifiers):** The hierarchical numeric addresses of monitored values inside the device MIB.
- **MIB (Management Information Base):** The database schema describing what values the device can expose.
- **Polling vs Traps:** 
  - *Polling:* The manager asks the device for values at intervals.
  - *Traps:* The device sends an unsolicited alert when an event occurs.

## How It Works
1. A monitoring platform sends an SNMP query to a switch.
2. The SNMP agent on the switch checks the requested OID.
3. The switch returns the value (e.g., interface input errors or CPU usage).
4. The monitoring platform stores the metric and compares it against thresholds.
5. If the value exceeds a threshold, it triggers an alert.

## Components / Types
- **SNMPv1:** Legacy, insecure, community-string based.
- **SNMPv2c:** Improved performance and 64-bit counters, but still insecure.
- **SNMPv3:** Adds authentication and encryption. This is the modern recommended version.
- **Get / GetNext / Walk:** Query operations for retrieving metrics.
- **Trap / Inform:** Alerting operations.

## Practical Examples
- Monitoring all interface utilization on core switches every 60 seconds.
- Alerting when a WAN interface shows CRC errors.
- Tracking temperature, fan state, and power supply health on a chassis switch.
- Monitoring wireless controller AP counts and client totals.

## Security Considerations
- **Community Strings:** SNMPv1/v2c use shared strings like passwords. If exposed, attackers can query network devices for topology details.
- **Default Strings:** `public` and `private` are famous defaults and should never be used.
- **SNMP Enumeration:** Attackers use SNMP to dump interface tables, routing tables, ARP entries, and software versions.
- **Defense:** Use SNMPv3 with authPriv, restrict source IPs, and disable write access unless absolutely necessary.

## Commands / Configuration Examples
### Linux (snmpwalk)
```bash
# Read system details from a device using SNMPv2c
snmpwalk -v2c -c public 10.0.0.1 1.3.6.1.2.1.1
```

### Cisco IOS
```text
! Legacy SNMPv2c (not recommended for new deployments)
snmp-server community SECURESTRING RO 10

! SNMPv3 (recommended)
snmp-server group NMS v3 priv
snmp-server user monitor NMS v3 auth sha AuthPass123 priv aes 128 PrivPass123

! Send traps to a monitoring server
snmp-server host 10.0.0.50 version 3 priv monitor
```

### Windows
```powershell
# Windows uses SNMP service only on older/legacy installs.
# Verification usually happens from the NMS side or with vendor tools.
Get-Service SNMP
```

## Troubleshooting
- **No Response:** Check ACLs/firewall rules, wrong community strings, or SNMP disabled on the device.
- **Wrong Metrics:** Ensure you are using the correct OID and that the monitoring platform understands the device MIB.
- **Counter Wrap:** Older 32-bit counters can overflow quickly on high-speed links. Prefer 64-bit counters.

## Interview Questions
- What is the difference between SNMP polling and SNMP traps?
- Why is SNMPv3 preferred over SNMPv2c?
- What is an OID?
- Why is SNMP a security risk if exposed to untrusted networks?

## Summary
SNMP Monitoring is one of the foundational building blocks of network observability. When properly secured and integrated, it provides the health and performance data needed to operate large networks efficiently.

## References
- [SNMP](../06-network-protocols/snmp.md)
- [Network Monitoring](network-monitoring.md)
- [Syslog](../06-network-protocols/syslog.md)
- [Troubleshooting Methodology](troubleshooting-methodology.md)
