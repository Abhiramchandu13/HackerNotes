# Roaming

> Roaming is the seamless process where a wireless client moves out of range of one Access Point and connects to another Access Point without dropping the active network connection.

## Overview
If you are on a Wi-Fi voice call and walk from the lobby to the cafeteria, your device physically moves away from the first Access Point (AP). The signal degrades. To keep the call alive, your phone must instantly disconnect from the first AP and associate with a new, closer AP. This transition is **Roaming**.

In enterprise environments, where an Extended Service Set (ESS) utilizes hundreds of APs broadcasting the exact same SSID, roaming must happen in a fraction of a second so applications don't time out and security keys are seamlessly transferred.

## Why It Matters
Bad roaming is the number one cause of user complaints on a wireless network. If a device fails to roam, the user experiences dropped VoIP calls, frozen video streams, and sudden internet disconnections. Understanding roaming mechanics is essential for wireless engineers tuning controller settings and for pentesters attempting to execute targeted attacks during the vulnerable re-authentication window.

## Core Concepts
- **The Client Decides:** This is the most crucial concept. The Wi-Fi infrastructure (the AP and Controller) **does not** decide when to roam. The smartphone or laptop makes the sole decision to drop one AP and connect to another based on its own internal algorithms.
- **RSSI Thresholds:** A client constantly monitors the signal strength (RSSI). When the signal drops below a specific threshold (e.g., `-70 dBm`), the client begins scanning the airwaves for a better AP.
- **Fast BSS Transition (802.11r):** A protocol that helps the client roam faster by allowing the network to send the client a list of nearby APs, saving the client from having to blindly scan all channels.

## How It Works (Standard Roaming)
1. A laptop is connected to AP-1 on Channel 6 with an excellent signal (`-50 dBm`).
2. The user walks down the hall. The signal from AP-1 drops to `-75 dBm`.
3. The laptop's driver triggers a roam. The laptop briefly scans other channels.
4. It hears AP-2 on Channel 11 broadcasting the same SSID at `-55 dBm`.
5. The laptop sends a Reassociation Request to AP-2.
6. The infrastructure authenticates the client on AP-2, updates the wired switch MAC tables (so packets route to the new AP), and the laptop drops AP-1.
7. Total time: Ideally under 150 milliseconds.

## Components / Types
- **Layer 2 Roaming:** The client moves to an AP on the exact same VLAN/Subnet. The client keeps its original IP address. This is fast and seamless.
- **Layer 3 Roaming:** The client moves to an AP on a completely different subnet. If the client changed its IP address, all active TCP connections would break. Enterprise controllers handle this via complex tunneling, anchoring the client to its original subnet to preserve the IP.
- **Fast Roaming (802.11k/r/v):** A suite of IEEE amendments designed to speed up the roaming process, specifically reducing the time it takes to negotiate WPA2/WPA3 enterprise encryption keys when jumping between APs.

## Practical Examples
- **Sticky Clients:** An iPhone connects to the AP in the conference room. The user walks back to their desk on the other side of the building. The iPhone's roaming algorithm is poorly written; it refuses to let go of the conference room AP, even though the signal is `-85 dBm` and completely unusable, completely ignoring the perfectly good AP directly above their desk.

## Security Considerations
- **Deauthentication Attacks:** Roaming is the vulnerable moment. Attackers capture WPA handshakes by spoofing Deauth frames, forcing a client to disconnect and immediately roam/reconnect, capturing the cryptographic handshake during the reconnection.
- **PMK Caching & Opportunistic Key Caching (OKC):** To make enterprise roaming fast, APs share the user's master encryption key. If an attacker compromises an AP, they may be able to extract cached PMK keys for recent users.

## Commands / Configuration Examples
Roaming is largely a client-side decision, but infrastructure must be tuned to encourage it.

### Cisco WLC
```text
! Engineers tune "Minimum Mandatory Data Rates" to fix Sticky Clients.
! By disabling slow 1, 2, and 5.5 Mbps rates, the AP refuses to talk 
! to a client far away. This forces the "Sticky Client" to drop the 
! connection and roam to a closer AP.

config 802.11b rate disabled 1
config 802.11b rate disabled 2
config 802.11b rate disabled 5.5
config 802.11b rate mandatory 12
```

## Troubleshooting
- **Insufficient Overlap:** For roaming to work without dropping packets, the coverage cells of AP-1 and AP-2 must overlap by about 15-20%. If they are placed too far apart, the client drops the signal from AP-1 entirely before it can find AP-2 (a dead zone).
- **Too Much Overlap:** If APs are placed too closely together, the client sees 5 different APs with excellent signal strength. The client constantly jumps back and forth between them (Ping-Ponging), causing massive instability.
- **Client Driver Issues:** 90% of roaming issues are solved by updating the Wi-Fi driver on the Windows laptop. Intel and Broadcom constantly release driver updates tweaking their proprietary roaming math.

## Interview Questions
- Who makes the decision to roam: the Access Point or the client device? (Answer: The client device).
- What is a "Sticky Client"?
- Explain the difference between Layer 2 and Layer 3 roaming.
- Why is roaming significantly more complicated on a WPA2-Enterprise network than a home network? (Answer: Because WPA2-Enterprise requires a lengthy RADIUS authentication process that can interrupt VoIP calls during the roam, necessitating Fast Roaming protocols like 802.11r).

## Summary
Roaming is the illusion of continuous wireless coverage. By understanding that clients are autonomous actors shifting between distinct BSSIDs, network engineers can design physical AP placements and power levels that gently guide clients into making optimal roaming decisions.

## References
- [BSSID](bssid.md)
- [Wireless Controller](../07-network-devices/wireless-controller.md)
- [Enterprise Wi-Fi](enterprise-wifi.md)
- [Wireless Site Surveys](wireless-site-surveys.md)
