# curl

> curl is a powerful command-line tool and library used to transfer data to or from a server using a vast range of protocols, primarily HTTP, HTTPS, FTP, and SFTP.

## Overview
Most people think of `curl` as "that tool that downloads websites," but it is far more than that. **curl** (Client URL) is the Swiss Army knife of network and API troubleshooting. It allows you to craft and send arbitrary requests to web servers and APIs, giving you complete control over the headers, HTTP methods (GET, POST, DELETE), and request body.

It is the definitive tool for testing web applications, load balancers, reverse proxies, and any service that speaks HTTP or HTTPS.

## Why It Matters
For network engineers, `curl` is the go-to utility for checking if a web service is alive and what status code it returns. For developers and security professionals, `curl` is indispensable for interacting with REST APIs, automating requests, testing authentication, and reproducing malicious payloads. If you don't know `curl`, you cannot effectively troubleshoot or test modern web services.

## Core Concepts
- **URL Transfer:** Fetches or sends data to a URL.
- **Stateless Requests:** Every `curl` command is an independent transaction, mirroring the stateless nature of HTTP.
- **Headers:** Allows complete control over HTTP headers (like `Authorization`, `Cookie`, or custom headers).
- **Methods / Verbs:** By default, `curl` performs a `GET`. With flags, you can change it to `POST`, `PUT`, `DELETE`, etc.

## How It Works
1. You provide `curl` with a URL and optional flags.
2. It resolves the domain via DNS.
3. It establishes the underlying TCP/TLS connection to the server.
4. It constructs the HTTP request according to your instructions.
5. It sends the request.
6. It receives the response (status code, headers, body) and prints it to the terminal or saves it to a file.

## Components / Types
Key `curl` capabilities are controlled by flags:
- `-I`: Fetch only the HTTP response headers (HEAD request).
- `-v`: Verbose mode. Shows the entire request/response transaction, including the TCP/TLS handshake.
- `-H`: Add a custom HTTP header.
- `-X`: Specify the HTTP method.
- `-d`: Send a data payload in the request body.
- `-o`: Save the response body to a file.
- `-k`: Insecure. Ignore invalid TLS/SSL certificates (extremely useful for testing self-signed certificates, but dangerous to use casually).

## Practical Examples
- **Health Checks:** A load balancer admin uses `curl -I http://internal-server` to instantly verify if the backend web server is returning a healthy `HTTP/1.1 200 OK` status or a crashing `500 Internal Server Error`.
- **API Testing:** A pentester has discovered a hidden API endpoint. They use `curl` to replay the exact request with custom headers and different JSON body payloads to test for authorization weaknesses and SQL injection.

## Security Considerations
- **Header Manipulation Testing:** Security engineers use `curl -H "X-Forwarded-For: 127.0.0.1"` to test if a web application blindly trusts proxy headers, potentially bypassing IP restrictions.
- **Credential Leaks:** If you include API keys or passwords directly in a shell history command (e.g., `curl -u admin:Password123`), the credentials are saved in your `.bash_history` or PowerShell history file, creating a local security risk.
- **SSRF Testing:** Pentesters use `curl` internally on compromised servers to determine if the server can reach internal metadata endpoints (e.g., AWS `169.254.169.254`) or other private internal services, proving Server-Side Request Forgery potential.

## Commands / Configuration Examples
### Linux / macOS / Windows (with curl installed)
```bash
# 1. Basic GET request, printing the HTML body to stdout
curl http://example.com

# 2. Fetch only the HTTP Response headers
curl -I https://example.com

# 3. Verbose mode: Show the TCP/TLS handshake and all headers
curl -v https://example.com

# 4. Send a POST request with a JSON body to an API
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"alice"}'

# 5. Follow redirects (-L) and ignore bad certificates (-k)
curl -L -k https://internal-bad-cert.local
```

## Troubleshooting
- **Connection Refused:** The TCP connection to the target port failed. The service is likely not running or a local host firewall is blocking it.
- **HTTP 400 / 401 / 403 / 404 / 500:** `curl` is fantastic because it shows the exact HTTP status code, helping instantly identify whether the problem is authentication, permissions, a missing page, or a server crash.
- **Certificate Errors:** If `curl` refuses to connect to a site with a self-signed certificate, the `-k` flag tells it to ignore the TLS validation error. If `-k` works, you have confirmed the problem is the certificate trust, not the network path.

## Interview Questions
- What is the purpose of the `-I` flag in `curl`?
- How do you add a custom HTTP header to a `curl` request? (Answer: `-H "Header: value"`).
- What does the `-k` flag do, and when might you use it in a test environment?
- Why is `curl` considered the ideal tool for API testing?

## Summary
`curl` is the universal command-line client for HTTP and numerous other protocols. By exposing total control over request methods, headers, bodies, and transport-layer details, it provides engineers and security analysts with the most precise utility available for testing, automating, and exploiting web services.

## References
- [HTTP](../06-network-protocols/http.md)
- [HTTPS](../06-network-protocols/https.md)
- [Proxy Server](../07-network-devices/proxy.md)
- [Firewall](../09-network-security/firewalls.md)
