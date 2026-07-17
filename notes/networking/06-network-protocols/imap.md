# IMAP (Internet Message Access Protocol)

> IMAP is a modern email retrieval protocol that synchronizes the client with the server, allowing users to seamlessly view and manage the exact same mailbox across multiple devices.

## Overview
Where POP3 forces you to download your emails to a single device, **Internet Message Access Protocol (IMAP)** leaves your emails safely on the server. When you open your email client, IMAP simply downloads a synchronized *copy* of your inbox. 

Operating on **TCP port 143**, IMAP ensures that if you read an email on your phone, it shows as "read" on your laptop. If you organize emails into folders or delete a message, that action happens on the server and is instantly reflected on all your connected devices.

## Why It Matters
IMAP is the standard open protocol for email retrieval today. In a world where users access email via smartphones, tablets, web browsers, and desktop clients simultaneously, synchronization is mandatory. Understanding IMAP is essential for configuring corporate email clients, migrating mailboxes, and supporting modern communication infrastructure.

## Core Concepts
- **Server-Centric:** The master copy of all emails, folders, and read-states lives on the mail server, not the local hard drive.
- **Two-Way Synchronization:** Changes made on the client (like moving an email to a folder) are pushed up to the server. Changes on the server are pulled down to the client.
- **Partial Downloads:** IMAP is bandwidth-efficient. A client can download just the headers (Sender, Subject) of an email quickly, and wait to download the heavy body and attachments until the user actually clicks to open the message.
- **Multiple Connections:** Multiple devices can be connected to the exact same mailbox at the exact same time without locking each other out.

## How It Works
1. A user opens Apple Mail on their iPhone.
2. The app connects to the mail server using IMAP.
3. It requests the current state of the inbox.
4. The server replies with the headers of 5 new emails.
5. The user deletes one email. The app sends a command to the server instructing it to move that specific message to the "Trash" folder.
6. The user opens Thunderbird on their laptop. It syncs via IMAP, sees the updated state on the server, and automatically moves that same email to the Trash folder on the laptop.

## Components / Types
- **IMAP4 (Port 143):** The current standard version of the protocol, but traffic is unencrypted plain text.
- **IMAPS / IMAP over TLS (Port 993):** The secure, encrypted version. Mandated by nearly all modern email providers to protect credentials and email content from interception.

## Practical Examples
- **Multi-Device Usage:** You start drafting an email on your desktop at work, save it, and finish it on your phone during the commute. Because IMAP syncs the "Drafts" folder to the server, both devices see the exact same file.
- **Mailbox Migrations:** IT administrators use tools like `imapsync` to migrate a company's email from a legacy on-premise server to Google Workspace. By logging into both servers via IMAP, the tool copies the entire folder structure and all messages perfectly.

## Security Considerations
- **Storage Limits and Quotas:** Because all emails remain on the server forever, mailboxes can quickly consume terabytes of expensive server storage. Administrators must configure strict storage quotas.
- **Credential Interception:** Like FTP and POP3, standard port 143 transmits passwords in clear text. Security standards require enforcing IMAPS (port 993) or utilizing STARTTLS to upgrade port 143 to an encrypted connection.
- **Brute Force Attacks:** Internet-facing IMAP servers are constantly hammered by automated password-guessing bots. Utilizing multi-factor authentication (MFA) or OAuth tokens instead of raw passwords is a critical defense mechanism.

## Commands / Configuration Examples
### Client Configuration (Standard Ports)
When setting up a third-party email client (like Outlook or Thunderbird) for a generic email provider, you need:
- **Protocol:** IMAP
- **Server:** `imap.example.com`
- **Port:** 993
- **Encryption:** SSL/TLS

### Diagnostic Testing (Linux / Windows)
You can use OpenSSL to manually test a secure IMAP connection and verify the server's certificate.
```bash
# Connect securely to an IMAP server
openssl s_client -connect imap.example.com:993
# Once connected, you can issue raw IMAP commands:
a1 LOGIN username password
a2 LIST "" "*"
a3 LOGOUT
```

## Troubleshooting
- **Emails Not Deleting:** A user deletes an email on their phone, but it still shows up on the webmail interface. The IMAP client might be configured improperly (e.g., hiding deleted messages visually instead of actually instructing the server to expunge them), or sync is failing due to poor connectivity.
- **Folder Sync Issues:** Sometimes an email client creates a local folder called "Deleted Items," but the server expects it to be called "Trash." The IMAP mapping must be corrected in the client settings so the folders align perfectly.
- **Blocked Ports:** If a user cannot receive mail on a corporate Wi-Fi network, the firewall may be blocking outbound TCP 993.

## Interview Questions
- Explain the key differences between IMAP and POP3.
- What port does secure IMAP (IMAPS) use? (Answer: TCP 993).
- Why is IMAP preferred for modern mobile devices?
- How does IMAP handle email attachments to save bandwidth on mobile networks? (Answer: It allows clients to download only the headers, deferring the attachment download until explicitly requested).

## Summary
IMAP is the engine of modern email management. By keeping the definitive source of truth on the server and synchronizing state across multiple clients, it provides a seamless, unified email experience regardless of which device the user happens to pick up.

## References
- [POP3](pop3.md)
- [SMTP](smtp.md)
- [TCP](tcp.md)
- [HTTPS](../06-network-protocols/https.md)
