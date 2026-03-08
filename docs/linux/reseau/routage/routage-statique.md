# Routage statique

## Activer le forwarding IP

```bash
# Vérifier l'état
cat /proc/sys/net/ipv4/ip_forward     # 0 = désactivé, 1 = activé

# Activer temporairement
echo 1 > /proc/sys/net/ipv4/ip_forward

#Pour la persistence
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
```

```bash title="/etc/sysctl.conf — persistant"
net.ipv4.ip_forward = 1
```

```bash
sysctl -p                             # Appliquer sans redémarrer
```

## Table de routage

```bash
ip route show                         # Table de routage complète
route -n                              # Même chose, ancienne syntaxe
ip route get 192.168.3.2              # Quelle route sera utilisée pour atteindre une IP
```

## Gérer les routes

```bash
# Ajouter
ip route add 192.168.3.0/24 via 192.168.1.1
ip route add default via 194.56.87.1       # Route par défaut (passerelle)

# Supprimer
ip route del 192.168.3.0/24
ip route del default
```

!!! warning "Temporaire"
    Ces commandes sont perdues au redémarrage. Utiliser la section persistance ci-dessous.


## Persistance

=== "Debian / Ubuntu"

    ```yaml title="/etc/netplan/01-netcfg.yaml"
    network:
      version: 2
      ethernets:
        eth0:
          addresses: [192.168.1.2/24]
          routes:
            - to: default
              via: 192.168.1.1
            - to: 192.168.3.0/24
              via: 192.168.1.1
    ```

    ```bash
    netplan apply
    ```

=== "Red Hat / Rocky / Fedora"

    ```bash
    nmcli con mod eth0 +ipv4.routes "192.168.3.0/24 192.168.1.1"
    nmcli con up eth0
    ```
## Diagnostics

```bash
ip route show
ip route get 192.168.3.2
traceroute 192.168.3.2
ping -c 4 192.168.3.2
```
