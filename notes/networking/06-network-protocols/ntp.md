# NTP (Network Time Protocol)

> NTP is the protocol used to synchronize the clocks of computers, routers, and servers across a network to a highly accurate, common time source.

## Overview
Computers have internal hardware clocks, but these clocks "drift" over time, losing or gaining seconds every month. If left alone, a server in New York might eventually be 5 minutes ahead of a server in London. 

**Network Time Protocol (NTP)** solves this. Operating over **UDP port 123**, NTP clients regularly query authoritative time servers, mathematically account for the network latency of the transmission, and gently adjust their own internal clocks to stay perfectly synchronized down to the millisecond.

## Why It Matters
Synchronized time is not just for convenience; it is a critical requirement for cryptography and logging. If a client computer's clock is off by 5 minutes, Kerberos authentication (Active Directory) will outright reject their login attempts to prevent replay attacks. For cybersecurity, if a firewall log says an attack happened at 12:01:00, but the web server log says the breach happened at 12:03:00, correlating the events during an Incident Response investigation becomes a nightmare.

## Core Concepts
- **Stratum Levels:** NTP uses a hierarchical system of accuracy called Stratums.
  - **Stratum 0:** High-precision timekeeping devices (Atomic clocks, GPS clocks). These are hardware, not network servers.
  - **Stratum 1:** Servers directly physically connected to a Stratum 0 device.
  - **Stratum 2:** Servers that sync their time over the network from a Stratum 1 server.
  - **Stratum 3+:** Servers syncing from Stratum 2, and so on. (Max is Stratum 15).
- **Drift and Slew:** NTP rarely "jumps" the clock instantly (which can crash databases). Instead, it "slews" the clock, running it slightly faster or slower until it catches up to the correct time.

## How It Works
1. A corporate router (Stratum 3) is configured to use `pool.ntp.org` (Stratum 2 servers on the Internet).
2. The router sends a UDP packet to Port 123 asking for the time.
3. The server replies with a timestamp.
4. The router calculates the round-trip network latency (e.g., it took 20ms for the packet to return, so the server's time is actually 10ms older than what the packet says).
5. The router adjusts its internal clock.
6. The router now acts as an NTP server for the internal enterprise. All PCs and servers on the LAN query the router, becoming Stratum 4 devices, ensuring every machine in the company shares the exact same millisecond.

## Components / Types
- **NTPv4:** The current standard, highly resilient and capable of cryptographic authentication.
- **SNTP (Simple Network Time Protocol):** A lightweight version of NTP used by low-power devices (like cheap IoT sensors). It lacks the complex mathematical algorithms used to achieve millisecond precision but is "close enough" for basic operations.
- **PTP (Precision Time Protocol):** A specialized protocol used in financial trading environments and cellular networks that requires microsecond or nanosecond accuracy, far exceeding standard NTP.

## Practical Examples
- **Active Directory:** By default, the Primary Domain Controller (PDC) Emulator in a Windows domain acts as the authoritative time source for the entire enterprise. It syncs from the Internet, and every Windows PC joined to the domain automatically syncs from the Domain Controller.
- **Log Correlation (SIEM):** A security analyst traces a hacker moving from an external web server to an internal database. Because both servers use the same internal NTP server, the timestamps in the logs match perfectly, allowing the analyst to build a precise, second-by-second timeline of the attack.

## Security Considerations
- **NTP Amplification (DDoS):** Older versions of the NTP daemon (`ntpd`) supported a command called `monlist`, which returned a massive list of recently connected clients. Attackers would spoof a victim's IP and send a tiny `monlist` request to a public NTP server. The server would respond with a massive payload (amplification) directed at the victim, crushing their bandwidth. (Modern NTP servers disable `monlist` by default).
- **Time Spoofing:** If an attacker can spoof NTP traffic or hijack an internal NTP server, they can roll back the clock on a target machine. This might cause the machine to accept expired SSL certificates or break time-based authentication tokens.
- **Defense:** Internal devices should only sync from trusted internal NTP servers. Enterprise NTP servers should use **NTP Authentication** (using symmetric keys) to ensure they are receiving time from a legitimate source, not an attacker.

## Commands / Configuration Examples
### Linux
```bash
# View the status of the local NTP synchronization and the peers it is talking to
chronyc sources -v
# or older systems
ntpq -p

# Force a manual, instant time sync (useful if the clock is wildly off and rejecting slewing)
sudo chronyd -q 'server pool.ntp.org iburst'
```

### Windows
```powershell
# View the current time source and status
w32tm /query /status

# Force Windows to resync its time immediately
w32tm /resync
```

### Cisco IOS
```text
! Configure the router to sync from an external internet source
ntp server 198.51.100.5

! Allow internal LAN devices to sync from this router
ntp master 3
```

## Troubleshooting
- **Clock Too Far Off:** If a server is turned off for a year and its battery dies, it might wake up thinking it is 1970. NTP is designed for small adjustments. If the time is wildly inaccurate (e.g., off by years), NTP will often refuse to sync to prevent catastrophic application errors. You must manually set the date close to the current time, and then let NTP take over.
- **Firewall Blocking UDP 123:** If internal servers are drifting out of sync, ensure the firewall permits outbound UDP Port 123 from the internal NTP servers to the internet sources.

## Interview Questions
- What port and transport protocol does NTP use? (Answer: UDP 123).
- Explain the concept of Stratum in NTP. What is a Stratum 1 server?
- Why is synchronized time critical for Active Directory (Kerberos) environments?
- What is an NTP Amplification attack and how does it utilize IP spoofing?

## Summary
Network Time Protocol is the silent metronome of the Internet. By mathematically compensating for network delays to ensure ubiquitous time synchronization, NTP enables the cryptographic trust, precise logging, and functional authentication required by all modern enterprise infrastructure.

## References
- [Syslog](syslog.md)
- [UDP](udp.md)
- [Active Directory Basics](../../ad-pentesting/01-foundations/active-directory-basics.md)
