# ACL Standard

Les ACL standard filtrent uniquement sur **l'adresse IP source** (plages 1-99 et 1300-1999).

## ACL numérotée

```text
Router(config)# access-list 10 permit 192.168.1.0 0.0.0.255
Router(config)# access-list 10 deny 192.168.1.5 0.0.0.0
Router(config)# access-list 10 permit any

! Appliquer sur une interface
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip access-group 10 in
```

## ACL nommée

```text
Router(config)# ip access-list standard MY_ACL
Router(config-std-nacl)# permit 192.168.1.0 0.0.0.255
Router(config-std-nacl)# deny 192.168.1.50 0.0.0.0
Router(config-std-nacl)# permit any
```

## Vérification

```text
Router# show access-lists
Router# show access-lists 10
Router# show ip access-lists
Router# show ip interface gigabitethernet 0/0
```

!!! info "Placement des ACL standard"
    Placer les ACL standard **le plus près possible de la destination** — elles ne filtrent que sur la source et bloqueraient du trafic légitime si placées trop près de la source.

!!! tip "Bonnes pratiques"
    - Toujours terminer par un `permit any` explicite si nécessaire — le deny implicite final bloque tout
    - Préférer les ACL **nommées** pour la lisibilité et la possibilité de modifier des entrées individuelles
    - Utiliser `show ip interface` pour vérifier quelle ACL est appliquée sur quelle interface et dans quel sens
