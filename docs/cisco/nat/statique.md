# NAT Statique

Le NAT statique traduit **une adresse privée fixe** vers **une adresse publique fixe** (1-to-1).

## Configuration

```text
! Définir la traduction statique
Router(config)# ip nat inside source static 192.168.1.10 200.1.1.10

! Marquer les interfaces
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip nat inside

Router(config)# interface serial 0/0
Router(config-if)# ip nat outside
```

## Vérification

```text
Router# show ip nat translations
Router# show ip nat statistics
Router# debug ip nat
Router# clear ip nat translation *
```

!!! tip "Bonnes pratiques"
    - Toujours marquer `ip nat inside` sur l'interface LAN et `ip nat outside` sur l'interface WAN/Internet
    - Utiliser `show ip nat translations` pour confirmer que la traduction est active
    - `clear ip nat translation *` efface toutes les traductions — utile pour le debug, à éviter en production
