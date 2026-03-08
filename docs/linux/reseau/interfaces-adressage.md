# Interfaces et adressage

Red Hat et Fedora Linux utilisent par défaut `iproute2` et `NetworkManager` pour configurer les interfaces.

Debian/Ubuntu incluent `iproute2` et **netplan**.

## Inspecter les interfaces
=== "iproute2"
    ```bash
    ip link show                  # Lister toutes les interfaces et leur état (UP/DOWN)
    ip addr show                  # Lister les interfaces avec leurs adresses IP
    ip addr show eth0             # Détails d'une interface spécifique
    ```

=== "NetworkManager"
    ```bash
    nmcli device status                   # Lister toutes les interfaces et leur état
    nmcli device show                     # Lister les interfaces avec leurs adresses IP
    nmcli device show eth0                # Détails d'une interface spécifique
    ```

## Configuration temporaire (ip)

Ces commandes s'appliquent immédiatement mais sont perdues au redémarrage.

```bash
# Adresse IP
ip addr add 192.168.1.10/24 dev eth0      # Ajouter une adresse IP
ip addr del 192.168.1.10/24 dev eth0      # Supprimer une adresse IP

# État de l'interface
ip link set eth0 up                        # Activer une interface
ip link set eth0 down                      # Désactiver une interface

# Adresse MAC temporaire
ip link set eth0 address 00:11:22:33:44:55
```

## Configuration persistante

=== "Debian / Ubuntu"

    Debian utilise **Netplan** (Ubuntu 18.04+).

    **Netplan** — fichier YAML dans `/etc/netplan/` :

    ```yaml title="/etc/netplan/01-netcfg.yaml — IP statique"
    network:
      version: 2
      ethernets:
        eth0:
          addresses:
            - 192.168.1.10/24
          routes:
            - to: default
              via: 192.168.1.1
          nameservers:
            addresses: [8.8.8.8, 1.1.1.1]
          dhcp4: false
    ```

    ```yaml title="/etc/netplan/01-netcfg.yaml — DHCP"
    network:
      version: 2
      ethernets:
        eth0:
          dhcp4: true
    ```

    ```bash
    netplan apply               # Appliquer la configuration Netplan
    netplan try                 # Tester avec rollback automatique si pas confirmé
    ```


=== "Red Hat / Fedora"

    Red Hat utilise **NetworkManager** via `nmcli`.
    **nmcli**:

    ```bash title="IP statique avec nmcli"
    nmcli con mod eth0 ipv4.addresses 192.168.1.10/24
    nmcli con mod eth0 ipv4.gateway 192.168.1.1
    nmcli con mod eth0 ipv4.dns "8.8.8.8 1.1.1.1"
    nmcli con mod eth0 ipv4.method manual
    nmcli con up eth0
    ```

    ```bash title="Ajout d'adresses IP à une connexion nmcli"
    nmcli con mod eth0 +ipv4.addresses "192.168.1.11/24,192.168.1.12/24"

    #Utiliser -ipv4.addresses pour supprimer des adresses
    ```
  

    ```bash title="DHCP avec nmcli"
    nmcli con mod eth0 ipv4.method auto
    nmcli con up eth0
    ```

    ```bash title="Créer une nouvelle connexion"
    nmcli con add type ethernet ifname eth0 con-name eth0 \
      ipv4.addresses 192.168.1.10/24 \
      ipv4.gateway 192.168.1.1 \
      ipv4.dns "8.8.8.8" \
      ipv4.method manual
    ```

    ```bash
    nmcli con reload            # Recharger les fichiers de configuration
    nmcli con up eth0           # Appliquer sur l'interface
    ```

