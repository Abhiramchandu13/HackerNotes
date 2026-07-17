# Throughput

> Throughput is the amount of data actually delivered successfully over a network in a given time.

## Overview
Throughput is the real-world performance you get from a connection. It is almost always lower than theoretical bandwidth because of overhead, congestion, retransmissions, and processing delays.

## Why It Matters
Throughput tells you what users really experience.

Examples:
- A file copy can be slow even when the link is rated at 1 Gbps
- A VPN may cut effective throughput due to encryption overhead
- A busy Wi-Fi network can deliver far less throughput than the advertised radio rate

For security teams, throughput helps size log pipelines, backup systems, and monitoring tools.

## Core Concepts
- Bandwidth = capacity
- Throughput = actual successful data delivery
- Goodput = useful application data after overhead is removed
- Overhead lowers throughput
- Retransmissions lower throughput

## How It Works
Throughput is affected by:
1. Link speed
2. Protocol overhead
3. Packet size
4. Congestion
5. Loss and retransmissions
6. CPU and storage performance
7. Wireless signal quality

The same network can show different throughput depending on time of day, client count, or route selection.

## Components / Types
- TCP throughput
- UDP throughput
- Application throughput
- Disk-to-disk transfer throughput
- Wireless throughput

## Practical Examples
- A backup over SMB might only achieve 200 Mbps on a 1 Gbps link.
- A web server may have high bandwidth but low throughput if the app is slow.
- A remote desktop session can feel sluggish if throughput is constrained.

## Security Considerations
- Malware or exfiltration tools may try to maximize throughput.
- DDoS attacks can consume available throughput.
- Monitoring throughput spikes can reveal unusual activity.
- Encryption and inspection can alter throughput characteristics.

## Commands / Configuration Examples
### Linux
```bash
iperf3 -c 192.0.2.10
iftop
```

### Windows
```powershell
Test-NetConnection 192.0.2.10 -Port 445
```

### Cisco IOS
```text
show interfaces counters errors
show policy-map interface
```

## Troubleshooting
- Is throughput much lower than bandwidth?
- Are there retransmissions or packet loss?
- Is a device overloaded?
- Is the bottleneck on the sender, receiver, or network?

## Interview Questions
- What is throughput?
- How is throughput different from bandwidth?
- What is goodput?
- Why is throughput important for VPNs and backups?

## Summary
Throughput is what matters in practice. It reflects the actual useful data rate your applications receive.

## References
- [Bandwidth](bandwidth.md)
- [Packet Loss](packet-loss.md)
- [Latency](latency.md)
