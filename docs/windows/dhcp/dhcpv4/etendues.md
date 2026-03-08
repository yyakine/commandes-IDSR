# Étendues DHCPv4 (Scopes)

## Créer une étendue (Add-DhcpServerv4Scope)

```powershell
Add-DhcpServerv4Scope `
    -Name         "Réseau-Bureau" `
    -StartRange   192.168.1.100 `
    -EndRange     192.168.1.200 `
    -SubnetMask   255.255.255.0 `
    -State        Active `
    -LeaseDuration 7.00:00:00
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-Name` | Obligatoire | Nom descriptif de l'étendue |
| `-StartRange` | Obligatoire | Première adresse IP de la plage |
| `-EndRange` | Obligatoire | Dernière adresse IP de la plage |
| `-SubnetMask` | Obligatoire | Masque de sous-réseau |
| `-State` | Optionnel | `Active` ou `Inactive` |
| `-LeaseDuration` | Optionnel | Durée du bail (défaut : 8 jours) — format `j.hh:mm:ss` |

## Configurer les options (Set-DhcpServerv4OptionValue)

```powershell
Set-DhcpServerv4OptionValue `
    -ScopeId   192.168.1.0 `
    -Router    192.168.1.1 `
    -DnsServer 192.168.1.10, 8.8.8.8 `
    -DnsDomain "contoso.com"
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-ScopeId` | Obligatoire | ID de l'étendue (adresse réseau) |
| `-Router` | Recommandé | Passerelle par défaut |
| `-DnsServer` | Recommandé | Serveurs DNS (séparés par une virgule) |
| `-DnsDomain` | Recommandé | Nom de domaine DNS |
| `-WinsServer` | Optionnel | Serveurs WINS (si utilisés) |

## Afficher les étendues (Get-DhcpServerv4Scope)

```powershell
# Toutes les étendues
Get-DhcpServerv4Scope

# Étendue spécifique
Get-DhcpServerv4Scope -ScopeId 192.168.1.0

# Sur un serveur distant
Get-DhcpServerv4Scope -ComputerName server.contoso.com
```

## Afficher les baux actifs (Get-DhcpServerv4Lease)

```powershell
# Baux d'une étendue
Get-DhcpServerv4Lease -ScopeId 192.168.1.0

# Bail d'une IP spécifique
Get-DhcpServerv4Lease -ScopeId 192.168.1.0 -IPAddress 192.168.1.150
```

## Afficher les options (Get-DhcpServerv4OptionValue)

```powershell
# Options d'une étendue
Get-DhcpServerv4OptionValue -ScopeId 192.168.1.0

# Toutes les options (serveur + étendues)
Get-DhcpServerv4OptionValue -All
```

## Modifier une étendue (Set-DhcpServerv4Scope)

```powershell
# Activer une étendue
Set-DhcpServerv4Scope -ScopeId 192.168.1.0 -State Active

# Modifier la durée du bail et le nom
Set-DhcpServerv4Scope -ScopeId 192.168.1.0 `
    -LeaseDuration 7.00:00:00 `
    -Name "Réseau-Nouveau"
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-ScopeId` | Obligatoire | ID de l'étendue |
| `-State` | Optionnel | `Active` ou `Inactive` |
| `-LeaseDuration` | Optionnel | Nouvelle durée du bail |
| `-Name` | Optionnel | Nouveau nom de l'étendue |

## Supprimer une étendue (Remove-DhcpServerv4Scope)

```powershell
# Avec confirmation
Remove-DhcpServerv4Scope -ScopeId 192.168.1.0

# Sans confirmation
Remove-DhcpServerv4Scope -ScopeId 192.168.1.0 -Force
```

!!! tip "Bonnes pratiques"
    - Définir le `-Router` et `-DnsServer` immédiatement après la création de l'étendue
    - Exclure les adresses statiques (serveurs, imprimantes) avant d'activer l'étendue
    - Utiliser une durée de bail courte (ex: 1 jour) pour les réseaux avec beaucoup de rotation de clients
