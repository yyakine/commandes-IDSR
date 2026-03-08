
Créer `/etc/openldap/slapd.conf` :

```conf
include /etc/openldap/schema/core.schema
include /etc/openldap/schema/cosine.schema
include /etc/openldap/schema/nis.schema
include /etc/openldap/schema/inetorgperson.schema

pidfile  /var/run/openldap/slapd.pid
argsfile /var/run/openldap/slapd.args

database    mdb
maxsize     1073741824
suffix      "dc=hassania,dc=ma"
rootdn      "cn=Manager,dc=hassania,dc=ma"
rootpw      {SSHA}HASH_GENERE_PAR_SLAPPASSWD
directory   /var/lib/ldap

index objectClass eq,pres
```


Générer le hash du mot de passe Manager :
```bash
slappasswd
# Copier le {SSHA}xxx dans slapd.conf
```

Fixer les permissions et démarrer :
```bash
chown -R ldap:ldap /var/lib/ldap
slaptest -f /etc/openldap/slapd.conf -v   # Tester la config
systemctl start slapd
```

## Fichiers de configuration

| Fichier | Rôle |
|---------|------|
| `/etc/openldap/slapd.conf` | Configuration du serveur (méthode flat file) |
| `/etc/openldap/ldap.conf` | Configuration client |
| `/var/lib/ldap/` | Base de données LDAP (données réelles) |
| `/etc/openldap/schema/` | Schémas (définissent les objectClass disponibles) |

## Fichiers LDIF Principe

Un fichier `.ldif` est un simple fichier texte. **Il ne fait rien tant qu'il n'est pas injecté** avec `ldapadd` ou `ldapmodify`.

Les fichier `.ldif` peuvent être créés n'importe où.

### Structure de base : Domaine et OUs (base.ldif)

```ldif
dn: dc=hassania,dc=ma
objectClass: top
objectClass: dcObject
objectClass: organization
o: Mon Organisation
dc: hassania

dn: ou=users,dc=hassania,dc=ma
objectClass: organizationalUnit
ou: users

dn: ou=groups,dc=hassania,dc=ma
objectClass: organizationalUnit
ou: groups
```

### Ajouter un utilisateur (users.ldif)

Générer le hash du mot de passe utilisateur d'abord :
```bash
slappasswd -s TonMotDePasse
```

```ldif
dn: cn=younes,ou=users,dc=hassania,dc=ma
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: shadowAccount
cn: younes
sn: Yakine
uid: younes
uidNumber: 1500
gidNumber: 1500
homeDirectory: /home/younes
loginShell: /bin/bash
userPassword: {SSHA}hash_genere_par_slappasswd
```

### Modifier une entrée existante (modif.ldif)

```ldif
dn: cn=younes,ou=users,dc=hassania,dc=ma
changetype: modify
replace: mail
mail: younes@hassania.ma
-
add: telephoneNumber
telephoneNumber: 0612345678
-
delete: description
```

!!! info "Le tiret `-`"
    Sépare les opérations dans un même fichier `modif.ldif`. Chaque bloc peut faire une action différente sur la même entrée.

## Commandes
!!! Warning 
    Après avoir créé les fichiers ldif, il faut les injecter à l'aide de `ldapadd` 

```bash
# Injecter des entrées (ordre important : base avant users)
ldapadd -x -D "cn=Manager,dc=hassania,dc=ma" -W -f base.ldif
ldapadd -x -D "cn=Manager,dc=hassania,dc=ma" -W -f users.ldif

# Modifier
ldapmodify -x -D "cn=Manager,dc=hassania,dc=ma" -W -f modif.ldif

# Supprimer une entrée
ldapdelete -x -D "cn=Manager,dc=hassania,dc=ma" -W "cn=younes,ou=users,dc=hassania,dc=ma"

# Rechercher tout l'annuaire
ldapsearch -x -b "dc=hassania,dc=ma"

# Rechercher un utilisateur spécifique
ldapsearch -x -b "ou=users,dc=hassania,dc=ma" "(uid=younes)"
```

### Options communes

| Option | Description |
|--------|-------------|
| `-x` | Authentification simple, sans SASL |
| `-D "cn=Manager,..."` | Bind DN : le compte utilisé pour se connecter |
| `-W` | Demande le mot de passe de manière interactive |
| `-b "dc=..."` | Base de recherche : point de départ dans l'arbre |
| `-f fichier.ldif` | Fichier LDIF à injecter |


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

