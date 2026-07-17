# TFTP (Trivial File Transfer Protocol)

> TFTP is a bare-bones, ultra-lightweight file transfer protocol that sacrifices security, authentication, and reliability for sheer simplicity.

## Overview
While standard FTP provides complex directory navigation, authentication, and reliable TCP delivery, **Trivial File Transfer Protocol (TFTP)** strips all of that away. Operating over **UDP port 69**, TFTP is designed to do exactly one thing: read a file from a server, or write a file to a server, with the absolute minimum amount of code possible.

Because it requires so little memory and CPU, TFTP clients can be embedded into the tiny, low-power microchips of network devices and IP phones to help them boot up.

## Why It Matters
You won't use TFTP to share documents with coworkers. However, in enterprise infrastructure, TFTP is the lifeblood of device provisioning. If a router's operating system crashes and it becomes a "brick," TFTP is the emergency recovery protocol used to push a new OS image to the device. Understanding TFTP is crucial for network automation and disaster recovery.

## Core Concepts
- **UDP Transport:** Relies on UDP. Because UDP has no inherent reliability, TFTP builds its own rudimentary acknowledgment system into the application layer. Every small block of data sent must be acknowledged before the next block is sent.
- **No Authentication:** TFTP has no concept of usernames or passwords. If you can reach the server, you can read or write files.
- **No Directory Listing:** You cannot type `ls` to see what is on a TFTP server. You must know the exact, case-sensitive filename you want to download beforehand.
- **Lock-Step Transfer:** Due to its simple "send block, wait for ACK" mechanism, TFTP is notoriously slow, especially over high-latency WAN links.

## How It Works
1. A client needs the file `config.txt`.
2. The client sends a Read Request (RRQ) to the TFTP server on UDP port 69.
3. The server responds not on port 69, but from a new, randomly selected ephemeral UDP port. It sends Block 1 of the file (usually 512 bytes).
4. The client receives Block 1 and sends an Acknowledgment (ACK) back to the server's ephemeral port.
5. The server sends Block 2. This continues until a block arrives that is smaller than 512 bytes, signaling the end of the file.

## Components / Types
TFTP is heavily tied to the **PXE (Preboot Execution Environment)** process:
- When a bare-metal server or VoIP phone boots up without an operating system, it queries DHCP.
- The DHCP server replies with an IP address, plus **Option 66** (the IP of a TFTP server) and **Option 67** (the name of a boot file).
- The blank device uses its tiny built-in TFTP client to download the boot file and launch its operating system.

## Practical Examples
- **Cisco Router Backups:** A network engineer routinely backs up the configuration files of all corporate switches by initiating a TFTP transfer from the switches to a central TFTP server.
- **VoIP Phone Provisioning:** When a new Cisco or Avaya IP phone is plugged into the wall, it boots, finds the TFTP server, and downloads its specific XML configuration file (containing its extension and features).

## Security Considerations
TFTP is an inherently dangerous protocol if exposed to untrusted networks.
- **Zero Authentication:** Anyone who can route to the TFTP server can download files from it.
- **Configuration Theft:** If an attacker discovers a TFTP server on an internal pentest, they can guess common filenames (like `router-confg` or `network-topology.xml`) and download them. These files often contain cleartext SNMP strings, routing passwords, or local admin hashes.
- **Rogue TFTP Servers:** During a PXE boot process, an attacker can spin up a rogue DHCP/TFTP server and feed a malicious boot image or configuration file to a booting server or VoIP phone.
- **Mitigation:** TFTP servers should be tightly constrained by firewalls, isolated on dedicated management VLANs, and strictly limited to serving only the exact files required for provisioning.

## Commands / Configuration Examples
### Linux (Using standard tftp client)
```bash
# Connect to the TFTP server
tftp 192.168.1.100

# Issue the command to download a file (Must know exact name)
tftp> get ios-upgrade-image.bin
tftp> quit
```

### Cisco IOS
```text
! Backing up the running configuration to a TFTP server
copy running-config tftp://192.168.1.100/router1-backup.cfg

! Upgrading the router's IOS image via TFTP
copy tftp://192.168.1.100/c2960-lanbasek9-mz.150-2.SE8.bin flash:
```

## Troubleshooting
- **Transfer Times Out immediately:** Because the initial request goes to UDP 69, but the actual data transfer happens over random high-numbered UDP ports, aggressive firewalls often block the return traffic. The firewall must support TFTP inspection (ALG) to dynamically open the correct return ports.
- **File Not Found:** Remember TFTP cannot list directories. Ensure the filename is typed perfectly, including case sensitivity, and that the file actually exists in the root directory of the TFTP server.

## Interview Questions
- What port and transport protocol does TFTP use? (Answer: UDP 69).
- What are two major differences between FTP and TFTP? (Answer: TFTP uses UDP, has no authentication, and cannot list directories).
- Describe a common, real-world use case for TFTP in an enterprise network.
- Why is it considered a security risk to leave a TFTP server running permanently on a user-accessible VLAN?

## Summary
TFTP trades robustness and security for the ultimate lightweight footprint. While unsuitable for modern file sharing, its simplicity makes it the cornerstone of hardware recovery, VoIP provisioning, and bare-metal network booting.

## References
- [UDP](udp.md)
- [FTP](ftp.md)
- [DHCP](dhcp.md)
- [Network Devices](../07-network-devices/router.md)
