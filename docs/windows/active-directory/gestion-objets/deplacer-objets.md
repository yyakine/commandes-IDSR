# Déplacer des objets

## Déplacer un objet (Move-ADObject)

```powershell
# Déplacer un utilisateur vers une autre OU
Move-ADObject `
    -Identity "CN=jdoe,OU=Users,DC=domain,DC=com" `
    -TargetPath "OU=IT,DC=domain,DC=com"

# Via pipeline : déplacer tous les stagiaires vers l'OU Inactifs
Get-ADUser -Filter {Department -eq "Stagiaire"} | `
    Move-ADObject -TargetPath "OU=Inactifs,DC=domain,DC=com"
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-Identity` | Obligatoire | DN, GUID ou SID de l'objet à déplacer |
| `-TargetPath` | Obligatoire | DN de l'OU de destination |
| `-Server` | Optionnel | Serveur AD ciblé |
| `-PassThru` | Optionnel | Retourner l'objet modifié |

!!! info "Trouver le DN d'un utilisateur"
    ```powershell
    (Get-ADUser -Identity "jdoe").DistinguishedName
    ```

## Déplacer un groupe ou une OU

```powershell
# Déplacer un groupe
Move-ADObject `
    -Identity "CN=IT-Team,OU=Groups,DC=domain,DC=com" `
    -TargetPath "OU=IT,DC=domain,DC=com"

# Déplacer une OU entière (attention : déplace aussi tout son contenu)
Move-ADObject `
    -Identity "OU=Anciens,DC=domain,DC=com" `
    -TargetPath "OU=Archives,DC=domain,DC=com"
```

!!! tip "Bonnes pratiques"
    - Toujours utiliser le Distinguished Name (DN) complet pour les opérations critiques
    - Tester avec `-WhatIf` avant de déplacer en masse
    - Créer une sauvegarde CSVDE avant les opérations de masse
