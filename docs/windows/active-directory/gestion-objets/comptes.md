# Comptes

## Changer le mot de passe (Set-ADAccountPassword)

```powershell
$NewPassword = ConvertTo-SecureString "NewPass123!" -AsPlainText -Force

# Méthode 1 : avec SamAccountName
Set-ADAccountPassword -Identity "jdoe" -NewPassword $NewPassword -Reset

# Méthode 2 : via pipeline
Get-ADUser -Identity "jdoe" | Set-ADAccountPassword -NewPassword $NewPassword -Reset
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-Identity` | Obligatoire | SamAccountName, DN, GUID ou objet AD |
| `-NewPassword` | Obligatoire | Nouveau mot de passe (SecureString) |
| `-Reset` | Optionnel | Réinitialiser sans connaître l'ancien mot de passe |

## Gérer l'état d'un compte (Disable / Enable / Unlock)

```powershell
# Désactiver un compte
Disable-ADAccount -Identity "jdoe"

# Activer un compte
Enable-ADAccount -Identity "jdoe"

# Déverrouiller un compte bloqué
Unlock-ADAccount -Identity "jdoe"

# Déverrouiller tous les comptes bloqués d'une OU
Get-ADUser -Filter {LockedOut -eq $true} `
    -SearchBase "OU=Users,DC=domain,DC=com" | Unlock-ADAccount
```

## Forcer le changement de mot de passe au prochain logon

```powershell
Set-ADUser -Identity "jdoe" -ChangePasswordAtLogon $true
```

## Définir une expiration de compte

```powershell
# Compte expirant à une date précise
Set-ADAccountExpiration -Identity "jdoe" -DateTime "31/12/2026"

# Supprimer l'expiration
Clear-ADAccountExpiration -Identity "jdoe"
```

!!! tip "Bonnes pratiques"
    - Utiliser des variables `SecureString` pour les mots de passe : jamais en clair dans les scripts
    - Désactiver un compte plutôt que le supprimer immédiatement pour conserver l'historique
    - Utiliser `-ErrorAction Stop` pour arrêter à la première erreur dans les scripts
