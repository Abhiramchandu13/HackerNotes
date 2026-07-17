# SD-WAN (Software-Defined Wide Area Network)

> SD-WAN is a software-defined approach to managing WAN connections, allowing enterprises to use any combination of underlying transport services (MPLS, broadband, LTE) to intelligently route traffic based on application needs.

## Overview
Traditional WANs were rigid. If you had an MPLS circuit to a branch office, all traffic used it, even if a cheaper, faster broadband connection was available. **Software-Defined Wide Area Network (SD-WAN)** centralizes the control plane of the WAN. It abstracts the underlying transport (MPLS, internet, 5G) into a single logical pool of bandwidth, allowing administrators to prioritize applications (e.g., VoIP always uses MPLS) and automatically route traffic over the best available link.

## Why It Matters
SD-WAN revolutionizes enterprise connectivity by providing massive cost savings, increased agility, and a superior user experience. It dramatically simplifies the management of complex, global WANs, enabling businesses to leverage cheaper internet links without sacrificing reliability or security. For network and cloud architects, SD-WAN is a key enabler of hybrid cloud strategies and distributed workforce models.

## Core Concepts
- **Centralized Control Plane:** A central controller manages all SD-WAN devices, pushing configurations and policies dynamically.
- **Transport Abstraction:** The underlying physical links (MPLS, broadband, LTE) are treated as a single pool of resources.
- **Application-Aware Routing:** Traffic is routed based on the application's requirements. VoIP traffic gets low-latency links; guest Wi-Fi goes over cheap broadband.
- **Automated Path Selection:** The SD-WAN device at the branch continuously monitors link quality (latency, jitter, loss) and automatically steers traffic over the optimal path.
- **Encrypted Overlay:** All traffic between SD-WAN devices is encrypted using IPsec tunnels over the underlying transport networks.

## How It Works
1. A company deploys SD-WAN appliances at each of its branch offices and its data center.
2. Each appliance establishes encrypted IPsec tunnels over all available WAN links (e.g., MPLS, two broadband links, one 5G LTE).
3. A central SD-WAN controller defines policies: "Voice traffic always uses the MPLS link if latency is below 100ms, otherwise failover to Broadband Link 1." "Guest Wi-Fi always uses Broadband Link 2."
4. A user at a branch office starts a VoIP call. The SD-WAN appliance identifies it as voice traffic.
5. The appliance continuously monitors the quality of the MPLS link. If its latency exceeds 100ms, the appliance instantly reroutes the VoIP traffic over Broadband Link 1, ensuring the call quality remains crystal clear.
6. The user downloading a large file (low priority) automatically uses the cheapest broadband link.

## Components / Types
- **SD-WAN Edge Appliance:** The physical or virtual device deployed at branch offices, data centers, and cloud VPCs. It creates and manages the encrypted tunnels.
- **SD-WAN Orchestrator/Controller:** The central management platform (often cloud-based) that defines and pushes policies to all edge appliances.
- **Underlay Network:** The existing physical transport networks (MPLS, Internet, LTE).
- **Overlay Network:** The encrypted, software-defined network created *over* the underlay by the SD-WAN tunnels.

## Practical Examples
- **Retail Branch Connectivity:** A retail chain has 1,000 stores. Each store has a cheap broadband internet connection. SD-WAN builds IPsec tunnels from each store to the data center, providing secure, managed connectivity without needing expensive MPLS circuits to every single store.
- **Hybrid Cloud Optimization:** A company has a Direct Connect to AWS but also uses public Internet for less critical cloud workloads. SD-WAN automatically routes critical application traffic over the Direct Connect and development/testing traffic over the cheaper Internet VPNs, optimizing cloud egress costs.

## Security Considerations
- **Encrypted Tunnels:** SD-WAN inherently provides security by encrypting all traffic between its edge devices using IPsec.
- **Centralized Policy:** Security policies (like firewall rules) can be defined centrally and pushed to all branch appliances, simplifying compliance.
- **Firewall Integration:** Most SD-WAN solutions now integrate Next-Generation Firewall (NGFW) capabilities directly into the edge appliance, providing comprehensive security at the branch.
- **Controller Compromise:** If the central SD-WAN orchestrator is compromised, an attacker could potentially gain control over the entire enterprise WAN.

## Commands / Configuration Examples
SD-WAN is managed primarily through web GUIs or API-driven orchestrators. CLI configuration is typically limited to basic setup and troubleshooting.

### Cisco Viptela (Conceptual Policy)
```text
# Policy to prioritize voice traffic over MPLS
policy
  vpn-list VPN1
    sequence 10 match
      app-list voice-apps
    !
    action accept
      set dscp ef
      set local-tloc-list TLOC_MPLS
```

## Troubleshooting
- **Path Selection Issues:** If an application is taking a sub-optimal path, check the controller's logs for link quality metrics (latency, jitter, loss) for all available transports. The application-aware routing policy might be misconfigured.
- **Central Controller Unreachable:** If the SD-WAN edge appliance cannot reach the central orchestrator, it will typically continue to operate using its last known configuration, but new policy updates will not be received.
- **Overlay vs. Underlay:** Distinguish whether a performance issue is due to the underlying ISP transport (underlay network) or the SD-WAN overlay itself. Run `ping` and `traceroute` from the SD-WAN appliance to test both.

## Interview Questions
- What problem does SD-WAN solve for enterprises?
- What is the difference between the "underlay" and "overlay" network in an SD-WAN deployment?
- How does SD-WAN dynamically select the best path for application traffic?
- What are two key benefits of SD-WAN for businesses?

## Summary
SD-WAN transforms rigid, expensive, and complex traditional WANs into agile, cost-effective, and application-aware networks. By centralizing control, abstracting transport, and enabling intelligent traffic steering, SD-WAN is essential for connecting modern, distributed enterprises to their data centers and cloud applications.

## References
- [MPLS](mpls.md)
- [WAN Technologies](wan-technologies.md)
- [IPsec](../09-network-security/ipsec.md)
- [Cloud Networking](../11-cloud-and-virtual-networking/cloud-networking.md)
