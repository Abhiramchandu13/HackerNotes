# MSS

> MSS is the largest segment of TCP payload data that can be sent without fragmentation.

## Overview
MSS stands for Maximum Segment Size. It is a TCP setting that helps endpoints avoid sending packets that are too large for the network path.

MSS is closely related to MTU but is not the same thing.

## Why It Matters
Incorrect MSS values can cause:
- TCP connections to stall
- Slow or broken HTTPS sessions
- VPN and tunnel issues
- Web applications that fail only for some users

This is a common issue in enterprise VPN, firewall, and cloud environments.

## Core Concepts
- MTU is a link-layer size limit
- MSS is a TCP payload limit
- MSS is typically smaller than MTU because headers are included
- MSS clamping may be used on routers or firewalls

## How It Works
When a TCP session is established, the endpoints exchange MSS values during the handshake.

A network device may adjust MSS on the fly so that packets fit through a tunnel or path with smaller MTU.

If MSS is too high, packets may be fragmented or dropped.

## Components / Types
- TCP segment
- TCP handshake
- MSS clamping
- Tunnel-adjusted MSS

## Practical Examples
- A VPN gateway reduces MSS to account for tunnel overhead.
- A firewall modifies TCP MSS so traffic survives a lower MTU path.
- A cloud overlay network uses MSS tuning to avoid packet drops.

## Security Considerations
- MSS manipulation can be used to improve tunnel reliability.
- Incorrect clamping can break connections and obscure troubleshooting.
- Attackers may abuse fragmentation edge cases when MTU and MSS are mismatched.

## Commands / Configuration Examples
### Linux
```bash
ping -M do -s 1472 8.8.8.8
iptables -t mangle -L
```

### Windows
```powershell
netsh interface ipv4 show subinterfaces
```

### Cisco IOS
```text
show policy-map interface
show running-config | include tcp adjust-mss
```

## Troubleshooting
- Is the VPN or tunnel changing the effective packet size?
- Is MSS clamping enabled on the correct device?
- Do only some sites or applications fail?
- Are large TCP packets being dropped silently?

## Interview Questions
- What is MSS?
- How is MSS different from MTU?
- Why do VPNs often require MSS adjustment?
- What is MSS clamping?

## Summary
MSS is a TCP safeguard that helps data fit within the path’s MTU. Understanding MSS is essential for troubleshooting VPN and tunnel-related connectivity issues.

## References
- [MTU](mtu.md)
- [TCP](../06-network-protocols/tcp.md)
- [VPNs](../09-network-security/vpns.md)
- [Packet Loss](packet-loss.md)
