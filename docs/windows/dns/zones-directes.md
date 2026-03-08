# Zones directes

Les zones directes résolvent les **noms d'hôtes → adresses IP**.

## Zone principale (Add-DnsServerPrimaryZone)

```powershell
Add-DnsServerPrimaryZone `
    -Name             "contoso.com" `
    -ReplicationScope Domain `
    -DynamicUpdate    Secure `
    -ZoneFile         "contoso.com.dns"
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-Name` | Obligatoire | Nom de la zone (ex: `contoso.com`) |
| `-ReplicationScope` | Recommandé | `Domain`, `Forest`, `Legacy` ou `Custom` |
| `-DynamicUpdate` | Recommandé | `Secure`, `NonsecureAndSecure` ou `None` |
| `-ZoneFile` | Optionnel | Nom du fichier de zone (si non-AD intégré) |


!!! info "DynamicUpdate"
    - `Secure` : seuls les clients membres du domaine peuvent s'enregistrer (recommandé en environnement AD)
    - `NonsecureAndSecure` : tous les clients peuvent s'enregistrer
    - `None` : les enregistrements sont créés manuellement uniquement

## Zone secondaire (Add-DnsServerSecondaryZone)

```powershell
Add-DnsServerSecondaryZone `
    -Name          "contoso.com" `
    -MasterServers 192.168.1.10 `
    -ZoneFile      "contoso.com.dns"
```

| Paramètre | Statut | Description |
|-----------|--------|-------------|
| `-Name` | Obligatoire | Nom de la zone secondaire |
| `-MasterServers` | Obligatoire | Adresse IP du serveur DNS maître |
| `-ZoneFile` | Optionnel | Fichier de zone local |

## Afficher les zones (Get-DnsServerZone)

```powershell
# Toutes les zones
Get-DnsServerZone

# Zone spécifique
Get-DnsServerZone -Name "contoso.com"

# Sur un serveur DNS distant
Get-DnsServerZone -ComputerName dc01.contoso.com
```


!!! tip "Bonnes pratiques"
    - Toujours utiliser `DynamicUpdate Secure` dans un environnement Active Directory
    - Utiliser `ReplicationScope Domain` pour répliquer la zone sur tous les DC du domaine
    - Utiliser `ReplicationScope Forest` uniquement si la zone doit être accessible à toute la forêt
