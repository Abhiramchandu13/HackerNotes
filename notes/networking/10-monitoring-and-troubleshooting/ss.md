# ss

> ss is the modern Linux CLI utility used to investigate active network sockets, displaying detailed TCP/UDP connections and listening ports, replacing the legacy netstat command.

## Overview
If a computer is a busy port, **ss** (Socket Statistics) is the harbor master's logbook. Operating at the Transport Layer (Layer 4), it lists every single active network connection, showing which local IP/Port is communicating with which remote IP/Port, and which software processes are owning the sockets.

Like the `ip` command, `ss` is the modern replacement for legacy tools—specifically replacing `netstat` in modern Linux distributions.

## Why It Matters
For system administrators, `ss` is the go-to tool for verifying if a service is running and listening on the correct port (e.g., verifying if a web server is actually listening on port 443). For security analysts, `ss` is critical for spotting unauthorized outbound connections (like malware calling home to a C2 server) or rogue services listening for connections.

## Core Concepts
- **Socket Statistics:** `ss` directly queries the Linux kernel's socket information dump (using Netlink), making it significantly faster and more accurate than `netstat` (which had to parse slow files inside the `/proc` directory).
- **Socket States:** Connections are categorized by state (e.g., `ESTABLISHED` for active connections, `LISTEN` for services waiting for connections, `TIME_WAIT` for recently closed connections).
- **Process ID (PID) Mapping:** The ability to map a network socket back to the exact program running on the CPU (e.g., showing that Port 80 is owned by PID 1234, which is `/usr/sbin/nginx`).

## How It Works
When you run `ss`:
1. The binary requests socket statistics directly from the kernel via Netlink.
2. The kernel dumps the active connection table.
3. `ss` parses the data, translates port numbers to human-readable protocol names (unless `-n` is used), and prints it.
4. It can filter the output dynamically in the kernel, making it highly efficient even on servers with millions of active connections.

## Components / Types
Important command line flags:
- `-t`: Show only TCP connections.
- `-u`: Show only UDP connections.
- `-l`: Show only listening sockets (services waiting for connections).
- `-a`: Show all sockets (both listening and active connections).
- `-n`: Do not resolve port names (shows `80` instead of `http`, and `22` instead of `ssh`), which runs faster and avoids DNS noise.
- `-p`: Show the process name and PID owning the socket (requires `sudo`/root).
- `-s`: Summary. Shows a quick count of total connections by type.

## Practical Examples
- **Verifying a Web Server:** You just installed Apache. You run `sudo ss -tulpn` to verify it is listening on Port 80.
- **Spotting a Reverse Shell:** A security analyst suspects a server is compromised. They run `ss -tna` and see an active outbound connection from a local ephemeral port to a foreign IP on port `4444` (a common pentesting port). They run `sudo ss -tp` to identify the process name, discovering it is owned by `/bin/bash`, confirming a reverse shell.

## Security Considerations
- **Reconnaissance:** Attackers use `ss` to identify internal services running on a compromised host that might not be exposed to the external network (e.g., a database running on `127.0.0.1:3306`).
- **Log Forging / Evasion:** Sophisticated malware (rootkits) can hide their sockets from the kernel. In these cases, `ss` might show no active connections, but a network tap or firewall log will show heavy traffic, indicating a compromised OS kernel.

## Commands / Configuration Examples
### Common Linux CLI Tasks
```bash
# 1. View all active TCP connections and listening ports
ss -t -a

# 2. View all listening TCP and UDP ports, with process names and PIDs (Requires sudo)
sudo ss -tulpn

# 3. View only established TCP connections
ss -t state established

# 4. Display a quick summary of network sockets
ss -s
```

## Troubleshooting
- **Permission Denied for PID:** If you run `ss -p` and the "Process" column is blank or contains only a hyphen `-`, it is because you ran the command as a standard user. You must run it as root or via `sudo` to inspect process ownership.
- **Localhost Binding:** If `ss` shows a service listening on `127.0.0.1:80`, the service is only accessible to programs running *on that local server*. It cannot be reached from the outside network. To fix it, you must configure the application (like Nginx) to bind to `0.0.0.0:80` (all interfaces) or the server's actual IP.

## Interview Questions
- What command has replaced `netstat` in modern Linux distributions?
- How do you view only listening TCP and UDP ports with process details using `ss`? (Answer: `sudo ss -tulpn`).
- What is the difference between binding a service to `127.0.0.1` vs `0.0.0.0`?
- Why is `ss` faster than legacy `netstat`? (Answer: `ss` queries the kernel directly via Netlink; `netstat` had to read and parse files inside `/proc` for every check).

## Summary
`ss` is the modern standard for socket investigation on Linux. By offering direct kernel Netlink communication, fast filtering, and detailed process mapping, it provides administrators and security analysts with the ultimate terminal utility for Transport layer diagnostics.

## References
- [netstat](netstat.md)
- [ip Command](ip-command.md)
- [Ports and Sockets](../06-network-protocols/ports-and-sockets.md)
- [Network Monitoring](network-monitoring.md)
