# Configuration et vérification STP

## Vérification

```text
Switch# show spanning-tree
Switch# show spanning-tree vlan 10
Switch# show spanning-tree interface fastethernet 0/1
Switch# show spanning-tree brief
```

## Priorité et Root Bridge

```text
! Root Primary (priorité 24576)
Switch(config)# spanning-tree vlan 10 root primary

! Root Secondary (priorité 28672)
Switch(config)# spanning-tree vlan 10 root secondary

! Priorité manuelle (multiples de 4096)
Switch(config)# spanning-tree vlan 10 priority 4096
```

## Mode STP

```text
Switch(config)# spanning-tree mode pvst
Switch(config)# spanning-tree mode rapid-pvst
Switch(config)# spanning-tree mode mst
```

| Mode | Description |
|------|-------------|
| `pvst` | Per-VLAN Spanning Tree (classique) |
| `rapid-pvst` | Rapid PVST+ — convergence rapide (recommandé) |
| `mst` | Multiple Spanning Tree — regroupe les VLANs en instances |

!!! tip "Bonnes pratiques"
    - Toujours utiliser `rapid-pvst` en production pour une convergence plus rapide
    - Configurer explicitement les Root Primary/Secondary plutôt que de laisser l'élection automatique
    - La priorité doit être un multiple de 4096 (ex: 4096, 8192, 12288...)
