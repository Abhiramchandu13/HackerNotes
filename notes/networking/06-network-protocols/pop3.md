# POP3 (Post Office Protocol version 3)

> POP3 is a legacy email retrieval protocol that downloads emails from a server to a local client and typically deletes them from the server.

## Overview
While SMTP is used to *send* emails, you need a different protocol to *read* the emails waiting for you on the server. Designed in the early days of the Internet when server storage space was extremely expensive, **Post Office Protocol version 3 (POP3)** was the solution. 

Operating on **TCP port 110**, POP3 allows an email client to connect to the mail server, download all new messages to the user's local hard drive, and then delete the originals from the server to free up space.

## Why It Matters
POP3 is largely obsolete in modern enterprise environments, having been replaced by IMAP and proprietary cloud APIs (like Microsoft Exchange/MAPI). However, understanding POP3 is important because it is still supported by almost all email providers, is occasionally used in specialized automated retrieval systems, and perfectly illustrates the difference between "downloading" data and "syncing" data.

## Core Concepts
- **One-Way Download:** The protocol is inherently one-directional. It pulls data down to the client.
- **Offline Access:** Because emails are downloaded directly to the local machine, the user can read their entire mailbox without an active Internet connection.
- **Single Device Focus:** Because POP3 traditionally deletes emails from the server after downloading them, it is terrible for modern users who want to check their email on a phone, a tablet, and a laptop. If the phone downloads the email via POP3, it disappears from the server, and the laptop will never see it.
- **Cleartext by Default:** Like many old protocols, standard POP3 transmits passwords in plain text.

## How It Works
1. A user opens Microsoft Outlook (configured for POP3).
2. Outlook connects to the mail server on TCP port 110.
3. The client authenticates using a username and password.
4. The client requests a list of all messages currently sitting in the server's mailbox.
5. The client downloads all the messages to a local file on the computer's hard drive.
6. The client issues a `DELE` command to the server, instructing it to permanently delete the messages.
7. The connection closes.

## Components / Types
- **POP3 (Port 110):** The standard, unencrypted protocol. Highly insecure.
- **POP3S (Port 995):** POP3 secured inside a TLS/SSL encrypted tunnel. This protects the authentication credentials and email content from network sniffing.
- **"Leave a Copy on Server":** A feature added to modern email clients. It modifies standard POP3 behavior by downloading the email but intentionally skipping the deletion step, mimicking some of IMAP's functionality.

## Practical Examples
- **Automated Processing Systems:** A company has an automated ticketing system. It uses POP3 to log into an `alerts@company.com` mailbox every 5 minutes, download any new emails, parse them into support tickets, and delete them from the server to keep the mailbox empty and clean.
- **Archiving / Migration:** A user wants to backup their entire Gmail account to a local hard drive. They enable POP3 access in Gmail and use a local client to pull all messages down for offline archiving.

## Security Considerations
- **Credential Sniffing:** Using standard port 110 on a public Wi-Fi network exposes email passwords to anyone running Wireshark. POP3S (Port 995) must always be used.
- **Data Loss:** Because emails are physically moved to the user's hard drive, if the user's hard drive crashes and is not backed up, all emails are permanently lost. The central IT department cannot recover them because they were deleted from the server.
- **Corporate Control:** In enterprise networks, IT often disables POP3 entirely. Allowing users to download corporate data to local files bypasses data retention policies and eDiscovery efforts.

## Commands / Configuration Examples
You can interact manually with a POP3 server using Telnet or Netcat.

### Diagnostic Testing
```text
$ telnet mail.example.com 110
+OK POP3 server ready
USER alice
+OK User accepted
PASS secretpassword
+OK Pass accepted
STAT
+OK 2 320     (2 messages, 320 bytes total)
RETR 1        (Retrieve message #1)
... (Message content prints here) ...
QUIT
+OK Goodbye
```

## Troubleshooting
- **Missing Emails on Other Devices:** If a user complains they see emails on their laptop but not on their iPhone, check if the laptop is configured using POP3. The laptop is likely downloading and deleting the emails before the phone can see them. Switch the accounts to IMAP.
- **Cannot Connect:** Ensure firewalls permit TCP Port 110 (or ideally Port 995 for SSL). Verify the email provider actually has POP3 access enabled (many disable it by default for security).

## Interview Questions
- What is the primary difference between POP3 and IMAP? (Answer: POP3 downloads and deletes, restricting you to one device. IMAP syncs the mailbox across multiple devices).
- What port does standard POP3 use? (Answer: 110).
- Why is POP3 unsuitable for a user who reads email on both a laptop and a smartphone?
- How do you secure POP3 traffic? (Answer: Use POP3S over port 995 to encrypt the session via TLS).

## Summary
POP3 was a brilliant solution for the era of dial-up internet and low-capacity servers, allowing users to download their mail and read it offline. However, its "download and delete" architecture clashes heavily with the modern expectation of multi-device synchronization, rendering it a niche protocol today.

## References
- [IMAP](imap.md)
- [SMTP](smtp.md)
- [TCP](tcp.md)
- [TLS](../09-network-security/tls.md)
