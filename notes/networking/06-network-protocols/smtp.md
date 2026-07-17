# SMTP (Simple Mail Transfer Protocol)

> SMTP is the standard protocol used for sending, relaying, and routing email messages across the Internet.

## Overview
When you hit "Send" on an email, the message doesn't magically appear in the recipient's inbox. **Simple Mail Transfer Protocol (SMTP)** is the mechanism that pushes that email from your email client to your mail server, and then routes it from your mail server across the Internet to the recipient's mail server. 

Operating historically on **TCP port 25** (and modernized on ports 587/465), SMTP is strictly a *push* protocol. It sends mail. It does not retrieve it (that is the job of POP3 or IMAP).

## Why It Matters
Email remains the primary communication tool of business, and consequently, the primary attack vector for cyber threats (phishing, malware delivery, spam). Understanding SMTP is essential for tracing email delivery issues, configuring mail relays for automated systems, and implementing the vital DNS security records (SPF, DKIM, DMARC) necessary to stop email spoofing.

## Core Concepts
- **MTA (Mail Transfer Agent):** The server software (like Postfix or Microsoft Exchange) that uses SMTP to route and deliver emails.
- **MUA (Mail User Agent):** The client software (like Outlook or Apple Mail) that uses SMTP to submit the email to the MTA.
- **Relaying:** The process of one SMTP server accepting an email and forwarding it to another SMTP server on its way to the final destination.
- **Cleartext Origins:** Like HTTP and FTP, SMTP was originally unencrypted. It relies on STARTTLS to upgrade the connection to secure encryption dynamically.

## How It Works
1. **Submission:** You write an email to `bob@company.com`. Your email client (MUA) connects to your company's mail server (MTA) via SMTP on Port 587, authenticates, and hands over the message.
2. **Resolution:** Your MTA looks at the destination domain (`company.com`). It queries DNS for the **MX (Mail Exchange) record** of `company.com` to find the IP address of Bob's mail server.
3. **Relay:** Your MTA connects to Bob's MTA via SMTP on Port 25.
4. **The Conversation:** 
   - Your MTA: `HELO` (Hello, I have mail).
   - Your MTA: `MAIL FROM: <you@yourdomain.com>`
   - Your MTA: `RCPT TO: <bob@company.com>`
   - Your MTA: `DATA` (Here is the subject and body of the email).
5. **Delivery:** Bob's MTA accepts the email and stores it. Bob later uses IMAP or a web interface to read it.

## Components / Types
- **Port 25:** The original, unauthenticated port used for MTA-to-MTA relaying across the Internet. Many residential ISPs block outbound Port 25 to prevent infected home computers from acting as spam bots.
- **Port 587:** The modern port used for Mail Submission. Your email client connects to this port using encryption (STARTTLS) and a username/password to send outbound mail.
- **Port 465:** An older, implicit TLS port for secure submission (less common than 587 today).

## Practical Examples
- **Automated Alerts:** A network monitoring server (like SolarWinds) is configured to use an internal SMTP relay to send an email alert to the IT team whenever a core switch goes offline.
- **Cloud Mail:** When using Google Workspace or Microsoft 365, your organization points its public DNS MX records to Google or Microsoft's SMTP servers, allowing them to receive mail on your behalf.

## Security Considerations
SMTP inherently lacks sender verification. By default, anyone can connect to an SMTP server and claim their `MAIL FROM` is `CEO@yourcompany.com`.
- **Open Relays:** If an SMTP server is misconfigured to accept and forward mail from *anyone* without authentication, spammers will hijack it to blast millions of junk emails, resulting in the server's IP being blacklisted globally.
- **Email Spoofing Defense:** Because SMTP is flawed, security relies on DNS records:
  - **SPF (Sender Policy Framework):** A DNS record listing exactly which IP addresses are authorized to send SMTP traffic on behalf of a domain.
  - **DKIM:** Cryptographically signing the email body.
  - **DMARC:** Tells the receiving server what to do (Quarantine or Reject) if SPF or DKIM fails.

## Commands / Configuration Examples
You can manually send an email by speaking SMTP over a raw Telnet or Netcat connection.

### Linux / Windows (Diagnostic Testing)
```text
$ telnet mail.example.com 25
220 mail.example.com ESMTP Postfix
HELO mycomputer.local
250 mail.example.com
MAIL FROM: <test@example.com>
250 2.1.0 Ok
RCPT TO: <admin@example.com>
250 2.1.5 Ok
DATA
354 End data with <CR><LF>.<CR><LF>
Subject: Test Email

This is a manual SMTP test.
.
250 2.0.0 Ok: queued as 12345ABCD
QUIT
```

## Troubleshooting
- **Mail Not Arriving:** Check the MX records for the destination domain using `dig` or `nslookup`. Ensure they point to the correct IP.
- **Emails Bouncing/Going to Spam:** If outbound emails are rejected by Gmail or Microsoft, check your SPF records. If the IP address of your sending SMTP server isn't listed in your domain's SPF record, modern servers will reject the mail as spoofed.
- **Port 25 Blocked:** If a script or application cannot send email out to the Internet, verify the corporate firewall or the ISP isn't blocking outbound TCP Port 25.

## Interview Questions
- What is the function of SMTP compared to POP3/IMAP? (Answer: SMTP pushes/sends mail; POP3/IMAP pulls/retrieves mail).
- What port is traditionally used for server-to-server SMTP communication? (Answer: 25).
- What port is recommended for client-to-server email submission? (Answer: 587).
- How do SPF records secure the SMTP protocol?

## Summary
SMTP is the push-engine of global email. While its foundational design is trusting and easily abused by spammers, a layered approach using encryption (STARTTLS), client authentication (Port 587), and DNS-based verification (SPF/DKIM/DMARC) secures it for modern enterprise use.

## References
- [POP3](pop3.md)
- [IMAP](imap.md)
- [DNS (MX Records)](dns.md)
- [Telnet](telnet.md)
