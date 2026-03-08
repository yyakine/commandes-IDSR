# Enregistrements de ressources

## Enregistrement A IPv4 (Add-DnsServerResourceRecordA)

```powershell
Add-DnsServerResourceRecordA `
    -Name        "www" `
    -ZoneName    "contoso.com" `
    -IPv4Address 192.168.1.100 `
    -CreatePtr `
    -TimeToLive  01:00:00
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-Name` | Obligatoire | Nom de l'hôte |
| `-ZoneName` | Obligatoire | Nom de la zone DNS |
| `-IPv4Address` | Obligatoire | Adresse IPv4 de l'hôte |
| `-CreatePtr` | Optionnel | Crée automatiquement l'enregistrement PTR inverse |
| `-TimeToLive` | Optionnel | Durée de vie (TTL) — format `hh:mm:ss` |

## Enregistrement AAAA IPv6 (Add-DnsServerResourceRecordAAAA)

```powershell
Add-DnsServerResourceRecordAAAA `
    -Name        "www" `
    -ZoneName    "contoso.com" `
    -IPv6Address 2001:db8::100 `
    -CreatePtr `
    -TimeToLive  01:00:00
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-Name` | Obligatoire | Nom de l'hôte |
| `-ZoneName` | Obligatoire | Nom de la zone DNS |
| `-IPv6Address` | Obligatoire | Adresse IPv6 de l'hôte |
| `-CreatePtr` | Optionnel | Crée automatiquement l'enregistrement PTR inverse |
| `-TimeToLive` | Optionnel | Durée de vie (TTL) |

## Enregistrement PTR (Add-DnsServerResourceRecordPtr)

```powershell
Add-DnsServerResourceRecordPtr `
    -Name          "100" `
    -ZoneName      "1.168.192.in-addr.arpa" `
    -PtrDomainName "server.contoso.com" `
    -TimeToLive    01:00:00
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-Name` | Obligatoire | Dernier octet de l'IP (ex: `100` pour `192.168.1.100`) |
| `-ZoneName` | Obligatoire | Nom de la zone inversée (format: `X.X.X.in-addr.arpa`) |
| `-PtrDomainName` | Obligatoire | FQDN de l'hôte pointé |
| `-TimeToLive` | Optionnel | Durée de vie (TTL) |

## Afficher les enregistrements (Get-DnsServerResourceRecord)

```powershell
# Tous les enregistrements d'une zone
Get-DnsServerResourceRecord -ZoneName "contoso.com"

# Enregistrement spécifique
Get-DnsServerResourceRecord -ZoneName "contoso.com" -Name "www"

# Par type
Get-DnsServerResourceRecord -ZoneName "contoso.com" -RRType A

# Sur un serveur distant
Get-DnsServerResourceRecord -ZoneName "contoso.com" -ComputerName dc01.contoso.com
```

| Paramètre `-RRType` | Description |
|---------------------|-------------|
| `A` | Enregistrement IPv4 |
| `AAAA` | Enregistrement IPv6 |
| `CNAME` | Alias canonique |
| `MX` | Serveur de messagerie |
| `PTR` | Pointeur inverse |
| `NS` | Serveur de noms |
| `SOA` | Start of Authority |

## Supprimer un enregistrement (Remove-DnsServerResourceRecord)

```powershell
# Avec confirmation
Remove-DnsServerResourceRecord -ZoneName "contoso.com" -Name "www" -RRType A

# Sans confirmation
Remove-DnsServerResourceRecord -ZoneName "contoso.com" -Name "www" -RRType A -Force
```


!!! tip "Bonnes pratiques"
    - Utiliser `-CreatePtr` lors de l'ajout d'enregistrements A/AAAA pour maintenir la cohérence DNS direct/inverse
    - Toujours spécifier `-RRType` lors de la suppression pour éviter de supprimer un mauvais enregistrement
    - Vérifier les enregistrements avec `Get-DnsServerResourceRecord` avant toute suppression
