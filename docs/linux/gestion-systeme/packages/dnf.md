# dnf (Red Hat / Fedora)

`dnf` est le gestionnaire de packages des distributions Red Hat depuis RHEL 8. Il remplace `yum` dont il est entièrement compatible.

## Mise à jour

```bash
dnf check-update              # Liste les mises à jour disponibles sans les appliquer
dnf update -y                 # Met à jour tous les packages
dnf update nginx -y           # Met à jour un seul package
```

## Installer et supprimer

```bash
dnf install nginx -y          # Installer un package
dnf install nginx httpd -y    # Installer plusieurs packages
dnf remove nginx              # Supprimer un package et ses dépendances orphelines
dnf reinstall nginx           # Réinstaller un package
dnf autoremove                # Supprimer les dépendances devenues orphelines
```

## Rechercher et inspecter

```bash
dnf search nginx              # Rechercher un package par nom ou description
dnf info nginx                # Détails : version, dépôt, description
dnf list installed            # Lister tous les packages installés
dnf list available            # Lister les packages disponibles dans les dépôts
dnf provides /usr/sbin/nginx  # Trouver quel package fournit un fichier
rpm -ql nginx                 # Lister les fichiers installés par un package
```

## Historique et rollback

```bash
dnf history                   # Liste toutes les transactions passées
dnf history info 5            # Détails de la transaction n°5
dnf history undo last         # Annuler la dernière transaction
dnf history undo 5            # Annuler une transaction spécifique
```

!!! tip "Rollback"
    `dnf history undo` est très utile pour revenir en arrière après une mise à jour qui a cassé quelque chose.

## Dépôts

```bash
dnf repolist                  # Liste les dépôts activés
dnf repolist all              # Liste tous les dépôts, activés et désactivés
dnf config-manager --enable epel          # Activer un dépôt
dnf config-manager --disable epel        # Désactiver un dépôt
dnf install epel-release                 # Installer le dépôt EPEL
ls /etc/yum.repos.d/                     # Fichiers de configuration des dépôts
```

## Nettoyage

```bash
dnf clean all                 # Supprime le cache des métadonnées et des packages
dnf makecache                 # Reconstruit le cache des dépôts
```
