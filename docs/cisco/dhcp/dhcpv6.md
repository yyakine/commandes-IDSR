# DHCPv6

## Activer le routage IPv6

```text
Router(config)# ipv6 unicast-routing
```

## Adresses exclues

```text
Router(config)# ipv6 dhcp excluded-address 2001:db8:1::1 2001:db8:1::10
Router(config)# ipv6 dhcp excluded-address 2001:db8:1::254
```

## Création de pool

```text
Router(config)# ipv6 dhcp pool POOL_IPV6
Router(config-dhcpv6)# address prefix 2001:db8:1::/64
Router(config-dhcpv6)# dns-server 2001:4860:4860::8888
Router(config-dhcpv6)# domain-name example.com
```

## Application sur interface

=== "SLAAC + DHCPv6 (Stateless)"

    Les clients génèrent leur propre adresse via SLAAC — DHCPv6 fournit uniquement DNS et domaine.

    ```text
    Router(config)# interface gigabitethernet 0/0
    Router(config-if)# ipv6 address 2001:db8:1::1/64
    Router(config-if)# ipv6 nd other-config-flag
    Router(config-if)# ipv6 dhcp server POOL_IPV6
    Router(config-if)# no shutdown
    ```

=== "DHCPv6 Only (Stateful)"

    DHCPv6 attribue l'adresse complète au client.

    ```text
    Router(config)# interface gigabitethernet 0/0
    Router(config-if)# ipv6 address 2001:db8:1::1/64
    Router(config-if)# ipv6 nd managed-config-flag
    Router(config-if)# ipv6 dhcp server POOL_IPV6
    Router(config-if)# no shutdown
    ```

## Vérification

```text
Router# show ipv6 dhcp pool
Router# show ipv6 dhcp binding
Router# show ipv6 interface brief
```

| Flag | Mode | Description |
|------|------|-------------|
| `other-config-flag` | Stateless | SLAAC pour l'adresse, DHCPv6 pour DNS/domaine |
| `managed-config-flag` | Stateful | DHCPv6 gère adresse + DNS + domaine |

!!! tip "Bonnes pratiques"
    - Préférer le mode **stateless** si SLAAC suffit — moins de charge sur le serveur
    - Toujours activer `ipv6 unicast-routing` avant toute configuration DHCPv6
    - Vérifier avec `show ipv6 dhcp binding` que les clients reçoivent bien leurs adresses
