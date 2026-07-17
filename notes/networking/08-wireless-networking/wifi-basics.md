# Wi-Fi Basics

> Wi-Fi is a technology that uses radio waves to provide wireless high-speed internet and network connections.

## Overview
Instead of transmitting data through copper wires or fiber-optic glass, **Wi-Fi** transmits data through the air using invisible electromagnetic radio waves. It acts as a wireless extension of the local Ethernet network, allowing laptops, smartphones, and IoT devices to communicate seamlessly with wired infrastructure.

At its core, Wi-Fi operates at **Layer 1 (Physical)** and **Layer 2 (Data Link)** of the OSI model. It uses the exact same IP addresses (Layer 3) as wired networks, meaning the transition from wired to wireless is completely invisible to applications like your web browser.

## Why It Matters
Wireless connectivity is the default access method for modern enterprises, cafes, and homes. For a network engineer, configuring Wi-Fi requires understanding physics—radio frequencies, interference, and signal strength—which behave very differently than cables. For a cybersecurity professional, Wi-Fi is notoriously dangerous because the network boundaries physically extend beyond the walls of the building, making it accessible to attackers in the parking lot.

## Core Concepts
- **Radio Frequencies (RF):** Wi-Fi primarily operates on two distinct frequency bands: **2.4 GHz** and **5 GHz** (and recently **6 GHz**).
- **Unbounded Medium:** Unlike a cable, the air is shared by everyone. Wi-Fi signals can be intercepted, blocked by walls, or ruined by a microwave oven.
- **Half-Duplex:** Wi-Fi radios can only send *or* receive at one time; they cannot do both simultaneously.
- **CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance):** Because it is half-duplex and shared, devices must "listen" to the airwaves. If someone else is talking, the device waits. If two devices talk at once, the data collides and is destroyed.

## How It Works
1. A Wireless Router or [Access Point](../07-network-devices/access-point.md) connects to the wired network.
2. It constantly broadcasts tiny radio signals called **Beacons**, announcing the network's name (SSID) and security requirements.
3. Your phone's Wi-Fi antenna picks up these beacons and displays the network name on your screen.
4. You tap connect and enter the password. The phone and AP complete a mathematical cryptographic handshake.
5. Once authenticated, the phone translates your internet request (e.g., an HTTP packet) into radio waves, blasts it into the air, the AP catches it, translates it back into an Ethernet frame, and sends it down the wire.

## Components / Types
- **2.4 GHz Band:** Older, slower, and incredibly crowded (used by Bluetooth, baby monitors, and microwaves). However, its long, slow waves penetrate solid walls incredibly well, giving it excellent range.
- **5 GHz Band:** Modern and fast. It has many more channels available, so interference is rare. However, the short, fast waves cannot penetrate concrete or metal well, meaning it has a much shorter range than 2.4 GHz.
- **6 GHz Band (Wi-Fi 6E/7):** The newest band. Ultra-fast and entirely free of legacy device interference, but suffers from the shortest physical range.

## Practical Examples
- **The Microwave Drop:** You are on a Wi-Fi call in the kitchen using the 2.4 GHz network. Someone turns on the microwave. The call drops instantly. This happens because the microwave operates at 2.45 GHz, blasting massive "noise" into the air and completely drowning out the tiny radio signal from your phone.
- **Corporate Roaming:** A hospital deploys APs every 50 feet. As a nurse walks down the hall pushing a laptop cart, the laptop automatically drops the fading connection to AP-1 and connects to AP-2 without dropping the active medical application.

## Security Considerations
- **Eavesdropping:** Anyone within physical range of the radio signal can use a tool like Wireshark or `airodump-ng` to capture every packet flying through the air. If the network doesn't use strong encryption (WPA2/WPA3), the attacker can read passwords and emails effortlessly.
- **Jamming / Deauth Attacks:** Because Wi-Fi relies on CSMA/CA (everyone waits their turn), an attacker can easily broadcast continuous "Deauthentication" frames, tricking all devices into disconnecting, creating a localized Denial of Service (DoS).

## Commands / Configuration Examples
### Windows
```powershell
# View incredibly detailed stats about your current Wi-Fi connection
# including signal strength, radio type, and BSSID
netsh wlan show interfaces

# View all saved Wi-Fi network profiles
netsh wlan show profiles
```

### Linux
```bash
# View the status of wireless interfaces
iwconfig

# Scan the airwaves to see all broadcasting networks around you
sudo iwlist wlan0 scan
```

## Troubleshooting
- **Strong Signal, No Internet:** The radio connection (Layer 1/2) is perfect, but the router failed to give you an IP address via DHCP (Layer 3), or the router's connection to the ISP is down.
- **Slow Speeds:** Usually caused by interference. If you live in an apartment building and 30 neighbors are all broadcasting their routers on 2.4 GHz Channel 6, the airwaves are congested. Change your router to Channel 1 or 11, or switch to 5 GHz.

## Interview Questions
- What is the difference between the 2.4 GHz and 5 GHz Wi-Fi bands?
- Explain why Wi-Fi is considered a "Half-Duplex" medium.
- What protocol does Wi-Fi use to avoid data collisions in the air? (Answer: CSMA/CA).
- How is capturing Wi-Fi traffic different from capturing wired Ethernet traffic?

## Summary
Wi-Fi translates data into radio waves, untethering devices from physical ports. While incredibly convenient, understanding its physical limitations—specifically the trade-offs between frequency, range, speed, and shared-medium interference—is the key to deploying functional wireless networks.

## References
- [Access Point](../07-network-devices/access-point.md)
- [IEEE 802.11](ieee-802-11.md)
- [Channels and SSID](channels-and-ssid.md)
- [Wireless Attacks](wireless-attacks.md)
