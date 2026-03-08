# Installation DNS

## Install-WindowsFeature

```powershell
Install-WindowsFeature -Name DNS -IncludeManagementTools
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-IncludeManagementTools` | Optionnel | Inclut la console DNS et les outils RSAT |
| `-Restart` | Optionnel | Redémarre le serveur après installation |

!!! info "DNS intégré à AD DS"
    Si vous installez AD DS avec `-InstallDns`, le rôle DNS est déjà installé et configuré automatiquement. Cette installation séparée est utile pour un serveur DNS dédié sans contrôleur de domaine.

!!! tip "Bonnes pratiques"
    - Installer toujours `-IncludeManagementTools` pour disposer de la console graphique DNS
    - Sur un DC, préférer `Install-ADDSForest -InstallDns` qui configure DNS et les zones AD automatiquement
