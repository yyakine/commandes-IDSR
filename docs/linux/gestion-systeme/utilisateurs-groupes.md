# Utilisateurs et groupes

## Fichiers système

| Fichier | Contenu |
|---------|---------|
| `/etc/passwd` | Liste des utilisateurs : nom, UID, GID, home, shell |
| `/etc/shadow` | Mots de passe hashés et politique d'expiration |
| `/etc/group` | Liste des groupes et leurs membres |
| `/etc/gshadow` | Mots de passe de groupes et administrateurs |

```bash
cat /etc/passwd               # Afficher tous les utilisateurs
cat /etc/group                # Afficher tous les groupes
id                            # UID, GID et groupes de l'utilisateur courant
id younes                     # UID, GID et groupes d'un utilisateur spécifique
whoami                        # Nom de l'utilisateur courant
who                           # Utilisateurs connectés en ce moment
last                          # Historique des connexions
```

## Gestion des utilisateurs

### Créer un utilisateur

```bash
useradd younes                          # Créer un utilisateur (sans home sur certaines distros)
useradd -m younes                       # Créer avec le répertoire home /home/younes
useradd -m -s /bin/bash younes          # Avec home et shell bash
useradd -m -s /bin/bash -u 1500 younes  # Avec UID personnalisé
useradd -m -G sudo,docker younes        # Avec groupes secondaires (Debian)
useradd -m -G wheel,docker younes       # Avec groupes secondaires (Red Hat)
```

### Définir et changer le mot de passe

```bash
passwd younes                 # Définir le mot de passe d'un utilisateur (root)
passwd                        # Changer son propre mot de passe
```

### Modifier un utilisateur

```bash
usermod -s /bin/zsh younes          # Changer le shell
usermod -d /home/newdir younes      # Changer le répertoire home
usermod -l newname younes           # Renommer un utilisateur
usermod -aG docker younes           # Ajouter à un groupe secondaire (-a obligatoire)
usermod -G docker,sudo younes       # Redéfinir tous les groupes secondaires
usermod -L younes                   # Verrouiller le compte
usermod -U younes                   # Déverrouiller le compte
```

!!! warning "-a avec -G"
    Sans `-a`, `usermod -G` remplace tous les groupes secondaires existants. Toujours utiliser `-aG` pour ajouter sans supprimer.

### Supprimer un utilisateur

```bash
userdel younes                # Supprimer l'utilisateur (garde le home)
userdel -r younes             # Supprimer l'utilisateur et son répertoire home
```

## Gestion des groupes

```bash
groupadd devops               # Créer un groupe
groupadd -g 1100 devops       # Créer un groupe avec GID personnalisé
groupmod -n newname devops    # Renommer un groupe
groupdel devops               # Supprimer un groupe
gpasswd -a younes devops      # Ajouter un utilisateur à un groupe
gpasswd -d younes devops      # Retirer un utilisateur d'un groupe
groups younes                 # Lister les groupes d'un utilisateur
```


## Élévation de privilèges

```bash
su -                          # Passer root avec son environnement complet
su - younes                   # Passer à un autre utilisateur
sudo commande                 # Exécuter une commande en tant que root
sudo -u younes commande       # Exécuter une commande en tant qu'un autre utilisateur
sudo -i                       # Ouvrir un shell root interactif
visudo                        # Éditer /etc/sudoers de façon sécurisée
```

!!! info "sudo vs su"
    `sudo` exécute une seule commande avec les privilèges root en conservant la traçabilité dans les logs. `su` ouvre une session complète en tant qu'un autre utilisateur, sans traçabilité par commande.
