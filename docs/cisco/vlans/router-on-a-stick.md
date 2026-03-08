# Router-on-a-Stick


## Configuration du routeur

```cisco
! Activer l'interface physique
Router(config)# interface gigabitethernet 0/0
Router(config-if)# no shutdown

! Sous-interface pour le VLAN 10
Router(config-if)# interface gigabitethernet 0/0.10
Router(config-subif)# encapsulation dot1q 10
Router(config-subif)# ip address 192.168.10.1 255.255.255.0

! Sous-interface pour le VLAN 20
Router(config-subif)# interface gigabitethernet 0/0.20
Router(config-subif)# encapsulation dot1q 20
Router(config-subif)# ip address 192.168.20.1 255.255.255.0

! Sous-interface pour le VLAN natif (si besoin)
Router(config-subif)# interface gigabitethernet 0/0.1
Router(config-subif)# encapsulation dot1q 1 native
Router(config-subif)# ip address 192.168.1.1 255.255.255.0
```

## Configuration du switch

L'interface du switch connectée au routeur **doit être en mode trunk** :

```cisco
Switch(config)# interface fastethernet 0/24
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 1,10,20
Switch(config-if)# switchport nonegotiate
```

## Vérification

```cisco
Router# show ip route
Router# show interfaces gigabitethernet 0/0.10
Router# show ip interface brief
```

!!! info "Router-on-a-Stick vs SVI"
    Router-on-a-Stick nécessite un routeur externe. Si vous avez un switch Layer 3, préférer les **SVI** qui offrent un routage matériel plus rapide.

!!! tip "Bonnes pratiques"
    - Nommer les sous-interfaces avec le numéro du VLAN (`Gi0/0.10` pour VLAN 10) pour la lisibilité
    - Toujours activer l'interface physique parente avec `no shutdown` avant de configurer les sous-interfaces
    - La sous-interface du VLAN natif doit utiliser `encapsulation dot1q [vlan] native`
