# apt (Debian / Ubuntu)

`apt` est le gestionnaire de packages des distributions basées sur Debian. Il résout les dépendances automatiquement et télécharge les packages depuis les dépôts configurés dans `/etc/apt/sources.list`.

## Mise à jour

```bash
apt update                   # Rafraîchit l'index des packages disponibles
apt upgrade -y               # Met à jour tous les packages installés
apt full-upgrade -y          # Met à jour en supprimant les packages conflictuels si nécessaire
apt update && apt upgrade -y # Les deux en une seule commande
```

!!! info "update vs upgrade"
    `apt update` ne modifie rien sur le système, il synchronise uniquement la liste des versions disponibles. `apt upgrade` applique les mises à jour.

## Installer et supprimer

```bash
apt install nginx             # Installer un package
apt install nginx apache2     # Installer plusieurs packages d'un coup
apt remove nginx              # Supprimer un package (garde les fichiers de config)
apt purge nginx               # Supprimer un package et ses fichiers de configuration
apt autoremove                # Supprimer les dépendances devenues orphelines
apt install --reinstall nginx # Réinstaller un package sans le supprimer
```

## Rechercher et inspecter

```bash
apt search nginx              # Rechercher un package par nom ou description
apt show nginx                # Détails : version, dépendances, description
apt list --installed          # Lister tous les packages installés
apt list --upgradable         # Lister les packages avec une mise à jour disponible
dpkg -l nginx                 # Vérifier si un package est installé et sa version
dpkg -L nginx                 # Lister tous les fichiers installés par un package
```

## Nettoyage

```bash
apt clean                     # Supprime le cache des packages téléchargés (.deb)
apt autoclean                 # Supprime uniquement les anciennes versions du cache
apt autoremove                # Supprime les dépendances inutilisées
```

## Dépôts

```bash
cat /etc/apt/sources.list             # Dépôts principaux
ls /etc/apt/sources.list.d/           # Dépôts tiers
add-apt-repository ppa:user/repo      # Ajouter un PPA (Ubuntu)
apt update                            # Toujours rafraîchir après ajout d'un dépôt
```
