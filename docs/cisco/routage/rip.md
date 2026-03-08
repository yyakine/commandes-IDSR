# RIP

## RIPv2

```text
Router(config)# router rip
Router(config-router)# version 2
Router(config-router)# network 192.168.1.0
Router(config-router)# network 192.168.2.0
Router(config-router)# network 10.0.0.0

! Désactiver l'auto-summary (obligatoire avec des sous-réseaux)
Router(config-router)# no auto-summary

! Interface passive (ne pas envoyer d'updates RIP)
Router(config-router)# passive-interface gigabitethernet 0/0
```

## RIPng (IPv6)

```text
Router(config)# ipv6 unicast-routing
Router(config)# ipv6 router rip NOM_PROCESSUS

Router(config)# interface gigabitethernet 0/0
Router(config-if)# ipv6 address 2001:db8:1::1/64
Router(config-if)# ipv6 rip NOM_PROCESSUS enable
Router(config-if)# no shutdown

! Interface passive RIPng
Router(config)# ipv6 router rip NOM_PROCESSUS
Router(config-rtr)# passive-interface gigabitethernet 0/1
```

## Vérification

```text
Router# show ip rip database
Router# show ip protocols
Router# show ip route rip
Router# debug ip rip
```

!!! warning "Limites de RIP"
    RIP est limité à **15 sauts** maximum. Au-delà, la destination est considérée inaccessible. Ne pas utiliser sur de grandes topologies.

!!! tip "Bonnes pratiques"
    - Toujours activer `no auto-summary` en RIPv2 pour éviter les problèmes de VLSM
    - Configurer `passive-interface` sur toutes les interfaces sans voisins RIP (ex: interfaces LAN)
    - Préférer OSPF ou EIGRP pour les réseaux de production
