# arp Command

> The arp command is a legacy command-line utility used to view and modify a host computer's Address Resolution Protocol (ARP) cache.

## Overview
When a computer wants to send data on a local network, it needs a MAC address. It uses the ARP protocol to discover it, saving the result in a temporary memory bank called the ARP Cache. The **arp** command is the tool used to read, manipulate, or delete entries in that cache.

Like `ifconfig` and `netstat`, the `arp` command is considered legacy on Linux (replaced by the `ip neigh` command). However, it remains natively supported and heavily used in Windows environments.

## Why It Matters
For network troubleshooting, the ARP table is the ultimate proof of Layer 2 connectivity. If you can ping an IP but can't reach it, the ARP table proves whether your computer even knows the target's physical MAC address. For cybersecurity, analyzing the ARP cache is critical for detecting local Man-in-the-Middle (MitM) attacks like ARP Poisoning.

## Core Concepts
- **Dynamic Entries:** IP-to-MAC mappings learned automatically by the network. They time out after a few minutes of inactivity.
- **Static Entries:** Mappings manually entered by an administrator. They never time out and override dynamic learning.
- **Cache Flushing:** Deleting the entire ARP table, forcing the computer to re-broadcast ARP requests to discover fresh MAC addresses.

## How It Works
1. You run `arp -a` in Windows.
2. The utility queries the OS networking stack.
3. It prints a table showing:
   - Interface IP Address
   - Physical Address (MAC)
   - Type (Dynamic or Static)

## Components / Types
Important command line flags (universal across Windows and legacy Linux):
- `-a`: Displays current ARP entries by interrogating the current protocol data.
- `-d`: Deletes the host specified by the Internet Address. You can use a wildcard `*` to delete all entries.
- `-s`: Adds a host and associates the Internet Address with the Physical Address (Static entry).

## Practical Examples
- **Troubleshooting an IP Conflict:** Two devices are accidentally assigned IP `192.168.1.50`. You run `arp -a`. You see `192.168.1.50` pointing to MAC `AA:AA`. A minute later, you run it again and see the same IP pointing to MAC `BB:BB`. The ARP table is "flapping," proving an IP conflict exists.
- **Detecting ARP Poisoning:** An analyst runs `arp -a` and sees two different IP addresses (the default gateway `10.0.0.1` and a coworker's PC `10.0.0.55`) associated with the exact same MAC address. This instantly proves the coworker's PC is executing an ARP Spoofing attack, claiming to be the router.

## Security Considerations
- **Static ARP Defense:** In highly secure, static environments (like Industrial Control Systems), administrators can use `arp -s` to statically hardcode the default gateway's MAC address into critical servers. This completely immunizes the server against ARP Spoofing attacks, because the server will ignore fake dynamic ARP replies.
- **Reconnaissance:** Pentesters dump the ARP cache of a compromised machine to instantly see exactly which other local hosts the machine has recently talked to, building a map of the internal subnet.

## Commands / Configuration Examples
### Windows
```powershell
# View the local ARP cache
arp -a

# Clear the entire ARP cache (Requires Administrator command prompt)
arp -d *

# Add a static ARP entry (Requires Administrator)
arp -s 192.168.1.1 00-aa-bb-cc-dd-ee
```

### Linux (Legacy vs Modern)
```bash
# Legacy command to view cache
arp -n

# Modern equivalent using the 'ip' command
ip neigh show

# Clear a specific ARP entry (Modern)
sudo ip neigh flush 192.168.1.10
```

## Troubleshooting
- **Cannot Reach a Replaced Server:** If a server's motherboard dies and you replace it with a new machine using the exact same IP address, PCs on the network will fail to reach it. Why? Their ARP caches are still pointing to the dead server's MAC address. Running `arp -d *` to clear the cache instantly fixes the issue.
- **Command Not Found (Linux):** If `arp` fails on a modern Linux server, the `net-tools` package is not installed. Use `ip neigh` instead.

## Interview Questions
- What is the purpose of the `arp -a` command?
- How do you use the ARP cache to detect a Man-in-the-Middle attack?
- What command has replaced the legacy `arp` command in modern Linux distributions? (Answer: `ip neigh`).
- How do you resolve a communication issue caused by a stale ARP entry? (Answer: Flush/delete the ARP cache).

## Summary
The `arp` command is the fundamental diagnostic tool for Layer 2 connectivity. Whether mapping local networks, verifying hardware replacements, or detecting spoofing attacks, inspecting the IP-to-MAC translation table remains a necessary skill for all IT professionals.

## References
- [ARP (Protocol)](../03-ethernet-and-switching/arp.md)
- [ip Command](ip-command.md)
- [MAC Addresses](../03-ethernet-and-switching/mac-addresses.md)
- [ARP Spoofing](../13-network-pentesting/arp-spoofing.md)
