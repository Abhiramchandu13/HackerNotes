# OSI Model Overview

> The Open Systems Interconnection (OSI) model is a 7-layer conceptual framework that standardizes how different networking technologies communicate.

## Overview
The OSI model breaks down the complex process of network communication into seven manageable layers. Developed by the International Organization for Standardization (ISO), it serves as a universal language for IT professionals to describe network functions, regardless of the underlying vendor or hardware.

While modern networks actually run on the TCP/IP model, the OSI model remains the industry standard for teaching, designing, and troubleshooting networks.

## Why It Matters
Understanding the OSI model is essential because:
- **Troubleshooting:** It provides a step-by-step methodology (e.g., "bottom-up" or "top-down" troubleshooting). If you know a problem is at Layer 3 (Network), you don't waste time checking Layer 7 (Application).
- **Vendor Agnostic:** It allows Cisco routers, Windows servers, and Linux endpoints to seamlessly communicate.
- **Security:** Firewalls and IDS/IPS operate at specific layers. Knowing which layer an attack targets is critical for defense.

## Core Concepts
The OSI model consists of seven layers, numbered from bottom to top:
7. **Application Layer:** Network process to application (HTTP, FTP).
6. **Presentation Layer:** Data representation and encryption (TLS, JPEG).
5. **Session Layer:** Interhost communication (RPC, NetBIOS).
4. **Transport Layer:** End-to-end connections and reliability (TCP, UDP).
3. **Network Layer:** Path determination and logical addressing (IP, routers).
2. **Data Link Layer:** Physical addressing and media access (MAC, switches).
1. **Physical Layer:** Media, signal, and binary transmission (cables, hubs).

*Mnemonic to remember (Bottom-Up):* **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way.

## How It Works
When a device sends data, it travels *down* the OSI model (Layer 7 down to Layer 1), a process called Encapsulation. When the receiving device gets the data, it travels *up* the model (Layer 1 up to Layer 7), called Decapsulation. At each layer, specific headers or trailers are added or removed to ensure the data is handled correctly by the corresponding layer on the receiving end.

## Components / Types
The layers are often grouped into two categories:
- **Upper Layers (Host Layers):** Layers 5, 6, and 7. These deal with application data, formatting, and session management. They are typically implemented in software.
- **Lower Layers (Media Layers):** Layers 1, 2, 3, and 4. These are responsible for the physical delivery of data over the network and are implemented in hardware and operating system networking stacks.

## Practical Examples
- **User Action:** You open a web browser and type `www.example.com`.
- **Layer 7:** The browser generates an HTTP request.
- **Layer 6:** The request is encrypted via TLS.
- **Layer 5:** A session is established with the web server.
- **Layer 4:** The data is broken into segments, and TCP ports are assigned (Source: 54321, Dest: 443).
- **Layer 3:** Segments become packets with Source and Destination IP addresses.
- **Layer 2:** Packets become frames with Source and Destination MAC addresses.
- **Layer 1:** Frames are converted to bits (1s and 0s) and sent over the Ethernet cable or Wi-Fi.

## Security Considerations
Security controls map directly to OSI layers:
- **Layer 7:** Web Application Firewalls (WAFs) inspect HTTP traffic for SQL injection.
- **Layer 4/3:** Traditional stateful firewalls block IP addresses and TCP/UDP ports.
- **Layer 2:** Port security on switches prevents MAC flooding attacks.
- **Layer 1:** Physical security prevents attackers from plugging into an open wall jack.

## Commands / Configuration Examples
Because the OSI model is conceptual, there are no specific configuration commands for the model itself. However, troubleshooting tools map to layers:

### Linux
```bash
ping 8.8.8.8         # Layer 3 test
nc -vz 8.8.8.8 443   # Layer 4 test
curl -I https://...  # Layer 7 test
```

### Windows
```powershell
Test-NetConnection 8.8.8.8         # Layer 3
Test-NetConnection 8.8.8.8 -Port 443 # Layer 4
```

### Cisco IOS
```text
ping 8.8.8.8         ! Layer 3
telnet 8.8.8.8 80    ! Layer 4/7
```

## Troubleshooting
The OSI model defines troubleshooting methodologies:
- **Bottom-Up:** Start at Layer 1 (Is the cable plugged in?) and work your way up to Layer 7 (Is the web server running?). Best for suspected physical issues.
- **Top-Down:** Start at Layer 7 (Does the app load?) and work down. Best for application or DNS issues.
- **Divide-and-Conquer:** Start at Layer 3 (Can I ping the gateway?). If yes, work up. If no, work down. Highly efficient for experienced engineers.

## Interview Questions
- Name the 7 layers of the OSI model in order.
- Which layer is responsible for logical addressing (IP)?
- At which OSI layer does a router operate? A switch? A hub?
- Explain the difference between top-down and bottom-up troubleshooting.

## Summary
The OSI model is the foundational map of networking. While protocols are implemented via the TCP/IP suite, the OSI model's 7-layer structure provides the vocabulary and framework for all network design, security, and troubleshooting.

## References
- [Physical Layer](physical-layer.md)
- [Data Link Layer](data-link-layer.md)
- [TCP/IP Model](tcp-ip-model.md)
- [Encapsulation and Decapsulation](encapsulation-and-decapsulation.md)
