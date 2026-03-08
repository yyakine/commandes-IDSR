# EtherChannel — LACP

LACP (Link Aggregation Control Protocol) est un protocole **IEEE 802.3ad** — standard ouvert, compatible multi-vendeurs.

## Modes LACP

| Mode | Comportement |
|------|-------------|
| `active` | Initie activement la négociation LACP |
| `passive` | Attend passivement — répond si l'autre côté initie |

!!! info "Compatibilité"
    Au moins un côté doit être en `active`. `passive` + `passive` = pas d'EtherChannel.

## Configuration

```text
! Mode active
Switch(config)# interface range fastethernet 0/1 - 2
Switch(config-if-range)# channel-group 1 mode active
Switch(config-if-range)# no shutdown

! Mode passive
Switch(config)# interface range fastethernet 0/3 - 4
Switch(config-if-range)# channel-group 2 mode passive
Switch(config-if-range)# no shutdown

! Configurer le port-channel LACP
Switch(config)# interface port-channel 1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk native vlan 1
```

## Vérification

```text
Switch# show etherchannel summary
Switch# show lacp neighbor
Switch# show etherchannel 1 detail
```

## PAgP vs LACP

| Critère | PAgP | LACP |
|---------|------|------|
| Standard | Cisco propriétaire | IEEE 802.3ad |
| Interopérabilité | Cisco uniquement | Multi-vendeurs |
| Mode actif | `desirable` | `active` |
| Mode passif | `auto` | `passive` |

!!! tip "Bonnes pratiques"
    - Préférer **LACP** en environnement multi-vendeurs ou pour la standardisation
    - Vérifier avec `show lacp neighbor` que les deux côtés négocient correctement
    - Maximum 8 interfaces actives par bundle (+ 8 en standby avec LACP)
