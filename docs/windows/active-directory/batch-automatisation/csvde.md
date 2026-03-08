# CSVDE

CSVDE (CSV Directory Exchange) est un outil en ligne de commande Windows qui permet d'**exporter et importer des objets Active Directory** au format CSV.

## Paramètres

| Paramètre | Description |
|-----------|-------------|
| `-i` | Mode importation (crée ou modifie les objets) |
| `-f` | Spécifie le fichier CSV à utiliser |
| `-d` | Définit la racine de recherche (DN) |
| `-r` | Définit un filtre LDAP |
| `-p` | Profondeur : `base`, `onelevel`, ou `subtree` |
| `-l` | Liste les attributs à exporter/importer |
| `-o` | Exclut certains attributs de l'export |
| `-k` | Ignore certaines erreurs (objets existants) |
| `-j` | Dossier de journalisation des logs |
| `-v` | Mode verbeux (affiche les détails complets) |
| `-t` | Spécifie le port LDAP (défaut : `389`) |

## Export

```cmd
# Exporter tous les utilisateurs d'une OU
csvde -f "C:\Export_Users.csv" ^
      -d "OU=Users,DC=ofppt,DC=local" ^
      -p subtree ^
      -r "(objectClass=user)"

# Exporter avec sélection d'attributs précis
csvde -f "C:\Users_Filtered.csv" ^
      -l "cn,sAMAccountName,mail,displayName,department" ^
      -d "DC=ofppt,DC=local" ^
      -p subtree
```

## Import

L'import CSVDE nécessite un fichier CSV dont la première ligne contient les noms des attributs LDAP.

```cmd
# Importer depuis un fichier CSV
csvde -i -f "C:\Import_Users.csv" -k -v -j "C:\Logs"
```

### Structure du fichier CSV d'import

```csv
DN,objectClass,sAMAccountName,userPrincipalName,cn,displayName,givenName,sn,mail,department,userAccountControl
"CN=John Doe,OU=IT,DC=ofppt,DC=local",user,jdoe,jdoe@ofppt.local,John Doe,Doe John,John,Doe,jdoe@ofppt.local,IT,512
"CN=Jane Smith,OU=RH,DC=ofppt,DC=local",user,jsmith,jsmith@ofppt.local,Jane Smith,Smith Jane,Jane,Smith,jsmith@ofppt.local,RH,512
```

!!! warning "Limites de CSVDE"
    CSVDE **ne peut pas importer les mots de passe**. Après l'import, il faut définir les mots de passe séparément avec `Set-ADAccountPassword`.

!!! tip "Bonnes pratiques"
    - Toujours faire un export de sauvegarde avant un import de masse
    - Utiliser `-k` pour ignorer les erreurs mineures (objets déjà existants)
    - Utiliser `-v` et `-j "C:\Logs"` pour auditer les opérations
