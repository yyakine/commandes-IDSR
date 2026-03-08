# Installation DHCP

## Install-WindowsFeature

```powershell
Install-WindowsFeature -Name DHCP -IncludeManagementTools
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-IncludeManagementTools` | Optionnel | Inclut la console DHCP et les outils de gestion |
| `-Restart` | Optionnel | Redémarre le serveur après installation |

## Add-DhcpServerInDC — Autoriser dans Active Directory

Après installation, le serveur DHCP doit être **autorisé dans Active Directory** pour pouvoir distribuer des adresses.

```powershell
Add-DhcpServerInDC -DnsName "server.contoso.com" -IPAddress 192.168.1.10
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-DnsName` | Obligatoire | Nom DNS du serveur DHCP |
| `-IPAddress` | Obligatoire | Adresse IP du serveur DHCP |

!!! tip "Bonnes pratiques"
    - Toujours autoriser le serveur DHCP dans AD avant de créer des étendues
    - Utiliser `-IncludeManagementTools` pour avoir la console graphique disponible
