# Pare-feu (nftables)

`nftables` est le pare-feu natif du noyau Linux depuis la version 3.13, et remplace `iptables` sur toutes les distributions modernes. Il utilise une syntaxe unifiée pour IPv4, IPv6 et le filtrage de trames Ethernet.

## Installation
    
```bash title="La même installation pour Debian/Ubuntu ainsi que Redhat/Fedora"
apt install nftables -y
systemctl enable --now nftables
```

## Concepts de base

| Concept | Description |
|---------|-------------|
| `table` | Conteneur de chaînes, associé à une famille (`ip`, `ip6`, `inet`, `arp`) |
| `chain` | Suite de règles, avec un type (`filter`, `nat`) et un hook (`input`, `output`, `forward`) |
| `rule` | Condition et action (`accept`, `drop`, `reject`) |
| `set` | Groupe d'adresses ou de ports réutilisables dans les règles |


## Commandes de base

```bash
nft list ruleset                  # Afficher toutes les tables, chaînes et règles
nft list tables                   # Lister les tables uniquement
nft list table inet filter        # Afficher une table spécifique
nft flush ruleset                 # Vider toutes les règles
```

## Créer une table et des chaînes

```bash
# Créer une table
nft add table inet filter

# Créer une chaîne input avec politique par défaut drop
nft add chain inet filter input \
  '{ type filter hook input priority 0 ; policy drop ; }'

# Créer une chaîne forward
nft add chain inet filter forward \
  '{ type filter hook forward priority 0 ; policy drop ; }'

# Créer une chaîne output (tout autoriser par défaut)
nft add chain inet filter output \
  '{ type filter hook output priority 0 ; policy accept ; }'
```

## Ajouter des règles

```bash

# Autoriser les connexions établies et liées
nft add rule inet filter input ct state established,related accept

# Autoriser SSH
nft add rule inet filter input tcp dport 22 accept

# Autoriser HTTP et HTTPS
nft add rule inet filter input tcp dport { 80, 443 } accept

# Autoriser ICMP (ping)
nft add rule inet filter input ip protocol icmp accept
nft add rule inet filter input ip6 nexthdr icmpv6 accept

# Autoriser une plage de ports
nft add rule inet filter input tcp dport 3000-4000 accept

# Autoriser depuis une IP source spécifique
nft add rule inet filter input ip saddr 192.168.1.10 tcp dport 22 accept

# Autoriser depuis un sous-réseau
nft add rule inet filter input ip saddr 192.168.1.0/24 accept

# Bloquer une IP
nft add rule inet filter input ip saddr 10.0.0.5 drop

# Rejeter avec message ICMP (plus propre que drop)
nft add rule inet filter input tcp dport 23 reject
```

## Supprimer une règle

```bash
nft list ruleset -a               # Afficher les règles avec leurs handles
nft delete rule inet filter input handle 5    # Supprimer par handle
```

## Sauvegarder et restaurer

```bash
nft list ruleset > /etc/nftables.conf     # Sauvegarder l'état actuel
nft -f /etc/nftables.conf                 # Restaurer
systemctl enable nftables                 # Charger automatiquement au démarrage
```

!!! info "Persistance"
    Sur les deux distributions, `systemctl enable nftables` charge `/etc/nftables.conf` au démarrage. Toujours sauvegarder le ruleset dans ce fichier après modification.
