# DHCPv4

## Adresses exclues

```text
Router(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.10
Router(config)# ip dhcp excluded-address 192.168.1.254
```

## Création de pool

```text
Router(config)# ip dhcp pool POOL1
Router(dhcp-config)# network 192.168.1.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.1.1
Router(dhcp-config)# dns-server 8.8.8.8 8.8.4.4
Router(dhcp-config)# domain-name example.com
Router(dhcp-config)# lease 0 0 30
```

Format du bail : `lease [jours] [heures] [minutes]`

## Notation CIDR

```text
Router(config)# ip dhcp pool SALES
Router(dhcp-config)# network 192.168.10.0 /24
Router(dhcp-config)# default-router 192.168.10.1
Router(dhcp-config)# dns-server 1.1.1.1 1.0.0.1
Router(dhcp-config)# domain-name example.com
```

## Helper Address (relai DHCP)

Transmet les requêtes DHCP vers un serveur distant quand le serveur n'est pas sur le même segment.

```text
Router(config)# interface vlan 20
Router(config-if)# ip helper-address 192.168.254.1
Router(config-if)# no shutdown
```

## Vérification

```text
Router# show ip dhcp pool
Router# show ip dhcp binding
Router# show ip dhcp statistics
Router# debug ip dhcp server events
```

!!! tip "Bonnes pratiques"
    - Toujours exclure les adresses statiques **avant** de créer le pool
    - Configurer `ip helper-address` sur l'interface SVI/VLAN du segment client, pas sur le serveur
    - Utiliser `show ip dhcp binding` pour vérifier les attributions et détecter les conflits
