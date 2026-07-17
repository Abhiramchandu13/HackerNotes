# CSMA/CD

> Carrier Sense Multiple Access with Collision Detection (CSMA/CD) is the legacy mechanism Ethernet used to prevent and recover from data collisions on shared network cables.

## Overview
Before the invention of modern switches, networks were built using hubs or single shared coaxial cables. When multiple computers shared one wire, they could talk over each other, causing a "collision" where data was destroyed. **CSMA/CD** was the traffic cop of early Ethernet, defining rules for how devices should listen before talking, and what to do if a collision occurred. 

While largely obsolete in modern full-duplex switched networks, CSMA/CD is a foundational concept that explains the history of Ethernet and the mechanics of half-duplex communication.

## Why It Matters
Although you won't encounter CSMA/CD on a modern Gigabit network, understanding it is heavily emphasized in foundational certifications like CompTIA Network+ and CCNA. Furthermore, the wireless equivalent—CSMA/CA (Collision Avoidance)—is the exact mechanism Wi-Fi uses today. Understanding the wired predecessor makes understanding modern Wi-Fi much easier.

## Core Concepts
Let's break down the acronym:
- **Carrier Sense (CS):** A device "listens" to the wire to see if any other device is currently transmitting (sensing the carrier).
- **Multiple Access (MA):** Many devices share the same physical cable.
- **Collision Detection (CD):** If two devices listen, hear silence, and transmit at the exact same millisecond, a collision occurs. The devices detect the voltage spike caused by the collision.
- **Backoff Algorithm:** After a collision, devices wait a random amount of time before trying to transmit again.

## How It Works
The CSMA/CD process follows a strict algorithm:
1. **Listen:** Host A wants to send data. It listens to the wire.
2. **Transmit:** If the wire is quiet, Host A begins transmitting. If busy, it waits.
3. **Collision:** Host A and Host B transmit simultaneously. The signals crash into each other, creating a higher-than-normal voltage.
4. **Jam Signal:** Both hosts detect the collision. They immediately stop transmitting data and send a 32-bit "Jam Signal" to ensure all other devices on the network know a collision happened.
5. **Random Backoff:** Host A and Host B both invoke a random backoff timer. Host A might wait 3 milliseconds, Host B might wait 5 milliseconds.
6. **Retransmit:** Whichever host's timer expires first listens to the wire again and retransmits.

## Components / Types
- **Collision Domain:** A network segment where packets can collide. A hub creates one large collision domain. A switch separates every port into its own individual collision domain.
- **Half-Duplex:** CSMA/CD *only* operates on half-duplex connections, where a device can either send OR receive, but not both simultaneously.
- **Full-Duplex:** Modern switches use full-duplex, meaning devices can send and receive simultaneously on separate wire pairs, making collisions impossible. CSMA/CD is disabled in full-duplex.

## Practical Examples
- **The Polite Conversation Analogy:** CSMA/CD is like a group of polite people in a dark room. You listen to see if anyone is talking (Carrier Sense). If it's quiet, you speak. If you and someone else start talking at the exact same time (Collision), you both stop, say "Oops!" (Jam Signal), and mentally pick a random number of seconds to wait before trying to speak again.

## Security Considerations
CSMA/CD itself isn't a direct security vulnerability, but the environments that required it (hubs) were:
- **Packet Sniffing:** Because shared media hubs broadcast all traffic to all ports (necessitating CSMA/CD), an attacker plugged into the hub could effortlessly capture passwords and sensitive data in cleartext using tools like Wireshark.
- **Denial of Service (DoS):** An attacker could continuously generate jam signals or force collisions on a legacy shared segment, halting all network communication.

## Commands / Configuration Examples
You don't configure CSMA/CD; it is baked into the Ethernet standard for half-duplex links. However, you can see its effects.

### Cisco IOS
```text
! View interface statistics. If you see collisions, the port is 
! either operating in half-duplex or there is a duplex mismatch.
show interfaces FastEthernet0/1

# Look for output lines indicating:
# "0 collisions, 0 late collisions"
```

## Troubleshooting
- **Late Collisions:** If collisions occur after the first 64 bytes of a frame have been transmitted, it is usually caused by a cable that exceeds the maximum length standard, or a severe duplex mismatch (one side full-duplex, one side half-duplex).
- **Duplex Mismatch:** If a PC is set to Full-Duplex (disabling CSMA/CD) but the switch is set to Half-Duplex, the PC will transmit whenever it wants, causing massive collisions and crippling network speeds on the switch side.

## Interview Questions
- What does the acronym CSMA/CD stand for?
- Explain the role of the random backoff timer.
- Does CSMA/CD operate on a modern, full-duplex switched network? Why or why not?
- What is a collision domain, and how does a switch affect it?

## Summary
CSMA/CD is the historical protocol that allowed early Ethernet to function over shared cables. By listening before talking, and reacting systematically to data collisions, it maintained order on early LANs. Today, it serves as a foundational concept for understanding half-duplex communication and the evolution into modern switched networks.

## References
- [Ethernet](ethernet.md)
- [Switch Operation](switch-operation.md)
- [Duplex](../01-networking-foundations/duplex.md)
- [Wi-Fi Basics (CSMA/CA)](../08-wireless-networking/wifi-basics.md)
