# DTP (Dynamic Trunking Protocol)

## Modes DTP

```cisco
! Tente activement de négocier un trunk
Switch(config-if)# switchport mode dynamic desirable

! Accepte un trunk si l'autre côté demande (passif)
Switch(config-if)# switchport mode dynamic auto
```

| Mode local | Mode distant | Résultat |
|------------|--------------|----------|
| `dynamic desirable` | `dynamic desirable` | Trunk |
| `dynamic desirable` | `dynamic auto` | Trunk |
| `dynamic desirable` | `trunk` | Trunk |
| `dynamic auto` | `dynamic auto` | Access |
| `dynamic auto` | `access` | Access |
| `access` | `trunk` | Access |

## Désactiver DTP (recommandé)

Pour éviter les attaques de type VLAN hopping, désactiver DTP en configurant le mode manuellement et en ajoutant `nonegotiate` :

```cisco
! Sur un port trunk
Switch(config)# interface fastethernet 0/24
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport nonegotiate

! Sur un port access
Switch(config)# interface fastethernet 0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport nonegotiate
```

## Vérification

```cisco
Switch# show dtp interface fastethernet 0/1
Switch# show interfaces fastethernet 0/1 switchport
```

!!! danger "Sécurité"
    DTP peut être exploité via des attaques **VLAN hopping** où un attaquant force le port en mode trunk pour accéder à tous les VLANs. Toujours désactiver DTP avec `switchport nonegotiate` sur les ports utilisateurs et les trunks fixes.

!!! tip "Bonnes pratiques"
    - Désactiver DTP sur **tous** les ports de production avec `switchport nonegotiate`
    - Ne jamais laisser un port en `dynamic auto` sur un port utilisateur
    - Configurer explicitement `switchport mode access` ou `switchport mode trunk` selon l'usage
