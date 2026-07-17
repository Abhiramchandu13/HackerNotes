# Port Security

> Port Security is a Layer 2 switch feature that restricts input to an interface by limiting and identifying the MAC addresses allowed to access the port.

## Overview
By default, switch ports are trusting. If you plug a device into an active wall jack, the switch dynamically learns its MAC address and grants it network access. **Port Security** changes this behavior. It enforces a strict policy at the absolute edge of the network, dictating exactly *who* (by MAC address) and *how many* devices are allowed to connect to a specific physical port.

## Why It Matters
Physical security is often bypassed. Anyone can walk into a conference room, unplug a VoIP phone, and plug in a rogue laptop or unauthorized wireless access point. Port Security is the first line of defense against these rogue devices. Furthermore, it is the absolute best mitigation against devastating Layer 2 attacks like MAC Flooding and CAM table exhaustion.

## Core Concepts
- **Maximum MAC Addresses:** Defines the limit of unique MAC addresses allowed on the port simultaneously (usually set to 1 for a PC, or 2/3 for a PC daisy-chained through an IP Phone).
- **Secure MAC Addresses:** The specific addresses allowed. These can be configured statically (typed in by an admin) or learned dynamically (sticky).
- **Sticky MAC:** A feature where the switch dynamically learns the first MAC address it sees on the port, and then permanently "sticks" it into the running configuration as a secure address.
- **Violation Modes:** What the switch does when an unauthorized MAC tries to communicate.

## How It Works
1. An admin configures Port Security on `Gi1/0/5` with a maximum of 1 MAC address, using Sticky learning, and a violation mode of Shutdown.
2. An employee plugs in their corporate laptop (MAC `AA`). The switch learns `AA`, makes it sticky, and allows traffic. The max limit (1) is reached.
3. An attacker unplugs the laptop and plugs in a rogue device (MAC `BB`).
4. The rogue device sends a frame. The switch sees MAC `BB`, realizes it exceeds the maximum allowed MACs for that port, and immediately triggers a **Violation**.
5. The port transitions to an `ErrDisable` state (shut down), killing the attacker's connection instantly.

## Components / Types
Violation Modes (Cisco specific, but conceptually universal):
- **Protect:** Drops frames from unknown MACs, but leaves the port up. Does *not* generate a syslog alert.
- **Restrict:** Drops frames from unknown MACs, leaves the port up, and *does* generate a syslog alert/SNMP trap.
- **Shutdown (Default):** Drops the frame, completely shuts down the port (ErrDisable state), and generates an alert. Requires an admin to manually re-enable the port or an auto-recovery timer.

## Practical Examples
- **Preventing Hubs:** A user brings a cheap unmanaged 5-port hub from home, plugs it into their wall jack, and connects three PCs. Port security (set to max 1) instantly detects three different MAC addresses arriving on a single port and shuts the port down, preventing unauthorized network expansion.

## Security Considerations
- **MAC Flooding Defense:** Tools like `macof` flood a switch with thousands of fake MAC addresses per second to overflow the CAM table. With Port Security set to a max of 1, the very first fake MAC address triggers a violation and shuts down the port, neutralizing the attack in milliseconds.
- **MAC Spoofing Bypass:** Port Security only looks at MAC addresses. If an attacker unplugs a corporate printer, reads the MAC address printed on the back, and spoofs their laptop's MAC to match the printer, Port Security will happily allow the attacker onto the network. (This is why 802.1X is superior for identity).

## Commands / Configuration Examples
### Cisco IOS
```text
! Navigate to the user port
interface GigabitEthernet1/0/5
 ! Must be a static access port, cannot be dynamic
 switchport mode access
 
 ! Enable port security
 switchport port-security
 
 ! Set maximum allowed MACs to 2 (e.g., PC + Phone)
 switchport port-security maximum 2
 
 ! Tell the switch to learn the MACs dynamically and remember them
 switchport port-security mac-address sticky
 
 ! Set the violation mode (shutdown is default, this is explicitly setting restrict)
 switchport port-security violation restrict

! Verify the configuration and status
show port-security interface GigabitEthernet1/0/5
```

## Troubleshooting
- **ErrDisabled Ports:** If a user complains the network is down and the port has no lights, check `show interfaces status`. If it says `err-disabled`, Port Security likely tripped.
- **Recovery:** To fix an err-disabled port on Cisco, you must physically remove the rogue device, go to the CLI, issue a `shutdown` command on the interface, followed by a `no shutdown`.
- **Sticky Headaches:** If you replace a broken PC for a user, you must clear the old sticky MAC address from the switch configuration, or the new PC will trigger a violation.

## Interview Questions
- What is the primary purpose of switch Port Security?
- Explain the difference between the Protect, Restrict, and Shutdown violation modes.
- How does the "Sticky" MAC address feature work?
- Can Port Security prevent a MAC Spoofing attack? Why or why not?

## Summary
Port Security is a foundational, easy-to-implement Layer 2 security control. By hard-capping the number of physical addresses allowed on a port, it eliminates CAM table exhaustion attacks and prevents casual network abuse via rogue hubs or unauthorized devices. 

## References
- [MAC Addresses](mac-addresses.md)
- [CAM Table](cam-table.md)
- [Switch Operation](switch-operation.md)
- [NAC and 802.1X](../09-network-security/nac-and-8021x.md)
