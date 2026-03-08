# VTP et création de VLANs

## Configuration VTP

```text
! Configurer le domaine et le mot de passe
Switch(config)# vtp domain [nom_domaine]
Switch(config)# vtp password [mot_de_passe]

! Définir le mode du switch
Switch(config)# vtp mode server
Switch(config)# vtp mode client
Switch(config)# vtp mode transparent

! Options supplémentaires
Switch(config)# vtp pruning
Switch(config)# no vtp pruning
Switch(config)# vtp version 2
```

| Mode | Description |
|------|-------------|
| `server` | Crée, modifie et propage les VLANs (mode par défaut) |
| `client` | Reçoit et propage les VLANs — ne peut pas les créer |
| `transparent` | Ne participe pas à VTP, mais transmet les annonces |

```cisco
! Vérifier la configuration VTP
Switch# show vtp status
Switch(config)# do show vtp status
```

## Création de VLANs

```cisco
! Créer un VLAN et lui donner un nom
Switch(config)# vlan 10
Switch(config-vlan)# name SALES

Switch(config)# vlan 20
Switch(config-vlan)# name IT

! Supprimer un VLAN
Switch(config)# no vlan 10
```

## Vérification

```cisco
Switch# show vlan brief
Switch# show interfaces trunk
Switch# show interfaces switchport
```

| Commande | Description |
|----------|-------------|
| `show vlan brief` | Liste tous les VLANs et leurs ports access associés |
| `show interfaces trunk` | Liste les interfaces trunk et leurs VLANs autorisés |
| `show interfaces switchport` | Modes et informations VLAN de chaque interface |

!!! warning "VTP Version"
    VTP version 3 supporte les VLANs étendus (1006-4094) et offre une meilleure sécurité. Préférer `vtp version 3` en production.

!!! tip "Bonnes pratiques"
    - Toujours configurer un `vtp password` pour éviter qu'un switch inconnu écrase la base VLAN
    - Utiliser le mode `transparent` sur les switches qui ne doivent pas propager les VLANs
    - Vérifier le numéro de révision VTP avant de connecter un nouveau switch (`show vtp status`)
