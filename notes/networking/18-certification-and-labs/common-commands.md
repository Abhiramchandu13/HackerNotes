# Common Commands

> Common Commands are a curated list of essential CLI utilities and their common usages across Linux, Windows, and Cisco IOS, serving as a quick reference for network and system administration tasks.

## Overview
Regardless of the operating system or network device, administrators perform a core set of tasks: checking IP addresses, verifying connectivity, inspecting active connections, and troubleshooting routing. While the syntax differs, the underlying goal is always the same.

This cheat sheet consolidates the most frequently used commands across Linux, Windows, and Cisco IOS, providing a cross-platform quick-reference guide.

## Why It Matters
Memorizing every command for every platform is inefficient. A quick reference for common tasks helps junior administrators rapidly diagnose issues across heterogeneous environments. For senior engineers, it saves time by providing instant recall of less frequently used syntax or platform-specific nuances.

## Core Concepts
-   **Platform Agnostic Tasks:** The network tasks themselves are universal (e.g., "show IP address").
-   **Syntax Differences:** The way to execute the task differs by OS/device (e.g., `ip addr` vs `ipconfig` vs `show ip interface brief`).
-   **Progressive Troubleshooting:** Commands are often used in a sequence to diagnose issues layer by layer.

## How It Works
When troubleshooting, locate the desired network function (e.g., "Check DNS") and then execute the corresponding command for the specific platform you are working on (e.g., `dig` for Linux, `nslookup` for Windows).

## Components / Types
This cheat sheet is organized by common network tasks.

## Practical Examples
-   **Verifying Network Configuration:** A user reports no internet.
    -   On Linux: `ip a` to check IP, `ip r` to check gateway, `cat /etc/resolv.conf` to check DNS.
    -   On Windows: `ipconfig /all` to check all settings.
    -   On Cisco: `show ip interface brief` to check router interface.
-   **Testing Connectivity:**
    -   On Linux/Windows/Cisco: `ping 8.8.8.8` to test internet reachability.
    -   On Linux/Windows/Cisco: `traceroute 8.8.8.8` to path map.

## Security Considerations
-   **Command History:** Be mindful that commands typed in CLI are stored in history files (`.bash_history`, `~/.ssh/history`). Avoid typing passwords directly into commands.
-   **Privilege Escalation:** Some commands (e.g., `iptables`, `ip link set`) require root/administrator privileges. Ensure these are only used by authorized personnel.
-   **Information Disclosure:** Commands like `ip route show` or `show ip bgp` can reveal internal network topology. Restrict access to these commands where possible.

## Commands / Configuration Examples

### IP Addressing & Interface Status
| Task               | Linux (`iproute2`)       | Windows (`cmd`/`ps`)       | Cisco IOS                      |
| :----------------- | :----------------------- | :--------------------------- | :----------------------------- |
| **Show IP**        | `ip a`                   | `ipconfig`                   | `show ip int brief`            |
| **Show MAC**       | `ip link show`           | `getmac`                     | `show interface`               |
| **Bring Up/Down**  | `sudo ip link set dev eth0 up` | `netsh int eth0 enable`      | `no shutdown`/`shutdown`       |
| **Show MTU**       | `ip link show`           | `netsh int ipv4 show int`    | `show interface`               |

### Connectivity Testing
| Task               | Linux (`iproute2`)       | Windows (`cmd`/`ps`)       | Cisco IOS                      |
| :----------------- | :----------------------- | :--------------------------- | :----------------------------- |
| **Ping Host**      | `ping 8.8.8.8`           | `ping 8.8.8.8`               | `ping 8.8.8.8`                 |
| **Traceroute**     | `traceroute 8.8.8.8`     | `tracert 8.8.8.8`            | `traceroute 8.8.8.8`           |
| **Test Port**      | `nc -vz host port`       | `Test-NetConnection -p port` | `telnet host port`             |

### Routing & ARP
| Task               | Linux (`iproute2`)       | Windows (`cmd`/`ps`)       | Cisco IOS                      |
| :----------------- | :----------------------- | :--------------------------- | :----------------------------- |
| **Show Route**     | `ip r`                   | `route print`                | `show ip route`                |
| **Show ARP**       | `ip neigh`               | `arp -a`                     | `show ip arp`                  |
| **Add Static**     | `sudo ip r add 10.0.0.0/24 via 192.168.1.1` | `route add 10.0.0.0 mask 255.255.255.0 192.168.1.1` | `ip route 10.0.0.0 255.255.255.0 192.168.1.1` |

### DNS & Hostname Resolution
| Task               | Linux (`iproute2`)       | Windows (`cmd`/`ps`)       | Cisco IOS                      |
| :----------------- | :----------------------- | :--------------------------- | :----------------------------- |
| **Show DNS Server**| `cat /etc/resolv.conf`   | `ipconfig /all`              | `show running-config | in dns` |
| **Resolve Name**   | `dig google.com`         | `nslookup google.com`        | `ping google.com` (if DNS enabled) |

### Network Services & Connections
| Task               | Linux (`iproute2`)       | Windows (`cmd`/`ps`)       | Cisco IOS                      |
| :----------------- | :----------------------- | :--------------------------- | :----------------------------- |
| **Show Listen Ports**| `sudo ss -tulpn`         | `netstat -ano`               | `show control-plane host open-ports` |
| **Show Connections** | `ss -tna`                | `netstat -ano`               | `show tcp brief all`           |
| **SSH Client**     | `ssh user@host`          | `ssh user@host` (Win10+)     | `ssh user@host`                |
| **Web Client**     | `curl url`               | `Invoke-WebRequest url`      | `telnet url 80`                |

## Troubleshooting
-   **Output Interpretation:** Understanding the output of each command is key. For example, `ping`'s `TTL` values, `traceroute`'s asterisks, or `netstat`'s `ESTABLISHED` states.
-   **Privileges:** Many commands require `sudo` on Linux or Administrator permissions on Windows.
-   **Module/Package Missing:** Some commands (like `ip`) might not be in the default PATH on older Linux systems.

## Interview Questions
-   How would you check the IP address of a Linux server?
-   What is the Windows equivalent of `ip route show`?
-   How do you test if a specific TCP port is open on a remote machine using the command line in Windows and Linux?
-   Name three commands you would use to troubleshoot a complete loss of internet connectivity on a Linux workstation.

## Summary
Common Commands form the fundamental toolkit for network and system administrators. By providing quick access to interface status, routing tables, connection details, and diagnostic utilities across diverse platforms, they enable rapid diagnosis and resolution of network issues.

## References
- [Linux Networking Labs](linux-networking-labs.md)
- [Windows Networking Labs](windows-networking-labs.md)
- [Cisco IOS Labs](cisco-ios-labs.md)
- [Cheat Sheets](cheat-sheets.md)
- [Troubleshooting Scenarios](troubleshooting-scenarios.md)
