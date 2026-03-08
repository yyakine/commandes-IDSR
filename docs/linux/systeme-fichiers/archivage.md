# Compression et archivage

Linux propose plusieurs outils de compression et d'archivage. **`tar`** crée des archives (sans compression seul), combiné avec `gzip` ou `bzip2` il compresse aussi. 

`gzip` est plus rapide, `bzip2` compresse mieux.

## gzip

```bash
gzip fichier.txt          # Compresse → fichier.txt.gz (supprime l'original)
gzip -k fichier.txt       # Compresse en gardant l'original (-k = keep)
gzip -d fichier.txt.gz    # Décompresse
gunzip fichier.txt.gz     # Équivalent à gzip -d
gzip -l fichier.txt.gz    # Affiche le taux de compression
gzip -9 fichier.txt       # Compression maximale (1=rapide, 9=max)
```

!!! warning "Fichier original"
    Par défaut `gzip` **supprime** le fichier source après compression. Utilise `-k` pour le conserver.

## bzip2

```bash
bzip2 fichier.txt         # Compresse → fichier.txt.bz2 (supprime l'original)
bzip2 -k fichier.txt      # Compresse en gardant l'original
bzip2 -d fichier.txt.bz2  # Décompresse
bunzip2 fichier.txt.bz2   # Équivalent à bzip2 -d
bzip2 -v fichier.txt      # Mode verbeux (affiche le taux de compression)
```

!!! info "gzip vs bzip2"
    `bzip2` produit des fichiers ~15% plus petits que `gzip` mais est significativement plus lent. Pour des backups volumineux, `bzip2` est préférable.

## tar

`tar` seul **archive** sans compresser (regroupe plusieurs fichiers/dossiers en un seul `.tar`).

### Options principales

| Option | Description |
|--------|-------------|
| `-c` | **C**réer une archive |
| `-x` | E**x**traire une archive |
| `-t` | Lis**t**er le contenu sans extraire |
| `-f` | Spécifier le nom du **f**ichier archive |
| `-v` | Mode **v**erbeux (affiche les fichiers traités) |
| `-z` | Compression **gz**ip (`.tar.gz`) |
| `-j` | Compression **bzip2** (`.tar.bz2`) |
| `-C` | Extraire vers un **dossier cible** |

### Créer une archive

```bash
# Archive simple (sans compression)
tar -cvf archive.tar /dossier/

# Archive compressée avec gzip
tar -czvf archive.tar.gz /dossier/

# Archive compressée avec bzip2
tar -cjvf archive.tar.bz2 /dossier/

# Archiver plusieurs éléments
tar -czvf backup.tar.gz /etc /home /var/log
```

### Extraire une archive

```bash
# Extraire dans le dossier courant
tar -xzvf archive.tar.gz

# Extraire vers un dossier spécifique
tar -xzvf archive.tar.gz -C /tmp/restauration/

# Extraire une archive bzip2
tar -xjvf archive.tar.bz2 -C /tmp/restauration/
```

### Lister le contenu sans extraire

```bash
tar -tzvf archive.tar.gz
tar -tjvf archive.tar.bz2
```

### Cas pratiques

```bash title="Backup du /etc avec date"
tar -czvf backup-etc-$(date +%Y%m%d).tar.gz /etc/
# → backup-etc-20260307.tar.gz
```

```bash title="Extraire un seul fichier depuis une archive"
tar -xzvf archive.tar.gz etc/hosts
```

```bash title="Voir la taille d'une archive"
ls -lh archive.tar.gz
```

