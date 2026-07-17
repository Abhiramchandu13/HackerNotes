# Network Troubleshooting in Linux

> Network troubleshooting in Linux involves using a variety of command-line tools to diagnose, identify, and resolve network connectivity and performance issues on a Linux system.

## Overview
When a Linux server or workstation cannot connect to the network, access the internet, or communicate with other services, a systematic approach is required. Linux provides a rich set of powerful command-line utilities that allow administrators to inspect every layer of the network stack, from the physical interface status up to DNS resolution and application connectivity.

## Why It Matters
Linux servers power the vast majority of the Internet and cloud infrastructure. For system administrators, DevOps engineers, and security professionals, rapidly diagnosing network issues on Linux is a daily task. Understanding the right tools and methodology can reduce server downtime from hours to minutes, ensuring critical services remain available.

## Core Concepts
Linux troubleshooting follows the same OSI model principles:
- **Layer 1 (Physical):** Is the interface physically up and connected? (Tools: `ip link show`).
- **Layer 2 (Data Link):** Is the MAC address correct? Any ARP issues? (Tools: `ip neigh show`, `bridge fdb show`).
- **Layer 3 (Network):** Is the IP configured? Is the routing table correct? Can it reach the gateway? (Tools: `ip addr show`, `ip route show`, `ping`, `traceroute`).
- **Layer 4 (Transport):** Are ports open? Are connections established? (Tools: `ss`, `netcat`).
- **Layer 7 (Application):** Is DNS resolving? Is the application listening? Can `curl` reach the service? (Tools: `dig`, `curl`, `ss -tulpn`).

## How It Works
A typical troubleshooting workflow involves isolating the problem:
1.  **Check Local Interface:** Use `ip a` to see if the interface has an IP and is `UP`.
2.  **Check Local Route:** Use `ip r` to ensure a default gateway is present.
3.  **Check Local DNS:** Use `cat /etc/resolv.conf` to verify DNS servers, then `dig` to test resolution.
4.  **Check Connectivity to Gateway:** `ping <gateway_ip>`.
5.  **Check Connectivity to External Host:** `ping 8.8.8.8` (testing outside routing).
6.  **Check Connectivity to External Service:** `curl https://google.com` (testing Layer 7).

## Components / Types
- **`ip` command:** Modern replacement for `ifconfig` and `route`.
- **`ss` command:** Modern replacement for `netstat`.
- **`ping`, `traceroute`, `mtr`:** For Layer 3 reachability and path mapping.
- **`dig`, `host`, `nslookup`:** For DNS diagnostics.
- **`curl`, `wget`, ``netcat` (`nc`):** For Layer 7 application testing.
- **`tcpdump`, `tshark`, `wireshark`:** For deep packet analysis.

## Practical Examples
- **Scenario:** A Linux web server can't reach the Internet, but it has a valid IP address.
  1.  `ip a`: Interface is up, has `192.168.1.50/24`.
  2.  `ip r`: No default gateway (`default via ...`) or it points to an unreachable IP.
  3.  *Resolution:* Add a default route: `sudo ip route add default via 192.168.1.1`.

## Security Considerations
- **Firewall Rules:** Host-based firewalls (like `firewalld` or `ufw`) can silently drop traffic. Remember to check local firewall status and rules.
- **Rootkits:** Advanced malware can hide network connections from `ss` or `netstat`. Cross-reference host tools with network-level flow data (NetFlow) or packet captures from the switch.
- **`sudo` Privileges:** Many powerful network tools (e.g., `tcpdump`, `ip link set`) require root privileges. Restrict `sudo` access carefully.

## Commands / Configuration Examples
### Essential Linux Network Troubleshooting Commands
```bash
# 1. Check interface status and IP address (Layer 1, 2, 3)
ip a
ip link show

# 2. Check routing table (Layer 3)
ip r

# 3. Check ARP cache / Neighbor table (Layer 2)
ip neigh

# 4. Ping local gateway and external IP (Layer 3 reachability)
ping -c 4 192.168.1.1
ping -c 4 8.8.8.8

# 5. Trace route to an external IP (Layer 3 path mapping)
traceroute 8.8.8.8

# 6. Check DNS resolution (Layer 7)
cat /etc/resolv.conf
dig google.com

# 7. Check listening ports and active connections (Layer 4)
sudo ss -tulpn

# 8. Test HTTP/HTTPS connectivity (Layer 7 application)
curl -I https://google.com
```

## Troubleshooting
- **No IP Address:** If `ip a` shows no `inet` address for an interface, check `/etc/netplan/*.yaml` or `/etc/sysconfig/network-scripts/ifcfg-eth0` for configuration.
- **Cannot Reach Gateway:** If `ping <gateway_ip>` fails, the problem is local (cable, NIC, switch port, local firewall, incorrect VLAN).
- **Cannot Reach Internet, but Gateway Responds:** Check the router's routing table (`ip route show`) for a default route. Check firewalls.
- **Name Resolution Fails:** If `ping 8.8.8.8` works but `ping google.com` fails, the issue is DNS. Check `/etc/resolv.conf` and `dig` to the configured DNS servers.

## Interview Questions
- What is the first command you would run on a Linux server to check its network configuration? (Answer: `ip a` or `ip addr show`).
- If a Linux server can ping `1.1.1.1` but cannot `dig google.com`, what is the likely problem?
- How do you check which services are listening on which ports on a Linux machine? (Answer: `sudo ss -tulpn`).
- What is the role of `traceroute` in diagnosing Linux network connectivity issues?

## Summary
Network troubleshooting in Linux is a methodical process of using specialized command-line tools to dissect network problems layer by layer. By systematically verifying interface status, IP configuration, routing, DNS, and application connectivity, administrators can rapidly identify and resolve even the most complex network issues.

## References
- [ip Command](../10-monitoring-and-troubleshooting/ip-command.md)
- [ss Command](../10-monitoring-and-troubleshooting/ss.md)
- [ping](../10-monitoring-and-troubleshooting/ping.md)
- [traceroute](../10-monitoring-and-troubleshooting/traceroute.md)
- [Network Configuration Files](network-configuration-files.md)
