# Réservations et exclusions DHCPv4

## Réserver une adresse (Add-DhcpServerv4Reservation)

Une réservation attribue **toujours la même adresse IP** à un client identifié par son adresse MAC.

```powershell
Add-DhcpServerv4Reservation `
    -ScopeId     192.168.1.0 `
    -IPAddress   192.168.1.50 `
    -ClientId    "00-15-5D-01-02-03" `
    -Name        "Imprimante-Bureau" `
    -Description "Imprimante HP LaserJet Pro"
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-ScopeId` | Obligatoire | ID de l'étendue |
| `-IPAddress` | Obligatoire | Adresse IP à réserver |
| `-ClientId` | Obligatoire | Adresse MAC du client (format : `XX-XX-XX-XX-XX-XX`) |
| `-Name` | Optionnel | Nom de la réservation |
| `-Description` | Optionnel | Description |

## Exclure une plage (Add-DhcpServerv4ExclusionRange)

Une exclusion empêche le serveur DHCP de distribuer les adresses d'une plage (ex: adresses réservées aux équipements statiques).

```powershell
Add-DhcpServerv4ExclusionRange `
    -ScopeId    192.168.1.0 `
    -StartRange 192.168.1.1 `
    -EndRange   192.168.1.50
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-ScopeId` | Obligatoire | ID de l'étendue |
| `-StartRange` | Obligatoire | Première adresse IP exclue |
| `-EndRange` | Obligatoire | Dernière adresse IP exclue |


!!! tip "Bonnes pratiques"
    - Créer les exclusions **avant** d'activer l'étendue pour éviter les conflits d'adresses
    - Documenter toutes les réservations avec un `-Name` et `-Description` explicites
    - L'adresse réservée doit être **dans la plage de l'étendue** mais idéalement hors de la plage dynamique
