# CDP et LLDP

## CDP (Cisco Discovery Protocol)

CDP est un protocole **Cisco propriétaire** de découverte de voisins Layer 2.

```text
! Activer/désactiver globalement
Switch(config)# cdp run
Switch(config)# no cdp run

! Activer/désactiver sur une interface
Switch(config)# interface fastethernet 0/1
Switch(config-if)# cdp enable
Switch(config-if)# no cdp enable

! Modifier les timers
Switch(config)# cdp timer 30
Switch(config)# cdp holdtime 240
```

### Vérification CDP

```text
Switch# show cdp neighbors
Switch# show cdp neighbors detail
Switch# show cdp neighbors interface fastethernet 0/1
Switch# show cdp
Switch# show cdp traffic
```

## LLDP (Link Layer Discovery Protocol)

LLDP est le standard ouvert **IEEE 802.1AB** — compatible multi-vendeurs.

```text
! Activer/désactiver globalement
Switch(config)# lldp run
Switch(config)# no lldp run

! Activer/désactiver par direction sur une interface
Switch(config)# interface fastethernet 0/1
Switch(config-if)# lldp transmit
Switch(config-if)# lldp receive
Switch(config-if)# no lldp transmit
Switch(config-if)# no lldp receive

! Modifier les timers
Switch(config)# lldp timer 60
Switch(config)# lldp holdtime 180
```

### Vérification LLDP

```text
Switch# show lldp neighbors
Switch# show lldp neighbors detail
Switch# show lldp neighbors interface fastethernet 0/1
Switch# show lldp
```

## CDP vs LLDP

| Critère | CDP | LLDP |
|---------|-----|------|
| Standard | Cisco propriétaire | IEEE 802.1AB |
| Interopérabilité | Cisco uniquement | Multi-vendeurs |
| Granularité | Global uniquement | Par direction (TX/RX) |
| Défaut | Activé | Désactivé |

!!! danger "Sécurité"
    Désactiver CDP/LLDP sur les interfaces connectées à des équipements non-Cisco ou exposées (ex: ports utilisateurs) — ils révèlent des informations sur la topologie réseau.

!!! tip "Bonnes pratiques"
    - Désactiver CDP sur les interfaces utilisateurs avec `no cdp enable`
    - Utiliser LLDP en environnement multi-vendeurs (switches HP, Juniper, etc.)
    - `show cdp neighbors detail` affiche les adresses IP des voisins — très utile pour le troubleshooting
