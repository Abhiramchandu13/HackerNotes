# QoS (Quality of Service)

> QoS is a set of technologies that manage network traffic to reduce packet loss, latency, and jitter for critical applications by prioritizing certain types of data over others.

## Overview
In a perfect network, all applications would perform flawlessly. In reality, network links have finite bandwidth. If a user is on a Voice over IP (VoIP) call while simultaneously downloading a massive 50 GB software update, the VoIP call will become choppy and robotic unless specific mechanisms are in place to ensure voice packets go first.

**Quality of Service (QoS)** is that mechanism. It allows network administrators to prioritize critical real-time traffic (like voice and video) over less time-sensitive traffic (like file transfers or backups), ensuring a consistent experience for key applications during network congestion.

## Why It Matters
For modern enterprises, QoS is essential for delivering reliable VoIP, video conferencing, and critical business applications (like SAP or Oracle) over shared network infrastructure. Without QoS, any period of network congestion leads to frustrated users and unproductive employees. For security teams, QoS can also prioritize security telemetry (like Syslog or NetFlow data) to ensure alerts are never dropped.

## Core Concepts
QoS works by classifying traffic, marking it, and then applying different queuing or scheduling treatments.

1.  **Classification:** Identifying different types of traffic (e.g., VoIP, video, database, web browsing).
2.  **Marking:** Adding a label to the packet header (e.g., DSCP bits in the IP header) to indicate its priority.
3.  **Queuing / Scheduling:** Holding lower-priority packets in a buffer while higher-priority packets are sent first during congestion.
4.  **Policing / Shaping:** Limiting the bandwidth consumed by certain types of traffic (policing drops excess, shaping buffers excess).

## How It Works
1. A VoIP phone places a call. The phone (or the switch it's plugged into) marks the packet with a high priority (e.g., DSCP EF - Expedited Forwarding).
2. The packet travels across the LAN.
3. It hits a router that is experiencing congestion on its WAN uplink.
4. The router's QoS configuration sees the high-priority DSCP mark. It places the VoIP packet into a "priority queue" and sends it immediately.
5. A large file transfer (marked with a lower priority) is placed into a "best-effort queue" and sent only when the priority queue is empty.
6. Result: The VoIP call remains crystal clear, while the file transfer might take a few extra seconds.

## Components / Types
- **DSCP (Differentiated Services Code Point):** A 6-bit field in the IP header (Layer 3) used for marking traffic priority.
- **CoS (Class of Service):** A 3-bit field in the 802.1Q VLAN tag (Layer 2) used for marking traffic priority within a local switch. Often mapped to DSCP at the Layer 3 boundary.
- **Queuing Disciplines:**
    - **FIFO (First In, First Out):** No QoS. Packets are processed in order.
    - **PQ (Priority Queuing):** Strict priority. High-priority traffic always goes first.
    - **CBWFQ (Class-Based Weighted Fair Queuing):** Fairly shares bandwidth among traffic classes, ensuring each gets its allocated minimum.
    - **LLQ (Low Latency Queuing):** Combines PQ for strict real-time traffic with CBWFQ for other critical traffic.

## Practical Examples
- **VoIP Call Quality:** On a busy corporate network, QoS ensures that voice and video traffic gets preferential treatment, preventing choppy calls or pixelated video feeds.
- **Mission-Critical Applications:** Database replication traffic for a critical financial application can be marked as high priority to ensure it always gets through, even if other business applications are causing congestion.

## Security Considerations
- **QoS Evasion:** Attackers can attempt to mark their malicious traffic with high QoS priority (by manipulating DSCP bits) to ensure their attack packets (e.g., DDoS traffic, C2 beacons) are delivered before legitimate traffic.
- **Denial of Service (DoS):** Misconfigured QoS can inadvertently cause a DoS for low-priority traffic. If 100% of bandwidth is dedicated to voice, then data traffic may never get sent.
- **Traffic Analysis:** Security monitoring tools can integrate with QoS to ensure critical security telemetry (NetFlow, Syslog) is never dropped due to congestion.

## Commands / Configuration Examples
QoS configuration is complex and highly vendor-specific. These are Cisco examples.

### Cisco IOS Router (Basic LLQ)
```text
! 1. Classify voice traffic (match DSCP EF)
class-map match-all VOICE_CLASS
 match ip dscp ef

! 2. Create a policy map that prioritizes voice
policy-map QOS_POLICY
 class VOICE_CLASS
  priority 1000 ! Give 1 Mbps strict priority bandwidth
 class class-default
  fair-queue   ! All other traffic gets fair sharing

! 3. Apply the policy to the congested WAN interface
interface GigabitEthernet0/1
 service-policy output QOS_POLICY
```

## Troubleshooting
- **Choppy VoIP:** If VoIP calls are suffering, verify that QoS is enabled and correctly configured on all network devices in the path of the voice traffic. Check if the packets are being correctly marked with the expected DSCP values.
- **Traffic Not Prioritized:** Ensure the traffic is being correctly classified and marked before it hits the congested interface where the queuing policy is applied. If traffic is marked as high priority at the desktop but the core switch discards the marking, it will never get prioritized.

## Interview Questions
- What problem does QoS solve in a network?
- What are the four primary mechanisms of QoS?
- What is DSCP and where is it located in a packet?
- Explain the difference between policing and shaping traffic in QoS.

## Summary
QoS is the traffic manager of a congested network. By classifying, marking, and prioritizing different types of data, it ensures that critical, delay-sensitive applications receive the necessary bandwidth and low latency required to function, even when network resources are strained.

## References
- [Latency](../01-networking-foundations/latency.md)
- [Jitter](../01-networking-foundations/jitter.md)
- [Packet Loss](../01-networking-foundations/packet-loss.md)
- [VoIP Basics](../06-network-protocols/sip.md)
