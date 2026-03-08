# EIGRP

## Activation EIGRP (IPv4)

```text
Router(config)# router eigrp 10
Router(config-router)# no auto-summary
Router(config-router)# network 192.168.1.0 0.0.0.255
Router(config-router)# network 192.168.2.0 0.0.0.255
Router(config-router)# network 10.0.0.0 0.0.0.255
```

## Router-ID via Loopback

```text
Router(config)# interface loopback 0
Router(config-if)# ip address 1.1.1.1 255.255.255.255
Router(config-if)# no shutdown
```

## Interface passive

```text
Router(config)# router eigrp 10
Router(config-router)# passive-interface gigabitethernet 0/1
```

## Vérification

```text
Router# show ip eigrp neighbors
Router# show ip route eigrp
Router# show ip protocols
Router# show ip eigrp topology
```

!!! tip "Bonnes pratiques"
    - Toujours activer `no auto-summary` pour supporter le VLSM
    - Le numéro d'AS EIGRP doit être **identique** sur tous les routeurs voisins
    - Configurer `passive-interface` sur les interfaces LAN pour éviter d'envoyer des hello inutiles
