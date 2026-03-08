Contrairement à l'ancien fichier plat `slapd.conf`, toute la configuration est stockée sous forme d'un **arbre LDAP réel** sur le disque, dans le répertoire `/etc/openldap/slapd.d/`.

## Structure de l'arbre `cn=config`

Voici comment la configuration se présente sur le disque après initialisation :

```
/etc/openldap/slapd.d/
├── cn=config.ldif                        ← Paramètres globaux du serveur
└── cn=config/
    ├── cn=schema.ldif                    ← Conteneur des schémas
    ├── cn=schema/
    │   ├── cn={0}core.ldif
    │   ├── cn={1}cosine.ldif
    │   ├── cn={2}nis.ldif
    │   └── cn={3}inetorgperson.ldif
    ├── olcDatabase={0}config.ldif        ← Base de config (accès à cn=config)
    └── olcDatabase={1}mdb.ldif           ← Votre base de données LDAP
```

Les préfixes numériques `{0}`, `{1}` imposent un **ordre de traitement**, car LDAP ne garantit pas l'ordre des entrées nativement.

---

## Comprendre les entrées de configuration

### Paramètres globaux (`cn=config`)

```ldif
dn: cn=config
objectClass: olcGlobal
cn: config
```

C'est l'**entrée racine** de toute la configuration. Elle doit exister pour que `slapd` démarre. Tous les autres éléments de configuration sont des enfants de cette entrée.

L'`objectClass: olcGlobal` autorise les attributs globaux comme `olcLogLevel`, `olcIdleTimeout`, `olcTLSCertFile`, etc.

### Conteneur des schémas (`cn=schema,cn=config`)

```ldif
dn: cn=schema,cn=config
objectClass: olcSchemaConfig
cn: schema
```

Cette entrée est le **dossier parent de tous les schémas**. Elle ne définit aucun schéma elle-même — elle doit simplement exister pour que les schémas chargés via `include:` aient un endroit où s'installer.

Lorsqu'on écrit `include: file:///etc/openldap/schema/core.ldif`, `slapadd` crée automatiquement une entrée enfant `cn={0}core,cn=schema,cn=config` sous cette entrée.

!!! warning "Ordre obligatoire"
    Cette entrée doit être déclarée **avant** toute directive `include:` dans le fichier LDIF de bootstrap.

---

### Sécurisation de la config (`olcDatabase=config,cn=config`)

```ldif
dn: olcDatabase=config,cn=config
objectClass: olcDatabaseConfig
olcDatabase: config
olcRootDN: cn=config
olcRootPW: {SSHA}YOUR_HASH_HERE
```

`cn=config` est lui-même une vraie base de données LDAP, et comme toute base LDAP, elle a besoin d'un compte administrateur. Cette entrée **définit cet administrateur**.

| Attribut | Rôle |
|---|---|
| `olcDatabase: config` | Désigne la base de configuration intégrée |
| `olcRootDN: cn=config` | L'identité admin de cette base (sans suffixe, spécifique à ce backend) |
| `olcRootPW` | Le mot de passe hashé de cet admin |


### Votre annuaire de données (`olcDatabase=mdb,cn=config`)

```ldif
dn: olcDatabase=mdb,cn=config
objectClass: olcDatabaseConfig
objectClass: olcMdbConfig
olcDatabase: mdb
olcDbMaxSize: 1073741824
olcDbDirectory: /var/lib/ldap
olcSuffix: dc=example,dc=com
olcRootDN: cn=admin,dc=example,dc=com
olcRootPW: {SSHA}YOUR_HASH_HERE
olcDbIndex: objectClass eq
```

C'est la base qui **stocke vos vraies données LDAP** (utilisateurs, groupes, etc.).

| Attribut | Rôle |
|---|---|
| `olcDatabase: mdb` | Backend MDB (Memory-Mapped Database), le moteur moderne d'OpenLDAP |
| `olcDbMaxSize` | Taille maximale du fichier de base en octets (1 Go ici) |
| `olcDbDirectory` | Chemin sur le disque où sont stockés les fichiers `data.mdb` et `lock.mdb` |
| `olcSuffix` | Le DN racine de votre annuaire — à adapter à votre domaine |
| `olcRootDN` | L'administrateur de **vos données** (distinct de l'admin config) |
| `olcRootPW` | Son mot de passe hashé |
| `olcDbIndex` | Index pour accélérer les recherches sur `objectClass` |

!!! info "Deux admins distincts"
    L'admin config (`cn=config`) et l'admin données (`cn=admin,dc=...`) sont deux identités **complètement indépendantes** avec des mots de passe séparés.

---

## Configuration pas à pas


### Étape 1 : Génération des mots de passe hashés

```bash
slappasswd -s MotDePasseConfig   # Pour cn=config
slappasswd -s MotDePasseData     # Pour cn=admin,dc=example,dc=com
```

### Étape 2 : Création du fichier LDIF de bootstrap

Créez `/etc/openldap/slapd.ldif` :

```ldif
# 1. Paramètres globaux
dn: cn=config
objectClass: olcGlobal
cn: config

# 2. Conteneur des schémas
dn: cn=schema,cn=config
objectClass: olcSchemaConfig
cn: schema

# 3. Chargement des schémas (ordre obligatoire)
include: file:///etc/openldap/schema/core.ldif
include: file:///etc/openldap/schema/cosine.ldif
include: file:///etc/openldap/schema/nis.ldif
include: file:///etc/openldap/schema/inetorgperson.ldif

# 4. Base de configuration
dn: olcDatabase=config,cn=config
objectClass: olcDatabaseConfig
olcDatabase: config
olcRootDN: cn=config
olcRootPW: {SSHA}VOTRE_HASH_CONFIG

# 5. Base de données MDB (annuaire de données)
dn: olcDatabase=mdb,cn=config
objectClass: olcDatabaseConfig
objectClass: olcMdbConfig
olcDatabase: mdb
olcDbMaxSize: 1073741824
olcDbDirectory: /var/lib/ldap
olcSuffix: dc=example,dc=com
olcRootDN: cn=admin,dc=example,dc=com
olcRootPW: {SSHA}VOTRE_HASH_DATA
olcDbIndex: objectClass eq
```

!!! warning "Ordre des entrées"
    L'ordre est **strict** : `cn=config` → `cn=schema` → `include:` → bases de données. `slapadd` traite les entrées séquentiellement ; un mauvais ordre provoque des erreurs.

---

### Étape 3 : Préparation du répertoire de données

```bash
mkdir -p /var/lib/ldap
chown ldap:ldap /var/lib/ldap
```

`slapd` s'exécute sous l'utilisateur système `ldap`. Ce répertoire accueillera les fichiers `data.mdb` et `lock.mdb`. Sans cette propriété, le service refusera de démarrer.

---

### Étape 4 : Chargement du bootstrap

```bash
slapadd -n 0 -F /etc/openldap/slapd.d -l /etc/openldap/slapd.ldif
```

| Option | Rôle |
|---|---|
| `-n 0` | Cible la base index 0, toujours la base `config` |
| `-F /etc/openldap/slapd.d` | Répertoire de destination (sera peuplé de fichiers `.ldif`) |
| `-l /etc/openldap/slapd.ldif` | Fichier LDIF source |

Correction des permissions après chargement (slapadd tourne en root) :

```bash
chown -R ldap:ldap /etc/openldap/slapd.d
chmod -R 0750 /etc/openldap/slapd.d
```

---

### Étape 5 : Démarrage du service

```bash
systemctl enable --now slapd
systemctl status slapd
```

### Étape 6 : Création des entrées de base de l'annuaire

Le fichier de bootstrap configure **comment** la base fonctionne, mais ne contient aucune donnée. Peuplez maintenant votre DIT :

```bash title="Création de domaine et d'unités d'organisations"
ldapadd -x -D "cn=admin,dc=hassania,dc=ma" -W -H ldap://localhost << 'EOF'
dn: dc=hassania,dc=ma
objectClass: top
objectClass: dcObject
objectClass: organization
dc: example
o: Example Organization

dn: ou=users,dc=hassania,dc=ma
objectClass: top
objectClass: organizationalUnit
ou: users

dn: ou=groups,dc=hassania,dc=ma
objectClass: top
objectClass: organizationalUnit
ou: groups
EOF
```

```bash title="Création d'utilisateurs"
ldapadd -x -D "cn=admin,dc=hassania,dc=ma" -W -H ldap://localhost << 'EOF'
dn: uid=younes,ou=users,dc=hassania,dc=ma
objectClass: top
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: shadowAccount
uid: younes
cn: Younes Yakine
sn: Yakine
givenName: Younes
mail: younes@hassania.ma
uidNumber: 1001
gidNumber: 1001
homeDirectory: /home/younes
loginShell: /bin/bash
userPassword: {SSHA}VOTRE_HASH_ICI
EOF
```

| Option | Rôle |
|---|---|
| `-x` | Authentification simple (par mot de passe) |
| `-D "cn=admin,..."` | Bind en tant qu'admin des **données** |
| `-W` | Demande interactive du mot de passe |
| `-H ldap://localhost` | Connexion TCP locale |

---

### Étape 7 : Vérification finale

```bash
# Vérifier l'arbre de configuration
ldapsearch -x -D "cn=config" -W -H ldapi:/// -b "cn=config" -LLL

# Vérifier l'annuaire de données
ldapsearch -x -D "cn=admin,dc=example,dc=com" -W \
-H ldap://localhost -b "dc=example,dc=com"
```



## Vérification et debug

```bash
slaptest -f /etc/openldap/slapd.conf -v   # Vérifier la config avant démarrage
ldapsearch -x -b "dc=hassania,dc=ma"      # Tester que les données sont bien injectées
journalctl -u slapd -f                    # Logs en temps réel
```

!!! warning "Pare-feu"
    ```bash
    firewall-cmd --add-service=ldap --permanent
    firewall-cmd --reload
    ```
    Ou avec nftables :
    ```bash
    nft add rule inet filter input tcp dport 389 accept   # LDAP
    nft add rule inet filter input tcp dport 636 accept   # LDAPS
    ```
