# DNS (BIND9)

## Installation

=== "Debian / Ubuntu"
    ```bash
    apt install bind9 bind9utils -y
    ```

=== "Red Hat / Rocky / Fedora"
    ```bash
    dnf install bind bind-utils -y
    ```

## Fichiers de configuration

=== "Debian / Ubuntu"

    | Fichier | Rôle |
    |---------|------|
    | `/etc/bind/named.conf` | Fichier principal (inclut les autres) |
    | `/etc/bind/named.conf.options` | Options globales : forwarders, récursion |
    | `/etc/bind/named.conf.local` | Déclaration des zones locales |
    | `/etc/bind/<zone>.db` | Fichier de zone (enregistrements DNS) |
    | `/var/log/syslog` | Logs BIND9 |

=== "Red Hat / Rocky / Fedora"

    | Fichier | Rôle |
    |---------|------|
    | `/etc/named.conf` | Fichier principal + options + zones |
    | `/var/named/<zone>.db` | Fichiers de zone |
    | `/var/log/messages` | Logs BIND9 |

## Configuration des options globales

=== "Debian / Ubuntu"
    ```ini title="/etc/bind/named.conf.options"
    options {
        directory "/var/cache/bind";

        forwarders {
            8.8.8.8;
            1.1.1.1;
        };

        recursion yes;
        allow-query { any; };
        dnssec-validation auto;
    };
    ```

=== "Red Hat / Rocky / Fedora"
    ```ini title="/etc/named.conf — section options"
    options {
        directory "/var/named";

        forwarders {
            8.8.8.8;
            1.1.1.1;
        };

        recursion yes;
        allow-query { any; };
        dnssec-validation auto;
    };
    ```

## Déclarer une zone

=== "Debian / Ubuntu"
    ```ini title="/etc/bind/named.conf.local"
    zone "lan.local" {
        type master;
        file "/etc/bind/db.lan.local";
    };

    zone "1.168.192.in-addr.arpa" {
        type master;
        file "/etc/bind/db.192.168.1";
    };
    ```

=== "Red Hat / Rocky / Fedora"
    ```ini title="/etc/named.conf — section zone"
    zone "lan.local" {
        type master;
        file "/var/named/lan.local.db";
    };

    zone "1.168.192.in-addr.arpa" {
        type master;
        file "/var/named/192.168.1.db";
    };
    ```

## Fichier de zone

```ini title="/etc/bind/zone.db"
$TTL 604800
@   IN  SOA  ns1.lan.local. admin.lan.local. (
            2026030801  ; Serial
            3600        ; Refresh
            1800        ; Retry
            604800      ; Expire
            604800 )    ; Negative TTL

; Serveurs de noms
@       IN  NS   ns1.lan.local.

; Enregistrements A
ns1     IN  A    192.168.1.1
www     IN  A    192.168.1.10
srv     IN  A    192.168.1.20

; Alias CNAME
ftp     IN  CNAME www.lan.local.
```

```ini title="Zone inverse — db.192.168.1"
$TTL 604800
@   IN  SOA  ns1.lan.local. admin.lan.local. (
            2026030801 3600 1800 604800 604800 )

@   IN  NS   ns1.lan.local.

; PTR — résolution inverse
1   IN  PTR  ns1.lan.local.
10  IN  PTR  www.lan.local.
20  IN  PTR  srv.lan.local.
```

## Commandes

```bash
systemctl restart named          # Red Hat
systemctl restart bind9          # Debian / Ubuntu
systemctl enable named           # Red Hat
systemctl enable bind9           # Debian / Ubuntu
```

## Vérifier la syntaxe et les erreurs

```bash
named-checkconf                          # Vérifier la syntaxe de named.conf
named-checkzone lan.local /etc/bind/db.lan.local   # Vérifier un fichier de zone
journalctl -u named -f                   # Logs en temps réel (Red Hat)
journalctl -u bind9 -f                   # Logs en temps réel (Debian)

# Tester la résolution
dig @192.168.1.1 www.lan.local           # Requête DNS vers le serveur
dig -x 192.168.1.10                      # Résolution inverse
nslookup www.lan.local 192.168.1.1       # Alternative à dig
```

!!! tip "Serial number"
    Le numéro de série dans le SOA doit être incrémenté à chaque modification du fichier de zone, sinon les serveurs secondaires ne détecteront pas les changements. La convention est d'utiliser le format `YYYYMMDDNN`.
