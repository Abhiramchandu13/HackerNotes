# Zero Trust Architecture

> Zero Trust is a modern security model that operates on the principle of "never trust, always verify," treating every user and device as a potential threat, regardless of whether they are inside or outside the network perimeter.

## Overview
Traditional network security was like a castle with a moat. It assumed everything *inside* the network was trusted, and everything *outside* was untrusted. Once an attacker breached the perimeter firewall (crossed the moat), they could move laterally and attack internal systems with relative ease.

**Zero Trust** completely demolishes this model. It assumes the network perimeter is dead and that attackers are already inside. It forces every single request—from any user, on any device, to any application—to be authenticated and authorized before access is granted.

## Why It Matters
Zero Trust is the direct response to modern threats like sophisticated phishing, insider threats, and compromised supply chains. In a world of remote work and cloud applications, the concept of a "trusted internal network" no longer exists. Adopting a Zero Trust mindset is now the goal of virtually every modern CISO and enterprise security program.

## Core Concepts
- **Identity as the New Perimeter:** Access is granted based on the verified identity of the user and the health of their device, not just their IP address or physical location.
- **Least Privilege Access:** Users are only given the absolute minimum access required to perform their specific job function.
- **Assume Breach:** Design the network as if attackers are already present. Every internal connection is treated with the same suspicion as a connection from the public Internet.
- **Continuous Verification:** Authentication is not a one-time event. Every session is continuously monitored, and access can be revoked in real-time if suspicious behavior is detected.

## How It Works
A Zero Trust architecture replaces broad network access with granular application access.

**Legacy Model:**
1. A user connects to the corporate VPN.
2. They are granted full access to the entire `/16` corporate network.
3. They can now scan, ping, and attempt to connect to any server, whether it's related to their job or not.

**Zero Trust Model:**
1. A user opens a browser to access an internal application.
2. The request is intercepted by a Zero Trust gateway (an Identity-Aware Proxy).
3. The user is forced to authenticate via Multi-Factor Authentication (MFA).
4. The gateway performs a device posture check (Is the OS patched? Is antivirus running?).
5. If both checks pass, the gateway builds a temporary, one-to-one encrypted tunnel from the user's device directly to the specific application they requested. 
6. The user has no network-level access to anything else. They cannot ping the server or scan its other ports.

## Components / Types
Zero Trust is not a single product, but a strategy built from multiple technologies working together:
- **Identity Provider (IdP):** The central source of truth for user identity (e.g., Microsoft Entra ID, Okta).
- **Multi-Factor Authentication (MFA):** The cornerstone of identity verification.
- **Device Posture / MDM:** Mobile Device Management solutions that verify the health and compliance of endpoints.
- **Identity-Aware Proxy (IAP) / ZTNA:** The gateway that enforces the access policies (e.g., Zscaler Private Access, Palo Alto Prisma Access, Cloudflare Zero Trust).
- **Micro-segmentation:** Dividing the data center into tiny segments to limit east-west traffic, even between trusted servers.

## Practical Examples
- **Replacing VPNs:** A company decommissions its clunky SSL VPN. They deploy Zscaler Private Access (ZPA). Now, remote users simply authenticate via their browser with their Okta credentials, and ZPA builds secure micro-tunnels to the specific internal applications they are authorized to use.

## Security Considerations
- **Policy Management:** A Zero Trust system requires an immense upfront investment in defining exactly which users and groups are allowed to access which applications. Misconfiguring a policy can either block legitimate business access or accidentally grant a user overly broad permissions.
- **The Identity Provider is the New Core:** In a Zero Trust model, the Identity Provider (like Entra ID) becomes the absolute keys to the kingdom. If an attacker compromises an administrator account on the IdP, they can grant themselves access to every application in the enterprise.

## Commands / Configuration Examples
Zero Trust is an architecture, not a single command. It is configured via the complex GUI dashboards of Identity Providers and ZTNA vendors.

### Conceptual Policy (Zscaler ZPA)
```text
# Logic of a rule in the ZPA dashboard
- Rule Order: 1
- Name: Allow Finance Team to access SAP
- Action: Allow
- Source Users/Groups: Finance_Team_AD_Group
- Destination Application Segment: SAP_ERP_System (defined by internal FQDN and port)
- Device Posture: Must be running CrowdStrike Falcon Agent
```

## Troubleshooting
- **User Cannot Access App:** The most common problem. The user's request is being blocked by the ZTNA policy. The administrator must check the ZTNA logs to see which policy is denying the connection. The cause is often a misconfigured user group, an incorrect application definition, or a failed device posture check.
- **Latency:** Because traffic is now routed through a cloud-based proxy, there can be added latency compared to a direct VPN connection to an on-premise data center.

## Interview Questions
- Explain the core principle of a Zero Trust security model.
- How does Zero Trust differ from the traditional "castle and moat" security model?
- What is an Identity-Aware Proxy (IAP)?
- Why is Multi-Factor Authentication (MFA) considered a mandatory component of any Zero Trust architecture?

## Summary
Zero Trust is a paradigm shift in cybersecurity, moving away from trusting networks and instead focusing on authenticating every user, device, and request. By assuming all actors are hostile until proven otherwise, it provides a far more resilient and granular security posture fit for the modern world of remote work and borderless cloud infrastructure.

## References
- [Micro-segmentation](microsegmentation.md)
- [NAC and 802.1X](nac-and-8021x.md)
- [Identity and Access Management](../ad-pentesting/01-foundations/active-directory-basics.md)
- [VPNs](vpns.md)
