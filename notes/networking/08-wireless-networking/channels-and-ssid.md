# Channels and SSID

> An SSID is the name of a wireless network, and Channels are the specific frequency lanes within the radio spectrum that the network uses to transmit data without interfering with others.

## Overview
If the radio spectrum is a highway, **Channels** are the individual driving lanes. To avoid crashing into each other, different Wi-Fi routers must operate in different lanes. The **SSID (Service Set Identifier)** is simply the billboard above the lane, telling users the name of the network they are connecting to.

Understanding how to select, space, and manage channels is the most important skill in wireless engineering. Poor channel planning destroys Wi-Fi performance faster than any other factor.

## Why It Matters
When you deploy five Access Points in an office, you can't just plug them in. If they all broadcast on the same channel, their radio waves will collide, causing massive packet loss and unusable Internet. Proper channel planning separates the frequencies, allowing seamless roaming and high throughput. For security professionals, hiding or spoofing SSIDs is a common tactic in reconnaissance and social engineering attacks.

## Core Concepts
- **SSID:** A human-readable string up to 32 characters (e.g., "Guest_WiFi").
- **2.4 GHz Channels:** There are 11 channels legally available in the US (1-13 in Europe). *However*, they are heavily overlapped. There are only **THREE** non-overlapping channels: **1, 6, and 11**.
- **5 GHz Channels:** Much wider spectrum. Offers dozens of non-overlapping channels (e.g., 36, 40, 44, 149), making interference much rarer.
- **Channel Width:** You can bond lanes together. A standard channel is 20 MHz wide. You can bond them to make 40 MHz, 80 MHz, or 160 MHz channels to achieve gigabit speeds, but doing so consumes available channels quickly, increasing the risk of interference.

## How It Works (The Interference Problem)
1. You set your router to Channel 6 on the 2.4 GHz band.
2. Your neighbor sets their router to Channel 7.
3. Because 2.4 GHz channels overlap like a Venn diagram, Channel 7's radio waves bleed heavily into Channel 6. 
4. Your router and your neighbor's router hear each other as static "noise" (Co-Channel Interference). Both routers are forced to slow down transmissions, causing high latency for both homes.
5. If both routers were on exactly Channel 6, they would politely wait their turn (CSMA/CA), sharing the bandwidth 50/50. If they are on 1, 6, and 11, they are completely separated and do not interfere at all.

## Components / Types
- **Hidden SSIDs:** An administrator can configure the AP not to broadcast the SSID in its Beacon frames. The network still exists, but the user must type the name manually to connect.
- **Multiple SSIDs:** A single physical Access Point can broadcast multiple SSIDs simultaneously (e.g., "Corp_LAN" and "Guest_LAN"), mapping each one to a different VLAN on the backend switch.
- **DFS Channels (Dynamic Frequency Selection):** In the 5 GHz band, certain channels are legally shared with weather and military radar. If an AP is using a DFS channel and detects radar pulses, it is legally required to immediately shut down and jump to a different channel, causing a momentary drop for connected users.

## Practical Examples
- **Enterprise Channel Planning:** In a large office building, APs are placed in a honeycomb pattern. The engineer configures the APs in a repeating pattern of Channels 1, 6, 11, 1, 6, 11 so that no two APs touching the same physical space are on the same frequency.
- **Channel Bonding:** A home user wants maximum speed on their Wi-Fi 5 router. They set the 5 GHz channel width to 80 MHz. This bonds four standard 20 MHz channels together, providing massive bandwidth to their laptop.

## Security Considerations
- **Hidden SSIDs provide NO Security:** Hiding an SSID is "security by obscurity." The AP still broadcasts the BSSID, and whenever a legitimate client connects, the client transmits the hidden SSID name in cleartext. Pentesters using `airodump-ng` will discover the hidden name within seconds.
- **Evil Twin Attacks:** An attacker goes to a coffee shop, sets up a rogue AP, and sets the SSID to the exact same name as the shop's Wi-Fi (e.g., "Starbucks_Free"). They set their AP to a clean channel and boost the transmit power. Because clients naturally connect to the strongest signal with a known SSID, laptops will drop the real AP and connect to the attacker.
- **Karma Attacks:** Some older devices constantly shout out "Is 'HomeNetwork' here?" wherever they go. An attacker's tool (like a WiFi Pineapple) hears this, automatically changes its own SSID to 'HomeNetwork', and forces the device to connect.

## Commands / Configuration Examples
### Linux (Scanning Channels)
```bash
# Put the wireless card in monitor mode to sniff all channels
sudo airmon-ng start wlan0

# Run airodump-ng to see all nearby SSIDs and the exact Channel they are operating on
sudo airodump-ng wlan0mon
```

### macOS (Hidden Diagnostics)
Hold the `Option` key and click the Wi-Fi icon in the top menu bar. It will display the BSSID, Channel, and Channel Width of the network you are currently connected to.

### Cisco WLC
```text
! Modern controllers handle channel planning automatically via 
! RRM (Radio Resource Management). You rarely hardcode channels manually.
show advanced 802.11a channel
```

## Troubleshooting
- **Slow Speeds / Dropping Connections:** The #1 cause is channel interference. Run a Wi-Fi analyzer app on your phone. If you see your router is on Channel 4, and three neighbors are on Channel 6, you are experiencing massive adjacent-channel interference. Move your router to Channel 1 or 11.
- **Devices Disconnecting on 5 GHz:** If clients are randomly dropping off a 5 GHz network, the AP might be operating on a DFS channel and frequently detecting radar, forcing the AP to abruptly change channels. Move the AP to a non-DFS channel (like 36 or 149).

## Interview Questions
- Why should you only ever use channels 1, 6, or 11 on a 2.4 GHz network?
- Does hiding an SSID prevent a determined attacker from finding the network name? Why?
- Explain the concept of Channel Bonding and its drawback in crowded environments.
- What is an Evil Twin attack and how does it utilize SSIDs?

## Summary
Channels and SSIDs define the physical lanes and logical names of wireless networks. Mastering channel allocation and avoiding overlapping frequencies is the most fundamental requirement for designing high-performance, stable Wi-Fi environments.

## References
- [Wi-Fi Basics](wifi-basics.md)
- [BSSID](bssid.md)
- [Wireless Site Surveys](wireless-site-surveys.md)
- [Wireless Attacks](wireless-attacks.md)
