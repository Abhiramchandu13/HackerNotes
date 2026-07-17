# tcpdump

> tcpdump is a lightweight, command-line packet analyzer used to capture and inspect network traffic directly from the terminal, making it the industry standard for Linux and headless server environments.

## Overview
While Wireshark provides an excellent graphical interface, it is heavy and cannot run on headless Linux servers that lack a GUI. **tcpdump** is the lightweight command-line equivalent. It runs directly in the terminal, consumes minimal resources, and uses the `libpcap` library to capture and filter packets.

Network engineers and security analysts use `tcpdump` to capture traffic on remote servers and then export the resulting `.pcap` file to their laptops to analyze visually in Wireshark.

## Why It Matters
Almost all cloud servers, production web hosts, and firewalls run on Linux or Unix variants without graphical interfaces. If a web server is experiencing a network issue, `tcpdump` is the only tool available to capture the traffic. For security automation, `tcpdump` can be scripted to trigger packet captures during suspected intrusion events.

## Core Concepts
- **pcap:** The standard packet capture file format. `tcpdump` writes to and reads from pcap files.
- **BPF (Berkeley Packet Filter):** The highly efficient filtering language used by `tcpdump` (e.g., `tcp port 80 and host 10.0.0.5`).
- **Standard Output (stdout):** `tcpdump` can print a summary of packet headers directly to the terminal screen.
- **Root Privileges:** Because it accesses the raw network socket, `tcpdump` must be run as root or with `sudo`.

## How It Works
1. You run `tcpdump` specifying a physical interface (e.g., `eth0`) and a filter.
2. The command puts the NIC into promiscuous mode.
3. As packets arrive, `tcpdump` parses the IP and TCP/UDP headers and displays a summary line on your screen in real-time.
4. If you specify the `-w` flag, `tcpdump` stops printing to the screen and writes the raw binary packets directly to a file on your disk.

## Components / Types
Important command line flags:
- `-i`: Specify the interface (e.g., `-i eth0`). Use `-i any` to listen on all interfaces.
- `-n`: Do not resolve IP addresses to hostnames (speeds up output and prevents DNS traffic noise).
- `-nn`: Do not resolve ports to service names (displays `80` instead of `http`).
- `-v`, `-vv`, `-vvv`: Increase the verbosity of the printed headers.
- `-w`: Write raw packets to a file (e.g., `-w capture.pcap`).
- `-r`: Read raw packets from a saved file (e.g., `-r capture.pcap`).
- `-c`: Stop capturing after a specific packet count (e.g., `-c 100`).

## Practical Examples
- **Capturing Web Traffic:** You want to capture HTTP traffic on a web server to see if a client is sending requests.
  ```bash
  sudo tcpdump -i eth0 -n -nn port 80
  ```
- **Saving a Capture for Wireshark:** You want to capture traffic on a production server and analyze it later on your laptop.
  ```bash
  sudo tcpdump -i eth0 -w /tmp/server_capture.pcap port 443
  # Move the file to your PC and open in Wireshark
  ```

## Security Considerations
- **Sniffing Risk:** Like Wireshark, anyone with root access on a server can use `tcpdump` to capture and read unencrypted sensitive data (passwords, session cookies).
- **Log Exposure:** Capturing packets containing sensitive data writes them to disk. Ensure `/tmp` or wherever you save `.pcap` files has strict permissions (`chmod 600`).
- **Resource Satiation:** Running `tcpdump` without filters on a busy 10Gbps link can generate gigabytes of data per minute, quickly filling up the server's hard drive and crashing system processes.

## Commands / Configuration Examples
Here are the most common BPF (Berkeley Packet Filter) syntax examples used with `tcpdump`:

### Common Filtering Commands
```bash
# Capture traffic only to/from a specific host
sudo tcpdump -i eth0 host 192.168.1.50

# Capture only TCP SYN packets (the start of a 3-way handshake)
sudo tcpdump -i eth0 "tcp[tcpflags] & (tcp-syn) != 0"

# Capture only DNS queries and responses
sudo tcpdump -i eth0 -n udp port 53

# Capture traffic on a specific subnet, excluding SSH (to avoid capturing your own terminal traffic)
sudo tcpdump -i eth0 net 10.0.0.0/24 and not port 22
```

## Troubleshooting
- **Seeing Your Own SSH Traffic:** If you run `tcpdump` on a remote server over SSH without filtering, the command will capture the SSH packets carrying the command output, causing an infinite loop of printing packets on the screen. Always use `and not port 22` to filter out your own connection.
- **Dropped Packets:** If the terminal output ends with `X packets dropped by kernel`, the server is receiving traffic faster than `tcpdump` can process it. Write to a file (`-w`) and disable DNS resolution (`-n`) to reduce CPU overhead.

## Interview Questions
- Why is `tcpdump` preferred over Wireshark for production server troubleshooting?
- What command flag is used to write a capture to a file, and what is the standard file extension? (Answer: `-w`, and `.pcap` or `.cap`).
- How do you filter out your own SSH session when running a packet capture? (Answer: Append `and not port 22` or `and not host <your_ip>`).
- What does the `-n` flag do in a `tcpdump` command?

## Summary
`tcpdump` is the essential command-line utility for packet capture. By leveraging efficient BPF filters, a lightweight footprint, and compatibility with `.pcap` analysis tools, it provides network and security professionals with the ultimate utility for raw network diagnostics on headless servers.

## References
- [Wireshark](wireshark.md)
- [tshark](tshark.md)
- [Packet Capture](packet-capture.md)
