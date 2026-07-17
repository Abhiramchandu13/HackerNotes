# NetFlow and IPFIX

> NetFlow and IPFIX are flow-monitoring technologies that summarize conversations between hosts, providing visibility into who talked to whom, on which ports, for how long, and how much data was transferred.

## Overview
Packet capture is precise but heavy. Capturing every packet on a busy core link is expensive and difficult to store long-term. **NetFlow** and **IPFIX** solve this by recording *metadata* about traffic flows instead of storing every packet.

A flow record typically includes source IP, destination IP, source port, destination port, protocol, byte count, packet count, and timestamps.

## Why It Matters
Flow data is one of the most valuable sources for network visibility and threat hunting. It tells you:
- Which hosts generate the most traffic
- Which destinations are being contacted
- Whether unusual east-west movement is occurring
- If a server suddenly starts beaconing externally

It is a key middle ground between simple interface counters and full packet capture.

## Core Concepts
- **Flow:** A conversation identified by fields like source IP, destination IP, ports, and protocol.
- **Exporter:** The router, switch, or firewall that observes traffic and generates flow records.
- **Collector:** The system that receives and stores the records.
- **Analyzer:** The system or dashboard used to query and visualize the collected flow data.

## How It Works
1. A router sees packets flowing between a client and a server.
2. Instead of saving the packets, it groups them into a flow record.
3. The router exports the summary to a collector.
4. The collector stores the records for dashboards, reporting, and security hunting.

## Components / Types
- **NetFlow v5:** Older Cisco export format.
- **NetFlow v9:** Template-based and more flexible.
- **IPFIX:** The IETF standardized evolution of NetFlow v9.
- **sFlow:** Similar concept, but often uses packet sampling rather than full flow accounting.

## Practical Examples
- A SOC analyst identifies a workstation sending 50 MB to an unusual external IP every 10 minutes.
- An engineer uses flow data to prove that a WAN circuit is saturated by backups, not by user browsing.
- A cloud security team tracks east-west traffic between subnets to detect lateral movement.

## Security Considerations
- **Threat Hunting:** Flow data is excellent for detecting scans, beacons, and exfiltration.
- **Privacy:** Flow records expose metadata about communication patterns, which may be sensitive.
- **Evasion:** Attackers may use common ports (443, 53) to blend in. Flow visibility still helps by revealing unusual frequency or volume.
- **No Payload:** Flow data does not show the actual content, so it cannot replace packet capture.

## Commands / Configuration Examples
### Cisco IOS NetFlow Example
```text
flow record BASIC-RECORD
 match ipv4 source address
 match ipv4 destination address
 match transport source-port
 match transport destination-port
 match ipv4 protocol
 collect counter bytes
 collect counter packets
 collect timestamp sys-uptime first
 collect timestamp sys-uptime last

flow exporter FLOW-COLLECTOR
 destination 10.0.0.50
 transport udp 2055

flow monitor BASIC-MONITOR
 record BASIC-RECORD
 exporter FLOW-COLLECTOR

interface GigabitEthernet0/1
 ip flow monitor BASIC-MONITOR input
 ip flow monitor BASIC-MONITOR output
```

### Linux
Linux flow export is usually done via routers/firewalls or specialized software collectors/analyzers.

## Troubleshooting
- **No Flow Records Arriving:** Check exporter IP, collector IP, export UDP port, and ACL/firewall rules.
- **Incomplete Visibility:** Not all platforms export the same fields. Verify templates and collector support.
- **Clock Problems:** Unsynchronized device clocks make flow timing difficult to analyze. Use NTP.

## Interview Questions
- What is the difference between packet capture and flow monitoring?
- What kind of security questions can NetFlow answer?
- Why is IPFIX preferred over older proprietary flow formats?
- Can NetFlow show the actual HTTP request body? (Answer: No, only flow metadata).

## Summary
NetFlow and IPFIX provide scalable, high-value visibility into traffic behavior without the storage cost of packet capture. They are essential for operations, capacity planning, and security investigations.

## References
- [Network Monitoring](network-monitoring.md)
- [Packet Capture](packet-capture.md)
- [Packet Analysis](packet-analysis.md)
- [Syslog](../06-network-protocols/syslog.md)
