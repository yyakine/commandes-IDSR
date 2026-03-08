# IPsec (ESP + AES + Pre-Shared Key)

IPsec sécurise les communications IP avec authentification et chiffrement. La configuration se fait en deux phases IKE.

## Phase 1 — Politique ISAKMP

```text
Router(config)# crypto isakmp policy 1
Router(config-isakmp)# authentication pre-share
Router(config-isakmp)# encryption aes 256
Router(config-isakmp)# hash sha256
Router(config-isakmp)# group 14
Router(config-isakmp)# lifetime 86400

! Clé pré-partagée (même clé sur les deux routeurs)
Router(config)# crypto isakmp key mySecretKey123! address 200.1.1.2
```

| Paramètre | Valeur utilisée | Description |
|-----------|-----------------|-------------|
| `encryption` | `aes 256` | Algorithme de chiffrement |
| `hash` | `sha256` | Algorithme de hachage |
| `group` | `14` | Groupe Diffie-Hellman (2048 bits) |
| `lifetime` | `86400` | Durée de vie de la SA en secondes (24h) |

## Phase 2 — Transform Set et Crypto Map

```text
! Transform Set
Router(config)# crypto ipsec transform-set MY_TRANSFORM esp-aes 256 esp-sha256-hmac
Router(config)# crypto ipsec transform-set MY_TRANSFORM mode transport

! ACL définissant le trafic à chiffrer
Router(config)# access-list 100 permit ip 192.168.1.0 0.0.0.255 192.168.2.0 0.0.0.255

! Crypto Map
Router(config)# crypto map MY_MAP 10 ipsec-isakmp
Router(config-crypto-map)# match address 100
Router(config-crypto-map)# set peer 200.1.1.2
Router(config-crypto-map)# set transform-set MY_TRANSFORM
Router(config-crypto-map)# set pfs group14
Router(config-crypto-map)# set lifetime seconds 3600

! Appliquer sur l'interface WAN
Router(config)# interface serial 0/0
Router(config-if)# crypto map MY_MAP
```

## Vérification

```text
Router# show crypto isakmp sa
Router# show crypto ipsec sa
Router# show crypto map
Router# debug crypto isakmp
Router# debug crypto ipsec
```

| Commande | Description |
|----------|-------------|
| `show crypto isakmp sa` | État de la phase 1 (doit afficher `QM_IDLE`) |
| `show crypto ipsec sa` | État de la phase 2 — compteurs de paquets chiffrés |
| `show crypto map` | Configuration complète de la crypto map |


!!! tip "Bonnes pratiques"
    - La configuration doit être **symétrique** sur les deux routeurs (même policy, même clé, même transform-set)
    - Préférer **GRE over IPsec** si un protocole de routage dynamique est nécessaire sur le tunnel
    - Ne jamais utiliser des clés faibles — préférer des clés aléatoires longues pour `isakmp key`
