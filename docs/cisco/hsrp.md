# HSRP (Hot Standby Router Protocol)

## Configuration — Routeur primaire

```text
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip address 192.168.1.2 255.255.255.0
Router(config-if)# standby 1 ip 192.168.1.1
Router(config-if)# standby 1 priority 110
Router(config-if)# standby 1 preempt
Router(config-if)# no shutdown
```

## Configuration — Routeur secondaire

```text
Router(config)# interface gigabitethernet 0/0
Router(config-if)# ip address 192.168.1.3 255.255.255.0
Router(config-if)# standby 1 ip 192.168.1.1
Router(config-if)# standby 1 priority 90
Router(config-if)# no shutdown
```

## Paramètres clés

| Commande | Description |
|----------|-------------|
| `standby 1 ip 192.168.1.1` | Adresse IP virtuelle partagée (gateway des clients) |
| `standby 1 priority 110` | Priorité — le plus élevé devient Active (défaut: 100) |
| `standby 1 preempt` | Reprend le rôle Active automatiquement si priorité meilleure |

## Vérification

```text
Router# show standby
Router# show standby brief
Router# show standby interface gigabitethernet 0/0
```

!!! info "États HSRP"
    - **Active** : répond aux paquets destinés à l'IP virtuelle
    - **Standby** : surveille l'Active, prêt à prendre le relai
    - **Listen** : connaît l'IP virtuelle mais n'est ni Active ni Standby

!!! tip "Bonnes pratiques"
    - Toujours configurer `preempt` sur le routeur primaire pour qu'il reprenne le rôle Active après une panne
    - Utiliser `standby 1 track` pour diminuer la priorité automatiquement si une interface upstream tombe
    - La même adresse IP virtuelle doit être configurée sur **tous** les routeurs du groupe HSRP
