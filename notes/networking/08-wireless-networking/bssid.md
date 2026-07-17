# BSSID (Basic Service Set Identifier)

> The BSSID is the 48-bit MAC address of the specific radio hardware inside a wireless Access Point.

## Overview
While the SSID (like "Corporate_WiFi") is the human-readable name of the network, the **BSSID** is the machine-readable name of the exact physical antenna transmitting that signal. 

In a large building, there might be 50 Access Points all broadcasting the exact same SSID so you can walk around without losing connection. However, each of those 50 Access Points has a completely unique BSSID. The BSSID is what your laptop actually connects to at Layer 2.

## Why It Matters
For general users, BSSIDs are invisible. For network engineers and penetration testers, the BSSID is everything. When troubleshooting roaming issues, the BSSID proves exactly which physical AP a client is stuck to. During a wireless penetration test, attack tools (like `aireplay-ng`) target the BSSID directly to launch deauthentication attacks or capture WPA handshakes. You cannot attack a network by its SSID; you must attack its specific BSSID.

## Core Concepts
- **MAC Address Format:** A BSSID looks exactly like a standard Ethernet MAC address (e.g., `00:14:22:01:23:45`).
- **Basic Service Set (BSS):** The coverage area created by one specific Access Point.
- **Extended Service Set (ESS):** A group of multiple Access Points connected to the same wired network, all broadcasting the same SSID, allowing clients to roam between their individual BSSIDs.
- **Multiple BSSIDs:** If a single physical Access Point broadcasts three different networks (e.g., "Guest", "Staff", "IoT"), the AP creates three distinct BSSIDs (usually by altering the last hex character of its base MAC address).

## How It Works
1. A corporate network has two APs. AP1 has BSSID `AA:AA:AA:AA:AA:01`. AP2 has BSSID `BB:BB:BB:BB:BB:02`. Both broadcast the SSID "Office_Net".
2. A user walks in the front door. Their phone sees "Office_Net" coming from `AA` (very strong) and `BB` (very weak).
3. The phone's network card explicitly associates with BSSID `AA`.
4. The user walks down the hall. The phone realizes the signal from BSSID `AA` is dropping below a threshold, and the signal from BSSID `BB` is much stronger.
5. The phone initiates a roam, dissociating from `AA` and instantly associating with BSSID `BB`. The SSID never changes, so the user notices nothing.

## Components / Types
- **BSSID Spoofing:** Because BSSIDs are just MAC addresses transmitted in cleartext beacons, they can be easily spoofed by software.
- **BSS Transition Management (802.11v):** Modern networks use specific frames to allow the infrastructure to gently force a client to transition from one BSSID to another better-performing BSSID.

## Practical Examples
- **Mapping Physical Locations:** In a large warehouse, a barcode scanner is reporting intermittent drops. The engineer looks at the wireless controller logs, tracks the specific BSSID the scanner was associated with when it dropped, references the floorplan to see exactly which physical AP owns that BSSID, and discovers it's positioned behind a massive metal shelving unit.
- **Targeted Pentesting:** A pentester wants to crack the "Cafe_Guest" network. They open `airodump-ng`. They see three APs broadcasting that name. They pick the BSSID with the strongest signal and direct their deauth packets strictly at that BSSID's clients to force a WPA handshake capture.

## Security Considerations
- **Evil Twin Pinpointing:** If a user connects to "Airport_Free_Wifi," they assume it's legitimate. A security tool can check the BSSID. If the known, legitimate airport AP has a BSSID of `C0:FF:EE:xx`, but the user just connected to one with an OUI belonging to a Raspberry Pi (`B8:27:EB:xx`), the security tool detects the Evil Twin attack immediately.
- **Deauthentication Attacks:** Attackers send forged "Deauth" frames to a client. The attacker must forge the Source MAC address of the frame to perfectly match the BSSID the client is connected to, tricking the client into believing the AP hung up on them.

## Commands / Configuration Examples
### Linux (Aircrack-ng Suite)
```bash
# Capture traffic specifically on Channel 6, targeting a specific BSSID
sudo airodump-ng -c 6 --bssid 00:11:22:33:44:55 wlan0mon

# Send Deauth packets spoofing the BSSID (-a) to disconnect a client (-c)
sudo aireplay-ng -0 5 -a 00:11:22:33:44:55 -c 99:88:77:66:55:44 wlan0mon
```

### Windows
```powershell
# View your current Wi-Fi connection details. 
# The BSSID field shows the exact physical AP you are currently touching.
netsh wlan show interfaces
```

### macOS
Hold the `Option` key and click the Wi-Fi icon in the menu bar. The dropdown will reveal the BSSID you are currently connected to.

## Troubleshooting
- **Sticky Clients:** The most common Wi-Fi issue. A user walks from one side of a building to another, but their laptop refuses to drop the old BSSID and connect to the new, closer BSSID. The laptop holds onto the weak signal until it completely drops. This requires adjusting "Minimum RSSI" values on the controller to forcefully kick sticky clients off weak BSSIDs.
- **Finding Rogue APs:** If you detect a rogue AP, you can walk around with a Wi-Fi analyzer app on your phone. You filter the app to show only the target BSSID and play "hot and cold" until the signal strength hits maximum, leading you to the physical device hidden in a potted plant.

## Interview Questions
- What is the difference between an SSID and a BSSID?
- Why might a single physical Access Point broadcast multiple different BSSIDs?
- How is the BSSID utilized during a wireless roaming event?
- If an attacker wants to disconnect a specific user from a Wi-Fi network, why must they know the BSSID?

## Summary
The BSSID is the true, physical anchor of a wireless network. While SSIDs provide a friendly name for humans, the BSSID is the unique Layer 2 hardware address that devices and security tools rely upon for targeting, routing, and roaming across the airwaves.

## References
- [Channels and SSID](channels-and-ssid.md)
- [Roaming](roaming.md)
- [Wireless Attacks](wireless-attacks.md)
- [MAC Addresses](../03-ethernet-and-switching/mac-addresses.md)
