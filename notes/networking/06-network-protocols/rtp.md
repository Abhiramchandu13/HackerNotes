# RTP (Real-time Transport Protocol)

> RTP is the protocol designed specifically for delivering audio and video over IP networks, focusing on timely delivery rather than guaranteed delivery.

## Overview
While SIP acts as the operator connecting the call, **Real-time Transport Protocol (RTP)** is the wire carrying the conversation. Operating almost exclusively over **UDP**, RTP takes raw, digitized audio or video, chops it into small packets, and fires them across the network as fast as possible. 

RTP does not have a well-known, static port. Instead, it uses dynamic, even-numbered high UDP ports (often ranging from 10000 to 20000) that are negotiated by SIP during the call setup.

## Why It Matters
RTP is the actual payload of telecommunications. Understanding RTP is essential for troubleshooting poor call quality, configuring Quality of Service (QoS) on switches to prioritize voice traffic, and understanding why strict firewalls completely break modern video conferencing software. 

## Core Concepts
- **UDP Foundation:** RTP uses UDP because speed is critical. If a packet of voice data is dropped by a router, waiting for TCP to retransmit it would cause a massive, confusing delay in the conversation. It is better to just lose the syllable and keep the conversation moving in real-time.
- **Sequencing:** Even though UDP doesn't guarantee order, the RTP header adds a sequence number. If packets arrive out of order, the receiving phone uses the sequence numbers to reorganize the audio before playing it to the user.
- **Timestamps:** RTP headers include timestamps so the receiver knows exactly when the audio was sampled, allowing it to smooth out network jitter and play the audio back at the correct, natural speed.
- **RTCP (RTP Control Protocol):** A companion protocol that runs alongside RTP (always on the odd-numbered port directly above the RTP port). It provides out-of-band statistics on packet loss, jitter, and delay, allowing endpoints to adjust video quality dynamically.

## How It Works
1. You speak into a VoIP phone. The hardware digitizes your voice into an audio codec (like G.711).
2. The phone chops the continuous audio into tiny 20-millisecond chunks.
3. It wraps each chunk in an RTP header containing a sequence number (e.g., 101) and a timestamp.
4. It wraps the RTP payload in a UDP header, addressing it to the destination IP and the specific UDP port negotiated by SIP.
5. The receiving phone receives the packet. It buffers it briefly to account for network jitter, uses the sequence number to ensure it follows packet 100, and converts the data back into sound.

## Components / Types
- **Codecs:** RTP carries data formatted by codecs. Narrowband codecs (G.711) use more bandwidth but require little CPU. Compressed codecs (G.729) save bandwidth but compress the audio, sometimes lowering quality. Video codecs (H.264) compress massive video streams into RTP packets.
- **SRTP (Secure RTP):** The secure version of RTP. It uses AES to encrypt the audio payload, ensuring that even if someone captures the network traffic, they cannot hear the conversation.

## Practical Examples
- **Jitter Buffers:** You are on a Teams call over a bad Wi-Fi connection. The network is experiencing high jitter (packets are arriving at wildly different intervals). The Teams app uses the RTP timestamps to hold the early packets in a "Jitter Buffer" for a few milliseconds, delaying playback slightly so it can output a smooth, continuous audio stream instead of robotic stuttering.

## Security Considerations
- **Unencrypted Eavesdropping:** Standard RTP transmits audio in the clear. If an attacker gains access to a corporate VLAN and runs Wireshark, the "VoIP Player" feature will automatically extract the RTP packets and allow the attacker to listen to private phone calls as if they were a recording. **SRTP is mandatory for sensitive communications.**
- **UDP Flooding (QoS Abuse):** Because RTP traffic is often prioritized by QoS configurations (placed in the "Expedited Forwarding" queue), an attacker who can spoof RTP traffic can flood the network, prioritizing their attack traffic over legitimate business applications.

## Commands / Configuration Examples
Because RTP uses dynamic ports, you cannot test it with a simple `telnet` command. Troubleshooting relies on packet capture and firewall logs.

### Linux / Windows (Wireshark)
```bash
# Capture RTP traffic. (Note: Because ports are dynamic, it is usually 
# better to capture all UDP traffic and filter within Wireshark).
sudo tcpdump -i eth0 udp -w voip_capture.pcap
```
*In Wireshark: Analyze -> Telephony -> RTP -> RTP Stream Analysis. This tool provides incredible visual graphs showing packet loss, sequence errors, and jitter for the exact audio stream.*

### Cisco IOS (Configuring QoS for RTP)
```text
! Create an ACL to match RTP traffic (often defined by a specific UDP port range)
access-list 100 permit udp any any range 16384 32767

! Classify the traffic
class-map match-all VOICE
 match access-group 100

! Assign the traffic to the absolute highest priority queue
policy-map QOS-POLICY
 class VOICE
  priority percent 10
```

## Troubleshooting
- **Choppy Audio / Robotic Voices:** This is almost always caused by Packet Loss or excessive Jitter. Run a network test to ensure the link isn't congested. Verify QoS is configured on the switches so large file downloads don't interrupt the delicate RTP voice packets.
- **One-Way Audio:** The SIP signaling worked, but a strict firewall dropped the actual RTP audio stream because it viewed the dynamic, high-numbered UDP ports as unsolicited, unauthorized traffic.
- **Latency / Echo:** If propagation delay is too high (over 150ms), users will begin talking over each other. This is common over satellite links or poorly routed global WANs.

## Interview Questions
- Why does RTP run over UDP instead of TCP?
- What two critical pieces of information does the RTP header add to a UDP packet? (Answer: Sequence numbers and Timestamps).
- If an employee complains of "one-way audio" on a VoIP call, what is the most likely culprit? (Answer: A firewall or NAT issue blocking the inbound RTP stream).
- What protocol provides encryption for real-time media streams? (Answer: SRTP).

## Summary
Real-time Transport Protocol is the delivery mechanism for the world's voice and video. By accepting the unreliability of UDP and layering on necessary sequencing and timing controls, RTP enables the low-latency, fluid communication required by modern human interaction.

## References
- [SIP](sip.md)
- [UDP](udp.md)
- [Jitter](../01-networking-foundations/jitter.md)
- [Latency](../01-networking-foundations/latency.md)
