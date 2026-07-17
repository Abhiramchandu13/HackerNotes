# HTTP (Hypertext Transfer Protocol)

> HTTP is the foundational Application layer protocol of the World Wide Web, used to request and transmit web pages, media, and API data across the Internet.

## Overview
**Hypertext Transfer Protocol (HTTP)** is the language browsers use to speak to web servers. It dictates how messages are formatted and transmitted, and what actions web servers and browsers should take in response to various commands. Operating typically over **TCP port 80**, HTTP is a plaintext protocol, meaning all data is transmitted in readable text.

While modern browsing relies heavily on HTTPS (secure HTTP), understanding raw HTTP is essential because it forms the underlying mechanics for web applications, REST APIs, and application-layer cyber attacks.

## Why It Matters
HTTP is the most ubiquitous protocol in existence today. For developers and network engineers, understanding HTTP headers, methods, and status codes is required to build and troubleshoot web applications and load balancers. For security professionals, HTTP is the primary attack vector for the OWASP Top 10 vulnerabilities (like SQL Injection and XSS). 

## Core Concepts
- **Client-Server Model:** A client (browser) opens a connection and makes a Request. The server processes it and returns a Response.
- **Stateless:** Every HTTP request is completely independent. The server has no memory of the previous request. (Developers must use "Cookies" to artificially create a sense of state or "login sessions").
- **Methods (Verbs):** The action the client wants to perform (e.g., `GET`, `POST`).
- **Headers:** Metadata attached to the request or response (e.g., telling the server what browser is being used, or what format to return the data in).
- **Status Codes:** A 3-digit number from the server indicating success or failure.

## How It Works (The HTTP Transaction)
1. **Connection:** The client establishes a TCP 3-way handshake with the server on port 80.
2. **Request:** The client sends an HTTP Request in plaintext:
   ```http
   GET /index.html HTTP/1.1
   Host: www.example.com
   User-Agent: Mozilla/5.0
   ```
3. **Processing:** The web server (like Apache or IIS) parses the headers, finds `index.html` on its hard drive, and generates a response.
4. **Response:** The server sends back the HTTP Response containing a status code and the actual HTML data:
   ```http
   HTTP/1.1 200 OK
   Content-Type: text/html
   Content-Length: 125

   <html><body>Hello World</body></html>
   ```
5. **Closure:** The TCP connection is closed (or kept alive for subsequent requests).

## Components / Types
### Common HTTP Methods
- **GET:** Retrieve data from the server (e.g., loading a webpage). Data is sent in the URL.
- **POST:** Submit data to the server (e.g., submitting a login form). Data is sent securely in the request body.
- **PUT:** Update existing data on the server.
- **DELETE:** Remove data from the server.

### Common Status Codes
- **2xx (Success):** `200 OK`
- **3xx (Redirection):** `301 Moved Permanently`, `302 Found`
- **4xx (Client Error):** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found` (The file doesn't exist).
- **5xx (Server Error):** `500 Internal Server Error` (The server's code crashed), `503 Service Unavailable`.

## Practical Examples
- **REST APIs:** Modern mobile apps rarely load HTML. Instead, they use HTTP to interact with REST APIs. The app sends a `GET /api/users/1` and the server responds with pure JSON data, utilizing HTTP purely as a transport mechanism.
- **Cookies:** Because HTTP is stateless, when you log into Amazon, the server replies with a `Set-Cookie` header. Your browser stores this token and attaches it to every subsequent HTTP request, proving you are still logged in.

## Security Considerations
- **Cleartext Transmission:** HTTP sends absolutely everything in plaintext. If a user logs into a website over HTTP, anyone on the local Wi-Fi, the ISP, or intercepting routers can read the username and password using Wireshark. **Never use HTTP for sensitive data.**
- **Header Manipulation:** Attackers can craft malicious HTTP headers (like `X-Forwarded-For`) to bypass IP restrictions or exploit vulnerabilities in the web server's logging software (e.g., Log4Shell).
- **Web Application Firewalls (WAF):** Traditional firewalls just allow port 80. A WAF performs deep packet inspection, tearing apart the HTTP request to look for malicious strings (like `<script>`) inside the URL or POST body before passing it to the server.

## Commands / Configuration Examples
### Linux / macOS
```bash
# Perform a basic GET request and print the HTML
curl http://example.com

# Fetch only the HTTP Response Headers (-I) to check the Status Code
curl -I http://example.com

# Use netcat to manually type an HTTP request to a server
nc example.com 80
GET / HTTP/1.1
Host: example.com
[Press Enter Twice]
```

### Windows
```powershell
# Perform a web request and view the parsed response
Invoke-WebRequest -Uri "http://example.com"
```

## Troubleshooting
- **404 Not Found:** The network is working perfectly, but the developer deleted or moved the file the user is asking for.
- **500 Internal Error:** The network is fine, and the file is there, but the backend script (like PHP or Python) threw an unhandled exception and crashed while trying to generate the page.
- **Infinite Redirect Loop:** A common misconfiguration where Page A returns a 301 redirect to Page B, but Page B returns a 301 redirect back to Page A. Browsers will eventually throw an `ERR_TOO_MANY_REDIRECTS`.

## Interview Questions
- What port does HTTP use by default, and what underlying transport protocol does it rely on? (Answer: TCP port 80).
- Explain the difference between an HTTP GET and an HTTP POST.
- If a server responds with a 403 status code, what does that mean?
- Why is HTTP considered a "stateless" protocol, and how do web applications overcome this?

## Summary
HTTP is the cornerstone of web communication. By defining a robust, human-readable structure of Methods, Headers, and Status Codes, it provides the universal format required for clients and servers to exchange the vast array of content that makes up the modern Internet.

## References
- [HTTPS](https.md)
- [TCP](tcp.md)
- [DNS](dns.md)
- [Application Layer](../02-osi-and-tcpip-models/application-layer.md)
