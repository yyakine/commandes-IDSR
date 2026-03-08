# Routage switch multicouches (SVI)

## Configuration

```cisco
! Activer le routage IP sur le switch L3
Switch(config)# ip routing

! Créer les SVI pour chaque VLAN
Switch(config)# interface vlan 10
Switch(config-if)# ip address 192.168.10.1 255.255.255.0
Switch(config-if)# no shutdown

Switch(config)# interface vlan 20
Switch(config-if)# ip address 192.168.20.1 255.255.255.0
Switch(config-if)# no shutdown

Switch(config)# interface vlan 30
Switch(config-if)# ip address 192.168.30.1 255.255.255.0
Switch(config-if)# no shutdown
```

## Ports routed (accès direct L3)

Pour une liaison directe vers un routeur ou un autre équipement L3, convertir un port en interface routed :

```cisco
Switch(config)# interface gigabitethernet 0/1
Switch(config-if)# no switchport
Switch(config-if)# ip address 10.0.0.1 255.255.255.252
Switch(config-if)# no shutdown
```

## Vérification

```cisco
Switch# show ip route
Switch# show interfaces vlan 10
Switch# show ip interface brief
Switch# show running-config | section interface vlan
```

## Router-on-a-Stick vs SVI

| Critère | Router-on-a-Stick | SVI (Switch L3) |
|---------|-------------------|-----------------|
| Matériel | Routeur externe requis | Switch L3 uniquement |
| Performance | Limitée par l'interface | Routage matériel (ASIC) |
| Scalabilité | Limité à une interface physique | Haute scalabilité |
| Coût | Nécessite un routeur dédié | Inclus dans le switch L3 |

!!! tip "Bonnes pratiques"
    - Toujours activer `ip routing` avant de créer les SVI, sinon les interfaces ne routent pas
    - Créer le VLAN avant la SVI correspondante (`vlan 10` puis `interface vlan 10`)
    - Utiliser des interfaces routées (`no switchport`) pour les liaisons point-à-point vers d'autres routeurs
