# Azure Infrastructure Lab — guided execution and evidence plan
**Status:** Deployment has NOT been carried out or verified. Cost values are not fabricated.

## Official learning
- [Describe the core architectural components of Azure](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/)
- [Describe cost management in Azure](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/)

## Architecture to build
```text
Azure subscription (student-owned)
  └─ Resource group: rg-learning-lab
       └─ Selected Azure region: [RECORD ACTUAL REGION]
            ├─ VNet: vnet-lab (10.40.0.0/16)
            │   └─ Subnet: subnet-vm (10.40.1.0/24)
            │       ├─ Network interface
            │       └─ VM: vm-learning-lab
            ├─ Managed OS disk
            └─ NSG — least-privilege ingress
```

## Safety / deployment steps
1. Check subscription permissions and free-tier/quota eligibility. Set a budget alert, understanding an alert does **not** stop spending. Record date and chosen Azure region.
2. Create resource group, VNet, subnet and NSG. Keep inbound access private or restricted; do not expose RDP (3389) or SSH (22) to the internet broadly.
3. Create a small VM with appropriate OS and managed disk, ensuring any selected size is genuinely available in the selected region. Record actual SKU and OS; only claim Windows Server if deployed.
4. Verify provisioning success, VM status, VNet/subnet placement, effective NSG rules, and authenticated connectivity using an approved, restricted method. Capture evidence with subscription IDs, public IPs and secrets masked.
5. Open Azure Cost Management and record usage if **real resource-use entries** are visible. Cost data may be delayed; separately label calculator outputs as **estimates**, never actual spend.
6. Stop and **delete the lab resource group and associated resources** when finished; confirm deletion and check remaining billable resources, including disks and public IPs. VM stop alone may not remove every charge.

## Evidence log
| Field | Value |
|---|---|
| Deployment date | NOT YET RUN |
| Region / subscription tier | TO RECORD |
| VM SKU / operating system | TO RECORD |
| VNet / subnet | Proposed: 10.40.0.0/16; 10.40.1.0/24 |
| Disk type / size | TO RECORD |
| Connectivity test and actual output | TO CAPTURE |
| Cost Management actual usage | NOT CAPTURED |
| Pricing calculator estimate | NOT PREPARED |
| Teardown and billing check | NOT VERIFIED |

## Publication claim gates
Only publish `Deployed an Azure virtual machine...` after an actual successful deployment and recorded evidence. Only publish `Tracked resource usage in Azure Cost Management` after real cost/use data was captured. Otherwise use `Designed an Azure VM deployment and validation lab`.
