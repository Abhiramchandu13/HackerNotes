# SIP (Session Initiation Protocol)

> SIP is a signaling protocol used to establish, modify, and terminate multimedia communication sessions, such as voice and video calls, over IP networks.

## Overview
When you make a phone call over the Internet (VoIP), you need two distinct functions: one protocol to actually carry the audio data, and another protocol to handle the "ringing," "answering," and "hanging up." 

**Session Initiation Protocol (SIP)** is the protocol that does the ringing. Operating primarily over **TCP or UDP port 5060** (and 5061 for TLS encrypted SIP), SIP acts as the control plane. It negotiates the parameters of the call between two endpoints, and once they agree, it steps out of the way, allowing RTP (Real-time Transport Protocol) to handle the actual audio transmission.

## Why It Matters
SIP is the universal standard for modern telecommunications. It has entirely replaced legacy digital phone lines (ISDN/PRI) in the enterprise. Whether you are using a desk phone, Microsoft Teams, Zoom, or a massive call center, SIP is likely operating under the hood to set up the sessions. Understanding SIP is critical for configuring firewalls for VoIP traffic and troubleshooting "one-way audio" issues.

## Core Concepts
- **Signaling vs. Media:** SIP only handles signaling (setup and teardown). It *does not* carry the audio/video.
- **URI (Uniform Resource Identifier):** SIP uses addresses that look exactly like email addresses (e.g., `sip:alice@example.com`), making it easy to route calls globally.
- **User Agent (UA):** The endpoint device (e.g., an IP phone or a softphone app).
- **Proxy Server / PBX:** An intermediary server that routes SIP requests to the correct destination, authenticates users, and handles voicemail.
- **SDP (Session Description Protocol):** A payload carried *inside* the SIP message. It contains the technical details (like IP addresses, port numbers, and audio codecs) that the endpoints need to know to establish the actual audio stream.

## How It Works
1. **REGISTER:** Alice turns on her IP phone. It sends a `REGISTER` message to the corporate SIP Proxy, saying "I am `sip:alice@corp.com`, and my current IP is 10.0.0.5."
2. **INVITE:** Alice dials Bob. Her phone sends an `INVITE` message to the proxy, which routes it to Bob's phone. This message contains SDP data saying, "I want to talk, send your audio to IP 10.0.0.5 on Port 10000."
3. **RINGING:** Bob's phone receives the invite and starts ringing, sending a `180 Ringing` message back to Alice.
4. **OK:** Bob answers. His phone sends a `200 OK` message containing his SDP data: "I agree, send your audio to IP 10.0.0.6 on Port 20000."
5. **ACK:** Alice's phone sends an `ACK` acknowledging the setup.
6. **Media Stream:** SIP's job is done. The two phones now blast UDP audio packets directly to each other using RTP.
7. **BYE:** Bob hangs up. His phone sends a `BYE` message to Alice's phone.
8. **OK:** Alice's phone replies `200 OK` and tears down the session.

## Components / Types
- **SIP Trunk:** A logical connection between a corporate phone system (PBX) and a telecom provider over the Internet, replacing physical copper phone lines.
- **SBC (Session Border Controller):** A specialized VoIP firewall placed at the network edge. It secures SIP trunks, hides internal IP topologies, and assists with NAT traversal for audio streams.

## Practical Examples
- **Enterprise Telephony:** A company drops its expensive legacy phone contracts. They buy a SIP Trunk from a VoIP provider. Now, all 500 employees can make outbound calls to the public telephone network routed entirely over their standard internet connection.
- **Video Conferencing:** When you click "Join" on a web-conferencing link, your browser often uses WebRTC (which frequently utilizes SIP for signaling) to negotiate the video and audio codecs with the remote server before the stream begins.

## Security Considerations
- **Toll Fraud:** If a corporate SIP PBX is exposed to the Internet without strict authentication, attackers will hijack it to make thousands of premium-rate international calls, racking up tens of thousands of dollars in fraudulent charges over a single weekend.
- **Eavesdropping:** Standard SIP and RTP are completely unencrypted. Anyone on the local network can capture the packets with Wireshark and replay the audio of the phone call perfectly.
- **Defense:** Enforce **SIPS (SIP over TLS on Port 5061)** to encrypt the signaling, and **SRTP (Secure RTP)** to encrypt the actual audio payloads. Utilize an SBC at the network edge to filter malformed SIP packets.

## Commands / Configuration Examples
SIP is an application layer protocol heavily reliant on text-based commands (similar to HTTP). Troubleshooting is usually done via packet capture.

### Linux / Windows (Wireshark)
```bash
# Capture SIP signaling traffic
sudo tcpdump -i eth0 -n -s 0 port 5060 or port 5061 -w sip_capture.pcap
```
*In Wireshark, navigating to `Telephony -> VoIP Calls` will automatically analyze SIP packets and allow you to visualize the call setup flow and even play back unencrypted audio.*

## Troubleshooting
- **One-Way Audio:** The most notorious VoIP issue. The phone rings and answers (SIP worked), but Alice can hear Bob, but Bob hears silence. This happens because SIP setup succeeded, but NAT or firewalls blocked the RTP audio stream coming back from Bob to Alice. You must ensure the high-numbered UDP ports negotiated in the SDP payload are allowed through the firewall.
- **Registration Failures:** An IP phone says "No Service." It cannot reach the SIP Proxy or failed authentication during the `REGISTER` phase. Check DNS resolution and credentials.
- **SIP ALG (Application Layer Gateway):** Many consumer routers have a feature called "SIP ALG" designed to help NAT. It attempts to rewrite the IP addresses inside the SIP SDP payload. Usually, it corrupts the packets and breaks the calls. Disabling SIP ALG on the firewall fixes 90% of weird VoIP issues.

## Interview Questions
- What is the difference between SIP and RTP? (Answer: SIP handles call setup/signaling; RTP carries the actual audio/video media).
- What ports are commonly used for SIP and secure SIP? (Answer: UDP/TCP 5060 for cleartext, TCP 5061 for TLS).
- Explain what causes "one-way audio" in a VoIP call.
- What is a SIP Trunk?

## Summary
SIP is the HTTP of real-time communication. By separating the complex logic of call routing and negotiation from the heavy lifting of audio transmission, SIP provides a flexible, scalable, and universal framework for modern global telecommunications.

## References
- [RTP](rtp.md)
- [UDP](udp.md)
- [TCP](tcp.md)
- [NAT and PAT](../04-ip-addressing/nat-and-pat.md)
