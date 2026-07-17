# netstat

> netstat is a legacy command-line utility used to display active network connections, routing tables, and interface statistics on both Unix/Linux and Windows operating systems.

## Overview
For decades, **netstat** (Network Statistics) was the universal tool for checking network connections on almost every platform. Operating at the Transport Layer (Layer 4), it lists all active TCP/UDP sockets, letting you see exactly who your computer is talking to.

However, `netstat` is legacy software on Linux. It has been officially deprecated in modern Linux distributions and replaced by the faster `ss` command. Despite this, `netstat` remains natively supported and heavily used in **Windows** environments.

## Why It Matters
Although deprecated on Linux, `netstat` is a mandatory tool to know because it is natively available on every Windows machine by default. When performing incident response on a Windows server, `netstat` is the first command you run to see if malware has established a connection back to a Command & Control (C2) server.

## Core Concepts
- **Active Connections:** Displays the local address, foreign address, and state of all active TCP/UDP ports.
- **Port Mapping:** Translates port numbers to human-readable names (e.g., showing `http` instead of `80`) unless specified otherwise.
- **Legacy Linux Bottleneck:** On Linux, `netstat` had to slowly parse files inside the `/proc` directory. On a server with 10,000 active connections, running `netstat` would consume massive CPU, which is why it was replaced by `ss`.

## How It Works
1. You run `netstat -ano` in the Windows Command Prompt.
2. The utility queries the OS networking stack.
3. It prints a structured table showing:
   - Proto: TCP or UDP.
   - Local Address: The local IP and Port.
   - Foreign Address: The remote IP and Port.
   - State: The TCP state (e.g., `ESTABLISHED`, `LISTENING`).
   - PID: The Process ID of the application owning that connection.

## Components / Types
Important command line flags (universal across Windows and legacy Linux):
- `-a`: Display all active connections and listening ports.
- `-n`: Display addresses and port numbers numerically (stops DNS/port resolution for speed).
- `-o`: Display the owning Process ID (PID) associated with each connection.
- `-r`: Display the routing table (equivalent to `route print`).
- `-s`: Display per-protocol statistics (total packets sent/received, errors).

## Practical Examples
- **Incident Response on Windows:** A security analyst suspects a Windows server is compromised. They run:
  ```cmd
  netstat -ano | findstr ESTABLISHED
  ```
  They spot an outbound connection to a foreign IP on port 4444 owned by PID `2345`. They open Task Manager, match PID `2345` to `cmd.exe`, confirming an active backdoor connection.

## Security Considerations
- **Reconnaissance:** Attackers run `netstat` immediately upon compromising a host to see what internal connections are active and locate potential targets for lateral movement.
- **Log Evaporation:** Some malware hides its connections from the `netstat` utility by patching the Windows kernel, rendering the tool blind. Analysts must cross-reference `netstat` output with network-level firewall logs.

## Commands / Configuration Examples
### Windows Command Prompt / PowerShell
```cmd
# View all active TCP connections and listening ports, showing PIDs numerically
netstat -ano

# View only established connections
netstat -ano | findstr ESTABLISHED

# View the Windows routing table
netstat -r
```

### Legacy Linux (net-tools)
```bash
# View all listening TCP and UDP ports with process names (Requires sudo)
sudo netstat -tulpn
```

## Troubleshooting
- **Command Not Found (Linux):** If `netstat` fails on a modern Linux server, it's not installed. Use `ss -tulpn` instead, or install the `net-tools` package.
- **Slow Output:** If `netstat` takes 30 seconds to print, it is trying to resolve DNS names for every IP address. Run it with the `-n` flag (e.g., `netstat -an`) to disable DNS resolution and make it print instantly.

## Interview Questions
- What is `netstat` used for?
- How do you find which process ID (PID) is using a specific port in Windows? (Answer: Run `netstat -ano` and match the PID in the final column).
- Why was `netstat` replaced by `ss` in modern Linux?
- What does the `-n` flag do in a `netstat` command?

## Summary
`netstat` is the classic network socket diagnostic tool. While superseded by `ss` on Linux, its native inclusion in Windows makes it an essential utility for system administrators, security analysts, and penetration testers auditing host connections.

## References
- [ss](ss.md)
- [ifconfig](ifconfig.md)
- [Ports and Sockets](../06-network-protocols/ports-and-sockets.md)
- [Network Monitoring](network-monitoring.md)
