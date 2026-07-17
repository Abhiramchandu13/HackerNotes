# tshark

> tshark is the command-line equivalent of Wireshark, combining the powerful protocol dissection engine of Wireshark with the terminal-based efficiency of tcpdump.

## Overview
While `tcpdump` is excellent for capturing raw packets, its built-in packet parsing is very basic. It cannot easily decode complex Application layer protocols. **tshark** is Wireshark's command-line interface. It uses the exact same packet dissection engine as the Wireshark GUI, allowing you to perform highly sophisticated packet analysis, extract specific data fields, and filter complex protocols directly from the command line.

## Why It Matters
For security analysts and automated script developers, `tshark` is the ultimate tool. You can use it to automatically parse through thousands of `.pcap` files, extract specific indicators of compromise (like requested DNS domains or HTTP User-Agents), and output the results in structured formats (like JSON) to feed into other security tools.

## Core Concepts
- **Wireshark Engine:** `tshark` has access to all 2,000+ protocol decoders built into Wireshark.
- **Fields Extraction:** The ability to pull out specific header values (e.g., extracting just the IP addresses or the HTTP hosts) and ignore the rest of the packet.
- **Display Filters:** Uses the exact same filter syntax as the Wireshark GUI (e.g., `ip.addr == 10.0.0.5`), which is more powerful than `tcpdump`'s BPF syntax.
- **Structured Output:** Can output data as XML, JSON, or custom tab-delimited text.

## How It Works
1. You run `tshark` pointing to a saved capture file (`-r capture.pcap`) or a live interface (`-i eth0`).
2. You specify the fields you want to extract (e.g., `-e ip.src -e ip.dst`).
3. `tshark` parses every packet, extracts the requested values, and prints them to the terminal.
4. You can pipe this output to standard Linux text tools (like `grep`, `awk`, or `sort`) to build instant statistics.

## Components / Types
Important command line flags:
- `-r`: Read from a file (e.g., `-r capture.pcap`).
- `-Y`: Apply a display filter (equivalent to Wireshark's search bar).
- `-T`: Define the output format (e.g., `-T fields` or `-T json`).
- `-e`: Specify which field to print (e.g., `-e http.host`).
- `-q`: Quiet mode (suppresses packet counts, useful for statistics).
- `-z`: Statistics gathering (e.g., listing all HTTP conversations).

## Practical Examples
- **Extracting DNS Queries:** You have a 1GB capture file and want to see a list of every domain name queried.
  ```bash
  tshark -r capture.pcap -T fields -e dns.qry.name | sort -u
  ```
- **Finding Malicious User-Agents:** Extract all User-Agents from HTTP requests.
  ```bash
  tshark -r capture.pcap -Y "http.request" -T fields -e http.user_agent | sort | uniq -c
  ```

## Security Considerations
- **Credential Sniffing:** Like any packet analyzer, `tshark` can be used to extract plaintext credentials. An attacker can write a one-line script to monitor port 80 and print out login passwords.
- **Automation Risks:** If `tshark` is used in automated scripts to process untrusted packet captures, vulnerabilities in the Wireshark dissection engine (which are occasionally discovered) could lead to remote code execution on the analysis machine. Keep the software updated.

## Commands / Configuration Examples
Here are practical `tshark` command templates for analysis:

### Common Analysis Commands
```bash
# Capture live traffic on eth0, filtering for only HTTP GET requests, printing the requested URL
sudo tshark -i eth0 -Y "http.request.method == GET" -T fields -e http.host -e http.request.uri

# Extract all unique IP addresses communicating on the network
tshark -r capture.pcap -T fields -e ip.src -e ip.dst | tr '\t' '\n' | sort -u

# Read a capture file and export the output as a clean JSON structure for scripting
tshark -r capture.pcap -T json -c 2 > packets.json
```

## Troubleshooting
- **Slow Performance:** Protocol dissection is CPU-intensive. If `tshark` is running slowly on a massive pcap, use the `-2` flag to enable two-pass analysis, or use `-Y` to narrow down the packets before extracting fields.
- **"Field X not found":** Ensure you are using the correct Wireshark field name. You can find the exact name by opening a packet in the Wireshark GUI, clicking on the field in the middle pane, and reading the status bar at the bottom.

## Interview Questions
- How does `tshark` differ from `tcpdump`? (Answer: `tcpdump` is lightweight and uses simple BPF filtering; `tshark` is heavier but has the full Wireshark dissection engine, allowing for Layer 7 protocol parsing and specific field extraction).
- What flag is used in `tshark` to apply a display filter? (Answer: `-Y`).
- How would you extract all DNS queries from a pcap using `tshark`?
- What output formats does `tshark` support for automation?

## Summary
`tshark` is the power of Wireshark brought to the command line. By enabling granular field extraction, support for advanced display filters, and structured outputs, it is the premier tool for automated packet analysis, scripting, and security forensics.

## References
- [Wireshark](wireshark.md)
- [tcpdump](tcpdump.md)
- [Packet Capture](packet-capture.md)
- [DNS](../06-network-protocols/dns.md)
