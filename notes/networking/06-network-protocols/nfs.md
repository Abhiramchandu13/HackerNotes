# NFS (Network File System)

> NFS is the standard protocol used in Unix and Linux environments to allow systems to share directories and files over a network as if they were local storage.

## Overview
If SMB is the language of Windows file sharing, **Network File System (NFS)** is the language of Linux. Developed originally by Sun Microsystems in 1984, NFS allows a user or a server to "mount" a directory from a remote server onto their own local file system. 

Once mounted, applications and users interact with the remote files exactly as if they were sitting on a local hard drive. NFS typically operates over **TCP port 2049** (though older versions utilized UDP and dynamic RPC ports).

## Why It Matters
NFS is foundational for Linux infrastructure. It is heavily used in high-performance computing, clustered web servers sharing a central pool of images, and enterprise storage arrays (NAS) providing datastores to VMware hypervisors. Understanding NFS is crucial for system administrators and cloud engineers building scalable, shared-storage environments.

## Core Concepts
- **Exporting:** The act of a server making a directory available to the network.
- **Mounting:** The act of a client attaching that remote exported directory to their local file system tree (e.g., attaching the remote `\var\nfs_share` to the local `/mnt/shared`).
- **Stateless vs Stateful:** NFSv3 was largely stateless (the server didn't track client connections closely), making it resilient to server crashes but complicated for file locking. NFSv4 is stateful, improving performance and security.
- **UID/GID Mapping:** NFS relies on User IDs and Group IDs. If "User A" is UID 1000 on the client, the NFS server assumes files created by that user belong to UID 1000 on the server. If UIDs are not synchronized across systems, severe permission errors occur.

## How It Works
1. **Server Configuration:** The admin configures the `/etc/exports` file on the Linux server, specifying which directory to share and which IP addresses are allowed to access it.
2. **Client Request:** A Linux client runs the `mount` command, pointing to the server's IP and the exported path.
3. **RPC Binding (Legacy):** In older versions (NFSv3), the client contacts the `rpcbind` service (Port 111) to find out which random ports the NFS services are using.
4. **Connection (Modern):** In NFSv4, everything is streamlined over a single connection to **TCP port 2049**.
5. **File Access:** The user opens a file in the mounted directory. The OS intercepts the read/write commands and sends them across the network via the NFS protocol to the server.

## Components / Types
- **NFSv3:** Legacy, but incredibly widespread. Fast, heavily reliant on RPC, unencrypted, and difficult to pass through firewalls.
- **NFSv4:** The modern standard. Operates on a single port (2049), supports strong authentication and encryption (via Kerberos integration), and improves performance over wide-area networks.

## Practical Examples
- **Web Server Clusters:** You have 5 web servers behind a load balancer running a WordPress site. Instead of trying to sync uploaded images across all 5 hard drives, all 5 servers mount a central NFS share from a Storage Area Network (SAN). When a user uploads a photo, it saves to the NFS share, and all 5 servers instantly have access to it.
- **VMware Datastores:** An enterprise uses an enterprise NAS (like NetApp). The VMware ESXi hosts use NFS to mount the massive storage volumes where all the Virtual Machine `.vmdk` hard drive files actually live.

## Security Considerations
NFS was built for high-trust internal networks and has a history of weak security.
- **IP-Based Authentication:** Standard NFS authentication relies entirely on the client's IP address. If the server exports a share to `192.168.1.50`, any device that manages to spoof or acquire that IP gets full access to the files.
- **Root Squashing:** A crucial security feature. By default, if the `root` user on the client machine creates a file on the NFS share, the NFS server "squashes" their permissions down to a nobody/anonymous user. This prevents a compromised client machine from writing malicious files to the server with absolute administrative power. (If disabled via `no_root_squash`, it is a massive vulnerability).
- **Cleartext:** Basic NFS traffic is unencrypted. Pentesters can sniff the traffic to read sensitive files.

## Commands / Configuration Examples
### Linux (Server)
```bash
# Example /etc/exports file:
# Share /var/nfs to the 10.0.0.0/24 subnet with read/write access
/var/nfs    10.0.0.0/24(rw,sync,root_squash)

# Apply the exports configuration
sudo exportfs -arv
```

### Linux (Client)
```bash
# Mount the remote NFS share to a local directory
sudo mount -t nfs 192.168.1.100:/var/nfs /mnt/local_share

# View actively mounted file systems
df -h
```

## Troubleshooting
- **Permission Denied:** The most common issue. Ensure the client's IP is listed in the server's `/etc/exports` file. Also, ensure the local Linux user has actual read/write permissions to the folder on the server side (UID mismatch).
- **Stale File Handle:** Occurs when a client tries to access a file or directory on an NFS mount that the server has deleted or modified underneath it. The client usually needs to unmount and remount the share to fix it.
- **Hanging Mounts:** If the NFS server crashes or a firewall blocks port 2049, the client machine might freeze entirely if it tries to access the dead mount point (unless the `soft` mount option was used).

## Interview Questions
- What protocol and port does NFSv4 use? (Answer: TCP 2049).
- Explain the concept of "Root Squashing" in NFS and why it is important for security.
- What is the difference in primary use cases between SMB and NFS? (Answer: SMB is primarily Windows-focused; NFS is Unix/Linux-focused).
- How do UIDs (User IDs) affect file permissions across an NFS share?

## Summary
Network File System provides seamless, high-performance distributed storage for Unix/Linux environments. While incredibly powerful for clustering and enterprise virtualization, its historical reliance on IP-based trust means it must be strictly isolated on secure, internal networks or upgraded to utilize robust Kerberos authentication.

## References
- [SMB](smb.md)
- [FTP](ftp.md)
- [RPC](rpc.md)
