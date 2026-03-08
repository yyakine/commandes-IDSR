# Filtres et opérateurs Get-ADUser

## Opérateurs disponibles

| Type | Opérateur | Exemple |
|------|-----------|---------|
| Égal | `-eq` | `{Department -eq "IT"}` |
| Pas égal | `-ne` | `{Status -ne "Inactive"}` |
| Plus petit que | `-lt` | `{LastLogonDate -lt (Get-Date).AddDays(-90)}` |
| Plus grand que | `-gt` | `{LogonCount -gt 0}` |
| Wildcard | `-like` | `{Name -like "John*"}` |
| Pas wildcard | `-notlike` | `{mail -notlike "*"}` |
| Regexp | `-match` | `{mail -match "[0-9]+"}` |
| Pas regexp | `-notmatch` | `{Name -notmatch "[0-9]"}` |

## Exemples pratiques

```powershell
# Utilisateurs d'un département dans une OU spécifique
Get-ADUser -Filter {Department -eq "IT"} `
    -SearchBase "OU=Users,DC=domain,DC=com" `
    -Properties Title, Manager

# Comptes désactivés
Get-ADUser -Filter {Enabled -eq $false}

# Comptes bloqués
Get-ADUser -Filter {LockedOut -eq $true}

# Utilisateurs inactifs depuis 90 jours
Get-ADUser -Filter {LastLogonDate -lt (Get-Date).AddDays(-90)} `
    -Properties LastLogonDate

# Utilisateurs sans adresse email
Get-ADUser -Filter {mail -notlike "*"} -Properties mail

# Comptes dont le mot de passe n'expire jamais
Get-ADUser -Filter {PasswordNeverExpires -eq $true}

# Combiner plusieurs filtres avec -and / -or
Get-ADUser -Filter {Department -eq "IT" -and Enabled -eq $true}
```

## Paramètres de recherche

| Paramètre | Description |
|-----------|-------------|
| `-SearchBase` | OU de départ pour la recherche |
| `-SearchScope OneLevel` | Cherche uniquement dans l'OU directe, pas les sous-OU |
| `-SearchScope Subtree` | Cherche dans l'OU et toutes ses sous-OU (défaut) |
| `-Properties *` | Retourner tous les attributs (plus lent) |
| `-ResultSetSize $null` | Retourner tous les résultats sans limite |

!!! tip "Bonnes pratiques"
    - Utiliser `-Filter` plutôt que `Get-ADUser | Where-Object` : le filtre s'exécute côté serveur AD, bien plus performant
    - Utiliser `-SearchScope OneLevel` pour éviter les recherches récursives inutiles
    - Toujours spécifier `-SearchBase` pour limiter le scope de recherche
    - Spécifier explicitement les `-Properties` nécessaires plutôt que `-Properties *` pour de meilleures performances
