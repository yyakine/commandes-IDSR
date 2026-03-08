# LDIFDE

Contrairement à CSVDE, LDIFDE supporte les **modifications et suppressions** d'objets.

## Paramètres

| Paramètre | Description |
|-----------|-------------|
| `-i` | Mode importation |
| `-f` | Spécifie le fichier LDIF |
| `-d` | Définit la racine de recherche (DN) |
| `-r` | Filtre LDAP |
| `-p` | Profondeur : `base`, `onelevel`, ou `subtree` |
| `-l` | Liste d'attributs à exporter |
| `-o` | Exclut certains attributs |
| `-k` | Ignore les erreurs non bloquantes |
| `-v` | Mode verbeux (détails complets) |
| `-a user "password"` | Authentification explicite (user + password) |

## Export

```cmd
# Exporter tous les utilisateurs
ldifde -f "C:\Export.ldf" ^
       -d "DC=ofppt,DC=local" ^
       -p subtree ^
       -r "(objectClass=user)"

# Exporter avec sélection d'attributs
ldifde -f "C:\Users_Filtered.ldf" ^
       -l "cn,sAMAccountName,mail,displayName" ^
       -d "OU=IT,DC=ofppt,DC=local" ^
       -p subtree
```

## Import

```cmd
# Importer depuis un fichier LDIF
ldifde -i -f "C:\Import.ldf" -k -v
```

### Structure du fichier LDIF d'import

```ldif
# Créer un utilisateur
dn: CN=John Doe,OU=IT,DC=ofppt,DC=local
changetype: add
objectClass: user
sAMAccountName: jdoe
userPrincipalName: jdoe@ofppt.local
cn: John Doe
displayName: Doe John
givenName: John
sn: Doe
mail: jdoe@ofppt.local
department: IT
userAccountControl: 512

# Modifier un attribut d'un utilisateur existant
dn: CN=John Doe,OU=IT,DC=ofppt,DC=local
changetype: modify
replace: department
department: Development
-

# Supprimer un utilisateur
dn: CN=John Doe,OU=IT,DC=ofppt,DC=local
changetype: delete
```

## Codes userAccountControl

| Code | Description |
|------|-------------|
| `512` | Compte actif et normal |
| `514` | Compte désactivé (`ACCOUNTDISABLE`) |
| `544` | Compte désactivé avec home directory |
| `66048` | Compte machine de domaine actif |

!!! tip "Bonnes pratiques"
    - Utiliser `-k` pour ignorer les erreurs mineures lors d'un import
    - Utiliser `-v` pour afficher le détail de chaque opération
    - LDIFDE ne gère pas non plus les mots de passe en clair — les définir après avec PowerShell
    - Toujours utiliser le DN complet pour identifier les objets AD
