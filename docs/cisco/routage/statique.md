# Routage statique

## Route statique

```text
! Avec masque de sous-réseau
Router(config)# ip route 192.168.2.0 255.255.255.0 192.168.1.2

! Notation CIDR
Router(config)# ip route 192.168.2.0/24 192.168.1.2
```

## Route statique flottante

Route de secours — utilisée uniquement si la route principale disparaît.

```text
! Distance administrative 150 (> 1 de la route primaire)
Router(config)# ip route 192.168.2.0 255.255.255.0 192.168.1.2 150
```

## Route par défaut

```text
Router(config)# ip route 0.0.0.0 0.0.0.0 192.168.1.1
```

## Vérification

```text
Router# show ip route
Router# show ip route static
Router# show running-config | include ip route
```

!!! tip "Bonnes pratiques"
    - Toujours utiliser des routes flottantes comme backup avec une DA > celle du protocole principal
    - La route par défaut (`0.0.0.0/0`) doit pointer vers le routeur de sortie Internet
    - Préférer la notation CIDR pour la lisibilité
