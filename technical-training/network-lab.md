# Network Troubleshooting Lab — Cisco Packet Tracer
**Status:** Guided lab specification; live Packet Tracer build and verification not yet completed. Do not claim a working .pkt file until tested.

## Course
Cisco Networking Academy: [Exploring Networking with Cisco Packet Tracer](https://www.netacad.com/courses/exploring-networking-cisco-packet-tracer?courseLang=en-US)

## Lab objective
Configure and test a routed two-subnet network, isolate an incorrect default gateway, then demonstrate that IP reachability does not imply DNS resolution.

## Topology
PC-A — SW-A — R1 — SW-B — PC-B; DNS-S connected to SW-B. R1 has one interface in each LAN.

| Node | Interface | IPv4 | Mask | Gateway | DNS |
|---|---|---|---|---|---|
| R1 | G0/0 | 192.168.10.1 | 255.255.255.0 | — | — |
| R1 | G0/1 | 192.168.20.1 | 255.255.255.0 | — | — |
| PC-A | NIC | 192.168.10.10 | 255.255.255.0 | 192.168.10.1 | 192.168.20.53 |
| PC-B | NIC | 192.168.20.10 | 255.255.255.0 | 192.168.20.1 | 192.168.20.53 |
| DNS-S | NIC | 192.168.20.53 | 255.255.255.0 | 192.168.20.1 | 192.168.20.53 |

DNS-S: Services → DNS → On, A record `lab-host.local` → `192.168.20.10`. *Packet Tracer simulation only; not a public DNS domain.*

### Router commands (interface naming may vary by device)
```text
enable
configure terminal
interface gigabitEthernet0/0
ip address 192.168.10.1 255.255.255.0
no shutdown
exit
interface gigabitEthernet0/1
ip address 192.168.20.1 255.255.255.0
no shutdown
end
show ip interface brief
show ip route
```
A Layer-2 switch can use default VLAN 1 and access ports for this simple lab; no VLAN trunk or static route is required because both subnets are directly connected to R1.

## Baseline and fault experiments
1. Baseline: PC-A `ipconfig`, `ping 192.168.10.1`, `ping 192.168.20.10`, `ping 192.168.20.53`, and `ping lab-host.local`. Record actual output, not expected output.
2. Fault A: set PC-A gateway to `192.168.10.254` (unused in this lab). Repeat pings; expect local-subnet access to work while cross-subnet access fails. Restore `192.168.10.1` and retest.
3. Fault B: keep working IP settings but set PC-A DNS to `192.168.10.99` (unused). Compare `ping 192.168.20.10` with `ping lab-host.local`; expect IP reachability but failed name resolution. Restore `192.168.20.53` and retest.
4. On unexpected results inspect IP/mask, interface status, gateway, switch ports, DNS service and A record before drawing conclusions. Packet Tracer commands and simulated services vary by version.

## Fault log template (complete for both faults after testing)
| Symptom (Belirti) | Test | Root cause (Neden) | Post-fix result (Düzeltme sonrası sonuç) |
|---|---|---|---|
| **EXPECTED ONLY** local ping succeeds; remote subnet fails | ping local gateway + PC-B; inspect PC-A IP settings | Deliberate wrong gateway 192.168.10.254 | **TO VERIFY** remote ping succeeds after 192.168.10.1 restored |
| **EXPECTED ONLY** direct IP works, host name fails | ping PC-B IP; ping lab-host.local; inspect DNS setting | Deliberate wrong DNS 192.168.10.99 | **TO VERIFY** hostname works after DNS 192.168.20.53 restored |

## Evidence to attach after execution
- `two-subnet-network.pkt` exported by Cisco Packet Tracer (cannot be manufactured from a text spec).
- Topology screenshot showing all interfaces and labels.
- Captured before/after command output for each incident.
- Date, Packet Tracer version, test operator, verified configuration and reflection.
