# Système de fichiers

## Exploration

```text
Switch# show file systems
Switch# show flash0:
Switch# dir flash0:
Switch# show nvram:
Switch# dir nvram:
Switch# pwd
Switch# more flash0:filename.txt
```

| Commande | Description |
|----------|-------------|
| `show file systems` | Liste tous les systèmes de fichiers disponibles |
| `show flash0:` | Espace disque de la mémoire flash |
| `dir flash0:` | Contenu détaillé de la flash |
| `dir nvram:` | Contenu de la NVRAM (startup-config) |
| `more flash0:fichier` | Affiche le contenu d'un fichier |

!!! tip "Bonnes pratiques"
    - Vérifier l'espace flash disponible avec `show flash0:` avant de copier une image IOS
    - Utiliser `dir flash0:` pour confirmer la présence des fichiers après une copie
