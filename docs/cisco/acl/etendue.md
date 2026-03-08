# ACL Étendue

Les ACL étendues filtrent sur **source, destination, protocole et port** (plages 100-199 et 2000-2699).

## ACL numérotée

```text
Router(config)# access-list 100 permit tcp 192.168.1.0 0.0.0.255 192.168.2.0 0.0.0.255 eq 80
Router(config)# access-list 100 permit tcp 192.168.1.0 0.0.0.255 192.168.2.0 0.0.0.255 eq 443
Router(config)# access-list 100 deny icmp any any
Router(config)# access-list 100 permit ip any any
```

## ACL nommée

```text
Router(config)# ip access-list extended RESTRICT_TRAFFIC
Router(config-ext-nacl)# permit tcp 10.0.0.0 0.0.0.255 192.168.1.0 0.0.0.255 eq 22
Router(config-ext-nacl)# permit tcp 10.0.0.0 0.0.0.255 192.168.1.0 0.0.0.255 eq 23
Router(config-ext-nacl)# deny ip any any

! Appliquer sur une interface
Router(config)# interface serial 0/0
Router(config-if)# ip access-group RESTRICT_TRAFFIC out
```

## Vérification

```text
Router# show access-lists
Router# show ip access-lists
Router# show ip interface gigabitethernet 0/0
```

!!! info "Placement des ACL étendues"
    Placer les ACL étendues **le plus près possible de la source** — elles filtrent précisément, donc elles évitent que le trafic indésirable traverse inutilement le réseau.

!!! tip "Bonnes pratiques"
    - Toujours terminer une ACL étendue par `permit ip any any` si le trafic non filtré doit passer
    - Utiliser `in` pour filtrer le trafic entrant sur l'interface, `out` pour le trafic sortant
    - Les règles sont évaluées **dans l'ordre** — mettre les règles les plus spécifiques en premier
