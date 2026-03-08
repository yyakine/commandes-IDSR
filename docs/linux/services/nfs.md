# NFS (Network File System)

## Installation

=== "Debian / Ubuntu"
    ```bash
    # Serveur
    apt install nfs-kernel-server -y

    # Client
    apt install nfs-common -y
    ```

=== "Red Hat / Rocky / Fedora"
    ```bash
    # Serveur et client
    dnf install nfs-utils -y
    ```

## Fichiers de configuration

| Fichier | Rôle |
|---------|------|
| `/etc/exports` | Définition des partages NFS |
| `/var/lib/nfs/etab` | Table interne des exports actifs |
| `/etc/fstab` | Montages persistants côté client |

## Configurer les partages

```ini title="/etc/exports"
# Syntaxe : <répertoire> <client>(<options>)

/srv/data    192.168.1.0/24(rw,sync,no_subtree_check)
/srv/public  *(ro,sync,no_subtree_check)
/srv/admin   192.168.1.10(rw,sync,no_root_squash)
```

| Option | Description |
|--------|-------------|
| `rw` | Lecture et écriture |
| `ro` | Lecture seule |
| `sync` | Écriture synchrone, plus sûr |
| `no_subtree_check` | Désactive la vérification de sous-arborescence, améliore les performances |
| `no_root_squash` | Le root client garde ses privilèges root sur le partage |
| `root_squash` | Le root client est mappé sur nobody (défaut, plus sûr) |

## Commandes côté serveur

```bash
systemctl enable --now nfs-server     # Démarrer le serveur NFS
exportfs -a                           # Appliquer /etc/exports sans redémarrer
exportfs -r                           # Recharger et re-exporter
exportfs -v                           # Afficher les partages actifs
showmount -e localhost                # Lister les partages exportés
```

## Commandes côté client

```bash
showmount -e 192.168.1.1              # Lister les partages disponibles sur un serveur
mount -t nfs 192.168.1.1:/srv/data /mnt/data    # Monter un partage manuellement
umount /mnt/data                      # Démonter
```

```bash title="/etc/fstab — montage persistant côté client"
192.168.1.1:/srv/data  /mnt/data  nfs  defaults,_netdev  0  0
```

!!! info "_netdev"
    L'option `_netdev` indique au système d'attendre que le réseau soit disponible avant de monter le partage au démarrage.

## Vérifier la syntaxe et les erreurs

```bash
exportfs -v                           # Vérifier les exports actifs
journalctl -u nfs-server -f           # Logs en temps réel (Debian)
journalctl -u nfs-server -f           # Logs en temps réel (Red Hat)
showmount -e localhost                # Confirmer que les partages sont bien exportés
```

!!! warning "Pare-feu"
    NFS utilise plusieurs ports. Le plus simple est d'autoriser le port 2049 :
    ```bash
    nft add rule inet filter input tcp dport 2049 accept
    nft add rule inet filter input udp dport 2049 accept
    ```
