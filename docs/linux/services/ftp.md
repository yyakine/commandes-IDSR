# FTP (vsftpd)

vsftpd (Very Secure FTP Daemon) est un serveur FTP léger et sécurisé. Il supporte les connexions anonymes, les utilisateurs locaux et le mode passif.

## Installation

=== "Debian / Ubuntu"
    ```bash
    apt install vsftpd -y
    ```

=== "Red Hat / Rocky / Fedora"
    ```bash
    dnf install vsftpd -y
    ```

## Fichiers de configuration
=== "Debian/Ubuntu"
    | Fichier | Rôle |
    |---------|------|
    | `/etc/vsftpd.conf` | Configuration principale (Debian) |
    | `/etc/ftpusers` | Utilisateurs interdits de connexion FTP |
    | `/etc/vsftpd.userlist` | Liste d'autorisation ou de blocage |
    | `/var/log/vsftpd.log` | Logs FTP |

=== "Redhat/Fedora"
    | Fichier | Rôle |
    |---------|------|
    | `/etc/vsftpd/vsftpd.conf` | Configuration principale |
    | `/etc/ftpusers` | Utilisateurs interdits de connexion FTP |
    | `/etc/vsftpd/user_list` | Liste d'autorisation ou de blocage |
    | `/var/log/vsftpd.log` | Logs FTP |

## Configuration principale

```ini title="/etc/vsftpd.conf"
anonymous_enable=NO          # Désactiver les connexions anonymes
local_enable=YES             # Autoriser les utilisateurs locaux
write_enable=YES             # Autoriser l'écriture
local_umask=022

chroot_local_user=YES        # Enfermer les utilisateurs dans leur home
allow_writeable_chroot=YES

# Mode passif (nécessaire derrière un pare-feu ou NAT)
pasv_enable=YES
pasv_min_port=40000
pasv_max_port=50000

# Liste d'utilisateurs autorisés
userlist_enable=YES
userlist_file=/etc/vsftpd.userlist
userlist_deny=NO             # NO = la liste est une whitelist

xferlog_enable=YES           # Activer les logs de transfert
```

!!! info "userlist_deny"
    `userlist_deny=NO` signifie que seuls les utilisateurs présents dans le fichier sont **autorisés**. `userlist_deny=YES` signifie que les utilisateurs du fichier sont **bloqués**.

## Ajouter un utilisateur FTP

```bash
useradd -m ftpuser
passwd ftpuser
echo "ftpuser" >> /etc/vsftpd.userlist    # Debian
echo "ftpuser" >> /etc/vsftpd/user_list   # Red Hat
```

## Commandes

```bash
# Debian / Ubuntu
systemctl enable --now vsftpd
systemctl restart vsftpd

# Red Hat / Rocky
systemctl enable --now vsftpd
systemctl restart vsftpd
```

## Vérifier la syntaxe et les erreurs

```bash
journalctl -u vsftpd -f          # Logs en temps réel
tail -f /var/log/vsftpd.log      # Logs de transfert

# Tester la connexion
ftp 192.168.1.10
```

!!! warning "Pare-feu et mode passif"
    En mode passif, les ports `40000-50000` doivent être ouverts sur le pare-feu :
    ```bash
    nft add rule inet filter input tcp dport 40000-50000 accept
    nft add rule inet filter input tcp dport 21 accept
    ```
