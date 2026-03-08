# Navigation et manipulation

## Navigation

| Commande | Description |
|----------|-------------|
| `pwd` | Affiche le répertoire courant |
| `cd [chemin]` | Change le répertoire courant |
| `cd ..` | Remonte d'un niveau |
| `cd -` | Retourne au répertoire précédent |
| `cd` | Retourne au répertoire personnel (`~`) |
| `ls` | Liste les fichiers et dossiers |
| `ls -l` | Liste détaillée |
| `ls -a` | Inclut les fichiers cachés |
| `ls -la` | Détaillée + fichiers cachés |

## Redirections et pipes

| Opérateur | Description |
|-----------|-------------|
| `>` | Redirige la sortie vers un fichier (écrase) |
| `>>` | Redirige la sortie vers un fichier (ajoute) |
| `<` | Utilise un fichier comme entrée |
| `|` | Passe la sortie d'une commande à une autre |
| `2>` | Redirige les erreurs vers un fichier |

```bash title="Combiner sort et uniq via pipe"
cat names.txt | sort | uniq
```

```bash title="Rediriger les erreurs vers /dev/null"
find / -name "*.conf" 2> /dev/null
```

## Gestion des fichiers et dossiers

| Commande | Description |
|----------|-------------|
| `touch [fichier]` | Crée un fichier vide |
| `mkdir [dossier]` | Crée un répertoire |
| `mkdir -p rep1/rep2/rep3` | Crée une arborescence complète |
| `mv [source] [destination]` | Déplace un fichier ou dossier |
| `mv [ancien] [nouveau]` | Renomme un fichier ou dossier |
| `cp [source] [destination]` | Copie un fichier |
| `cp -r [source] [destination]` | Copie un dossier récursivement |
| `rm [fichier]` | Supprime un fichier |
| `rm -rf [dossier]` | Supprime un dossier non vide |
| `rmdir [dossier]` | Supprime un dossier vide |
| `rm -i [fichier]` | Supprime avec confirmation |
| `cp -i [source] [dest]` | Copie avec confirmation |
| `mv -i [source] [dest]` | Déplace avec confirmation |

```bash title="Créer une arborescence complète en une commande"
mkdir -p ~/OFPPT/{ID/{ID-101,ID-102},DD/{DD-101,DD-102}}
```

```bash title="Déplacer tous les fichiers .md d'un dossier vers un autre"
mv dossier/source/*.md dossier/destination/
```

## Lecture et écriture de fichiers

| Commande | Description |
|----------|-------------|
| `cat [fichier]` | Affiche le contenu d'un fichier |
| `cat > [fichier]` | Écrit dans un fichier (entrée clavier, écrase) |
| `cat >> [fichier]` | Écrit dans un fichier sans écraser |
| `echo "texte" > [fichier]` | Écrit une ligne dans un fichier (écrase) |
| `echo "texte" >> [fichier]` | Ajoute une ligne sans écraser |
| `head -n [N] [fichier]` | Affiche les N premières lignes |
| `tail -n [N] [fichier]` | Affiche les N dernières lignes |
| `less [fichier]` | Lecture paginée (`q` pour quitter) |

```bash title="Afficher les lignes 10 à 15 d'un fichier"
head -n 15 /etc/group | tail -n 6
```

```bash title="Afficher les 5 derniers utilisateurs créés (noms seulement)"
tail -n 5 /etc/passwd | cut -d ":" -f 1
```

```bash title="Concaténer deux fichiers dans un troisième"
cat fichier1.txt fichier2.txt > fusion.txt
```

## Recherche de fichiers

| Commande | Description |
|----------|-------------|
| `find [chemin] -name [fichier]` | Recherche par nom |
| `find [chemin] -type f` | Recherche uniquement des fichiers |
| `find [chemin] -type d` | Recherche uniquement des dossiers |
| `find [chemin] -size +10M` | Fichiers de plus de 10 Mo |
| `find [chemin] -size -500k` | Fichiers de moins de 500 Ko |
| `find [chemin] -mtime -7` | Modifiés il y a moins de 7 jours |
| `find [chemin] -mtime +30` | Modifiés il y a plus de 30 jours |
| `find [chemin] -user [user]` | Appartenant à un utilisateur |
| `find [chemin] -perm 755` | Avec des permissions précises |
| `find [chemin] -delete` | Supprime les fichiers trouvés |

```bash title="Tous les fichiers .log modifiés il y a plus de 3 jours"
find /var/log -name "*.log" -mtime +3
```

```bash title="Fichiers de plus de 500 Mo dans /home, résultat dans un fichier"
find /home -size +500M -type f >> ~/fichiers_lourds.txt
```

## Manipulation de texte

| Commande | Description |
|----------|-------------|
| `grep "motif" [fichier]` | Lignes contenant le motif |
| `grep "^motif" [fichier]` | Lignes commençant par le motif |
| `grep "motif$" [fichier]` | Lignes se terminant par le motif |
| `grep -v "motif" [fichier]` | Lignes ne contenant PAS le motif |
| `cut -d ':' -f 1` | Sépare par `:` et retourne le 1er champ |
| `cut -d ':' -f 1-4` | Retourne les champs 1 à 4 |
| `sort` | Trie les lignes alphabétiquement |
| `uniq` | Supprime les doublons consécutifs |

```bash title="Afficher les lignes de /etc/passwd contenant /home"
grep "/home" /etc/passwd
```

```bash title="Afficher les lignes ne contenant pas nologin"
grep -v "nologin" /etc/passwd
```

```bash title="Retourner uniquement les noms d'utilisateurs"
cut -d ":" -f 1 /etc/passwd
```

## Aide sur les commandes

| Commande | Description |
|----------|-------------|
| `man [commande]` | Manuel complet d'une commande |
| `[commande] --help` | Aide rapide |
| `which [commande]` | Chemin de l'exécutable |
| `whereis [commande]` | Chemin binaire, sources et man |
