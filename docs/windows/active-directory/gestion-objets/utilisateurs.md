# Utilisateurs

## Créer un utilisateur (New-ADUser)

```powershell
$Password = ConvertTo-SecureString "TempPass123!" -AsPlainText -Force

New-ADUser `
    -Name "John Doe" `
    -SamAccountName "jdoe" `
    -UserPrincipalName "jdoe@domain.com" `
    -GivenName "John" `
    -Surname "Doe" `
    -DisplayName "Doe, John" `
    -EmailAddress "jdoe@domain.com" `
    -Title "Developer" `
    -Department "IT" `
    -Company "ACME Corp" `
    -Office "Casablanca" `
    -Path "OU=IT,DC=domain,DC=com" `
    -AccountPassword $Password `
    -Enabled $true `
    -ChangePasswordAtLogon $true
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-Name` | Obligatoire | Nom d'affichage de l'utilisateur |
| `-SamAccountName` | Obligatoire | Nom d'ouverture de session Windows (max 20 caractères) |
| `-UserPrincipalName` | Recommandé | UPN : `user@domain.com` |
| `-GivenName` | Optionnel | Prénom |
| `-Surname` | Optionnel | Nom de famille |
| `-DisplayName` | Optionnel | Nom complet affiché dans l'annuaire |
| `-EmailAddress` | Optionnel | Adresse email professionnelle |
| `-Title` | Optionnel | Titre / Poste |
| `-Department` | Optionnel | Département |
| `-Company` | Optionnel | Entreprise |
| `-Office` | Optionnel | Bureau / Localisation |
| `-OfficePhone` | Optionnel | Téléphone de bureau |
| `-MobilePhone` | Optionnel | Téléphone mobile |
| `-StreetAddress` | Optionnel | Adresse postale |
| `-City` | Optionnel | Ville |
| `-State` | Optionnel | Région / État |
| `-PostalCode` | Optionnel | Code postal |
| `-Country` | Optionnel | Pays (code ISO 2 lettres : `MA`, `FR`, etc.) |
| `-Description` | Optionnel | Description / Notes |
| `-HomePage` | Optionnel | Site web personnel |
| `-Manager` | Optionnel | DN du responsable : `CN=Boss,OU=IT,DC=domain,DC=com` |
| `-Path` | Optionnel | OU de destination : `OU=IT,DC=domain,DC=com` |
| `-AccountPassword` | Optionnel | Mot de passe (SecureString) |
| `-Enabled` | Optionnel | Activer le compte (`$true` / `$false`) |
| `-ChangePasswordAtLogon` | Optionnel | Forcer changement au 1er logon |
| `-PasswordNeverExpires` | Optionnel | Mot de passe n'expire jamais |
| `-CannotChangePassword` | Optionnel | Empêcher l'utilisateur de changer son mot de passe |
| `-AccountExpirationDate` | Optionnel | Date d'expiration du compte : `"31/12/2026"` |
| `-ScriptPath` | Optionnel | Chemin du script de logon : `\\server\scripts\logon.bat` |

## Modifier un utilisateur (Set-ADUser)

```powershell
Set-ADUser -Identity "jdoe" `
    -Title "Senior Developer" `
    -Department "Development" `
    -Manager "CN=Boss,OU=IT,DC=domain,DC=com"

# Effacer des attributs
Set-ADUser -Identity "jdoe" -Clear @("Title", "Department")
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-Identity` | Obligatoire | SamAccountName, DN, GUID ou SID |
| `-Manager` | Optionnel | DN du responsable |
| `-ScriptPath` | Optionnel | Script de logon |
| `-Clear` | Optionnel | Effacer un ou plusieurs attributs |

## Récupérer un utilisateur (Get-ADUser)

```powershell
# Utilisateur spécifique avec tous ses attributs
Get-ADUser -Identity "jdoe" -Properties *

# Tous les utilisateurs d'un département
Get-ADUser -Filter {Department -eq "IT"} `
    -SearchBase "OU=Users,DC=domain,DC=com"

# Utilisateurs inactifs depuis 90 jours
Get-ADUser -Filter {LastLogonDate -lt (Get-Date).AddDays(-90)}
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-Identity` | Optionnel | Utilisateur spécifique |
| `-Filter` | Optionnel | Filtre PowerShell |
| `-SearchBase` | Optionnel | OU de départ pour la recherche |
| `-SearchScope` | Optionnel | `Base`, `OneLevel`, ou `Subtree` |
| `-Properties` | Optionnel | Attributs à retourner (`*` = tous) |

## Supprimer un utilisateur (Remove-ADUser)

```powershell
# Tester avant de supprimer
Remove-ADUser -Identity "jdoe" -WhatIf

# Supprimer
Remove-ADUser -Identity "jdoe" -Confirm:$false
```

!!! tip "Bonnes pratiques"
    - Toujours tester avec `-WhatIf` avant une suppression
    - Utiliser `-Properties *` pour voir tous les attributs d'un objet
    - Utiliser des filtres plutôt que `Get-ADUser | Where-Object` pour la performance
    - Toujours spécifier `-SearchBase` pour limiter le scope de recherche
