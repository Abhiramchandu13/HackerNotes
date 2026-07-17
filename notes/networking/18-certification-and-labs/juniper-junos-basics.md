# Juniper Junos Basics

> Junos OS is the unified operating system used across Juniper Networks routers, switches, and security devices, providing a powerful, consistent CLI for network configuration and management.

## Overview
While Cisco IOS is the dominant operating system in enterprise networking, **Juniper Networks** is a major player, particularly in service provider environments, large data centers, and advanced security deployments. Juniper's **Junos OS** provides a command-line interface (CLI) that is distinctly different from Cisco IOS, heavily inspired by FreeBSD Unix principles.

Understanding Junos OS basics is crucial for network engineers working in multi-vendor environments or those specializing in service provider infrastructure.

## Why It Matters
Juniper devices are renowned for their stability, advanced routing capabilities, and robust security features (especially their SRX firewalls). Proficiency in Junos OS is a highly valued skill in the networking industry, opening doors to roles in ISPs, cloud providers, and large enterprises that leverage Juniper's specialized hardware.

## Core Concepts
-   **Configuration Database:** Unlike Cisco IOS (which uses a running-config and startup-config), Junos OS uses a single, hierarchical configuration database. Changes are applied to a "candidate" configuration and then "committed" to become active.
-   **Modes of Operation:** Similar to Cisco, Junos has different CLI modes (Operational Mode, Configuration Mode, Edit Mode).
-   **Rollback:** Junos OS automatically saves multiple previous configurations, allowing administrators to instantly revert to a prior working state if a change breaks the network.
-   **Commit Confirmation:** A feature that automatically rolls back configuration changes if they break network connectivity, preventing lockouts.

## How It Works
1.  You log into a Juniper device. You are in **Operational Mode**. You can execute `show` commands here.
2.  To make changes, you type `configure`. You enter **Configuration Mode**.
3.  You navigate the hierarchical configuration tree (e.g., `edit interfaces ge-0/0/0`).
4.  You make changes. These are applied to the "candidate" configuration.
5.  To make changes live, you type `commit`. The changes are validated and applied.
6.  To revert to a previous configuration, you type `rollback <number>`.

## Components / Types
-   **Junos CLI:** The command-line interface, providing powerful tab completion and context-sensitive help.
-   **`set` commands:** Used to add or modify configuration elements in the hierarchy.
-   **`show` commands:** Used in Operational Mode to view status and verify configuration.
-   **`run` command:** Used in Configuration Mode to execute an Operational Mode command without exiting Configuration Mode.

## Practical Examples
-   **Interface Configuration:** Assign an IP address to a physical interface.
-   **OSPF Configuration:** Enable OSPF and advertise networks.
-   **Static Routing:** Configure manual routes.
-   **Firewall Filter (ACLs):** Apply packet filtering rules.

## Security Considerations
-   **Robustness:** Junos OS is known for its robust security architecture, including features like control plane policing (CoPP) and a hardened FreeBSD-based kernel.
-   **Authentication:** Supports strong AAA (TACACS+, RADIUS) for administrative access.
-   **Role-Based Access Control (RBAC):** Granular control over which commands administrators are allowed to execute.

## Commands / Configuration Examples

### Basic Junos OS Commands
```text
user@router> show interfaces terse              ! View interface status (Operational Mode)
user@router> configure                          ! Enter Configuration Mode
[edit]
user@router# set interfaces ge-0/0/0 unit 0 family inet address 10.1.1.1/24 ! Configure IP
[edit]
user@router# set protocols ospf area 0.0.0.0 interface ge-0/0/0.0 ! Configure OSPF
[edit]
user@router# show | compare                     ! See what changes have been made
[edit]
user@router# commit check                      ! Validate changes before applying
[edit]
user@router# commit and-quit                   ! Apply changes and exit
user@router> show route                         ! Verify routing table (Operational Mode)
user@router> rollback 1                         ! Revert to previous configuration
```

## Troubleshooting
-   **Commit Errors:** If a configuration has syntax errors or conflicts, Junos OS will prevent the commit and provide detailed error messages, preventing you from pushing bad configurations.
-   **Rollback to Last Known Good:** The `rollback` command is an invaluable troubleshooting tool. If a new configuration breaks network connectivity, you can instantly revert to a previous working configuration.
-   **`monitor traffic`:** The Junos OS equivalent of `tcpdump`, allowing you to capture and analyze packets directly from the CLI.

## Interview Questions
-   How does the configuration management model of Junos OS differ from Cisco IOS? (Answer: Junos uses a candidate configuration that is committed; Cisco uses `running-config` and `startup-config`).
-   What command is used to make changes live in Junos OS?
-   Explain the concept of "rollback" in Junos OS.
-   What are the benefits of Junos OS being based on FreeBSD? (Answer: Robustness, security, and a familiar Unix-like environment for advanced users).

## Summary
Juniper Junos OS provides a powerful, modular, and highly reliable operating system for network devices. Its hierarchical configuration, transaction-based commit model, and robust troubleshooting features make it a preferred choice for service providers and large enterprises, offering a distinct and advanced skill set for network engineers.

## References
- [CCNA Roadmap](ccna-roadmap.md)
- [Cisco IOS Labs](cisco-ios-labs.md)
- [OSPF](../05-routing/ospf.md)
- [BGP](../05-routing/bgp.md)
