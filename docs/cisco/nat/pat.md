# PAT (Port Address Translation)

PAT (ou NAT Overload) traduit **plusieurs adresses privées** vers **une seule adresse publique** en différenciant les sessions par le numéro de port.

## PAT avec interface publique

```text
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255
Router(config)# ip nat inside source list 1 interface serial 0/0 overload

Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip nat inside

Router(config)# interface serial 0/0
Router(config-if)# ip nat outside
```

## PAT avec pool d'adresses

```text
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255
Router(config)# ip nat pool PUBLIC_POOL 200.1.1.1 200.1.1.10 netmask 255.255.255.0
Router(config)# ip nat inside source list 1 pool PUBLIC_POOL overload

Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip nat inside

Router(config)# interface serial 0/0
Router(config-if)# ip nat outside
```

## Vérification

```text
Router# show ip nat translations
Router# show ip nat statistics
Router# debug ip nat
Router# clear ip nat translation *
```

## NAT Statique vs Dynamique vs PAT

| Type | Traduction | Usage |
|------|------------|-------|
| Statique | 1 privée → 1 publique fixe | Serveurs exposés (web, mail) |
| Dynamique | N privées → N publiques (pool) | Rare, pool d'IP publiques disponibles |
| PAT | N privées → 1 publique | Accès Internet standard (SOHO, entreprise) |

!!! tip "Bonnes pratiques"
    - Utiliser `interface serial 0/0 overload` de préférence à un pool — plus simple et économise les IPs
    - PAT est la solution par défaut pour quasiment tous les déploiements Internet
    - Vérifier les ports dans `show ip nat translations` pour confirmer la distinction des sessions
