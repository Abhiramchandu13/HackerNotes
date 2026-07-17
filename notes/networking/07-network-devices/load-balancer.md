# Load Balancer

> A Load Balancer is a network device or software application that efficiently distributes incoming network traffic across a group of backend servers to ensure high availability and reliability.

## Overview
A single web server can only handle so many simultaneous users before its CPU maxes out and the website crashes. To scale a website to millions of users, you must deploy multiple duplicate web servers. 

A **Load Balancer** sits in front of these servers. When users connect to a website, they connect to the Load Balancer. The Load Balancer acts as a traffic cop, examining the incoming request and seamlessly passing it to the server in the pool that currently has the most available capacity. If a server crashes, the Load Balancer detects the failure and instantly redirects traffic to the surviving servers.

## Why It Matters
High Availability (HA) and horizontal scalability are impossible without load balancing. It is a foundational concept in cloud architecture, enterprise data centers, and modern application deployment. Understanding how load balancers route traffic and maintain session persistence is critical for network engineers, cloud architects, and developers troubleshooting application state issues.

## Core Concepts
- **VIP (Virtual IP):** The single Public IP address exposed by the Load Balancer. To the outside world, this IP *is* the application.
- **Server Pool (Server Farm):** The group of backend servers (Nodes) that actually process the requests.
- **Health Checks:** The Load Balancer continuously pings or sends HTTP requests to the backend servers. If a server fails the health check (e.g., returns a 500 error instead of a 200 OK), the Load Balancer automatically removes it from the pool.
- **Session Persistence (Sticky Sessions):** An algorithm that ensures a specific user is always routed to the *exact same* backend server for the duration of their session. Essential for legacy web apps that store shopping cart data in the local memory of a specific server.

## How It Works (Layer 4 vs Layer 7)
Load balancers operate at two distinct layers:

### Layer 4 Load Balancing (Transport Layer)
- Evaluates traffic based only on **Source/Destination IP** and **TCP/UDP Port**.
- Fast, simple, and requires very little CPU overhead.
- Cannot read the contents of the HTTP request.
- Uses algorithms like **Round Robin** (Server A, then Server B, then Server C) or **Least Connections** (send to the server with the fewest active TCP connections).

### Layer 7 Load Balancing (Application Layer)
- Acts effectively as a [Reverse Proxy](reverse-proxy.md). It decrypts the HTTPS traffic and evaluates the actual HTTP headers, URL paths, and cookies.
- Allows for highly intelligent routing: If the URL is `example.com/video`, route it to the high-bandwidth Video Server Pool. If the URL is `example.com/api`, route it to the high-CPU API Server Pool.
- Slower than Layer 4 due to the overhead of Deep Packet Inspection and SSL termination.

## Components / Types
- **Hardware Load Balancers:** Massive, expensive physical appliances built by vendors like F5 Networks (BIG-IP) or Citrix. Used in large enterprise data centers capable of handling millions of connections per second in silicon.
- **Software Load Balancers:** Applications like HAProxy or Nginx running on standard Linux servers. Extremely popular due to their flexibility and zero hardware cost.
- **Cloud Load Balancers:** Managed services provided by AWS (ALB/NLB), Azure, and GCP. The cloud provider handles the scaling and hardware entirely; the engineer just configures the rules via an API.

## Practical Examples
- **Black Friday Shopping:** An e-commerce site expects massive traffic. They deploy 50 identical web servers. The AWS Application Load Balancer distributes the incoming surge of HTTP requests evenly across all 50 servers, ensuring the site doesn't crash under the load.
- **Zero-Downtime Maintenance:** A sysadmin needs to apply Windows updates to a backend server. They log into the Load Balancer and mark Server 3 as "Draining". The Load Balancer stops sending new users to Server 3. Once the existing users log off, the sysadmin reboots Server 3, updates it, and adds it back to the pool without a single user experiencing an outage.

## Security Considerations
- **DDoS Mitigation:** Because the Load Balancer is the first point of contact, it absorbs the brunt of SYN Floods and connection-exhaustion attacks, shielding the fragile backend application servers.
- **SSL Termination:** Like a reverse proxy, Load Balancers frequently hold the SSL certificates, centralizing cryptographic security and allowing for the inspection of unencrypted traffic by WAF modules before it reaches the backend.
- **X-Forwarded-For:** If a backend server logs an attack, it will show the IP address of the Load Balancer, not the attacker. The Load Balancer must be configured to inject the `X-Forwarded-For` HTTP header so security teams can trace the true origin IP of malicious requests.

## Commands / Configuration Examples
### HAProxy (Software Load Balancer Example)
```text
# Example /etc/haproxy/haproxy.cfg
# Define the frontend (The VIP)
frontend http_front
   bind *:80
   default_backend web_servers

# Define the backend pool with Health Checks and Round-Robin routing
backend web_servers
   balance roundrobin
   # The 'check' parameter tells HAProxy to continuously verify the server is alive
   server web1 10.0.0.51:80 check
   server web2 10.0.0.52:80 check
```

## Troubleshooting
- **Intermittent Login Failures:** A user logs in successfully, clicks a link, and is instantly logged out. This happens when the Load Balancer uses Round-Robin without "Sticky Sessions." Request 1 goes to Server A (where the login occurred). Request 2 goes to Server B (which has no idea who the user is). The solution is to enable Cookie-based Session Persistence, or rewrite the application to store session state in a centralized database (like Redis) instead of local memory.
- **503 Service Unavailable:** The Load Balancer is functioning perfectly, but every single backend server in the pool has failed its health check. The Load Balancer has nowhere to send the traffic and returns a 503 error to the user.

## Interview Questions
- What is the difference between a Layer 4 and a Layer 7 load balancer?
- Explain the concept of "Sticky Sessions" (Session Persistence) and why an application might require it.
- How does a load balancer know if a backend server has crashed? (Answer: Through continuous Health Checks).
- What is the difference between the Round Robin and Least Connections load balancing algorithms?

## Summary
Load Balancers are the cornerstone of scalable architecture. By presenting a single Virtual IP to the world and intelligently distributing the workload across a hidden army of backend servers, they transform fragile, single-server applications into resilient, highly available enterprise systems.

## References
- [Reverse Proxy](reverse-proxy.md)
- [High Availability](../12-enterprise-networking/high-availability.md)
- [HTTP](../06-network-protocols/http.md)
- [AWS Networking](../11-cloud-and-virtual-networking/aws-networking.md)
