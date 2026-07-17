# DHCP in Linux

> DHCP in Linux involves configuring the system to act as a Dynamic Host Configuration Protocol client to obtain network settings, or as a server to assign IPs to other devices.

## Overview
Just like Windows clients, Linux machines can obtain their IP address, subnet mask, default gateway, and DNS servers automatically from a DHCP server. This is the standard for Linux workstations and many servers in virtualized or cloud environments. Linux also offers robust DHCP server implementations for managing IP address pools.

## Why It Matters
For client-side Linux machines (laptops, desktops), DHCP simplifies network connectivity. For server-side Linux (DHCP servers), it automates IP address management across an entire enterprise, integrating with DNS and supporting complex network topologies. For security professionals, understanding DHCP client behavior is crucial for detecting rogue DHCP servers.

## Core Concepts
- **DHCP Client Daemon:** Software running on Linux that performs the DORA process (Discover, Offer, Request, Acknowledge) to obtain an IP. Common clients include `dhclient` and clients integrated into network managers like `NetworkManager` or `systemd-networkd`.
- **DHCP Server Daemon:** Software (e.g., ISC DHCP Server, `dnsmasq`) running on Linux that manages IP address pools and hands out network configurations.
- **Lease Files:** DHCP client information is stored persistently to avoid requesting a new IP every reboot.

## How It Works (Client-Side)
1. A Linux machine boots up.
2. The DHCP client daemon (e.g., `dhclient`) is started.
3. It sends a DHCP Discover broadcast out of its network interface.
4. A DHCP server replies with an Offer.
5. The Linux client accepts, the server ACKs, and the client's network interface is configured with the IP, subnet, gateway, and DNS.
6. The client records the lease in a file (e.g., `/var/lib/dhcp/dhclient.leases`).

## Components / Types
- **`dhclient`:** The classic DHCP client daemon for Linux.
- **`NetworkManager`:** A service for managing network connections. It includes its own DHCP client.
- **`systemd-networkd`:** A systemd component that can manage network configurations, including acting as a DHCP client.
- **ISC DHCP Server:** A full-featured DHCP server often deployed on Linux.

## Practical Examples
- **Desktop Linux:** Your Ubuntu laptop uses `NetworkManager`'s integrated DHCP client to automatically connect to your home Wi-Fi and receive an IP address.
- **Server DHCP:** A small office runs an internal DHCP server on a Linux VM using `dnsmasq`, which combines DHCP, DNS caching, and TFTP services.

## Security Considerations
- **Rogue DHCP Servers:** Linux clients, like Windows clients, are susceptible to Rogue DHCP attacks. If a malicious server replies faster than the legitimate one, it can redirect the Linux machine's traffic through the attacker.
- **DHCP Starvation:** Linux-based tools can perform DHCP starvation attacks.
- **Log Files:** DHCP server logs (`/var/log/syslog` or `journalctl`) are critical for auditing which IPs were assigned to which MAC addresses, aiding incident response.

## Commands / Configuration Examples
### Linux (Client-Side)
```bash
# Force a DHCP client to renew its lease (using dhclient)
sudo dhclient -r eth0  # Release
sudo dhclient eth0     # Request new lease

# View the current DHCP lease file
cat /var/lib/dhcp/dhclient.leases

# On systemd-networkd managed systems, use networkctl
networkctl status eth0
```

### Linux (Server-Side - ISC DHCP Server)
```text
# Example /etc/dhcp/dhcpd.conf
subnet 192.168.1.0 netmask 255.255.255.0 {
  range 192.168.1.100 192.168.1.200;
  option routers 192.168.1.1;
  option domain-name-servers 8.8.8.8, 8.8.4.4;
  default-lease-time 600;
  max-lease-time 7200;
}

# Restart the DHCP server
sudo systemctl restart isc-dhcp-server
```

## Troubleshooting
- **No IP Address:** If a Linux machine fails to get an IP (verified by `ip a`), check the `dhclient.leases` file for errors. Verify the DHCP client daemon is running. Check network connectivity to the DHCP server.
- **IP Conflict:** If the DHCP server assigns an IP that's already in use, the Linux client will detect the conflict (often via ARP) and log a warning. The server may mark the IP as `BAD_ADDRESS`.
- **Wrong Options:** If the machine gets an IP but can't reach the internet, verify that the Default Gateway (Option 3) and DNS Servers (Option 6) were correctly assigned.

## Interview Questions
- What daemon typically handles DHCP client functionality on Linux?
- How do you manually force a Linux client to renew its DHCP lease?
- What are two common Linux DHCP server implementations? (Answer: ISC DHCP Server, `dnsmasq`).
- Why is a Linux machine susceptible to a Rogue DHCP server attack?

## Summary
DHCP in Linux is essential for automated network configuration, supporting both client connectivity and centralized IP address management. Understanding DHCP client behavior and server configuration is fundamental for ensuring reliable and secure network operations in any Linux environment.

## References
- [DHCP](../06-network-protocols/dhcp.md)
- [Network Configuration Files](network-configuration-files.md)
- [Rogue DHCP](../15-network-pentesting/rogue-dhcp.md)
- [Network Interfaces in Linux](network-interfaces-linux.md)
