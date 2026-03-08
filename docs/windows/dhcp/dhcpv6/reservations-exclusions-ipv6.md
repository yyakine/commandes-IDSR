# Réservations et exclusions DHCPv6

## Réserver une adresse IPv6 (Add-DhcpServerv6Reservation)

En DHCPv6, les réservations sont identifiées par le **DUID** du client (et non l'adresse MAC).

```powershell
Add-DhcpServerv6Reservation `
    -Prefix      2001:db8::/64 `
    -IPAddress   2001:db8::100 `
    -ClientDuid  "00-01-00-01-2A-3B-4C-5D-6E-7F" `
    -Name        "Serveur-Web" `
    -Description "Serveur Web principal"
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-Prefix` | Obligatoire | Préfixe de l'étendue |
| `-IPAddress` | Obligatoire | Adresse IPv6 réservée |
| `-ClientDuid` | Obligatoire | DUID du client (identifiant unique DHCPv6) |
| `-Name` | Optionnel | Nom de la réservation |
| `-Description` | Optionnel | Description |

## Exclure une plage IPv6 (Add-DhcpServerv6ExclusionRange)

```powershell
Add-DhcpServerv6ExclusionRange `
    -Prefix     2001:db8::/64 `
    -StartRange 2001:db8::1 `
    -EndRange   2001:db8::50
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-Prefix` | Obligatoire | Préfixe de l'étendue |
| `-StartRange` | Obligatoire | Première adresse IPv6 exclue |
| `-EndRange` | Obligatoire | Dernière adresse IPv6 exclue |

!!! info "DUID vs MAC"
    En DHCPv6, l'identifiant client est le **DUID** (DHCP Unique Identifier), pas l'adresse MAC. Il est visible avec `ipconfig /all` sur le client Windows sous "DHCP IPv6 IAID" et "DHCP IPv6 Client DUID".

!!! tip "Bonnes pratiques"
    - Créer les exclusions avant d'activer l'étendue
    - Documenter les DUIDs des équipements avec réservation dans un fichier de référence
    - Tester avec `Get-DhcpServerv6Lease` pour vérifier les attributions après activation
