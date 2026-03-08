# rpm (Red Hat / Fedora)

`rpm` est le gestionnaire de packages bas niveau des distributions Red Hat. Contrairement à `dnf`, il ne résout pas les dépendances automatiquement. Il sert principalement à inspecter, installer des `.rpm` locaux et vérifier des packages.

## Installer et supprimer

```bash
rpm -ivh package.rpm          # Installer un fichier .rpm local
rpm -Uvh package.rpm          # Mettre à jour (installe si absent)
rpm -Fvh package.rpm          # Mettre à jour uniquement si déjà installé
rpm -e nginx                  # Supprimer un paquet
rpm -e --nodeps nginx         # Supprimer sans vérifier les dépendances
```

!!! warning "Dépendances"
    `rpm` n'installe pas les dépendances automatiquement. Pour un package avec dépendances, utilise `dnf install package.rpm` à la place.

## Interroger la base de données

```bash
rpm -qa                       # Lister tous les paquets installés
rpm -qa | grep nginx          # Chercher un paquet installé
rpm -qi nginx                 # Informations détaillées sur un paquet installé
rpm -ql nginx                 # Lister tous les fichiers installés par un paquet
rpm -qc nginx                 # Lister uniquement les fichiers de configuration
rpm -qd nginx                 # Lister uniquement les fichiers de documentation
rpm -qf /etc/nginx/nginx.conf # Trouver quel paquet a installé un fichier
```

## Interroger un fichier .rpm avant installation

```bash
rpm -qip package.rpm          # Informations sur un .rpm local non installé
rpm -qlp package.rpm          # Lister les fichiers contenus dans un .rpm local
```

## Vérifier l'intégrité

```bash
rpm -V nginx                  # Vérifier si les fichiers installés ont été modifiés
rpm -Va                       # Vérifier tous les paquets installés
rpm -K package.rpm            # Vérifier la signature GPG d'un .rpm
rpm --import /chemin/cle.gpg  # Importer une clé GPG pour la vérification
```

## Extraire le contenu d'un .rpm sans l'installer

```bash
rpm2cpio package.rpm | cpio -idmv
```
