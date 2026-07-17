# TLS (Transport Layer Security)

> TLS is a cryptographic protocol that provides end-to-end security for data sent between applications over a network, ensuring confidentiality, integrity, and authenticity.

## Overview
Whenever you see a padlock icon in your web browser next to a URL starting with `https://`, you are using **Transport Layer Security (TLS)**. It is the successor to the deprecated SSL (Secure Sockets Layer). TLS is the most widely deployed encryption protocol in the world, operating at the **Presentation Layer (Layer 6)** of the OSI model. 

It acts as a secure "wrapper" around Application layer protocols like HTTP, SMTP, or FTP, protecting them from being intercepted or modified on their journey across the untrusted Internet.

## Why It Matters
Modern digital life is built on TLS. Online banking, e-commerce, private messaging, and secure APIs all depend on it. For network and security engineers, understanding the TLS handshake, cipher suites, and certificate validation process is absolutely critical for deploying secure applications and troubleshooting connectivity issues.

## Core Concepts
TLS guarantees the three pillars of the CIA Triad:
- **Confidentiality:** Uses symmetric encryption (like AES-GCM) to encrypt the actual data stream.
- **Integrity:** Uses a Message Authentication Code (MAC) or HMAC to ensure the data has not been tampered with in transit.
- **Authenticity:** Uses Digital Certificates and Public Key Infrastructure (PKI) to prove the server you are connecting to is the legitimate owner of the domain, not a phishing site.

## How It Works (The TLS Handshake)
Before any application data is sent, the client and server perform a complex negotiation:
1. **Client Hello:** The client (e.g., your browser) sends a message saying, "I want to talk. Here are the TLS versions and cipher suites I support."
2. **Server Hello & Certificate:** The server picks the strongest cipher they both support. It replies with its chosen cipher and sends its **Digital Certificate**. The certificate contains the server's Public Key and is cryptographically signed by a trusted Certificate Authority (CA) like Let's Encrypt.
3. **Client Validation:** The client checks the certificate's signature against its built-in list of trusted CAs. It verifies the domain name on the certificate matches the URL.
4. **Key Exchange:** Using asymmetric cryptography (like Diffie-Hellman), the client and server securely generate a shared, one-time-use **Session Key**.
5. **Secure Session:** The handshake is complete. All subsequent HTTP traffic is encrypted symmetrically using the session key.

## Components / Types
- **SSL (Secure Sockets Layer):** The original protocol. Versions 2.0 and 3.0 are completely broken and deprecated.
- **TLS 1.0 & 1.1:** Early versions of TLS. Now also deprecated due to cryptographic weaknesses.
- **TLS 1.2:** The long-standing modern baseline. Highly secure.
- **TLS 1.3:** The latest standard. Faster handshake, removes obsolete ciphers, and improves security.
- **Cipher Suite:** The combination of algorithms used for key exchange, bulk encryption, and message authentication (e.g., `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`).

## Practical Examples
- **HTTPS:** The most common use. HTTP traffic wrapped in a TLS tunnel.
- **DoH/DoT:** DNS over HTTPS and DNS over TLS. Encrypts DNS queries to prevent ISP snooping.
- **SMTPS, IMAPS, FTPS:** Secure versions of email and file transfer protocols that run inside a TLS tunnel.

## Security Considerations
- **SSL Stripping:** An attacker performs a Man-in-the-Middle attack, intercepting a user's initial `http://` request and blocking the server's attempt to redirect to `https://`. The attacker communicates with the server over HTTPS, but serves the content back to the user over unencrypted HTTP, allowing them to steal passwords. (HSTS defeats this).
- **Weak Cipher Suites:** If a server is misconfigured to support old, weak encryption algorithms (like RC4 or Triple DES), an attacker can force a "downgrade" attack, making the encryption easier to crack.
- **SSL Decryption / Inspection:** Because TLS hides data from network devices, corporate Next-Gen Firewalls cannot inspect for malware. They must perform legal, man-in-the-middle decryption by installing a trusted corporate root certificate on all employee computers, allowing the firewall to decrypt, scan, and re-encrypt the traffic.

## Commands / Configuration Examples
### Linux (OpenSSL)
The `openssl` command is the ultimate tool for TLS diagnostics.
```bash
# Connect to a server and display the entire certificate and handshake details
openssl s_client -connect www.google.com:443

# Test if a server supports the insecure, deprecated SSLv3 protocol
openssl s_client -connect server.example.com:443 -ssl3
```

### Web Server Configuration (Nginx)
```nginx
# Example nginx config to enforce strong TLS
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM';
```

## Troubleshooting
- **Certificate Expiration:** The most common TLS error. If an administrator forgets to renew the server's certificate, browsers will display a severe "Your connection is not private" warning and block access.
- **Cipher Mismatch:** A very old client (like a Windows XP machine) tries to connect to a modern server that only supports TLS 1.3. They have no common cipher suites to agree upon. The handshake will fail.
- **Chain of Trust Issues:** If a server presents a certificate that is not signed by a CA in the client's trusted root store, the validation will fail.

## Interview Questions
- What are the three security guarantees provided by the TLS protocol?
- Explain the role of a Certificate Authority (CA) in the TLS handshake.
- What is the difference between SSL and TLS?
- How does "SSL Decryption" work on a corporate firewall?

## Summary
TLS is the cryptographic bedrock of the secure internet. Through a sophisticated handshake involving asymmetric and symmetric cryptography, it establishes a private, authenticated, and untampered channel, allowing sensitive applications like banking and e-commerce to operate safely over untrusted networks.

## References
- [HTTPS](../06-network-protocols/https.md)
- [SSL VPN](ssl-vpn.md)
- [Presentation Layer](../02-osi-and-tcpip-models/presentation-layer.md)
- [CIA in Networking](cia-in-networking.md)
