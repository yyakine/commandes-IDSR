# GRE (Generic Routing Encapsulation)

GRE crée un tunnel Layer 3 point-à-point entre deux routeurs, permettant de transporter n'importe quel protocole de couche 3 à travers un réseau IP.

## Configuration

À faire sur **les deux routeurs** en inversant source et destination.

```text
! Routeur A
Router(config)# interface tunnel 0
Router(config-if)# ip address 10.0.0.1 255.255.255.0
Router(config-if)# tunnel source 200.1.1.1
Router(config-if)# tunnel destination 200.1.1.2
Router(config-if)# tunnel mode gre ip
Router(config-if)# no shutdown

! Routeur B
Router(config)# interface tunnel 0
Router(config-if)# ip address 10.0.0.2 255.255.255.0
Router(config-if)# tunnel source 200.1.1.2
Router(config-if)# tunnel destination 200.1.1.1
Router(config-if)# tunnel mode gre ip
Router(config-if)# no shutdown
```

## Routage à travers le tunnel

```text
! Annoncer le réseau du tunnel via OSPF
Router(config)# router ospf 1
Router(config-router)# network 10.0.0.0 0.0.0.255 area 0

! Ou via route statique
Router(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2
```

## Vérification

```text
Router# show interface tunnel 0
Router# ping 10.0.0.2
Router# show ip route
```

!!! warning "GRE sans chiffrement"
    GRE seul n'offre **aucun chiffrement** — le trafic circule en clair. Combiner avec IPsec pour sécuriser le tunnel en production.

!!! tip "Bonnes pratiques"
    - Utiliser des adresses loopback comme `tunnel source` pour la résilience (résiste à la panne d'une interface physique)
    - Toujours tester la connectivité avec `ping 10.0.0.2` depuis l'interface tunnel avant de configurer le routage
    - GRE + OSPF est une combinaison courante pour propager les routes dynamiquement à travers le tunnel
