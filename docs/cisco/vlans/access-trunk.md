# Ports Access et Trunk

## Port Access 

```cisco
Switch(config)# interface fastethernet 0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
```

## VLAN Voix 

```cisco
Switch(config)# interface fastethernet 0/5
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 20
Switch(config-if)# switchport voice vlan 150
```

## Port Trunk 

```cisco
! Configurer un port trunk
Switch(config)# interface fastethernet 0/24
Switch(config-if)# switchport mode trunk

! Autoriser des VLANs spécifiques
Switch(config-if)# switchport trunk allowed vlan 10,20,30

! Ajouter un VLAN à la liste existante
Switch(config-if)# switchport trunk allowed vlan add 40

! Retirer un VLAN de la liste
Switch(config-if)# switchport trunk allowed vlan remove 40

! Autoriser tous les VLANs (défaut)
Switch(config-if)# switchport trunk allowed vlan all
```

## Vérification

```cisco
Switch# show vlan brief
Switch# show interfaces trunk
Switch# show interfaces fastethernet 0/1 switchport
```

!!! info "VLAN natif"
    Le VLAN natif (par défaut VLAN 1) circule en clair sur un trunk sans tag 802.1Q. Pour la sécurité, le changer sur un VLAN dédié non utilisé :
    ```cisco
    Switch(config-if)# switchport trunk native vlan 999
    ```

!!! tip "Bonnes pratiques"
    - Ne jamais utiliser le VLAN 1 comme VLAN de données
    - Toujours lister explicitement les VLANs autorisés sur les trunks (`allowed vlan`)
    - Utiliser `switchport mode access` sur tous les ports utilisateurs, jamais `dynamic`
