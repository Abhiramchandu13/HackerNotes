# CDP and LLDP

> CDP and LLDP are discovery protocols that allow network devices to advertise their identity and capabilities to directly connected neighbors.

## Overview
In a large enterprise network, figuring out exactly what is plugged into what can be a nightmare. **Cisco Discovery Protocol (CDP)** and **Link Layer Discovery Protocol (LLDP)** solve this by allowing devices to periodically whisper their name, IP address, device type, and port number to the device plugged into the other end of the cable. 

They operate strictly at Layer 2 (Data Link Layer), meaning they work even if the devices don't have IP addresses configured or are on different subnets.

## Why It Matters
For network engineers, these protocols are essential for mapping topologies, troubleshooting, and verifying cable patching. If documentation says Switch-A Port-1 connects to Router-B, CDP/LLDP allows you to verify that instantly via the CLI. 

For cybersecurity and pentesting, these protocols are goldmines. If an attacker gains access to a network drop, listening to CDP/LLDP broadcasts instantly reveals the network topology, management IP addresses, and exact OS versions of the infrastructure.

## Core Concepts
- **Layer 2 Only:** Packets are not routed. They only travel to the directly connected neighbor across a single wire.
- **Multicast:** Discovery packets are sent to specific multicast MAC addresses.
- **CDP (Cisco Discovery Protocol):** Proprietary protocol developed by Cisco. Enabled by default on Cisco gear. Only talks to other Cisco gear (and a few licensed partners like VMware).
- **LLDP (Link Layer Discovery Protocol):** IEEE 802.1AB standard. Vendor-neutral. Supported by almost all network vendors, Linux, and Windows.

## How It Works
1. Every 60 seconds (default for CDP) or 30 seconds (default for LLDP), a device sends a discovery frame out of all active interfaces.
2. The frame contains TLVs (Type-Length-Values) holding data: Hostname, OS version, Management IP, Port ID (e.g., `GigabitEthernet0/1`), and Capabilities (Router, Switch, Phone).
3. The neighbor receives the frame, reads the data, and stores it in a neighbor table.
4. The neighbor holds this data for a specific "Holdtime" (e.g., 180 seconds). If it doesn't receive a new message before the holdtime expires, it deletes the neighbor from the table.

## Components / Types
- **LLDP-MED (Media Endpoint Discovery):** An extension of LLDP designed specifically for VoIP phones and PoE (Power over Ethernet) devices. It allows a switch to tell a phone, "You belong on Voice VLAN 100, and I will supply you with exactly 15 watts of power."

## Practical Examples
- **VoIP Deployment:** A Cisco switch uses CDP to detect that an IP Phone has been plugged into a port. The switch automatically configures a QoS trust boundary and pushes the Voice VLAN ID to the phone, allowing it to boot up without manual configuration.
- **Network Mapping:** An engineer logs into a core switch and types `show lldp neighbors`. They see that port 1 connects to a Juniper firewall, port 2 connects to a Linux server, and port 3 connects to an Aruba switch. 

## Security Considerations
Discovery protocols violate the principle of least privilege by broadcasting sensitive infrastructure data.
- **Information Disclosure:** An attacker plugging a Raspberry Pi into a wall jack can run Wireshark, capture an LLDP frame, and immediately know the switch hostname, its exact IP address, its IOS version (useful for finding CVEs), and the VLAN ID.
- **CDP Spoofing / Flooding:** Attackers can send malformed CDP packets to cause Denial of Service (DoS) or exhaust the memory of a switch.
- **Best Practice:** Globally disable CDP/LLDP on untrusted, user-facing access ports. Only enable it on core infrastructure links (switch-to-switch) or ports requiring IP phones.

## Commands / Configuration Examples
### Cisco IOS (CDP)
```text
! View brief summary of all connected Cisco neighbors
show cdp neighbors

! View highly detailed info (including Management IPs) of neighbors
show cdp neighbors detail

! Disable CDP globally on the entire device
no cdp run

! Disable CDP on a specific user-facing interface
interface GigabitEthernet1/0/10
 no cdp enable
```

### Cisco IOS (LLDP)
```text
! Enable LLDP globally (disabled by default on older Cisco gear)
lldp run

! View connected LLDP neighbors
show lldp neighbors
```

### Linux
```bash
# Install and run lldpd to advertise the Linux server to the switch
sudo apt install lldpd
sudo systemctl enable --now lldpd

# View LLDP neighbors seen by the Linux server
lldpcli show neighbors
```

## Troubleshooting
- **No Neighbors Showing:** Ensure both sides are running the same protocol. A Juniper switch running LLDP will not appear in the `show cdp neighbors` output of a Cisco switch (you must use `show lldp neighbors`).
- **Mismatched Hostnames:** If `show cdp neighbors` shows a device connected to port `Gi0/1` that doesn't match your physical wiring diagram, your cabling patch is wrong.

## Interview Questions
- What is the difference between CDP and LLDP?
- At which layer of the OSI model do discovery protocols operate?
- Why might a security team mandate that CDP be disabled on access ports?
- What specific extension of LLDP is used to assist Voice over IP (VoIP) deployments?

## Summary
CDP and LLDP provide invaluable visibility into network topologies by allowing devices to introduce themselves to their physical neighbors. While powerful tools for administration and automation, their indiscriminate sharing of infrastructure details requires careful security management on edge ports.

## References
- [Data Link Layer](data-link-layer.md)
- [VLANs and Trunks](vlans-and-trunks.md)
- [Network Reconnaissance](../15-network-pentesting/network-reconnaissance.md)
