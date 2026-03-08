# RAID logiciel (mdadm)

Le RAID logiciel sous Linux s'administre avec `mdadm`. Les arrays sont des périphériques `/dev/mdX` qu'on formate et monte comme n'importe quelle partition.

## Installation

=== "Debian / Ubuntu"
    ```bash
    sudo apt install mdadm -y
    ```

=== "Red Hat / Rocky / Fedora"
    ```bash
    sudo dnf install mdadm -y
    ```

## Comparaison RAID 0 / 1 / 5

| | RAID 0 | RAID 1 | RAID 5 |
|---|--------|--------|--------|
| **Nom** | Striping | Mirroring | Striping + parité |
| **Disques minimum** | 2 | 2 | 3 |
| **Tolérance pannes** | 0 disque | 1 disque | 1 disque |
| **Espace utilisable** | 100% | 50% | (n-1)/n |
| **Performance lecture** | Très rapide | Rapide | Rapide |
| **Performance écriture** | Très rapide | Normale | Normale |
| **Usage typique** | Performance pure, pas critique | Données critiques | Compromis performance et sécurité |

!!! warning "RAID 0"
    RAID 0 n'offre aucune redondance. Si un disque tombe, toutes les données sont perdues. C'est uniquement pour la performance.

## Créer un array RAID

```bash title="RAID 0 — striping sur 2 disques"
mdadm --create /dev/md0 --level=0 --raid-devices=2 /dev/sdb1 /dev/sdc1
#Où bien
mdadm --create /dev/md0 -l0 -n2 /dev/sdb1 /dev/sdc1
```

```bash title="RAID 1 — mirroring sur 2 disques"
mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb1 /dev/sdc1
#Où bien
mdadm --create /dev/md0 -l1 -n2 /dev/sdb1 /dev/sdc1
```

```bash title="RAID 5 — striping avec parité sur 3 disques"
mdadm --create /dev/md0 --level=5 --raid-devices=3 /dev/sdb1 /dev/sdc1 /dev/sdd1
#Où bien
mdadm --create /dev/md0 -l5 -n3 /dev/sdb1 /dev/sdc1 /dev/sdd1
```

```bash title="RAID 5 avec un disque spare"
mdadm --create /dev/md0 --level=5 --raid-devices=3 /dev/sdb1 /dev/sdc1 /dev/sdd1 --spare-devices=1 /dev/sde1
#Où bien
mdadm --create /dev/md0 -l5 -n3 /dev/sdb1 /dev/sdc1 /dev/sdd1 -x1 /dev/sde1
```

## Utiliser l'array

```bash
mkfs.ext4 /dev/md0
mkfs.xfs  /dev/md0

mkdir /mnt/raid
mount /dev/md0 /mnt/raid
```

```bash title="/etc/fstab — montage persistant"
/dev/md0   /mnt/raid   ext4   defaults   0   2
```

## Surveiller l'array

```bash
cat /proc/mdstat                  # État de tous les arrays et progression du rebuild
mdadm --detail /dev/md0           # Détails complets : état, disques, parité
mdadm --query /dev/md0            # Résumé rapide
watch -n1 cat /proc/mdstat        # Surveillance en temps réel, rafraîchissement 1s
```

```bash title="Exemple de sortie /proc/mdstat"
md0 : active raid5 sdd1 sdc1 sdb1
      20955136 blocks super 1.2 level 5, 512k chunk, algorithm 2 [3/3] [UUU]
# [UUU] = tous les disques UP
# [UU_] = 1 disque manquant, array dégradé
```

## Gérer les pannes

```bash
# Simuler une panne (pour test)
mdadm /dev/md0 --fail /dev/sdb1

# Retirer un disque défaillant
mdadm /dev/md0 --remove /dev/sdb1

# Ajouter un disque de remplacement
mdadm /dev/md0 --add /dev/sdf1

# Ajouter un spare à la volée
mdadm /dev/md0 --add /dev/sde1
```

!!! info "Rebuild automatique"
    Dès qu'un spare est disponible, `mdadm` lance le rebuild automatiquement. La progression est visible dans `/proc/mdstat`. Pendant ce temps, l'array reste accessible en mode dégradé.

## Sauvegarder la configuration

=== "Debian / Ubuntu"
    ```bash title="Debian / Ubuntu"
    mdadm --detail --scan >> /etc/mdadm/mdadm.conf
    update-initramfs -u
    ```

=== "Redhat / Fedora"
    ```bash title="Red Hat / Rocky / Fedora"
    mdadm --detail --scan >> /etc/mdadm.conf
    dracut --force
    ```

!!! warning "Sans mdadm.conf"
    Sans cette étape, l'array ne s'assemblera pas automatiquement au redémarrage. Le système peut ne pas démarrer si `/` est sur RAID.

## Supprimer un array

```bash
umount /mnt/raid
mdadm --stop /dev/md0
mdadm --remove /dev/md0
mdadm --zero-superblock /dev/sdb1   # À répéter sur chaque disque de l'array
mdadm --zero-superblock /dev/sdc1
```
