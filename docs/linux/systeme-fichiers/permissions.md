## Modifier les permissions (chmod)

### Mode symbolique

| Commande | Résultat |
|----------|----------|
| `chmod u+x fichier` | Ajoute l'exécution au propriétaire |
| `chmod o-r fichier` | Retire la lecture aux autres |
| `chmod g=r fichier` | Groupe : lecture uniquement |
| `chmod u+rwx,o-rwx fichier` | Tous les droits au propriétaire, aucun aux autres |
| `chmod u=rwx,g=rx,o= fichier` | `u=rwx`, `g=r-x`, `o=---` |
| `chmod -R g+r dossier` | Applique récursivement |

### Mode octal

| Valeur | Permissions |
|--------|-------------|
| `7` | `rwx` |
| `6` | `rw-` |
| `5` | `r-x` |
| `4` | `r--` |
| `0` | `---` |

| Commande | Résultat |
|----------|----------|
| `chmod 700 fichier` | `u=rwx`, `g=---`, `o=---` |
| `chmod 755 fichier` | `u=rwx`, `g=r-x`, `o=r-x` |
| `chmod 750 fichier` | `u=rwx`, `g=r-x`, `o=---` |
| `chmod 640 fichier` | `u=rw-`, `g=r--`, `o=---` |
| `chmod 644 fichier` | `u=rw-`, `g=r--`, `o=r--` |

```bash title="Rendre un script exécutable par le propriétaire"
chmod u+x backup.sh
```

```bash title="Permissions récursives sur un dossier : u=rwx, g=r-x, o=---"
chmod -R 750 /var/www/mysite
```

## Modifier le propriétaire (chown)

| Commande | Description |
|----------|-------------|
| `chown [user] [fichier]` | Change le propriétaire |
| `chown [user]:[groupe] [fichier]` | Change le propriétaire et le groupe |
| `chown -R [user] [dossier]` | Applique récursivement |

```bash title="Changer le propriétaire d'un dossier et son contenu"
sudo chown -R stagiaire1 /home/stagiaire1/projets
```

## Modifier le groupe (chgrp)

| Commande | Description |
|----------|-------------|
| `chgrp [groupe] [fichier]` | Change le groupe d'un fichier |
| `chgrp -R [groupe] [dossier]` | Applique récursivement |

```bash title="Changer le groupe d'un fichier"
sudo chgrp equipe_dev rapport_final.md
```

## Permissions par défaut (umask)

`umask` définit les permissions **retirées** par défaut à chaque nouveau fichier ou dossier créé.

> `umask` est temporaire, il s'applique uniquement pendant la session terminal en cours.

| Commande | Permissions résultantes |
|----------|------------------------|
| `umask 000` | Tous les droits à tous |
| `umask 022` | `u=rwx`, `g=r-x`, `o=r-x` (valeur système par défaut) |
| `umask 027` | `u=rwx`, `g=r-x`, `o=---` |
| `umask 077` | `u=rwx`, `g=---`, `o=---` |

```bash title="Appliquer un umask pour la session courante"
umask 027
```

