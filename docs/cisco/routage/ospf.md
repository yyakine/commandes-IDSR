# OSPF

## Interface Loopback (Router-ID)

```text
Router(config)# interface loopback 0
Router(config-if)# ip address 10.0.0.1 255.255.255.255
Router(config-if)# no shutdown
```

## Activation OSPF

```text
Router(config)# router ospf 1
Router(config-router)# router-id 1.1.1.1

! Annoncer les réseaux (wildcard mask)
Router(config-router)# network 192.168.1.0 0.0.0.255 area 0
Router(config-router)# network 192.168.2.0 0.0.0.255 area 0
Router(config-router)# network 10.0.0.0 0.0.0.255 area 10

! Activer OSPF directement sur l'interface
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip ospf 1 area 0
```

## Type de réseau

```text
! Point-to-point sur liaisons série
Router(config)# interface serial 0/0
Router(config-if)# ip ospf network point-to-point
```

## Coût et bande passante de référence

```text
! Modifier le coût d'une interface
Router(config-if)# ip ospf cost 50

! Modifier la bande passante de référence globale (défaut: 100 Mbps)
Router(config)# router ospf 1
Router(config-router)# auto-cost reference-bandwidth 1000
```

## Redistribution et route par défaut

```text
Router(config)# router ospf 1
Router(config-router)# redistribute connected subnets
Router(config-router)# redistribute static subnets
Router(config-router)# default-information originate
```

## Hello / Dead intervals

```text
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip ospf hello-interval 10
Router(config-if)# ip ospf dead-interval 40
```

## OSPFv3 (IPv6)

```text
Router(config)# ipv6 unicast-routing
Router(config)# interface loopback 0
Router(config-if)# ipv6 address 2001:db8::1:1/128
Router(config-if)# no shutdown

Router(config)# ipv6 router ospf 1
Router(config-rtr)# router-id 1.1.1.1

Router(config)# interface gigabitethernet 0/0
Router(config-if)# ipv6 address 2001:db8:1::1/64
Router(config-if)# ipv6 ospf 1 area 0
Router(config-if)# no shutdown
```

## Vérification

```text
Router# show ip ospf neighbors
Router# show ip ospf database
Router# show ip route ospf
Router# show ip ospf interface brief
Router# show ip ospf statistics
```

!!! info "Dead interval"
    Le dead-interval doit toujours être **4x le hello-interval**. Des valeurs différentes entre voisins empêchent l'adjacence OSPF.

!!! tip "Bonnes pratiques"
    - Toujours configurer un `router-id` explicite via loopback pour la stabilité
    - Utiliser `auto-cost reference-bandwidth 1000` (1 Gbps) sur tous les routeurs pour des coûts cohérents
    - Configurer `passive-interface` sur les interfaces sans voisins OSPF pour réduire le trafic inutile
    - Les hello/dead intervals doivent être identiques sur tous les routeurs d'un même segment
