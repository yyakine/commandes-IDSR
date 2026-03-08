# VoIP (Cisco CME)

## DHCP avec Option 150

```text
Router(config)# ip dhcp pool VOICE_POOL
Router(dhcp-config)# network 192.168.100.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.100.1
Router(dhcp-config)# option 150 ip 192.168.254.1
Router(dhcp-config)# dns-server 8.8.8.8 8.8.4.4
Router(dhcp-config)# exit
```

`option 150` transmet l'adresse du serveur TFTP/CUCM aux téléphones IP au démarrage.

## Telephony Service (CME)

```text
Router(config)# telephony-service
Router(config-telephony)# max-ephones 10
Router(config-telephony)# max-dn 10
Router(config-telephony)# ip source-address 192.168.1.1 port 2000
Router(config-telephony)# auto assign 2 to 10
Router(config-telephony)# exit
```

| Commande | Description |
|----------|-------------|
| `max-ephones` | Nombre maximum de téléphones IP enregistrés |
| `max-dn` | Nombre maximum de Directory Numbers (extensions) |
| `ip source-address` | Adresse IP du routeur CME + port SCCP (2000) |
| `auto assign 2 to 10` | Auto-attribution des ePhone-DN 2 à 10 |

## Création des ePhone-DN (extensions)

```text
Router(config)# ephone-dn 1
Router(config-ephone-dn)# number 2001
Router(config-ephone-dn)# exit

Router(config)# ephone-dn 2
Router(config-ephone-dn)# number 2002
Router(config-ephone-dn)# exit

Router(config)# ephone-dn 3
Router(config-ephone-dn)# number 2003
Router(config-ephone-dn)# exit
```

## Assignation manuelle d'un téléphone (MAC address)

```text
Router(config)# ephone 1
Router(config-ephone)# mac-address 00A1.2345.6789
Router(config-ephone)# type 7960
Router(config-ephone)# button 1:1
Router(config-ephone)# exit
```

| Commande | Description |
|----------|-------------|
| `mac-address` | Adresse MAC du téléphone IP (format Cisco) |
| `type` | Modèle du téléphone (7960, 7961, 8945...) |
| `button 1:1` | Bouton 1 assigné à ePhone-DN 1 (numéro 2001) |

## Vérification

```text
Router# show ephone
Router# show ephone-dn
Router# show ephone 1
Router# show ephone-dn 1
Router# show call active voice
Router# show voice call summary
```

!!! info "Auto assign"
    Avec `auto assign 2 to 10`, tout téléphone qui se connecte reçoit automatiquement un ePhone-DN disponible (numéros 2002–2010). Seul le téléphone 1 est assigné manuellement via MAC address.

!!! tip "Bonnes pratiques"
    - Toujours configurer le pool DHCP avec `option 150` avant de connecter les téléphones
    - Le VLAN voix doit être séparé du VLAN données (`switchport voice vlan 150`)
    - Vérifier l'enregistrement des téléphones avec `show ephone` — l'état doit afficher `Registered`
