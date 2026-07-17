# RPC (Remote Procedure Call)

> RPC is a protocol that allows a computer program to cause a subroutine or procedure to execute in another address space (commonly on another computer on a shared network) without the programmer explicitly coding the details for the network interaction.

## Overview
When you write code, calling a local function is easy: `calculateTax(price)`. **Remote Procedure Call (RPC)** makes executing code on a completely different server across the world look exactly the same to the developer. 

RPC handles all the messy networking details in the background. It takes the parameters, packages them up, sends them over the network (often using TCP or UDP), waits for the remote server to run the calculation, and returns the result back to the local application. 

## Why It Matters
RPC is the hidden framework beneath massive portions of enterprise computing. Microsoft Windows relies extensively on its own flavor of RPC (MSRPC) for everything from Active Directory replication to printing. In modern cloud architecture, lightweight RPC frameworks like **gRPC** are the backbone of microservices communicating with each other rapidly and efficiently.

## Core Concepts
- **Client/Server Model:** The client sends the request; the server executes the code and returns the result.
- **Stub:** A piece of software that acts as a local stand-in for the remote function. The client application calls the stub, and the stub handles the networking translation (marshalling).
- **Marshalling / Unmarshalling:** The process of taking data structures (like objects or arrays), converting them into a binary format that can travel over the network, and then reassembling them on the other side.
- **Endpoint Mapper / Portmapper:** Because RPC services often use random, dynamic high-numbered ports, a central directory service (listening on a well-known port) is used to tell clients exactly which port the specific service they want is currently running on.

## How It Works
1. A client application calls a local stub function.
2. The stub packages the function name and parameters into a network message (Marshalling).
3. The client asks the remote server's Endpoint Mapper (e.g., Port 111 for Linux, Port 135 for Windows): "What port is the 'Calculate' service running on?"
4. The Mapper replies: "It is running on Port 49152."
5. The client sends the RPC message to Port 49152.
6. The remote server unmarshalls the data, executes the actual code, and sends the result back.

## Components / Types
- **ONC RPC (Sun RPC):** The historical Unix/Linux standard. Heavily used by NFS. Usually relies on the `rpcbind` or `portmapper` service on TCP/UDP Port 111.
- **MSRPC (Microsoft RPC):** Microsoft's implementation. Essential for Windows domain environments, WMI, and Exchange. Uses TCP Port 135 for the Endpoint Mapper, and a massive range of dynamic ports (49152-65535) for the actual communication.
- **gRPC:** Developed by Google, this is a modern, high-performance, open-source RPC framework that uses HTTP/2 for transport and Protocol Buffers for blazing-fast marshalling. Dominant in modern cloud microservices.

## Practical Examples
- **Active Directory:** When you change your password on your local Windows PC, the OS uses MSRPC to execute the password-change function on the remote Domain Controller.
- **Microservices:** A ride-sharing app uses gRPC. When a user requests a ride, the User Service makes a gRPC call to the Pricing Service to calculate the fare, which makes a gRPC call to the Mapping Service to calculate the distance.

## Security Considerations
- **Firewall Nightmares:** Legacy RPC is notorious for breaking firewalls. Because it uses Port 135 just to "ask" for a port, and then switches to a random port between 49152 and 65535 for the actual data, network admins are forced to open massive ranges of high ports, creating large attack surfaces.
- **Vulnerabilities:** Flaws in RPC implementations have led to some of the worst worms in internet history (e.g., Blaster worm exploiting DCOM RPC, Conficker). 
- **Exposed Portmapper:** Exposing Port 111 (Unix RPC) or Port 135 (Windows RPC) to the public Internet is a critical security risk, inviting enumeration and exploitation.

## Commands / Configuration Examples
### Linux (Checking ONC RPC)
```bash
# Query the local or remote rpcbind service to see what RPC programs are registered and which ports they are using
rpcinfo -p 127.0.0.1
# Output will show services like 'nfs' mapped to specific TCP/UDP ports
```

### Windows (Checking MSRPC)
MSRPC is deeply integrated into the OS. You can test connectivity using WMI (which relies on RPC).
```powershell
# Test WMI/RPC connectivity to a remote server
Get-WmiObject -Class Win32_ComputerSystem -ComputerName "Server01"
```

## Troubleshooting
- **RPC Server Unavailable:** A classic Windows error. It means the client tried to connect to Port 135 on the server, but the connection timed out. This is almost always caused by a firewall (local Windows Defender or network firewall) blocking Port 135, or the remote server is offline.
- **Dynamic Port Blocked:** The client connects to Port 135 successfully, gets told to use Port 50000, but the connection hangs. The firewall allows Port 135 but is blocking the high-numbered dynamic RPC range.

## Interview Questions
- What is the primary purpose of an RPC protocol?
- Explain the role of the Endpoint Mapper / Portmapper in an RPC transaction.
- What TCP port does the Microsoft RPC Endpoint Mapper listen on? (Answer: 135).
- Why is configuring a traditional firewall for legacy RPC traffic considered difficult? (Answer: Because the actual data transfer happens over unpredictable, dynamically negotiated high-numbered ports).

## Summary
Remote Procedure Call abstracts away the complexities of network programming, allowing applications to function seamlessly across distributed systems. While legacy implementations pose significant security and firewall challenges, modern evolutions like gRPC have cemented RPC as the high-speed communication standard for modern cloud architectures.

## References
- [NFS](nfs.md)
- [SMB](smb.md)
- [Ports and Sockets](ports-and-sockets.md)
- [Active Directory Basics](../../ad-pentesting/01-foundations/active-directory-basics.md)
