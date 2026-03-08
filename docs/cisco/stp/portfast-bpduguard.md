# PortFast et BPDUGuard

## PortFast

Élimine le délai de convergence STP (30s) sur les ports access connectés à des équipements terminaux.

```text
! Sur une interface spécifique
Switch(config)# interface fastethernet 0/1
Switch(config-if)# spanning-tree portfast

! Globalement sur tous les ports access
Switch(config)# spanning-tree portfast default
```

## BPDUGuard

Désactive le port immédiatement si un BPDU est reçu — protège contre la connexion accidentelle d'un switch sur un port access.

```text
! Sur une interface spécifique
Switch(config)# interface fastethernet 0/1
Switch(config-if)# spanning-tree bpduguard enable

! Globalement (s'applique à tous les ports PortFast)
Switch(config)# spanning-tree portfast bpduguard default
```

## Combiner PortFast + BPDUGuard

```text
Switch(config)# interface fastethernet 0/1
Switch(config-if)# spanning-tree portfast
Switch(config-if)# spanning-tree bpduguard enable
```

## Réactiver un port err-disabled

```text
Switch(config)# interface fastethernet 0/1
Switch(config-if)# shutdown
Switch(config-if)# no shutdown
```

!!! warning "PortFast uniquement sur ports access"
    Ne jamais activer PortFast sur un port trunk ou connecté à un autre switch — cela peut créer des boucles.

!!! tip "Bonnes pratiques"
    - Toujours associer PortFast avec BPDUGuard sur les ports utilisateurs
    - Utiliser `spanning-tree portfast bpduguard default` pour une protection globale automatique
    - Configurer `errdisable recovery cause bpduguard` pour une réactivation automatique après délai
