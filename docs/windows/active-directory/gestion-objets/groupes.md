# Groupes

## Créer un groupe (New-ADGroup)

```powershell
New-ADGroup `
    -Name "IT-Team" `
    -SamAccountName "IT-Team" `
    -GroupScope Global `
    -GroupCategory Security `
    -DisplayName "IT Administrators" `
    -Description "Équipe IT" `
    -Path "OU=Groups,DC=domain,DC=com" `
    -ManagedBy "CN=Manager,OU=Users,DC=domain,DC=com"
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-Name` | Obligatoire | Nom du groupe |
| `-GroupScope` | Obligatoire | `Global`, `DomainLocal`, ou `Universal` |
| `-GroupCategory` | Obligatoire | `Security` ou `Distribution` |
| `-Path` | Optionnel | OU de destination |
| `-ManagedBy` | Optionnel | DN du responsable du groupe |

## Ajouter des membres (Add-ADGroupMember)

```powershell
# Ajouter un utilisateur
Add-ADGroupMember -Identity "IT-Team" -Members "jdoe"

# Ajouter plusieurs utilisateurs
Add-ADGroupMember -Identity "IT-Team" -Members "jdoe","jane","bob"

# Via pipeline : ajouter tous les utilisateurs du département IT
Get-ADUser -Filter {Department -eq "IT"} | Add-ADGroupMember -Identity "IT-Team"
```

## Retirer des membres (Remove-ADGroupMember)

```powershell
Remove-ADGroupMember -Identity "IT-Team" -Members "jdoe" -Confirm:$false
```

## Lister les membres (Get-ADGroupMember)

```powershell
# Membres directs
Get-ADGroupMember -Identity "IT-Team"

# Membres récursifs (groupes imbriqués)
Get-ADGroupMember -Identity "IT-Team" -Recursive
```

## Récupérer un groupe (Get-ADGroup)

```powershell
# Groupe spécifique
Get-ADGroup -Identity "IT-Team" -Properties *

# Tous les groupes de sécurité
Get-ADGroup -Filter {GroupCategory -eq "Security"}
```

## Supprimer un groupe (Remove-ADGroup)

```powershell
Remove-ADGroup -Identity "IT-Team" -WhatIf
Remove-ADGroup -Identity "IT-Team" -Confirm:$false
```

!!! tip "Bonnes pratiques"
    - Chaîner avec le pipeline pour automatiser l'ajout de membres en masse
    - Toujours tester avec `-WhatIf` avant une suppression
    - Utiliser `Get-ADGroupMember -Recursive` pour voir les membres des groupes imbriqués
