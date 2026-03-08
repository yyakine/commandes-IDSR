# Samba

## Installation

=== "Debian / Ubuntu"
    ```bash
    apt install samba -y
    ```

=== "Red Hat / Fedora"
    ```bash
    dnf install samba samba-client -y
    ```

## Fichiers de configuration

| Fichier | Rôle |
|---------|------|
| `/etc/samba/smb.conf` | Configuration principale |
| `/var/lib/samba/private/passdb.tdb` | Base de données des mots de passe Samba |
| `/var/log/samba/` | Logs Samba |

## Configuration principale

```ini title="/etc/samba/smb.conf"
[global]
   workgroup = WORKGROUP
   server string = Serveur Samba
   security = user
   map to guest = bad user

# Partage avec authentification
[data]
   path = /srv/samba/data
   browseable = yes
   writable = yes
   valid users = @sambausers
   create mask = 0660
   directory mask = 0770

# Partage public (sans mot de passe)
[public]
   path = /srv/samba/public
   browseable = yes
   writable = no
   guest ok = yes
```

## Créer un utilisateur Samba

L'utilisateur doit d'abord exister en tant qu'utilisateur Linux.

```bash
useradd -M -s /sbin/nologin sambauser     # Créer un utilisateur sans home ni shell
smbpasswd -a sambauser                    # Ajouter à Samba et définir le mot de passe
smbpasswd -e sambauser                    # Activer le compte
smbpasswd -d sambauser                    # Désactiver le compte
smbpasswd -x sambauser                    # Supprimer le compte Samba
```

## Commandes

=== "Debian / Ubuntu"
    ```bash
    systemctl enable --now samba             
    systemctl restart samba                  
    ```
    
=== "Redhat / Fedora"
    ```bash
    systemctl enable --now smb               
    systemctl restart smb
    ```                 


## Vérifier la syntaxe et les erreurs

```bash
testparm                                 # Vérifier la syntaxe de smb.conf
testparm -s                              # Afficher la config finale sans commentaires
smbclient -L localhost -N               # Lister les partages disponibles localement
journalctl -u smb -f                    # Logs en temps réel (Red Hat)
journalctl -u samba -f                  # Logs en temps réel (Debian)
```

```bash title="Tester la connexion depuis un client Linux"
smbclient //192.168.1.1/data -U sambauser
```

!!! warning "Pare-feu"
    Samba utilise les ports 139 et 445 :
    ```bash
    nft add rule inet filter input tcp dport { 139, 445 } accept
    nft add rule inet filter input udp dport { 137, 138 } accept
    ```

!!! info "SELinux sur Red Hat"
    Sur Red Hat/Rocky, SELinux peut bloquer Samba même si la configuration est correcte :
    ```bash
    setsebool -P samba_enable_home_dirs on
    setsebool -P samba_export_all_rw on
    ```
