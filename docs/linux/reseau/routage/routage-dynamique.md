# Routage dynamique

Sous Linux, deux logiciels sont couramment utilisés : **FRR** (FRRouting) et **Bird**.

## FRRouting (FRR)

FRR supporte OSPF, BGP, RIP et d'autres protocoles. La configuration se fait via un shell interactif `vtysh`.

### Installation

=== "Debian/Ubuntu"
    ```bash
    apt install frr -y
    ```

=== "Red Hat/Fedora"
    ```bash
    dnf install frr -y
    ```

### Activer un protocole

Les protocoles sont désactivés par défaut. Pour les activer, éditer `/etc/frr/daemons` :

```ini title="/etc/frr/daemons"
ospfd=yes    # Activer OSPF
ripd=yes     # Activer RIP
bgpd=yes     # Activer BGP
```

```bash
systemctl restart frr
```

### Configurer un protocole de routage

```bash
vtysh                              # Accéder au shell FRR
```

```ios
routeur# configure terminal
...etc
```

### Vérification FRR

```ios
routeur# show ip route        # Table de routage complète
routeur# show ip ospf route   # Routes apprises via OSPF
routeur# show ip rip          # Routes apprises via RIP
```

---

## Bird

Bird est un daemon de routage léger supportant RIP, OSPF et BGP. Il fonctionne en mode serveur (routeur) et client.

### Installation

=== "Debian / Ubuntu"
    ```bash
    apt install bird -y
    ```

=== "Red Hat / Rocky / Fedora"
    ```bash
    dnf install bird -y
    ```

### Configuration côté routeur

```bash title="/etc/bird.conf — serveur"
protocol kernel {
    persist;
    scan time 20;
    export all;
}

protocol device {
    scan time 10;
}

protocol direct {
    export all;
}

protocol rip {
    export all;
    import all;
    authentication plaintext;
    password "monpassword";
    interface "eth*" { mode broadcast; };
}
```

### Configuration côté client

```bash title="/etc/bird.conf — client"
protocol kernel {
    learn;
    import all;
    export all;
}

protocol device { }

protocol rip {
    import filter {
        if net ~ [ 192.168.160.0/24 ] then {
            reject;          # Ne pas importer la route locale
        }
        else accept;
    };
    authentication plaintext;
    password "monpassword";
    interface "eth*" { mode broadcast; };
}
```

```bash
systemctl enable --now bird
systemctl restart bird
```

!!! info "FRR vs Bird"
    FRR est plus adapté aux infrastructures complexes avec plusieurs protocoles. Bird est plus léger et souvent utilisé dans des environnements où seul RIP ou OSPF est nécessaire.
