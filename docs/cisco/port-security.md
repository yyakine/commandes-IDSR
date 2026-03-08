# Port-Security

## Activer Port-Security

Port-Security doit être activé sur un port en mode `access` ou `trunk` statique.

```text
Switch(config)# interface fastethernet 0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport port-security
```

## Maximum d'adresses MAC

```text
Switch(config-if)# switchport port-security maximum 5
```

## Apprentissage des adresses MAC

=== "Statique"

    ```text
    Switch(config-if)# switchport port-security mac-address 00:11:22:33:44:55
    ```

=== "Sticky (dynamique + sauvegarde)"

    Apprend dynamiquement les adresses MAC et les sauvegarde dans la running-config.

    ```text
    Switch(config-if)# switchport port-security mac-address sticky
    ```

## Mode de violation

```text
Switch(config-if)# switchport port-security violation protect
Switch(config-if)# switchport port-security violation restrict
Switch(config-if)# switchport port-security violation shutdown
```

| Mode | Trafic en violation | Syslog | Port désactivé |
|------|---------------------|--------|----------------|
| `protect` | Ignoré silencieusement | ✗ | ✗ |
| `restrict` | Ignoré | ✓ | ✗ |
| `shutdown` | Bloqué | ✓ | ✓ (err-disabled) |

## Aging (vieillissement)

```text
Switch(config-if)# switchport port-security aging time 60
Switch(config-if)# switchport port-security aging type inactivity
```

## Réactiver un port err-disabled

```text
Switch(config)# interface fastethernet 0/1
Switch(config-if)# shutdown
Switch(config-if)# no shutdown
```

## Vérification

```text
Switch# show port-security
Switch# show port-security interface fastethernet 0/1
Switch# show port-security address
```

!!! tip "Bonnes pratiques"
    - Utiliser `sticky` + `shutdown` sur les ports utilisateurs pour une sécurité maximale
    - Configurer `errdisable recovery cause psecure-violation` pour une réactivation automatique
    - Toujours définir un `maximum` explicite — la valeur par défaut est 1
