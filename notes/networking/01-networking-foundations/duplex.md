# Duplex

> Duplex describes whether a network link can send and receive data at the same time.

## Overview
Duplex is a communication mode. It determines whether a device can transmit and receive simultaneously or only one direction at a time.

Most modern Ethernet links use full duplex, which is faster and avoids collisions.

## Why It Matters
Duplex mismatches can cause:
- Slow network performance
- Late collisions or errors
- Unstable links
- Poor application behavior

Duplex issues are common when legacy equipment is connected to modern switches or when auto-negotiation fails.

## Core Concepts
- Half duplex: send or receive, but not both at the same time
- Full duplex: send and receive simultaneously
- Auto-negotiation: devices agree on speed and duplex automatically
- Duplex mismatch: one side thinks one setting and the other side thinks another

## How It Works
In half duplex, devices must share the medium and avoid transmitting at the same time.

In full duplex, each side has separate transmit and receive paths, which eliminates collisions on switched Ethernet.

## Components / Types
- Half duplex
- Full duplex
- Auto-negotiated duplex
- Forced duplex

## Practical Examples
- Old hubs operated in half duplex.
- Modern switches typically operate at full duplex.
- A misconfigured NIC may force half duplex on one side and full duplex on the other.

## Security Considerations
- Duplex problems can mimic congestion or attack symptoms.
- Attackers may exploit weak or outdated infrastructure where half duplex still exists.
- Full duplex on switched networks reduces collision-related noise and improves predictability.

## Commands / Configuration Examples
### Linux
```bash
ethtool eth0
```

### Windows
```powershell
Get-NetAdapterAdvancedProperty
```

### Cisco IOS
```text
show interfaces status
show interfaces gigabitEthernet0/1
```

## Troubleshooting
- Are both sides set to auto-negotiation?
- Is one side forced and the other automatic?
- Are there collisions, errors, or late collisions?
- Does the link speed match expectations?

## Interview Questions
- What is duplex in networking?
- Why is full duplex preferred?
- What happens when duplex mismatches occur?
- How do you detect a duplex problem?

## Summary
Duplex defines whether a link can send and receive simultaneously. Full duplex is the standard for modern switched Ethernet.

## References
- [Switch Operation](../03-ethernet-and-switching/switch-operation.md)
- [CSMA/CD](../03-ethernet-and-switching/csma-cd.md)
- [Ethernet](../03-ethernet-and-switching/ethernet.md)
