# Configuration initiale

Avant de déployer des rôles Windows Server, quelques étapes de configuration de base sont nécessaires : renommer la machine, configurer le réseau et rejoindre un domaine.

## Renommer le serveur

```powershell
Rename-Computer -NewName "SRV-AD01" -Restart
```

!!! info "Restart obligatoire"
    Le renommage ne prend effet qu'après redémarrage. L'option `-Restart` le fait automatiquement.

## Configurer l'adresse IP

```powershell
# Identifier l'index de l'interface réseau
Get-NetAdapter

# Configurer une IP statique
New-NetIPAddress `
    -InterfaceIndex 4 `
    -IPAddress 192.168.1.10 `
    -PrefixLength 24 `
    -DefaultGateway 192.168.1.1

# Configurer le DNS
Set-DnsClientServerAddress `
    -InterfaceIndex 4 `
    -ServerAddresses ("192.168.1.1", "8.8.8.8")
```

```powershell
# Vérifier la configuration
Get-NetIPAddress -InterfaceIndex 4
Get-DnsClientServerAddress -InterfaceIndex 4
```

## Rejoindre un domaine

```powershell
# Rejoindre un domaine (redémarre automatiquement)
Add-Computer `
    -DomainName "lan.local" `
    -Credential (Get-Credential) `
    -Restart

## Quitter un domaine
Remove-Computer `
    -UnjoinDomainCredential (Get-Credential) `
    -WorkgroupName "WORKGROUP" `
    -Restart
```

## Convertir en installation complète ou minimale

```powershell title="Convertir une installation minimale en une installation complète"
 Get-WindowsFeature -Name *GUI* | Install-WindowsFeature -IncludeAllSubFeature -
IncludeManagementTools -Restart
```

```powershell title="Convertir une installation complète en une installation minimale"
 Get-WindowsFeature -Name *GUI* | Remove-WindowsFeature -Restart
```


