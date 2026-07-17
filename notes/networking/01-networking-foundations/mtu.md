# MTU

> MTU is the largest packet or frame size a network link can carry without fragmentation.

## Overview
MTU stands for Maximum Transmission Unit. It defines how much data can fit into a single packet at the link layer before fragmentation may be required.

MTU issues are common in VPNs, tunnels, and complex enterprise networks.

## Why It Matters
If MTU is wrong, traffic may fail in confusing ways:
- Web pages partially load
- VPN connections break
- Large file transfers stall
- Some applications work while others fail

Security teams see MTU problems during tunneling, encrypted overlays, and cloud connectivity.

## Core Concepts
- MTU applies to the payload a link can carry
- Smaller MTU can reduce efficiency
- Larger MTU can improve throughput if the path supports it
- Path MTU discovery helps hosts avoid fragmentation

## How It Works
A sender chooses a packet size that fits the path.

If a packet is too large:
1. It may be fragmented.
2. It may be dropped if fragmentation is blocked.
3. It may trigger path MTU discovery behavior.

Common Ethernet MTU is 1500 bytes, but many environments use different values for tunnels or jumbo frames.

## Components / Types
- Standard MTU
- Jumbo frame MTU
- Path MTU
- Tunnel MTU

## Practical Examples
- A site-to-site VPN may need a smaller MTU because of encryption overhead.
- A data center with jumbo frames may use an MTU above 1500 bytes.
- A cloud overlay network may require careful MTU tuning.

## Security Considerations
- Fragmentation can complicate inspection and filtering.
- Tunnel overhead can create unexpected MTU black holes.
- Attackers may abuse fragmentation to evade some security tools.
- Monitoring should include tunnel interfaces and overlays.

## Commands / Configuration Examples
### Linux
```bash
ping -M do -s 1472 8.8.8.8
ip link show
```

### Windows
```powershell
ping -f -l 1472 8.8.8.8
```

### Cisco IOS
```text
show interface
show running-config interface tunnel0
```

## Troubleshooting
- Does ping with DF set fail?
- Is the tunnel reducing effective MTU?
- Are ICMP fragmentation-needed messages being blocked?
- Is the path using jumbo frames consistently?

## Interview Questions
- What is MTU?
- Why does MTU matter in VPNs?
- What is path MTU discovery?
- How does fragmentation affect performance and security?

## Summary
MTU controls the size of data that can travel over a link without fragmentation. Correct MTU tuning is essential for reliable routing and tunneling.

## References
- [MSS](mss.md)
- [Packet Loss](packet-loss.md)
- [VPNs](../09-network-security/vpns.md)
- [IPv6 Transition Mechanisms](../04-ip-addressing/ipv6-transition-mechanisms.md)
