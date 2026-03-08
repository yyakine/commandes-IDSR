# Zones inversées

Les zones inversées résolvent les **adresses IP → noms d'hôtes** (enregistrements PTR).

## Zone inversée IPv4 (Add-DnsServerPrimaryZone)

```powershell
Add-DnsServerPrimaryZone `
    -NetworkId        "192.168.1.0/24" `
    -ReplicationScope Domain `
    -DynamicUpdate    Secure
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-NetworkId` | Obligatoire | Réseau au format CIDR (ex: `192.168.1.0/24`) |
| `-ReplicationScope` | Recommandé | `Domain`, `Forest`, `Legacy` ou `Custom` |
| `-DynamicUpdate` | Recommandé | `Secure`, `NonsecureAndSecure` ou `None` |
| `-ZoneFile` | Optionnel | Fichier de zone (ex: `1.168.192.in-addr.arpa.dns`) |

## Zone inversée IPv6 (Add-DnsServerPrimaryZone)

```powershell
Add-DnsServerPrimaryZone `
    -NetworkId        "2001:db8::/64" `
    -ReplicationScope Domain `
    -DynamicUpdate    Secure
```

## Afficher les zones inversées (Get-DnsServerZone)

```powershell
# Zone inversée IPv4 spécifique
Get-DnsServerZone -Name "1.168.192.in-addr.arpa"

# Sur un serveur distant
Get-DnsServerZone -ComputerName dc01.contoso.com
```

!!! info "Format du nom de zone inversée"
    Une zone inversée IPv4 pour le réseau `192.168.1.0/24` se nomme automatiquement `1.168.192.in-addr.arpa` — les octets du réseau sont inversés.

!!! tip "Bonnes pratiques"
    - Créer systématiquement une zone inversée pour chaque sous-réseau géré
    - Utiliser `-CreatePtr` lors de l'ajout d'enregistrements A pour créer le PTR automatiquement
    - La zone inversée est indispensable pour les vérifications de sécurité (reverse DNS lookup)
