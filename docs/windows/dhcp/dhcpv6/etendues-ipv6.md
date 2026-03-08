# Étendues DHCPv6

## Créer une étendue IPv6 (Add-DhcpServerv6Scope)

```powershell
Add-DhcpServerv6Scope `
    -Name              "IPv6-Bureau" `
    -Prefix            2001:db8::/64 `
    -State             Active `
    -PreferredLifetime 7.12:00:00 `
    -ValidLifetime     12.00:00:00
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-Name` | Obligatoire | Nom descriptif de l'étendue |
| `-Prefix` | Obligatoire | Préfixe IPv6 du réseau (ex: `2001:db8::/64`) |
| `-State` | Optionnel | `Active` ou `Inactive` |
| `-PreferredLifetime` | Optionnel | Durée de vie préférée (défaut : 7.5 jours) |
| `-ValidLifetime` | Optionnel | Durée de vie valide (défaut : 12 jours) |

## Configurer les options IPv6 (Set-DhcpServerv6OptionValue)

```powershell
Set-DhcpServerv6OptionValue `
    -Prefix           2001:db8::/64 `
    -DnsServer        2001:db8::10, 2001:4860:4860::8888 `
    -DomainSearchList "contoso.com"
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-Prefix` | Obligatoire | Préfixe de l'étendue IPv6 |
| `-DnsServer` | Recommandé | Serveurs DNS IPv6 |
| `-DomainSearchList` | Recommandé | Liste de domaines de recherche |

## Afficher les étendues (Get-DhcpServerv6Scope)

```powershell
# Toutes les étendues IPv6
Get-DhcpServerv6Scope

# Étendue spécifique
Get-DhcpServerv6Scope -Prefix 2001:db8::/64

# Sur un serveur distant
Get-DhcpServerv6Scope -ComputerName server.contoso.com
```

## Afficher les baux actifs (Get-DhcpServerv6Lease)

```powershell
Get-DhcpServerv6Lease -Prefix 2001:db8::/64
Get-DhcpServerv6Lease -Prefix 2001:db8::/64 -ComputerName server.contoso.com
```

## Afficher les options (Get-DhcpServerv6OptionValue)

```powershell
Get-DhcpServerv6OptionValue -Prefix 2001:db8::/64
Get-DhcpServerv6OptionValue -All
```

## Modifier une étendue (Set-DhcpServerv6Scope)

```powershell
Set-DhcpServerv6Scope -Prefix 2001:db8::/64 `
    -State             Active `
    -PreferredLifetime 8.00:00:00 `
    -ValidLifetime     12.00:00:00 `
    -Name              "IPv6-Nouveau"
```

## Supprimer une étendue (Remove-DhcpServerv6Scope)

```powershell
Remove-DhcpServerv6Scope -Prefix 2001:db8::/64 -Force
```

!!! tip "Bonnes pratiques"
    - DHCPv6 est souvent utilisé en complément de SLAAC (Stateless Address Autoconfiguration)
    - Toujours configurer les options DNS après la création de l'étendue
    - La `ValidLifetime` doit être supérieure à la `PreferredLifetime`
