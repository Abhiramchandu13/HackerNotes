# HTTPS (Hypertext Transfer Protocol Secure)

> HTTPS is the secure version of HTTP, encapsulating web traffic within an encrypted TLS tunnel to provide confidentiality, data integrity, and server authentication.

## Overview
Standard HTTP transmits everything—passwords, credit card numbers, personal messages—in plain text. Anyone monitoring the network path can read or alter the data. **HTTPS** solves this by inserting a cryptographic layer (TLS/SSL) between the Application Layer (HTTP) and the Transport Layer (TCP). 

Operating by default over **TCP port 443**, HTTPS ensures that even if an attacker intercepts the traffic, they see nothing but mathematically indecipherable gibberish. 

## Why It Matters
HTTPS is no longer optional; it is the absolute minimum standard for the modern web. Browsers like Chrome and Firefox now aggressively flag websites using standard HTTP as "Not Secure." For network and security professionals, understanding HTTPS is vital for managing certificates, configuring reverse proxies, and deploying SSL Inspection/Decryption firewalls to detect malware hidden in encrypted streams.

## Core Concepts
- **TLS (Transport Layer Security):** The modern cryptographic protocol used to secure HTTPS. (SSL is its deprecated, insecure predecessor).
- **Confidentiality:** Data is encrypted; eavesdroppers cannot read it.
- **Integrity:** Data cannot be modified in transit without breaking the cryptographic math, ensuring the file you downloaded wasn't altered by a Man-in-the-Middle.
- **Authentication:** By leveraging Digital Certificates and Public Key Infrastructure (PKI), HTTPS proves to the client that the server they are talking to is the legitimate owner of the domain, not an imposter.

## How It Works (The TLS Handshake)
Before a single HTTP `GET` request is sent, HTTPS requires a complex handshake:
1. **TCP Handshake:** Client and server complete the standard SYN/SYN-ACK/ACK.
2. **Client Hello:** Client says "I want to speak TLS. Here are the cipher suites I support."
3. **Server Hello & Certificate:** Server picks a secure cipher and sends back its Digital Certificate (which contains its Public Key and a cryptographic signature from a trusted Certificate Authority like Let's Encrypt or DigiCert).
4. **Validation:** The client's browser verifies the certificate against its internal list of trusted CAs to ensure the server is legitimate.
5. **Key Exchange:** The client uses the server's Public Key to securely negotiate a shared, symmetric "Session Key."
6. **Encrypted Communication:** The TLS tunnel is now established. The client sends standard HTTP requests inside the tunnel, encrypted by the Session Key.

## Components / Types
- **HSTS (HTTP Strict Transport Security):** A web server response header that tells the browser, "Never use HTTP for this domain, only use HTTPS." This prevents attackers from attempting to downgrade the connection.
- **Wildcard Certificates:** A single certificate (e.g., `*.example.com`) that secures the main domain and all subdomains, simplifying administration.
- **SNI (Server Name Indication):** A crucial extension to TLS. It allows a client to tell the server exactly which domain it wants *during* the initial handshake. This allows a single web server (with one IP) to host multiple HTTPS websites and serve the correct certificate for each.

## Practical Examples
- **Online Banking:** Without HTTPS, your login credentials and account balances would traverse the internet in cleartext, readable by your local coffee shop Wi-Fi admin, your ISP, and every router in between.
- **Reverse Proxies:** In corporate architectures, web servers often don't handle HTTPS themselves. A Load Balancer or Reverse Proxy (like Nginx) terminates the TLS connection, handles the certificates, and forwards raw HTTP back to the internal web servers (SSL Offloading).

## Security Considerations
- **SSL Stripping / Downgrade Attacks:** An attacker acting as a Man-in-the-Middle intercepts an HTTP request and blocks the server's attempt to redirect the user to HTTPS. The user browses in HTTP without noticing. (HSTS defeats this).
- **Certificate Errors:** If a user sees "Your connection is not private," it means the cryptographic trust is broken. The certificate might be expired, signed by an untrusted entity, or assigned to the wrong domain. Users often ignore this warning, exposing themselves to interception.
- **SSL Inspection (Corporate):** Because malware frequently hides in HTTPS traffic, corporate Next-Gen Firewalls act as intentional MitM devices. They install a custom Root Certificate on all employee PCs, decrypt all outbound HTTPS traffic, scan it for viruses, and re-encrypt it before sending it to the Internet.

## Commands / Configuration Examples
### Linux (OpenSSL Diagnostics)
```bash
# Manually initiate a TLS handshake and view the server's certificate details
openssl s_client -connect example.com:443

# Check if a certificate matches a private key
openssl x509 -noout -modulus -in cert.crt | openssl md5
openssl rsa -noout -modulus -in private.key | openssl md5
```

### Linux (cURL)
```bash
# Make an HTTPS request (curl validates the certificate automatically)
curl -I https://example.com

# Force curl to ignore certificate validation errors (Insecure, useful for testing self-signed certs)
curl -k -I https://example.com
```

## Troubleshooting
- **Mixed Content Warnings:** A page loads securely over HTTPS, but the browser shows a warning icon. This means the HTML loaded securely, but an image or script on the page was loaded using standard `http://`. Browsers block this by default.
- **Connection Resets (No SNI):** If you try to connect to a modern HTTPS site using legacy software or older curl versions that don't support SNI, the server won't know which certificate to serve and will drop the connection during the handshake.

## Interview Questions
- What port does HTTPS operate on by default?
- Explain the purpose of a Digital Certificate in the TLS handshake.
- What is HSTS and what specific attack does it prevent?
- If you capture HTTPS traffic using Wireshark, can you read the HTTP headers (like the requested URL path)? (Answer: No, the entire HTTP payload, including headers, is encrypted inside the TLS tunnel).

## Summary
HTTPS guarantees that web communication is private, tamper-proof, and authenticated. By wrapping the ubiquitous HTTP protocol in robust cryptography, it provides the essential layer of trust required for e-commerce, private communications, and secure API integrations across the globe.

## References
- [HTTP](http.md)
- [TCP](tcp.md)
- [Presentation Layer](../02-osi-and-tcpip-models/presentation-layer.md)
- [TLS Security](../09-network-security/tls.md)
