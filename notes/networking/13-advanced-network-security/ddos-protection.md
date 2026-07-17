# DDoS Protection

> Distributed Denial of Service (DDoS) Protection involves network architectures and specialized hardware designed to absorb, filter, and mitigate massive floods of malicious traffic intended to overwhelm a target system.

## Overview
A Denial of Service attack is simple: send more traffic to a server than it can handle, causing it to crash or stop responding to legitimate users. A **Distributed Denial of Service (DDoS)** attack amplifies this by using a "botnet"—tens of thousands of compromised computers worldwide—to attack the target simultaneously. 

Standard firewalls and routers cannot stop a massive DDoS attack. If 100 Gbps of junk traffic hits a firewall with a 10 Gbps internet connection, the internet pipe itself fills up before the firewall can even drop the packets. **DDoS Protection** requires specialized external networks and high-capacity filtering techniques to scrub the traffic *before* it reaches the corporate perimeter.

## Why It Matters
DDoS attacks are cheap to execute and devastating in their impact. They are used for extortion, hacktivism, and as a smokescreen to hide concurrent data breaches. For network engineers, surviving a DDoS attack is the ultimate test of infrastructure resilience, BGP routing control, and incident response planning.

## Core Concepts
DDoS attacks generally fall into three categories:
1. **Volumetric Attacks:** Pure bandwidth exhaustion. Sending massive amounts of data (like UDP floods or ICMP floods) to clog the internet pipe.
2. **Protocol / Network-Layer Attacks:** Exhausting the memory or state tables of firewalls and load balancers (e.g., TCP SYN floods, Smurf attacks).
3. **Application-Layer Attacks (Layer 7):** Sending seemingly legitimate HTTP requests that require massive backend processing (e.g., repeatedly searching a complex database), crashing the web server using very little actual bandwidth.

## How It Works (Cloud Mitigation Strategy)
Because a local corporate firewall cannot stop a volumetric attack that exceeds its internet connection speed, modern DDoS protection relies on Cloud Scrubbing Centers (e.g., Cloudflare, Akamai, AWS Shield).

1. An enterprise web server (`203.0.113.10`) is hit by a 50 Gbps UDP flood. The 1 Gbps corporate internet link goes down instantly.
2. The Network Engineer initiates a **BGP Route Advertisement** change. 
3. The engineer tells the global internet: "To reach `203.0.113.0/24`, don't send traffic directly to me anymore. Send it to the Cloudflare Scrubbing Center."
4. The massive attack traffic immediately redirects to Cloudflare's massive global network, which can easily absorb terabytes of data.
5. Cloudflare's hardware analyzes the traffic, drops the malicious UDP flood, and forwards only the clean, legitimate HTTP requests to the enterprise web server over a secure, dedicated GRE tunnel.
6. The website stays online.

## Components / Types
- **Anycast Routing:** CDNs use Anycast to distribute the attack load. If 100,000 bots attack an Anycast IP, the traffic is naturally divided among the 50 closest data centers worldwide, diluting the attack so no single data center is overwhelmed.
- **BGP Flowspec:** A protocol that allows an ISP or mitigation provider to rapidly distribute highly specific firewall filters (e.g., "Drop all UDP traffic on port 123 originating from this subnet") across the entire internet backbone in seconds.
- **WAF (Web Application Firewall):** Essential for stopping Layer 7 (Application) attacks by identifying malicious HTTP request patterns that evade volumetric filters.
- **SYN Cookies:** A cryptographic technique used by load balancers and firewalls to mitigate TCP SYN floods. Instead of allocating memory for a half-open connection, the server calculates a cryptographic hash, sends it back as the SYN-ACK sequence number, and immediately forgets about the connection until the client proves it is legitimate by completing the 3-way handshake.

## Practical Examples
- **NTP Amplification Attack:** An attacker sends a tiny UDP request (8 bytes) to a vulnerable public NTP server, spoofing the Source IP address to be the victim's IP. The NTP server processes the request and sends the response (which is 4000 bytes—a massive 500x amplification) to the victim. The attacker repeats this using thousands of NTP servers, generating a colossal volumetric flood against the victim while hiding their own IP address.

## Security Considerations
- **The Smokescreen Effect:** Advanced attackers often launch a loud, disruptive DDoS attack against the public website to distract the network and security teams. While everyone is panicked trying to keep the website online, the attackers silently execute a targeted data exfiltration attack on the backend databases.
- **Cost Analysis:** Cloud DDoS protection is notoriously expensive. Companies must perform a risk assessment to determine if the cost of an hour of downtime is greater than the monthly retainer for a cloud scrubbing service.
- **Internal Bottlenecks:** A company might pay for cloud mitigation, but if their internal firewall performs deep packet inspection on all inbound traffic, the firewall CPU might still max out processing the *legitimate* traffic surge during a marketing event, causing a self-inflicted denial of service.

## Commands / Configuration Examples
Mitigating a massive DDoS attack is an architectural routing change, not a single command. 

### Cisco IOS (BGP RTBH - Remote Triggered Black Hole)
When an enterprise cannot scrub the traffic, they can use BGP to tell their ISP to instantly drop all traffic destined for the specific victim IP, sacrificing the single server to save the rest of the enterprise network.
```text
! Create a static route pointing the victim IP to the Null0 interface
ip route 203.0.113.50 255.255.255.255 Null0 tag 666

! In BGP, redistribute routes tagged with 666 to the ISP
router bgp 65000
 redistribute static route-map RTBH_MAP

! The route-map sets a specific BGP community string agreed upon with the ISP.
! The ISP receives it, recognizes the community string, and instantly drops all 
! traffic for 203.0.113.50 at the ISP edge, protecting the corporate WAN link.
```

## Troubleshooting
- **Isolating the Attack Vector:** During an attack, the first step is analyzing NetFlow or router logs to determine the attack type. Is it a SYN flood? (Enable SYN cookies). Is it a massive UDP flood? (You must reroute to a cloud scrubber).
- **Collateral Damage:** If you implement aggressive rate-limiting or Geo-IP blocking (e.g., "Drop all traffic from Russia") to stop an attack, ensure you aren't simultaneously blocking legitimate customers or crucial third-party API services located in those regions.

## Interview Questions
- What is the difference between a DoS and a DDoS attack?
- Explain the concept of an Amplification/Reflection attack (e.g., using DNS or NTP).
- Why is a standard corporate firewall usually ineffective at stopping a volumetric DDoS attack? (Answer: Because the internet pipe connecting the firewall to the ISP fills up before the firewall can even inspect the traffic).
- How do Cloud providers use Anycast routing to mitigate DDoS attacks?

## Summary
DDoS Protection is the discipline of maintaining availability under extreme hostility. Because volumetric attacks overwhelm the physical limitations of local hardware and circuits, surviving them requires a robust architecture reliant on BGP traffic engineering, Anycast distribution, and cloud-scale traffic scrubbing centers.

## References
- [BGP](../05-routing/bgp.md)
- [Anycast Addressing](../04-ip-addressing/anycast-addressing.md)
- [TCP (SYN Floods)](../06-network-protocols/tcp.md)
- [UDP](../06-network-protocols/udp.md)
