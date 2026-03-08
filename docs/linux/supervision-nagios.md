# Supervision — Nagios Core

Nagios Core monitore la disponibilité des hôtes et services. Il utilise NRPE pour superviser les machines Linux à distance et NSClient++ pour les machines Windows.

## Installation — Nagios Core

=== "Debian / Ubuntu"
    ```bash
    apt install nagios4 nagios-plugins nagios-nrpe-plugin -y
    ```

=== "Red Hat / Rocky / Fedora"
    ```bash
    dnf install nagios nagios-plugins-all nagios-plugins-nrpe -y
    ```

## Fichiers de configuration

Nagios Core est installé dans `/usr/local/nagios/` quelle que soit la distribution. [web:86]

| Fichier | Rôle |
|---------|------|
| `/usr/local/nagios/etc/nagios.cfg` | Configuration principale |
| `/usr/local/nagios/etc/objects/` | Hôtes, services, commandes, contacts |
| `/usr/local/nagios/etc/objects/commands.cfg` | Définitions des commandes de check |
| `/usr/local/nagios/etc/objects/contacts.cfg` | Contacts et groupes de contacts |
| `/usr/local/nagios/etc/objects/templates.cfg` | Templates d'hôtes et services |
| `/usr/local/nagios/libexec/` | Plugins Nagios |
| `/usr/local/nagios/var/nagios.log` | Logs Nagios |

Pour organiser les hôtes, créer un répertoire dédié et le déclarer dans `nagios.cfg` : [web:95]

```bash
mkdir /usr/local/nagios/etc/servers

# Ajouter dans nagios.cfg
cfg_dir=/usr/local/nagios/etc/servers
```

## Superviser une machine Linux — NRPE

### Sur la machine Linux supervisée

=== "Debian / Ubuntu"
    ```bash
    apt install nagios-nrpe-server nagios-plugins -y
    ```

=== "Red Hat / Rocky / Fedora"
    ```bash
    dnf install nrpe nagios-plugins-all -y
    ```

```ini title="/etc/nagios/nrpe.cfg"
allowed_hosts=127.0.0.1,192.168.1.1      # IP du serveur Nagios

command[check_disk]=/usr/lib/nagios/plugins/check_disk -w 20% -c 10% -p /
command[check_load]=/usr/lib/nagios/plugins/check_load -w 15,10,5 -c 30,25,20
command[check_procs]=/usr/lib/nagios/plugins/check_procs -w 150 -c 200
```

```bash
systemctl enable --now nrpe
nft add rule inet filter input tcp dport 5666 accept
```

### Ajouter la commande check_nrpe sur le serveur Nagios

```bash title="/usr/local/nagios/etc/objects/commands.cfg"
define command {
    command_name check_nrpe
    command_line $USER1$/check_nrpe -H $HOSTADDRESS$ -c $ARG1$
}
```

### Déclarer l'hôte Linux

```bash title="/usr/local/nagios/etc/servers/linux-host.cfg"
define host {
    use                 linux-server
    host_name           serveur-linux
    alias               Serveur Linux
    address             192.168.1.20
    max_check_attempts  3
}

define service {
    use                 generic-service
    host_name           serveur-linux
    service_description Disque
    check_command       check_nrpe!check_disk
}

define service {
    use                 generic-service
    host_name           serveur-linux
    service_description Charge CPU
    check_command       check_nrpe!check_load
}

define service {
    use                 generic-service
    host_name           serveur-linux
    service_description Processus
    check_command       check_nrpe!check_procs
}
```

## Superviser une machine Windows — NSClient++

Installer NSClient++ sur la machine Windows depuis `nsclient.sourceforge.net`.

```ini title="C:\Program Files\NSClient++\nsclient.ini"
[/settings/default]
allowed hosts = 192.168.1.1        ; IP du serveur Nagios

[/modules]
NRPEServer = enabled
CheckSystem = enabled
CheckDisk = enabled
CheckEventLog = enabled
```

```text
net start nscp                     # Démarrer NSClient++ depuis cmd
```

### Déclarer l'hôte Windows

```bash title="/usr/local/nagios/etc/servers/windows-host.cfg"
define host {
    use                 windows-server
    host_name           serveur-windows
    alias               Serveur Windows
    address             192.168.1.30
    max_check_attempts  3
}

define service {
    use                 generic-service
    host_name           serveur-windows
    service_description CPU
    check_command       check_nrpe!CheckCPU warn=80 crit=90 time=5m
}

define service {
    use                 generic-service
    host_name           serveur-windows
    service_description Disque C
    check_command       check_nrpe!CheckDriveSize MinWarn=20% MinCrit=10% Drive=C:
}
```

## Commandes

```bash
systemctl enable --now nagios
systemctl restart nagios

# Tester NRPE depuis le serveur Nagios
/usr/local/nagios/libexec/check_nrpe -H 192.168.1.20 -c check_disk
/usr/local/nagios/libexec/check_nrpe -H 192.168.1.30 -c CheckCPU
```

## Vérifier la syntaxe et les erreurs

```bash
/usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg   # Vérifier la config
journalctl -u nagios -f
tail -f /usr/local/nagios/var/nagios.log
```

!!! tip "Toujours vérifier avant de recharger"
    Un fichier de configuration invalide empêche Nagios de démarrer. Toujours lancer `nagios -v` avant `systemctl restart`.
