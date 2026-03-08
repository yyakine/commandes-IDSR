# Installation et création de domaine

## Installer le rôle AD DS

```powershell
Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-IncludeManagementTools` | Optionnel | Inclut les outils RSAT (Active Directory Users and Computers, etc.) |
| `-Restart` | Optionnel | Redémarre le serveur automatiquement après installation |

## Créer une nouvelle forêt (Install-ADDSForest)

```powershell
Install-ADDSForest `
    -DomainName "contoso.com" `
    -DomainNetbiosName "CONTOSO" `
    -ForestMode 2016 `
    -DomainMode 2016 `
    -InstallDns `
    -SafeModeAdministratorPassword (ConvertTo-SecureString 'Pass123!' -AsPlainText -Force)
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-DomainName` | Obligatoire | Nom DNS complet du domaine |
| `-DomainNetbiosName` | Obligatoire | Nom NetBIOS, max 15 caractères |
| `-ForestMode` | Recommandé | Niveau fonctionnel de la forêt (`2016`, `2019`, `2022`) |
| `-DomainMode` | Recommandé | Niveau fonctionnel du domaine |
| `-InstallDns` | Recommandé | Installe et configure DNS sur ce DC |
| `-SafeModeAdministratorPassword` | Obligatoire | Mot de passe DSRM pour le mode récupération |

!!! info "DSRM"
    Le mot de passe DSRM (Directory Services Restore Mode) est utilisé pour démarrer le DC en mode récupération. Il est indépendant du mot de passe Administrateur du domaine.

## Ajouter un domaine enfant (Install-ADDSDomain)

```powershell
Install-ADDSDomain `
    -NewDomainName "child" `
    -ParentDomainName "contoso.com" `
    -DomainType ChildDomain `
    -InstallDns `
    -Credential (Get-Credential "CONTOSO\Administrator") `
    -SafeModeAdministratorPassword (ConvertTo-SecureString 'Pass123!' -AsPlainText -Force)
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-NewDomainName` | Obligatoire | Nom du nouveau domaine enfant |
| `-ParentDomainName` | Obligatoire | Domaine parent existant |
| `-DomainType` | Optionnel | `ChildDomain` ou `TreeDomain` |
| `-Credential` | Obligatoire | Identifiants administrateur du domaine parent |
| `-SafeModeAdministratorPassword` | Obligatoire | Mot de passe DSRM |

!!! info "ChildDomain vs TreeDomain"
    `ChildDomain` crée un sous-domaine (`child.contoso.com`). `TreeDomain` crée un nouveau domaine racine dans la même forêt (`autredomaine.com`).

## Ajouter un contrôleur de domaine supplémentaire (Install-ADDSDomainController)

```powershell
Install-ADDSDomainController `
    -DomainName "contoso.com" `
    -InstallDns `
    -SiteName "Site-Paris" `
    -Credential (Get-Credential "CONTOSO\Administrator") `
    -SafeModeAdministratorPassword (ConvertTo-SecureString 'Pass123!' -AsPlainText -Force)
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-DomainName` | Obligatoire | Nom du domaine existant à rejoindre |
| `-Credential` | Obligatoire | Identifiants admin du domaine |
| `-InstallDns` | Recommandé | Installe DNS sur ce DC |
| `-SiteName` | Optionnel | Site Active Directory pour ce DC |
| `-SafeModeAdministratorPassword` | Obligatoire | Mot de passe DSRM |
