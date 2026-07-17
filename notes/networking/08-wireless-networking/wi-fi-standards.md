# Wi-Fi Standards

> Wi-Fi standards (Wi-Fi 4, 5, 6, 7) are consumer-friendly marketing names created by the Wi-Fi Alliance to represent the complex IEEE 802.11 engineering amendments.

## Overview
If a customer goes to Best Buy, asking them to choose between an `802.11ac Wave 2` router and an `802.11ax` router is confusing and terrible marketing. To simplify this, the **Wi-Fi Alliance** (a consortium of hardware vendors) retroactively created a generational naming scheme. 

**Wi-Fi Standards** translate the dense IEEE engineering specs into simple, chronological generations, making it easy for consumers and IT buyers to understand what technology they are deploying.

## Why It Matters
While network engineers configure devices using IEEE terminology, executives, clients, and software developers use the Wi-Fi Alliance terminology. You must be able to translate between the two fluently. Knowing the capabilities of each generation allows you to accurately design networks, predict bandwidth limitations, and troubleshoot compatibility issues.

## Core Concepts
The generational mapping is the core of this concept.

| Generation | IEEE Standard | Release | Frequencies | Key Innovation |
| :--- | :--- | :--- | :--- | :--- |
| **Wi-Fi 1** | 802.11b | 1999 | 2.4 GHz | The original commercial standard. |
| **Wi-Fi 2** | 802.11a | 1999 | 5 GHz | Faster, but poor range. |
| **Wi-Fi 3** | 802.11g | 2003 | 2.4 GHz | Reached 54 Mbps. |
| **Wi-Fi 4** | 802.11n | 2009 | 2.4 / 5 GHz | Introduced MIMO (multiple antennas). |
| **Wi-Fi 5** | 802.11ac | 2014 | 5 GHz | Wide channels, broke the 1 Gbps barrier. |
| **Wi-Fi 6** | 802.11ax | 2019 | 2.4 / 5 GHz | High-density efficiency (OFDMA). |
| **Wi-Fi 6E**| 802.11ax | 2021 | 6 GHz | Opened massive new clean radio spectrum. |
| **Wi-Fi 7** | 802.11be | 2024 | 2.4 / 5 / 6 GHz| 320MHz channels, Multi-Link Operation (MLO). |

## How It Works
The primary driver behind advancing Wi-Fi standards is overcoming the limitations of radio physics. 
- **Throughput:** Increasing speed requires either using more antennas simultaneously (MIMO), using wider radio channels, or packing more data into the same wave (higher QAM modulation).
- **Efficiency:** Early Wi-Fi required devices to wait in line to talk. Wi-Fi 6 introduced OFDMA, which slices a single radio channel into smaller chunks, allowing the router to talk to 10 different laptops in the exact same millisecond.
- **Spectrum:** The 2.4 and 5 GHz bands ran out of room. Wi-Fi 6E and Wi-Fi 7 utilize the massive, newly deregulated 6 GHz frequency band, providing gigabit speeds without any interference from older legacy devices.

## Components / Types
- **MIMO (Multiple Input, Multiple Output):** Using 2, 3, or 4 antennas to transmit distinct data streams simultaneously, multiplying speeds. (Introduced in Wi-Fi 4).
- **MU-MIMO (Multi-User MIMO):** Allows the router to use its multiple antennas to transmit to *different* devices simultaneously, rather than just one fast device. (Introduced in Wi-Fi 5).
- **QAM (Quadrature Amplitude Modulation):** The method of packing data bits into the radio wave. Wi-Fi 5 uses 256-QAM. Wi-Fi 6 uses 1024-QAM (packing 25% more data into the same signal, requiring a very clean, noise-free environment).

## Practical Examples
- **Stadium Wi-Fi:** A football stadium deployed Wi-Fi 5 (802.11ac). It had plenty of bandwidth, but because 50,000 people were trying to talk at once, the collision-avoidance timers crushed the network. They upgraded to Wi-Fi 6. Because Wi-Fi 6 handles high-density efficiency, users can finally check scores without timing out.
- **Wi-Fi 6E in Apartments:** In a dense apartment building, the 5 GHz band is completely congested by neighbors' routers. Upgrading to a Wi-Fi 6E router allows the user to operate in the brand new 6 GHz spectrum, resulting in zero interference and maximum speeds.

## Security Considerations
- **WPA3 Mandate:** When the Wi-Fi Alliance released the certification for Wi-Fi 6, they included a massive security mandate: To receive the "Wi-Fi 6 Certified" logo, the hardware *must* support WPA3 encryption. This forced the industry to finally abandon the aging WPA2 standard.
- **Legacy Downgrades:** An attacker cannot easily break WPA3 on a Wi-Fi 6 network. However, if the router is configured for "WPA2/WPA3 Mixed Mode" to support older devices, an attacker can launch a downgrade attack, forcing a modern client to connect using vulnerable WPA2, which the attacker can then crack.

## Commands / Configuration Examples
Checking the capabilities of your hardware requires looking at the OS interface metrics.

### Windows
```powershell
# This command will display the "Protocol" field, explicitly showing 
# whether you are connected via 802.11n, 802.11ac, or 802.11ax.
netsh wlan show interfaces
```

### macOS
*(Hold the `Option` key and click the Wi-Fi icon in the top menu bar to see the PHY Mode (e.g., 802.11ax) and Channel metrics).*

## Troubleshooting
- **Missing Networks (Wi-Fi 6E):** A user buys a new Wi-Fi 6E router but complains their 3-year-old laptop cannot see the 6 GHz network. The laptop's internal network card is physically incapable of tuning to the 6 GHz frequency. The hardware must be upgraded.
- **Distance Issues:** A user upgrades from a Wi-Fi 4 router to a Wi-Fi 5 router and complains their signal in the backyard is worse. Wi-Fi 5 relies exclusively on 5 GHz, which physically cannot penetrate walls as well as the 2.4 GHz used heavily by Wi-Fi 4.

## Interview Questions
- Translate "Wi-Fi 5" and "Wi-Fi 6" into their IEEE 802.11 standard names.
- What massive physical frequency change was introduced with Wi-Fi 6E? (Answer: The addition of the 6 GHz band).
- Explain what MU-MIMO is and why it improves network performance.
- Why did the introduction of Wi-Fi 6 significantly accelerate the adoption of WPA3 security?

## Summary
Wi-Fi Standards translate dense engineering amendments into clear generational leaps. Understanding the progression from Wi-Fi 4 to Wi-Fi 7 is crucial for designing networks that balance the need for raw bandwidth, high-density device efficiency, and backward compatibility with legacy hardware.

## References
- [IEEE 802.11](ieee-802-11.md)
- [Wi-Fi Basics](wifi-basics.md)
- [WPA3](wpa3.md)
- [Channels and SSID](channels-and-ssid.md)
