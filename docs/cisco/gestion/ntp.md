# NTP et horloge

## Heure manuelle

```text
Switch# clock set 14:30:00 14 January 2026
```

Format : `clock set HH:MM:SS DD MONTH YYYY`

```text
Switch# show clock
Switch# show clock detail
```

## NTP (Network Time Protocol)

```text
! Configurer un ou plusieurs serveurs NTP
Switch(config)# ntp server 192.168.1.1
Switch(config)# ntp server 192.168.1.2
Switch(config)# ntp server 192.168.1.3

! Serveur préféré
Switch(config)# ntp server 192.168.1.1 prefer

! Configurer le fuseau horaire
Switch(config)# clock timezone CET 1
```

## Vérification NTP

```text
Switch# show ntp status
Switch# show ntp associations
```

| Commande | Description |
|----------|-------------|
| `show ntp status` | État de la synchronisation (synchronized/unsynchronized) |
| `show ntp associations` | Liste des serveurs NTP et leur état |

!!! tip "Bonnes pratiques"
    - Toujours synchroniser tous les équipements réseau sur le même serveur NTP pour la cohérence des logs
    - Configurer le fuseau horaire avec `clock timezone` avant d'activer NTP
    - Utiliser au minimum 2 serveurs NTP pour la redondance
