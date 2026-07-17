# Reverse Proxy

> A Reverse Proxy is an intermediary server that sits in front of backend web servers, intercepting incoming requests from the Internet and securely forwarding them to the internal servers.

## Overview
While a standard (Forward) Proxy protects *clients* from the Internet, a **Reverse Proxy** protects *servers* from the Internet. 

When you navigate to `netflix.com`, your browser does not connect directly to the actual Linux server holding the video files. Instead, it connects to a Reverse Proxy. The reverse proxy accepts your connection, evaluates it, retrieves the necessary data from the hidden internal servers, and returns it to you. The internal servers are never directly exposed to the public web.

## Why It Matters
Modern, scalable web architecture relies entirely on reverse proxies. They are the gateway for all inbound HTTP/HTTPS traffic. For network engineers and DevOps professionals, reverse proxies (like Nginx, HAProxy, or Apache) are essential for load balancing, terminating SSL encryption, and combining multiple microservices under a single public domain name.

## Core Concepts
- **Server Anonymity:** External clients have no idea how many backend servers exist, what their internal IP addresses are, or what operating systems they run. They only see the public IP of the reverse proxy.
- **SSL Termination (Offloading):** The reverse proxy holds the expensive, heavy cryptographic certificates. It decrypts incoming HTTPS traffic, and then forwards the traffic to the internal servers via fast, unencrypted HTTP, drastically reducing the CPU load on the backend servers.
- **Path-Based Routing:** A reverse proxy can look at the URL path and send traffic to entirely different servers. (e.g., `example.com/blog` goes to a WordPress server, while `example.com/api` goes to a Node.js server).
- **Caching:** Just like a forward proxy caches downloads for users, a reverse proxy caches static images and HTML pages, serving them instantly to users without ever bothering the backend servers.

## How It Works
1. A user types `https://api.example.com/data` in their browser.
2. DNS resolves this to the Public IP address of the Reverse Proxy.
3. The user's browser completes a TLS handshake with the Reverse Proxy. The proxy decrypts the HTTP request.
4. The proxy reads its configuration file. It sees a rule: "If the requested host is `api.example.com`, forward the request to the internal server pool at `10.0.0.50`."
5. The reverse proxy opens a fresh TCP connection to the internal server at `10.0.0.50`, fetches the JSON data, and passes it back through the TLS tunnel to the external user.

## Components / Types
- **Web Server Reverse Proxies:** Nginx and Apache are highly efficient web servers that double as massive reverse proxies.
- **Ingress Controllers:** In Kubernetes environments, an Ingress Controller (often based on Nginx or Traefik) acts as an automated reverse proxy, dynamically routing external traffic to internal containers.
- **Web Application Firewalls (WAF):** A specialized reverse proxy that deeply inspects the inbound HTTP request for malicious payloads (like SQL injection) before deciding whether to forward it to the backend server.

## Practical Examples
- **Microservices Architecture:** A company rewrites a monolithic application into 50 tiny microservices. Instead of making users memorize 50 different IP addresses and ports, they deploy a reverse proxy. The proxy exposes a single domain `app.company.com` on port 443, and routes the traffic internally based on the API endpoints requested.
- **Cloudflare:** Cloudflare operates one of the world's largest global reverse proxies. You point your DNS to Cloudflare, and all web traffic hits their proxy servers first, allowing them to absorb DDoS attacks, cache content, and filter bad traffic before passing the clean requests to your actual web host.

## Security Considerations
- **Hiding the Backend:** Because the backend servers only accept traffic from the Reverse Proxy's internal IP address, you can tightly lock down their local firewalls. Even if an attacker discovers a zero-day exploit in the backend web application software, they cannot access the port directly from the internet to exploit it.
- **Header Injection:** When a reverse proxy forwards traffic, the backend server thinks every request is coming from the Proxy's IP address. To fix this, the reverse proxy must inject the `X-Forwarded-For` HTTP header, passing the user's real public IP address to the backend for accurate logging and rate-limiting. Attackers frequently attempt to spoof this header.
- **WAF Integration:** Reverse proxies are the ideal location to integrate ModSecurity or other WAF modules, blocking malicious HTTP requests at the perimeter.

## Commands / Configuration Examples
### Nginx (Classic Reverse Proxy Configuration)
```nginx
# Example /etc/nginx/sites-available/default
server {
    listen 80;
    server_name api.example.com;

    location / {
        # Forward all traffic to the internal Node.js server
        proxy_pass http://10.0.0.50:3000;
        
        # Preserve the original host and client IP for the backend logs
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_addrs;
    }
}
```

## Troubleshooting
- **502 Bad Gateway:** The most infamous reverse proxy error. It means the reverse proxy successfully received the user's request, but when it tried to contact the backend server (e.g., `10.0.0.50:3000`), the connection was refused. The backend server is likely crashed, turned off, or blocking the proxy via a local firewall.
- **504 Gateway Timeout:** The reverse proxy contacted the backend server, but the backend server took too long to process the request (e.g., a database query took 60 seconds). The proxy gave up and threw an error to the user.
- **Mixed Content Warnings / Redirect Loops:** Occurs heavily during SSL Offloading. If the backend server (running HTTP) sends a redirect telling the user to go to `http://example.com`, the user tries HTTP, hits the proxy, the proxy forces them to HTTPS, they hit the backend, which redirects to HTTP again. You must configure the backend app to be "proxy-aware."

## Interview Questions
- What is the difference between a forward proxy and a reverse proxy?
- Explain the concept of SSL Termination (SSL Offloading).
- What HTTP header is used by a reverse proxy to pass the client's original IP address to the backend server? (Answer: X-Forwarded-For).
- If a user sees a "502 Bad Gateway" error, where does the fault likely reside? (Answer: On the backend internal server, or the network connection between the proxy and the backend).

## Summary
The reverse proxy is the invisible shield and orchestrator of modern web hosting. By centralizing encryption, routing, and caching at the network edge, reverse proxies allow complex, fragile backend architectures to present a unified, fast, and secure face to the global Internet.

## References
- [Proxy Server](proxy.md)
- [Load Balancer](load-balancer.md)
- [HTTP](../06-network-protocols/http.md)
- [HTTPS](../06-network-protocols/https.md)
