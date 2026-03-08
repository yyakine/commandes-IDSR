# HTTP (Apache2)

Apache2 est le serveur web le plus répandu sous Linux. Il sert des pages web via HTTP/HTTPS et supporte les virtual hosts pour héberger plusieurs sites sur une même machine.

## Installation

=== "Debian / Ubuntu"
    ```bash
    apt install apache2 -y
    ```

=== "Red Hat / Rocky / Fedora"
    ```bash
    dnf install httpd -y
    ```

## Fichiers de configuration

=== "Debian / Ubuntu"

    | Fichier | Rôle |
    |---------|------|
    | `/etc/apache2/apache2.conf` | Configuration principale |
    | `/etc/apache2/sites-available/` | Virtual hosts disponibles |
    | `/etc/apache2/sites-enabled/` | Virtual hosts actifs (symlinks) |
    | `/etc/apache2/mods-enabled/` | Modules activés |
    | `/var/www/html/` | Répertoire web par défaut |
    | `/var/log/apache2/access.log` | Logs d'accès |
    | `/var/log/apache2/error.log` | Logs d'erreurs |

=== "Red Hat / Rocky / Fedora"

    | Fichier | Rôle |
    |---------|------|
    | `/etc/httpd/conf/httpd.conf` | Configuration principale |
    | `/etc/httpd/conf.d/` | Fichiers de config additionnels (virtual hosts ici) |
    | `/var/www/html/` | Répertoire web par défaut |
    | `/var/log/httpd/access_log` | Logs d'accès |
    | `/var/log/httpd/error_log` | Logs d'erreurs |

## Virtual host

=== "Debian / Ubuntu"

    ```bash title="/etc/apache2/sites-available/monsite.conf"
    <VirtualHost *:80>
        ServerName monsite.lan.local
        DocumentRoot /var/www/monsite

        <Directory /var/www/monsite>
            AllowOverride All
            Require all granted
        </Directory>

        ErrorLog ${APACHE_LOG_DIR}/monsite-error.log
        CustomLog ${APACHE_LOG_DIR}/monsite-access.log combined
    </VirtualHost>
    ```

    ```bash
    a2ensite monsite.conf        # Activer le virtual host
    a2dissite monsite.conf       # Désactiver le virtual host
    a2enmod rewrite              # Activer un module
    a2dismod rewrite             # Désactiver un module
    systemctl reload apache2
    ```

=== "Red Hat / Rocky / Fedora"

    ```bash title="/etc/httpd/conf.d/monsite.conf"
    <VirtualHost *:80>
        ServerName monsite.lan.local
        DocumentRoot /var/www/monsite

        <Directory /var/www/monsite>
            AllowOverride All
            Require all granted
        </Directory>

        ErrorLog /var/log/httpd/monsite-error.log
        CustomLog /var/log/httpd/monsite-access.log combined
    </VirtualHost>
    ```

    ```bash
    systemctl reload httpd
    ```

!!! info "Pas de a2ensite sur Red Hat"
    Sur Red Hat, tout fichier `.conf` placé dans `/etc/httpd/conf.d/` est automatiquement chargé. Pas besoin de commandes d'activation.

## Commandes

=== "Debian/Ubuntu"
    ```bash
    systemctl start apache2
    systemctl enable apache2
    systemctl reload apache2      # Recharger la config sans couper les connexions
    ```
=== "Redhat/Fedora"
    ```bash 
    # Red Hat / Rocky
    systemctl start httpd
    systemctl enable httpd
    systemctl reload httpd        # Recharger la config sans couper les connexions
    ```

## Vérifier la syntaxe et les erreurs

=== "Debian/Ubuntu"
    ```bash
    apache2ctl configtest          # Debian / Ubuntu
    journalctl -u apache2 -f       # Logs en temps réel (Debian)
    tail -f /var/log/apache2/error.log      # Debian
    ```

=== "Redhat/Fedora"
    ```bash
    httpd -t                   
    journalctl -u httpd -f        
    tail -f /var/log/httpd/error_log     
    ```
