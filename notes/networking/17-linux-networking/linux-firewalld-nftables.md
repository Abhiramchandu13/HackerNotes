# Linux Firewalld and nftables

> Firewalld is the dynamic firewall management tool for modern Linux, while nftables is the powerful, flexible packet filtering framework that firewalld uses under the hood.

## Overview
Just like Windows Defender Firewall protects individual Windows machines, **Linux has its own robust host-based firewalls**. Historically, Linux relied on `iptables` (which was complex and difficult to manage). Modern Linux distributions (like CentOS 7+, Fedora, and RHEL) have transitioned to **firewalld** for managing firewall rules.

**Firewalld** simplifies firewall configuration by introducing concepts like "zones" and "services," making it much more user-friendly. Underneath firewalld (and `iptables` and `ebtables`), the Linux kernel's modern packet filtering framework is **nftables**.

## Why It Matters
A Linux server exposed directly to the Internet (e.g., a web server) will be scanned and attacked thousands of times a day. A host-based firewall is its first line of defense, blocking unauthorized connections before they ever reach the application. For security professionals, knowing how to audit and configure firewalld rules is mandatory for hardening Linux systems.

## Core Concepts
### Firewalld
- **Zones:** Represent different levels of trust for network connections. (e.g., `public`, `home`, `internal`, `trusted`, `dmz`). Each zone has its own set of rules.
- **Services:** Predefined rules for common applications (e.g., `ssh`, `http`, `https`). Instead of opening port 22, you just "allow ssh."
- **Runtime vs. Permanent:** Changes can be applied temporarily (runtime) or permanently (persistent across reboots).
- **Default Deny:** If a connection is not explicitly permitted by a rule in an active zone, it is dropped by default.

### nftables
- **Unified Framework:** `nftables` aims to replace `iptables`, `ip6tables`, `arptables`, and `ebtables` with a single, unified syntax for managing IPv4, IPv6, and Layer 2 packet filtering.
- **Flexible Ruleset:** Rules are defined in terms of "tables," "chains," and "rules," giving fine-grained control over packet matching and actions.
- **Atomic Operations:** Rule sets can be replaced in one atomic operation, avoiding temporary states of no firewall.

## How It Works
### Firewalld
1. You connect your Linux server to a public cloud VPC. Firewalld automatically assigns the `public` zone to the network interface.
2. The `public` zone has a rule: "Allow `ssh` service."
3. An attacker scans your server for port 22. Firewalld sees the incoming connection, matches the "Allow SSH" rule, and permits the connection.
4. The attacker then scans for port 80. Firewalld sees this. Since there is no "Allow HTTP" rule in the `public` zone, the connection is dropped by the default deny policy.

### nftables
When firewalld applies a rule (e.g., "allow ssh"), it doesn't write directly to `iptables` anymore. It translates that user-friendly request into `nftables` syntax and loads it into the kernel's `nftables` engine.

## Components / Types
- **Firewalld Zones:**
  - `public`: Untrusted networks. Most restrictive.
  - `home` / `internal`: More trusted networks.
  - `dmz`: For public-facing servers.
- **Firewalld Services:** `ssh`, `http`, `https`, `dhcp`, `dns`, `samba`, etc.
- **Runtime Rules:** Changes made with `firewall-cmd` without the `--permanent` flag. Lost on reboot.
- **Permanent Rules:** Changes made with `firewall-cmd --permanent`. Require `firewall-cmd --reload` to take effect.

## Practical Examples
- **Web Server Hardening:** A new Linux web server is deployed. The admin configures firewalld to use the `public` zone on the Internet-facing interface and explicitly adds the `http` and `https` services. This ensures only web traffic is allowed, with all other ports implicitly blocked.
- **Developer Workstation:** A developer's workstation is configured to use the `home` zone, which allows SSH, Samba sharing, and local printing, but blocks all other inbound connections.

## Security Considerations
- **Default Deny is Crucial:** Always ensure the default behavior of the active zone is to `DROP` incoming traffic.
- **External Interfaces:** Assign Internet-facing interfaces to the `public` or `external` zone, which are highly restrictive.
- **Internal Interfaces:** Assign interfaces connected to trusted internal LANs to the `internal` or `trusted` zone, which are less restrictive but still enforce policy.
- **Local Exploits:** Even if the external firewall is perfectly configured, an attacker who gains local access to the Linux machine can disable the host firewall.

## Commands / Configuration Examples
### Firewalld (Linux)
```bash
# 1. View the default zone (which zone is active on interfaces)
firewall-cmd --get-default-zone

# 2. Assign the 'public' zone to the eth0 interface permanently
sudo firewall-cmd --zone=public --change-interface=eth0 --permanent

# 3. Add the SSH service to the public zone permanently
sudo firewall-cmd --zone=public --add-service=ssh --permanent

# 4. Add a specific port (e.g., TCP 8080) to the public zone permanently
sudo firewall-cmd --zone=public --add-port=8080/tcp --permanent

# 5. Reload firewalld to apply permanent changes
sudo firewall-cmd --reload

# 6. View all active rules in the public zone
sudo firewall-cmd --zone=public --list-all

# 7. Temporarily block an IP address for 5 minutes
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.1.50" drop'
sudo firewall-cmd --reload
```

## Troubleshooting
- **Cannot SSH to Server:** Verify that the `ssh` service is allowed in the active zone applied to the interface you are connecting to (`sudo firewall-cmd --list-all`). Ensure you reloaded firewalld after making permanent changes (`sudo firewall-cmd --reload`).
- **Application Not Working:** If a new web server is not reachable from the network, verify the correct port (e.g., 80 or 443) is allowed in the zone assigned to the server's network interface.
- **`firewall-cmd` not working:** On older Linux distributions (like Ubuntu before 18.04), `ufw` (Uncomplicated Firewall) is used instead of `firewalld`.

## Interview Questions
- What problem does `firewalld` solve compared to directly configuring `iptables`?
- Explain the concept of "zones" in `firewalld`.
- How do you allow HTTP (port 80) traffic through `firewalld` permanently? (Answer: `sudo firewall-cmd --zone=public --add-service=http --permanent; sudo firewall-cmd --reload`).
- What is `nftables`?

## Summary
Firewalld provides a user-friendly, zone-based interface for managing the powerful `nftables` packet filtering framework in Linux. By simplifying host firewall configuration, it enables administrators to easily enforce least-privilege access, significantly reducing the attack surface of critical Linux servers and workstations.

## References
- [Linux Networking](../../17-linux-networking/network-interfaces-linux.md)
- [Network Configuration Files](network-configuration-files.md)
- [Firewall](../09-network-security/firewalls.md)
- [ufw (Uncomplicated Firewall)](linux-firewalld-nftables.md)
