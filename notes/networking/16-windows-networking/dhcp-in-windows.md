# DHCP in Windows

> DHCP in Windows refers to the implementation of the Dynamic Host Configuration Protocol on Windows Server, which centrally manages and automates the assignment of IP addresses to clients on a network.

## Overview
While a home router runs a simple DHCP service, enterprise networks require far more control. The **Windows Server DHCP role** provides a highly scalable, robust platform for managing IP addresses across dozens or hundreds of subnets. 

It integrates deeply with Active Directory and Windows DNS, allowing a client to receive an IP address and automatically register its hostname in the corporate DNS server in a single, seamless process.

## Why It Matters
For system administrators, Windows DHCP is the standard tool for managing corporate IP space. It allows for the configuration of crucial network options—like telling VoIP phones where their call server is, or telling PXE clients where to download an operating system. For security, improperly configured DHCP servers or rogue DHCP servers can easily hijack an entire subnet's traffic.

## Core Concepts
- **Scope:** A contiguous range of IP addresses (e.g., `10.1.1.100` to `10.1.1.200`) assigned to a specific subnet.
- **Exclusions:** Specific IPs within a scope that the server is forbidden from handing out (usually because they are statically assigned to printers or servers).
- **Reservations:** Tying a specific MAC address to a specific IP address. The device uses DHCP, but the server guarantees it always gets the exact same IP.
- **Scope Options:** Extra network settings handed to the client along with the IP. 
  - *Option 3:* Default Gateway (Router).
  - *Option 6:* DNS Servers.
  - *Option 15:* DNS Domain Name.

## How It Works (Windows Specifics)
When a Windows DHCP server receives a Discover packet from a client:
1. It checks its authorized database in Active Directory to ensure it is allowed to hand out IPs (preventing unauthorized admins from spinning up rogue Windows DHCP servers).
2. It selects an available IP from the correct Scope based on the subnet the request originated from.
3. It performs a quick ICMP Ping to that IP. If it receives a reply, it knows the IP is already in use (an IP conflict), marks it as "BAD_ADDRESS," and selects a different IP.
4. It completes the DORA process.
5. **Dynamic DNS Updates:** The DHCP server securely contacts the Windows DNS server and updates the A and PTR records for the newly connected client, ensuring the corporate phonebook is always accurate.

## Components / Types
- **DHCP Failover:** A critical enterprise feature. Two Windows DHCP servers share the exact same scope and replicate lease data. If Server A crashes, Server B instantly takes over handing out IPs, preventing a network outage.
- **Superscope:** Grouping multiple different scopes together to service a single physical network segment that has multiple IP subnets running on it.
- **MAC Address Filtering:** Built into Windows DHCP, allowing an admin to explicitly "Allow" or "Deny" specific devices from receiving an IP address based on their MAC address.

## Practical Examples
- **VoIP Deployment:** A company buys 500 new Cisco IP phones. The admin creates a new DHCP scope for the Voice VLAN. They configure **DHCP Option 150** to point to the IP address of the Cisco Call Manager. When the phones boot up, they get an IP and use Option 150 to instantly find their controller and download their configuration.

## Security Considerations
- **Rogue DHCP Servers:** If an attacker plugs a laptop into the network and runs a DHCP server, they can hand out IPs and set themselves as the Default Gateway, creating a Man-in-the-Middle attack. 
- **DHCP Starvation:** An attacker blasts thousands of fake DHCP requests, emptying the Windows DHCP server's scope, causing a Denial of Service for legitimate users trying to connect.
- **Defense:** These attacks cannot be stopped by the Windows server itself. They must be stopped at the physical network layer using a switch feature called **DHCP Snooping**.

## Commands / Configuration Examples
### Windows Server (PowerShell)
Managing DHCP via PowerShell is faster and more scriptable than the GUI.
```powershell
# Install the DHCP Server Role
Install-WindowsFeature -Name DHCP -IncludeManagementTools

# Add a new IPv4 Scope
Add-DhcpServerv4Scope -Name "Guest_WiFi" -StartRange 192.168.10.100 -EndRange 192.168.10.200 -SubnetMask 255.255.255.0

# Set the Scope Options (Gateway and DNS)
Set-DhcpServerv4OptionValue -ScopeId 192.168.10.0 -Router 192.168.10.1 -DnsServer 10.0.0.5, 10.0.0.6

# View all active leases in a specific scope
Get-DhcpServerv4Lease -ScopeId 192.168.10.0
```

### Windows Client (Troubleshooting)
```powershell
# Release the current IP lease
ipconfig /release

# Request a new IP lease from the server
ipconfig /renew
```

## Troubleshooting
- **Scope Exhaustion:** If a guest Wi-Fi scope fills up with 200 users, the 201st user will not get an IP and will receive a `169.254.x.x` (APIPA) address. To fix this, either increase the scope size (if the subnet allows) or significantly lower the **Lease Duration** (e.g., from 8 days to 2 hours) so IPs are returned to the pool faster when guests leave.
- **Across VLANs:** If a DHCP server is in VLAN 10, but clients in VLAN 20 are getting APIPA addresses, the DHCP broadcast is dying at the router. You must configure an `ip helper-address` (DHCP Relay) on the router interface for VLAN 20 to forward the requests to the Windows server.
- **Unauthorized Server:** In an Active Directory environment, if a junior admin installs the DHCP role on a new Windows server but forgets to "Authorize" it in AD, the DHCP service will start, realize it is unauthorized, and instantly shut down to prevent rogue IP distribution.

## Interview Questions
- What is the difference between a DHCP Exclusion and a DHCP Reservation?
- Explain the role of an "IP Helper" or "DHCP Relay" when dealing with a centralized Windows DHCP server.
- How does Windows DHCP help maintain the accuracy of the corporate DNS server? (Answer: Through Dynamic DNS updates, where the DHCP server registers the client's hostname and IP in DNS upon leasing).
- What is DHCP Failover and why is it important in an enterprise?

## Summary
Windows DHCP transforms the chaotic process of IP address management into a highly automated, resilient, and AD-integrated service. By mastering Scopes, Options, and Failover clustering, Windows administrators ensure reliable, scalable connectivity across the entire corporate infrastructure.

## References
- [DHCP](../06-network-protocols/dhcp.md)
- [Rogue DHCP](../15-network-pentesting/rogue-dhcp.md)
- [DNS in Windows](dns-in-windows.md)
- [Active Directory Networking](active-directory-networking.md)
