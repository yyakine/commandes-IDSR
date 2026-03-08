# Disques et partitions

Sous Linux, la gestion des disques passe par trois étapes : **partitionner** (`fdisk`/`gdisk`), **formater** (`mkfs`) et **monter** (`mount`). Le fichier `/etc/fstab` gère les montages persistants.

## Identifier les disques

```bash
lsblk                    # Vue arborescente : disques, partitions, points de montage
lsblk -f                 # Ajoute le type de filesystem et les UUID
fdisk -l                 # Liste tous les disques et leurs tables de partitions
blkid                    # UUID, type de filesystem et label de chaque partition
df -h                    # Espace libre sur tous les systèmes de fichiers montés
du -sh /var/log          # Taille totale d'un répertoire
du -ah /var | sort -rh | head -10  # Top 10 des plus gros éléments sous /var
```

## Partitionner

| Outil | Type de table | Limite |
|-------|--------------|--------|
| `fdisk` | MBR | ≤ 2 To |
| `gdisk` | GPT | > 2 To |
| `parted` | MBR / GPT | Universel |

```bash title="fdisk — partitionnement MBR interactif"
fdisk /dev/sdb
# Dans l'interface interactive :
# n → nouvelle partition
# d → supprimer une partition
# p → afficher la table
# t → changer le type (82=swap, 83=Linux, 8e=LVM)
# w → écrire et quitter
```

```bash title="gdisk — partitionnement GPT interactif"
gdisk /dev/sdb
# Mêmes raccourcis que fdisk
```

```bash title="parted — non-interactif"
parted /dev/sdb mkpart primary ext4 1MiB 10GiB
```

!!! tip "Nommage des disques"
    - `/dev/sda`, `/dev/sdb` → disques SATA/SCSI
    - `/dev/nvme0n1` → disques NVMe (`nvme0n1p1` = partition 1)
    - `/dev/vda` → disques virtuels (KVM/VMware)

## Formater (créer un filesystem)

```bash
mkfs.ext4 /dev/sdb1      # ext4 — le plus courant sur Debian/Ubuntu
mkfs.xfs  /dev/sdb1      # XFS  — défaut sur Red Hat/Rocky
mkfs.vfat -F 32 /dev/sdb1  # FAT32 (clé USB, partage Windows)
mkswap /dev/sdb2         # Préparer une partition swap
```

!!! warning "Attention"
    `mkfs` **efface toutes les données** de la partition. Vérifie bien le bon disque avec `lsblk` avant.

## Monter et démonter

```bash
mount /dev/sdb1 /mnt/data     # Montage manuel
umount /mnt/data              # Démontage (ne pas être dans le répertoire)
mount -a                      # Monter tout ce qui est dans /etc/fstab
swapon /dev/sdb2              # Activer le swap
swapoff /dev/sdb2             # Désactiver le swap
```

## Montage persistant sur /etc/fstab

Chaque ligne de `/etc/fstab` suit le format :
```
<device>   <point_de_montage>   <type_fs>   <options>   <dump>   <pass>
```

```bash title="/etc/fstab — exemples"
# Partition ext4 montée au démarrage
UUID=abc123   /mnt/data   ext4   defaults   0   2

# Partition XFS
/dev/sdb1     /srv/data   xfs    defaults   0   2

# Swap
UUID=def456   none        swap   sw         0   0
```

```bash title="Trouver l'UUID d'une partition"
blkid /dev/sdb1
# → /dev/sdb1: UUID="abc123" TYPE="ext4"
```

!!! info "Tester fstab"
    Toujours tester fstab avec `mount -a` après modification.



