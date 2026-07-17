# IPv4 Addressing

> An IPv4 address is a unique 32-bit logical identifier assigned to a device, allowing it to locate and communicate with other devices across different networks.

## Overview
While MAC addresses (Layer 2) provide a physical identity for devices on a local switch, **Internet Protocol version 4 (IPv4) addresses** (Layer 3) provide a logical identity. Think of a MAC address as your social security number (permanent and physical), and an IP address as your mailing address (logical, and changes based on what city you live in).

IPv4 is the foundational addressing protocol of the Internet, enabling routers to determine the optimal path for data to travel across the globe.

## Why It Matters
IPv4 is the most ubiquitous protocol in IT. If you cannot read an IP address, determine its network vs. host portions, and understand its scope, you cannot configure a server, setup a firewall, or troubleshoot a basic internet outage. In cybersecurity, IP addresses are the primary method of identity in firewall logs, intrusion detection alerts, and threat intelligence feeds.

## Core Concepts
- **32-bit Structure:** An IPv4 address consists of 32 binary bits.
- **Dotted Decimal Notation:** Because humans struggle to read 32 ones and zeros (`11000000.10101000.00000001.00001010`), the address is divided into four 8-bit sections called **octets**, and converted to decimal format (e.g., `192.168.1.10`).
- **Network vs. Host:** Every IP address is split into two parts:
  - *Network Portion:* Identifies the specific street/neighborhood the device is on.
  - *Host Portion:* Identifies the specific house/device on that street.
- **Subnet Mask:** A secondary 32-bit number (e.g., `255.255.255.0`) that acts as a ruler, indicating exactly where the Network portion ends and the Host portion begins.

## How It Works
1. A computer (IP `10.0.0.5`, Mask `255.255.255.0`) wants to send a packet to `10.0.0.50`.
2. The OS compares the destination IP against its own Subnet Mask. Because the network portions (`10.0.0`) match exactly, the OS knows the destination is on the local LAN. It uses ARP to find the MAC address and sends the frame directly.
3. Next, the computer wants to reach `8.8.8.8`. It applies its mask and realizes the network portions do not match.
4. Because the destination is on a foreign network, the OS sends the packet to its **Default Gateway** (the local router), trusting the router to figure out the global path.

## Components / Types
- **Classes (Legacy):** Historically, IP addresses were divided into strict classes (Class A, B, C, D, E) based on their first octet, dictating a rigid subnet mask. This is entirely obsolete today but still tested in certs.
- **Classless Inter-Domain Routing (CIDR):** The modern method of IP addressing that ignores classes and uses variable-length subnet masks (e.g., `/24`).
- **Unicast:** One-to-One communication.
- **Multicast:** One-to-Many communication.
- **Broadcast:** One-to-All communication on the local subnet.

## Practical Examples
- **Home Network:** Your ISP assigns your home router a single Public IP address. Your router then assigns Private IP addresses (e.g., `192.168.1.x`) to your laptop, phone, and TV, allowing them all to communicate locally.
- **Server Configuration:** A web server in a data center is assigned a static (permanent) IPv4 address so that DNS records can reliably point users to it without the IP ever changing.

## Security Considerations
- **IP Spoofing:** Attackers can easily forge the Source IP address of an IPv4 packet because the protocol inherently lacks authentication. This is heavily used in DDoS amplification attacks.
- **Reconnaissance:** Pentesters scan ranges of IPv4 addresses using tools like Nmap or Masscan to discover live hosts and open ports.
- **Exhaustion:** There are only about 4.3 billion possible IPv4 addresses. They are practically exhausted, making public IPs expensive and highly targeted.

## Commands / Configuration Examples
### Linux
```bash
# Display IP address and subnet mask (CIDR notation)
ip addr show

# Temporarily assign an IPv4 address to an interface
sudo ip addr add 192.168.1.50/24 dev eth0
```

### Windows
```powershell
# Display detailed IPv4 configuration including Default Gateway
ipconfig /all

# Check IPv4 routing table
route print -4
```

### Cisco IOS
```text
! Assign an IPv4 address to a router interface
interface GigabitEthernet0/1
 ip address 10.0.0.1 255.255.255.0
 no shutdown
```

## Troubleshooting
- **Incorrect Subnet Mask:** If a PC has the IP `10.0.0.5` but is given the wrong subnet mask (`255.0.0.0` instead of `255.255.255.0`), it will miscalculate whether other devices are local or remote, causing routing failures.
- **No Default Gateway:** A device with a valid IP and mask can talk to local peers, but without a configured default gateway, it has no way to reach the Internet.
- **IP Conflicts:** Two devices statically assigned the same IP address will result in ARP cache flapping and intermittent connectivity for both.

## Interview Questions
- How many bits make up an IPv4 address?
- Explain the purpose of a Subnet Mask.
- If a device wants to send a packet to an IP address on a different subnet, what must it do?
- Convert the binary octet `11000000` to decimal. (Answer: 192).

## Summary
IPv4 is the logical addressing scheme that powers local and global routing. By utilizing a 32-bit address paired with a subnet mask, networks can efficiently scale, route, and identify individual endpoints across the globe.

## References
- [Network Layer](../02-osi-and-tcpip-models/network-layer.md)
- [IPv4 Subnetting](ipv4-subnetting.md)
- [CIDR](cidr.md)
- [Private IP](private-ip.md)
