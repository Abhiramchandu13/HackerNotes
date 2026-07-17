# Syslog

> Syslog is a standard protocol used by network devices, servers, and applications to send event messages and logs to a centralized logging server.

## Overview
A single enterprise might have 50 routers, 100 switches, 10 firewalls, and 500 Linux servers. If a critical hardware failure or a security breach occurs, logging into 660 different devices to read their individual, local log files is impossible. 

**Syslog** solves this. Operating primarily over **UDP port 514** (though TCP/TLS are increasingly common), Syslog provides a simple, universal format for every device to instantly forward its logs to a central server (a Syslog Server or SIEM). 

## Why It Matters
Centralized logging is the bedrock of network troubleshooting and cybersecurity monitoring. Without Syslog, tracing a network outage across multiple switches is tedious. For a Security Operations Center (SOC), Syslog is the primary data feed. If firewalls and servers aren't sending their syslogs to the SIEM (Security Information and Event Management) platform, the SOC is completely blind to attacks.

## Core Concepts
- **The Format:** A syslog message contains a timestamp, the hostname of the sending device, the process that generated the log, and the actual log message.
- **Facility:** A numerical code indicating *what* generated the log (e.g., the kernel, the mail system, the authorization system, or local use like a router).
- **Severity Level:** A critical number from 0 to 7 indicating how bad the event is:
  - **0 (Emergency):** System is unusable.
  - **1 (Alert):** Action must be taken immediately.
  - **2 (Critical):** Critical conditions (e.g., hardware failure).
  - **3 (Error):** Error conditions.
  - **4 (Warning):** Warning conditions.
  - **5 (Notice):** Normal but significant condition.
  - **6 (Informational):** Informational messages.
  - **7 (Debug):** Debug-level messages (extremely verbose).
- **UDP vs TCP:** Traditionally, Syslog uses UDP 514. It just fires and forgets. If the network is congested and drops the log packet, the log is lost forever. Modern security mandates often require TCP (Port 1468 or 6514) to guarantee log delivery.

## How It Works
1. A user fails an SSH login on a Linux server.
2. The `sshd` process on the server generates an authentication failure event.
3. The server's internal syslog daemon (like `rsyslog` or `systemd-journald`) catches the event.
4. It formats the event into the standard Syslog format, tagging it with Facility `auth` and Severity `warning` (Level 4).
5. It checks its configuration, sees it should forward all logs to `10.0.0.99`.
6. It wraps the log in a UDP packet and fires it to `10.0.0.99` on Port 514.
7. The central Syslog server receives the packet, writes it to a master database, and triggers an alert if necessary.

## Components / Types
- **Syslog Daemon:** The service running on a host (e.g., `rsyslog`, `syslog-ng`) that handles receiving and forwarding logs.
- **SIEM (Security Information and Event Management):** Advanced syslog servers (like Splunk, Elastic, or Graylog) that not only store logs but index them, search them, and correlate events to detect complex attacks.
- **Reliable Syslog (RFC 5424/6587):** The modern standard specifying TCP and TLS encryption for guaranteed, secure log delivery.

## Practical Examples
- **Firewall Traffic Logging:** A Palo Alto firewall is configured to send a syslog message to Splunk every time it denies a connection. A SOC analyst searches Splunk for `action=deny` and sees a single external IP address attempting to connect to 500 different internal servers, instantly identifying a port scan.
- **Router Troubleshooting:** An interface on a core switch is rapidly going up and down (flapping). The switch sends syslog messages (Severity 3) to the central server. The network admin sees the central dashboard turn red and knows exactly which switch port needs a cable replaced.

## Security Considerations
- **Cleartext Transmission:** Traditional UDP 514 syslog is unencrypted. If an attacker sniffs the network, they can read all the logs, which might contain sensitive data like usernames, internal IP structures, or even mistakenly typed passwords.
- **Log Forging / Spoofing:** Because UDP requires no handshake, an attacker can easily forge the Source IP of a UDP packet. They can flood the SIEM with millions of fake log messages, hiding their real attack in the noise, or filling up the server's hard drive (DoS).
- **Defense:** Always use Syslog over TLS (TCP 6514) for sensitive environments to guarantee delivery, encrypt contents, and authenticate the sender.

## Commands / Configuration Examples
### Linux (rsyslog Configuration)
```bash
# Edit /etc/rsyslog.conf to forward all logs to a remote server via UDP
*.* @10.0.0.99:514

# Forward all logs via TCP (Double @@)
*.* @@10.0.0.99:514

# Restart the service to apply changes
sudo systemctl restart rsyslog
```

### Cisco IOS
```text
! Enable logging and send all messages of level 6 (Informational) and lower to a server
logging host 10.0.0.99
logging trap informational

! Ensure timestamps are included in the logs (Crucial for SIEM correlation)
service timestamps log datetime msec
```

## Troubleshooting
- **No Logs Arriving:** Standard network troubleshooting. Is UDP Port 514 open on the firewalls between the device and the server? Are the host's local firewalls (e.g., `firewalld`) blocking outbound port 514?
- **Logs are Discarded:** If a switch is sending millions of Debug (Level 7) messages, it might overwhelm the central server. Ensure devices are configured to only send relevant severities (usually Notice (5) or higher) across the network.
- **Incorrect Times:** If logs arrive with the wrong timestamp, correlating an attack is impossible. Ensure all network devices and the Syslog server are synchronized using NTP.

## Interview Questions
- What port and protocol does standard Syslog use? (Answer: UDP 514).
- What are the advantages and disadvantages of using UDP for Syslog instead of TCP?
- Name three Syslog severity levels and describe what they mean.
- Why is NTP (Network Time Protocol) critical for a centralized Syslog architecture?

## Summary
Syslog transforms a chaotic, decentralized network into an observable, manageable ecosystem. By standardizing the format and centralizing the collection of event data, Syslog provides the critical visibility necessary for both proactive network maintenance and rapid cybersecurity incident response.

## References
- [NTP](ntp.md)
- [UDP](udp.md)
- [Network Monitoring](../10-monitoring-and-troubleshooting/network-monitoring.md)
