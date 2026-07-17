# Client-Server vs Peer-to-Peer

> Client-server networking centralizes services, while peer-to-peer networking distributes responsibility across equal participants.

## Overview
Client-server and peer-to-peer are two basic communication models. In client-server networking, a client asks a server for a resource or service. In peer-to-peer networking, devices communicate more directly and can act as both client and server.

Understanding this model helps you predict traffic flow, access control, and failure behavior.

## Why It Matters
Most enterprise systems are client-server based. Web apps, file shares, authentication systems, and email all rely on dedicated servers.

Peer-to-peer still matters in:
- File sharing
- Some collaboration tools
- Decentralized applications
- Device discovery and direct transfers

Security teams need to know the model because peer-to-peer communication can be harder to monitor and control.

## Core Concepts
- Client: requests a service
- Server: provides a service
- Peer: can request and provide services
- Centralization: improves control and policy enforcement
- Distribution: improves resilience and direct sharing

## How It Works
In a client-server model:
1. The client opens a connection or sends a request.
2. The server authenticates, authorizes, and responds.
3. The server may log the transaction for auditing.

In a peer-to-peer model:
1. Devices discover each other.
2. Each device may share files or data directly.
3. There may be no central authority enforcing policy.

## Components / Types
### Client-Server
- Web browsing
- Database access
- Directory services
- Email systems
- SaaS applications

### Peer-to-Peer
- Local file transfer
- Distributed content sharing
- Some voice, chat, and media applications

## Practical Examples
- A browser connecting to a website is client-server.
- A Windows workstation authenticating to Active Directory is client-server.
- A team sharing files over a P2P sync tool is peer-to-peer.
- A printer shared by one workstation can behave like a simple peer resource.

## Security Considerations
- Client-server systems are easier to log and control centrally.
- P2P systems can bypass enterprise controls if not managed.
- P2P traffic may spread malware quickly.
- Server compromise can affect many clients at once.

## Commands / Configuration Examples
### Linux
```bash
ss -tulpn
curl http://server.local
```

### Windows
```powershell
Test-NetConnection server.local -Port 443
Get-SmbShare
```

### Cisco IOS
```text
show tcp brief all
show ip sockets
```

## Troubleshooting
- Is the client able to resolve the server name?
- Is the server listening on the correct port?
- Is the service reachable from multiple clients?
- If using P2P, can each peer discover the other?

## Interview Questions
- What is the difference between client-server and peer-to-peer?
- Why is client-server more common in enterprises?
- What are the security risks of peer-to-peer networking?

## Summary
Client-server is the dominant enterprise model because it enables centralized control. Peer-to-peer is useful for direct sharing but is harder to govern.

## References
- [What is Networking](what-is-networking.md)
- [Network Devices](../07-network-devices/router.md)
- [Network Security](../09-network-security/zero-trust.md)
