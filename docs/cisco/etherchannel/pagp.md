# EtherChannel — PAgP

PAgP (Port Aggregation Protocol) est un protocole **Cisco propriétaire** de négociation d'EtherChannel.

## Modes PAgP

| Mode | Comportement |
|------|-------------|
| `desirable` | Initie activement la négociation PAgP |
| `auto` | Attend passivement — répond si l'autre côté initie |

!!! info "Compatibilité"
    Au moins un côté doit être en `desirable` pour que le bundle se forme. `auto` + `auto` = pas d'EtherChannel.

## Configuration

```text
! Mode desirable (actif)
Switch(config)# interface range fastethernet 0/1 - 2
Switch(config-if-range)# channel-group 1 mode desirable
Switch(config-if-range)# no shutdown

! Mode auto (passif)
Switch(config)# interface range fastethernet 0/3 - 4
Switch(config-if-range)# channel-group 2 mode auto
Switch(config-if-range)# no shutdown

! Configurer le port-channel (interface virtuelle)
Switch(config)# interface port-channel 1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30
```

## Vérification

```text
Switch# show etherchannel summary
Switch# show etherchannel 1 detail
Switch# show interfaces port-channel 1
```

!!! tip "Bonnes pratiques"
    - Toutes les interfaces du bundle doivent avoir la même vitesse, duplex, VLAN et mode trunk/access
    - Configurer le port-channel avant d'activer les interfaces physiques
    - Utiliser `show etherchannel summary` — l'état doit afficher `SU` (layer2, in use)
