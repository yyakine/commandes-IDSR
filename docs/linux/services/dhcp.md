# DHCP (isc-dhcp-server
)
## Installation

=== "Debian / Ubuntu"
    ```bash
    apt install isc-dhcp-server -y
    ```

=== "Red Hat / Rocky / Fedora"
    ```bash
    dnf install dhcp-server -y
    ```

## Fichiers de configuration importants

| Fichier | Rôle |
|---------|------|
| `/etc/dhcp/dhcpd.conf` | Configuration principale |
| `/var/lib/dhcp/dhcpd.leases` | Base de données des baux actifs |


## Configuration principale

```ini title="/etc/dhcp/dhcpd.conf"
# Paramètres globaux
option domain-name "lan.local";
option domain-name-servers 8.8.8.8, 1.1.1.1;
default-lease-time 600;
max-lease-time 7200;

# Déclaration de sous-réseau
subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.100 192.168.1.200;
    option routers 192.168.1.1;
    option subnet-mask 255.255.255.0;
}

# Réservation statique (IP fixe par adresse MAC)
host serveur-web {
    hardware ethernet aa:bb:cc:dd:ee:ff;
    fixed-address 192.168.1.50;
}
```

## Commandes

```bash
systemctl start dhcpd        # Démarrer
systemctl enable dhcpd       # Activer au démarrage
systemctl restart dhcpd      # Redémarrer après modification
systemctl status dhcpd       # Vérifier l'état
```

!!! info "Nom du service"
    Sur Debian/Ubuntu le service s'appelle `isc-dhcp-server`, sur Red Hat `dhcpd`.

    ```bash
    # Debian / Ubuntu
    systemctl restart isc-dhcp-server

    # Red Hat / Rocky
    systemctl restart dhcpd
    ```

## Vérifier la syntaxe et les erreurs

```bash
dhcpd -t -cf /etc/dhcp/dhcpd.conf        # Tester la syntaxe sans démarrer
journalctl -u dhcpd -f                   # Logs en temps réel (Red Hat)
journalctl -u isc-dhcp-server -f         # Logs en temps réel (Debian)
cat /var/lib/dhcp/dhcpd.leases           # Baux actifs (Debian)
cat /var/lib/dhcpd/dhcpd.leases          # Baux actifs (Red Hat)
```
