# NAT Dynamique

Le NAT dynamique traduit un **pool d'adresses privées** vers un **pool d'adresses publiques** (many-to-many).

## Configuration

```text
! ACL définissant les hôtes à traduire
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255

! Pool d'adresses publiques
Router(config)# ip nat pool PUBLIC_POOL 200.1.1.1 200.1.1.10 netmask 255.255.255.0

! Lier l'ACL au pool
Router(config)# ip nat inside source list 1 pool PUBLIC_POOL

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

!!! info "NAT Dynamique vs PAT"
    Le NAT dynamique nécessite autant d'adresses publiques que de sessions simultanées. Si le pool est épuisé, de nouvelles connexions sont refusées. Utiliser **PAT** pour n'utiliser qu'une seule adresse publique.

!!! tip "Bonnes pratiques"
    - Dimensionner le pool public en fonction du nombre de connexions simultanées attendues
    - Préférer PAT (overload) dans la majorité des cas pour économiser les adresses publiques
