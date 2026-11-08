# Datacenter Operations Training Lab — simulation
**Status:** Prepared conceptual simulation and templates; no actual datacenter operations claimed.

Learn first: [Microsoft Learn — Introduction to Datacenter](https://learn.microsoft.com/en-us/training/paths/introduction-to-datacenter/).

## Conceptual rack drawing
```text
     FRONT — not to scale
  ┌───────────────────────┐
  │ RU42: patch panel     │
  │ RU41: top-of-rack SW  │ ◄── network uplink
  │ RU38–40: storage      │
  │ RU34–37: server A     │ ◄── simulated incident
  │ RU30–33: server B     │
  │  ... clear airflow ...│
  │ Rear: dual PDUs A/B   │ ◄── protected power feeds
  └───────────────────────┘
  Cool air IN: front → hot air OUT: rear
```
This is a **learning diagram**, not a certified rack, electrical, thermal or capacity layout. Site engineers must validate all clearances, power limits and installation practices.

## Asset register
| Asset | Purpose | Simulated evidence to capture |
|---|---|---|
| Rack | Mounting and airflow | Rack ID / U mapping |
| ToR switch | Network aggregation | Port ID, link LED, change record |
| Server A | Compute | Asset tag, power, management reachability |
| Storage | Data service | Status and logical connection |
| PDU A/B | Power distribution | Feed assignment, safety check |
| Cooling | Heat removal | Inlet/outlet sensor readings if available |

## Incident ticket: INC-SIM-001
- **Scenario:** Server A cannot be reached; switch shows link warning.
- **Symptoms:** Application monitor alert, management connectivity warning; simulated facts, not measured.
- **Initial triage:** Record alert/time; confirm monitoring scope and maintenance/change window; check other affected hosts; consult switch port state, cable/optic indicators, server power and management interface via approved access; avoid unapproved live cabling/power actions.
- **Escalation:** Network operations for link/switch issues; server/compute team for server or NIC issues; facilities for power/cooling alarms; incident manager if wider impact or service severity threshold is met. Follow actual organization runbooks.
- **Closure gate:** Authorized remediation recorded, connectivity and application health retested, monitoring stable for agreed observation window, stakeholder/owner acknowledges and ticket documents root cause or planned follow-up.
- **Status:** TEMPLATE — unresolved; no real incident or fix asserted.

## Equipment lifecycle checklists
### Install
- [ ] Approved request and change ticket; owner; access permissions.
- [ ] Confirm rack U-space, supported weight, airflow, grounding, power budget and safety signoff by site engineer.
- [ ] Asset tag, serial, rack U, network port and PDU assignments recorded.
- [ ] Physical installation performed by authorized personnel; cable labels and dual-feed policy checked.
- [ ] Health, link and monitoring checks passed; as-built inventory updated.

### Replace
- [ ] Approved incident/change and maintenance window; backup/redundancy and impact assessed.
- [ ] Record existing serial, ports, power and configuration; validate replacement compatibility.
- [ ] Authorized safe isolation, swap and reconnection per runbook.
- [ ] Verify services, alerts, link status and asset records; document rollback and handover.

### Decommission
- [ ] Owner and retention/legal hold approval; dependencies migrated.
- [ ] Data sanitization method approved and audited by security.
- [ ] Approved disconnect and removal by authorized staff.
- [ ] CMDB/inventory, monitoring, licenses and disposal chain-of-custody updated.
- [ ] Close change only after confirmations.

**Deliverable evidence:** rack diagram + asset register + lifecycle lists + sample incident ticket. Completion of a Learn module and real technical duties require separate proof.
