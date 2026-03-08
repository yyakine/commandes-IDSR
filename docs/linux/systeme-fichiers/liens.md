# Liens symboliques et physiques

Linux supporte deux types de liens : les **liens physiques (hard links)** qui pointent directement vers l'inode d'un fichier, et les **liens symboliques (soft links)** qui pointent vers un chemin.

## Comparaison

| Caractéristique | Lien physique | Lien symbolique |
|----------------|---------------|-----------------|
| Pointe vers | L'inode du fichier | Le chemin du fichier |
| Fichier supprimé | Le lien reste valide | Le lien devient cassé |
| Fonctionne sur dossiers | Non | Oui |
| Fonctionne entre partitions | Non | Oui |

## Créer un lien physique (hard link)

```bash
ln [fichier_source] [nom_lien]
```

| Commande | Description |
|----------|-------------|
| `ln fichier.txt lien_hard` | Crée un lien physique vers `fichier.txt` |
| `ls -li` | Affiche les inodes |

```bash title="Créer et vérifier un lien physique"
ln /etc/hosts /tmp/hosts_backup
ls -li /etc/hosts /tmp/hosts_backup
# Les deux fichiers affichent le même numéro d'inode
```

!!! info "Comportement"
    Supprimer le fichier original ne supprime pas les données, elles restent accessibles via le hard link tant qu'au moins un lien existe. Les données sont supprimées uniquement quand le compteur de liens atteint 0.

## Créer un lien symbolique (soft link)

```bash
ln -s [cible] [nom_lien]
```

| Commande | Description |
|----------|-------------|
| `ln -s fichier.txt lien_sym` | Crée un lien symbolique vers `fichier.txt` |
| `ln -s /etc/nginx/nginx.conf ~/nginx.conf` | Lien symbolique avec chemin absolu |
| `ln -sf [cible] [lien]` | Recrée le lien s'il existe déjà (`-f` force) |
| `readlink [lien]` | Affiche la cible d'un lien symbolique |
| `readlink -f [lien]` | Affiche le chemin absolu résolu |

```bash title="Créer et vérifier un lien symbolique"
ln -s /var/log/nginx/access.log ~/logs/nginx-access.log
ls -l ~/logs/nginx-access.log
# nginx-access.log -> /var/log/nginx/access.log
```

!!! warning "Lien cassé"
    Si la cible est déplacée ou supprimée, le lien symbolique devient cassé. `ls -l` l'affichera en rouge.

## Identifier les liens

```bash title="Lister les liens symboliques dans un dossier"
find /etc -type l
```

```bash title="Lister les fichiers avec plus d'un hard link"
find /home -type f -links +1
```

```bash title="Afficher le nombre de liens d'un fichier"
stat fichier.txt
# Links: 2  ← nombre de hard links
```
