# LDAP (OpenLDAP)

## Installation

=== "Debian / Ubuntu"
    ```bash
    apt install slapd ldap-utils -y
    ```

=== "Red Hat / Rocky / Fedora"
    ```bash
    dnf install openldap openldap-servers openldap-clients -y
    ```

## Deux approches de configuration

Après installation, slapd démarre avec un répertoire `slapd.d/` — c'est la configuration **OLC** (On-Line Configuration). Cette methode est plus moderne.
L'ancienne methode utilise le fichier de configuration plat `slapd.conf`.


