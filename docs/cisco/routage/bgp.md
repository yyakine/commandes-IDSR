# BGP

## Configuration de base

```text
! Activer BGP (AS 65001)
Router(config)# router bgp 65001

! Voisins eBGP (AS différent)
Router(config-router)# neighbor 192.168.1.2 remote-as 65002
Router(config-router)# neighbor 192.168.1.3 remote-as 65002

! Annoncer des réseaux
Router(config-router)# network 192.168.10.0 mask 255.255.255.0
Router(config-router)# network 10.0.0.0 mask 255.0.0.0
```

## iBGP (même AS)

```text
Router(config)# router bgp 65001
Router(config-router)# neighbor 10.0.0.2 remote-as 65001
Router(config-router)# neighbor 10.0.0.2 update-source loopback 0
```

## Vérification

```text
Router# show ip bgp summary
Router# show ip bgp neighbors
Router# show ip bgp
Router# show ip route bgp
Router# debug ip bgp keepalives
```

| Commande | Description |
|----------|-------------|
| `show ip bgp summary` | État de toutes les sessions BGP (Up/Down, préfixes reçus) |
| `show ip bgp` | Table BGP complète avec attributs |
| `show ip route bgp` | Routes BGP installées dans la table de routage |

!!! info "eBGP vs iBGP"
    - **eBGP** : entre routeurs de différents AS — distance administrative **20**
    - **iBGP** : entre routeurs du même AS — distance administrative **200**

