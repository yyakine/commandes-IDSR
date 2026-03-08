## Gestion des services (systemctl)

### Contrôle d'un service

```bash
systemctl start nginx         # Démarrer un service
systemctl stop nginx          # Arrêter un service
systemctl restart nginx       # Arrêter puis redémarrer
systemctl reload nginx        # Recharger la configuration sans couper le service
systemctl enable nginx        # Activer au démarrage du système
systemctl disable nginx       # Désactiver au démarrage
systemctl enable --now nginx  # Activer et démarrer immédiatement
systemctl disable --now nginx # Désactiver et arrêter immédiatement
```

### État et inspection

```bash
systemctl status nginx            # État détaillé du service et derniers logs
systemctl is-active nginx         # Retourne "active" ou "inactive"
systemctl is-enabled nginx        # Retourne "enabled" ou "disabled"
systemctl is-failed nginx         # Retourne "failed" si le service a planté
systemctl list-units --type=service           # Lister tous les services actifs
systemctl list-units --type=service --all     # Tous les services, actifs et inactifs
systemctl list-unit-files --type=service      # État enabled/disabled de tous les services
```

### Recharger systemd

```bash
systemctl daemon-reload       # Recharger les fichiers unit après modification
```

!!! info "Quand utiliser daemon-reload"
    À chaque fois qu'un fichier `.service` est créé ou modifié dans `/etc/systemd/system/`, il faut lancer `daemon-reload` avant de démarrer le service.

## Logs systemd (journalctl)

```bash
journalctl -u nginx                  # Logs d'un service spécifique
journalctl -u nginx -f               # Logs en temps réel (follow)
journalctl -u nginx --since today    # Logs depuis aujourd'hui
journalctl -u nginx -n 50            # Les 50 dernières lignes
journalctl -u nginx --since "2026-03-07 08:00" --until "2026-03-07 10:00"
journalctl -p err                    # Uniquement les erreurs
journalctl -p err -u nginx           # Erreurs d'un service spécifique
journalctl --disk-usage              # Taille occupée par les logs
journalctl --vacuum-time=7d          # Supprimer les logs de plus de 7 jours
```

## Processus (ps)

```bash
ps aux                        # Tous les processus du système avec détails
ps aux | grep nginx           # Filtrer par nom
ps -ef                        # Format alternatif avec PPID (parent PID)
ps -u younes                  # Processus d'un utilisateur spécifique
ps --sort=-%cpu | head -10    # Top 10 par consommation CPU
ps --sort=-%mem | head -10    # Top 10 par consommation mémoire
```

### Colonnes importantes de ps aux

| Colonne | Description |
|---------|-------------|
| `USER` | Propriétaire du processus |
| `PID` | Identifiant du processus |
| `%CPU` | Pourcentage CPU utilisé |
| `%MEM` | Pourcentage mémoire utilisée |
| `STAT` | État : `R` running, `S` sleeping, `Z` zombie, `T` stopped |
| `COMMAND` | Commande qui a lancé le processus |

## Processus (top et htop)

```bash
top                           # Monitoring temps réel des processus
htop                          # Version améliorée de top (à installer)
```

```bash title="Raccourcis clavier dans top"
# k   → kill un processus (demande le PID)
# r   → renice (changer la priorité)
# M   → trier par mémoire
# P   → trier par CPU
# q   → quitter
```

## Signaux et kill

```bash
kill 1234                     # Envoyer SIGTERM (arrêt propre) au PID 1234
kill -9 1234                  # Envoyer SIGKILL (arrêt forcé) au PID 1234
kill -15 1234                 # SIGTERM explicite
killall nginx                 # Envoyer SIGTERM à tous les processus nommés nginx
killall -9 nginx              # Forcer l'arrêt de tous les processus nginx
pkill -u younes               # Arrêter tous les processus d'un utilisateur
```

!!! warning "kill -9"
    SIGKILL ne laisse pas au processus le temps de se fermer proprement. Il ne sauvegarde pas son état et ne ferme pas ses fichiers ouverts. À utiliser uniquement si SIGTERM n'a pas fonctionné.

## Priorité des processus (nice et renice)

Les valeurs nice vont de `-20` (priorité maximale) à `+19` (priorité minimale). Par défaut un processus démarre avec nice `0`.

```bash
nice -n 10 ./script.sh        # Lancer un processus avec une priorité basse
nice -n -5 ./script.sh        # Lancer avec une priorité élevée (root uniquement)
renice -n 5 -p 1234           # Modifier la priorité d'un processus en cours
renice -n 10 -u younes        # Modifier la priorité de tous les processus d'un user
```

## Processus en arrière-plan

```bash
commande &                    # Lancer en arrière-plan
jobs                          # Lister les jobs en arrière-plan
fg %1                         # Ramener le job 1 au premier plan
bg %1                         # Reprendre le job 1 en arrière-plan
Ctrl + Z                      # Suspendre le processus en cours
nohup commande &              # Lancer en arrière-plan, résiste à la déconnexion
disown %1                     # Détacher un job du terminal courant
```

!!! tip "nohup vs screen/tmux"
    `nohup` est simple pour des scripts ponctuels. Pour des sessions interactives longues qui doivent survivre à une déconnexion SSH, `screen` ou `tmux` sont bien plus adaptés.