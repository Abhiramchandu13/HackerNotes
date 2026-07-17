# Proxy Server

> A Proxy Server is an intermediary device or software that sits between client computers and the Internet, intercepting client requests and making them on the client's behalf to provide security, filtering, and caching.

## Overview
Normally, when a computer wants to view a website, it connects directly to the web server. A **Proxy Server** breaks this direct connection. Operating primarily at the **Application Layer (Layer 7)**, the proxy forces the client to ask the proxy to fetch the website instead. 

Historically known as "Forward Proxies" or "Web Proxies," these devices were heavily utilized in the 1990s and 2000s to speed up slow internet connections via caching, and to strictly control which websites employees were allowed to visit.

## Why It Matters
While Next-Generation Firewalls (NGFWs) have absorbed many traditional proxy features, dedicated web proxies (like Squid or Blue Coat) are still prevalent in highly secure enterprise and government environments. For cybersecurity professionals, proxies are critical choke points for data loss prevention (DLP) and malware inspection. Furthermore, understanding proxies is essential for penetration testers who must configure their attack tools (like Burp Suite) to tunnel through corporate proxy infrastructure.

## Core Concepts
- **Intermediary:** The proxy makes the network request on behalf of the client. The destination web server sees the IP address of the Proxy, *not* the IP address of the internal user.
- **Caching:** If User A downloads a 50MB Windows update, the proxy saves a copy. When User B requests the exact same file 10 minutes later, the proxy delivers it instantly from its local cache, saving external internet bandwidth.
- **Content Filtering:** The proxy can inspect the URL, the requested domain, and the actual HTML content to enforce corporate policies (e.g., blocking social media or malicious domains).
- **Anonymity:** Because the destination server only sees the proxy's IP, the client's internal IP and identity are hidden.

## How It Works (Explicit Forward Proxy)
1. An administrator configures the employee's web browser settings to point to the Proxy Server IP (e.g., `10.0.0.100` on port `8080`).
2. The employee types `http://example.com`.
3. The browser does *not* do a DNS lookup for `example.com`. Instead, it opens a TCP connection to the Proxy Server at `10.0.0.100`.
4. The browser sends a special HTTP request to the proxy: `GET http://example.com HTTP/1.1`.
5. The Proxy Server receives the request. It checks its ACLs and URL filtering categories. It determines the site is allowed.
6. The Proxy Server performs the DNS lookup, opens a TCP connection to `example.com`, and downloads the webpage.
7. The Proxy Server passes the downloaded HTML back to the employee's browser.

## Components / Types
- **Explicit Proxy:** The client OS or browser must be manually configured (or configured via PAC files/Group Policy) to know the proxy exists and to send traffic to it.
- **Transparent / Intercepting Proxy:** The client has no idea a proxy exists. A router or firewall intercepts all outbound Port 80/443 traffic at the network level and silently redirects it into the proxy engine for inspection.
- **Reverse Proxy:** The exact opposite of a forward proxy. It sits in front of *internal* web servers, intercepting requests from the *Internet* to protect and load-balance the servers. (See [Reverse Proxy](reverse-proxy.md)).

## Practical Examples
- **School Internet Filtering:** A school district forces all student Chromebooks to use a cloud-based explicit proxy (like Zscaler). If a student tries to access a gaming site, the proxy intercepts the request, checks its database, and returns an "Access Denied by District Policy" HTML page instead of the game.
- **Burp Suite (Pentesting):** A security engineer configures their Firefox browser to use `127.0.0.1:8080` as an explicit proxy. Burp Suite listens on that port. Now, every time the engineer clicks a link, the HTTP request pauses inside Burp Suite, allowing the engineer to manually alter the HTTP headers before forwarding it to the target website.

## Security Considerations
- **Bypassing the Proxy:** If an explicit proxy is used, but the edge firewall still allows direct internet access from user IP addresses, tech-savvy users will simply remove the proxy settings from their browser to bypass all security filtering. Firewalls must be configured to *only* allow outbound internet traffic originating from the Proxy's IP address.
- **HTTPS Inspection:** Proxies cannot read the contents of an encrypted HTTPS stream. To filter URLs or scan for malware, modern proxies must act as a Man-in-the-Middle, utilizing a trusted corporate root certificate to decrypt, inspect, and re-encrypt the traffic before it reaches the user.
- **Data Loss Prevention (DLP):** Proxies are the ideal place to deploy DLP. The proxy inspects outbound POST requests (like uploading a file to Dropbox) and blocks the transfer if it detects sensitive data like credit card numbers.

## Commands / Configuration Examples
### Linux (Using Squid Proxy)
Squid is the most famous open-source caching proxy.
```bash
# Example /etc/squid/squid.conf snippet
# Define the local network
acl localnet src 10.0.0.0/8

# Block a specific domain
acl badsites dstdomain .badwebsite.com
http_access deny badsites

# Allow the local network to use the proxy
http_access allow localnet

# Listen on port 3128
http_port 3128
```

### Linux / Windows (Client Environment Variables)
Many command-line tools (like `curl`, `wget`, `apt`, `git`) do not use the browser's proxy settings. You must define them in the OS environment.
```bash
export http_proxy=http://10.0.0.100:8080
export https_proxy=http://10.0.0.100:8080
curl http://example.com
```

## Troubleshooting
- **"Proxy Server Refused Connection":** This means the browser is trying to use a proxy, but the proxy service is down, the IP is wrong, or the proxy's internal ACLs are denying the user's source IP address from utilizing the proxy service.
- **Software Updates Failing:** While browsers work fine, background applications (like antivirus updaters or Java runtimes) often fail in explicit proxy environments because they are not "proxy-aware" and attempt to connect directly to the internet, which the firewall drops.
- **Certificate Errors:** If SSL Decryption is enabled on the proxy, but the IT department failed to push the Proxy's Root Certificate to the client machines via Active Directory, users will receive severe certificate warnings on every HTTPS website.

## Interview Questions
- Explain the fundamental difference between a Forward Proxy and a Reverse Proxy.
- How does an Explicit Proxy differ from a Transparent Proxy?
- Why might a company choose to implement SSL/TLS decryption on their corporate web proxy?
- How does a proxy server help conserve internet bandwidth? (Answer: Through caching frequently requested static content).

## Summary
The proxy server is the ultimate intermediary for outbound web traffic. By severing direct connections to the Internet, proxy servers provide organizations with absolute control over content filtering, caching, and deep packet inspection, serving as a critical checkpoint in a defense-in-depth architecture.

## References
- [Reverse Proxy](reverse-proxy.md)
- [Load Balancer](load-balancer.md)
- [HTTP](../06-network-protocols/http.md)
- [Next-Gen Firewalls (NGFW)](next-gen-firewalls.md)
