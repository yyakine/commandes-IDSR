# LVM — Logical Volume Manager

LVM ajoute une couche d'abstraction entre les disques physiques et les filesystems. Cela permet de **redimensionner, déplacer et snapshoter** des volumes sans toucher à la table de partitions.

## Architecture LVM

```
Disques physiques  →  PV (Physical Volumes)
PV regroupés       →  VG (Volume Group)
VG découpé         →  LV (Logical Volumes)  →  mkfs + mount
```

!!! info "Principe"
    Un VG est une "cuve" d'espace disque. On y puise pour créer des LV de la taille qu'on veut, redimensionnables à chaud.

## Physical Volumes (PV)

```bash
pvcreate /dev/sdb              # Initialiser un disque comme PV
pvcreate /dev/sdb1 /dev/sdc1   # Plusieurs partitions d'un coup
pvs                            # Liste compacte des PV
pvdisplay                      # Détails complets (taille, VG associé, PE size)
pvdisplay /dev/sdb             # Détails d'un PV spécifique
pvremove /dev/sdb              # Retirer un PV (doit être hors VG)
```

## Volume Groups (VG)

```bash
vgcreate vg0 /dev/sdb /dev/sdc    # Créer un VG à partir de 2 PV
vgextend vg0 /dev/sdd             # Ajouter un PV à un VG existant
vgreduce vg0 /dev/sdd             # Retirer un PV du VG (doit être vide)
vgs                               # Liste compacte des VG
vgdisplay vg0                     # Détails (PE total, PE libre, taille)
vgremove vg0                      # Supprimer un VG (tous les LV doivent être supprimés)
```

## Logical Volumes (LV)

```bash
# Créer un LV
lvcreate -L 10G -n lvdata vg0        # LV de 10 Go nommé lvdata
lvcreate -l 100%FREE -n lvdata vg0   # Tout l'espace libre du VG
lvcreate -l 50%VG -n lvdata vg0      # 50% de la taille totale du VG

# Lister
lvs                                  # Liste compacte
lvdisplay /dev/vg0/lvdata            # Détails complets

# Supprimer
lvremove /dev/vg0/lvdata             # Démonter d'abord !
```

## Utiliser un LV (formater + monter)

```bash
mkfs.ext4 /dev/vg0/lvdata           # Formater
mkfs.xfs  /dev/vg0/lvdata           # Ou en XFS

mkdir /mnt/data
mount /dev/vg0/lvdata /mnt/data      # Monter manuellement
```

```bash title="/etc/fstab — montage persistant"
/dev/vg0/lvdata   /mnt/data   ext4   defaults   0   2
```

## Étendre un LV

```bash
# Étape 1 — étendre le LV
lvextend -L +5G /dev/vg0/lvdata         # Ajouter 5 Go
lvextend -l +100%FREE /dev/vg0/lvdata   # Tout l'espace restant du VG

# Étape 2 — redimensionner le filesystem (à chaud)
resize2fs /dev/vg0/lvdata              # ext4
xfs_growfs /mnt/data                   # XFS (utilise le point de montage)

# Ou en une seule commande avec -r
lvextend -r -L +5G /dev/vg0/lvdata     # -r = resize automatique après extension
```

!!! tip "XFS ne peut qu'agrandir"
    XFS ne supporte pas la réduction de taille. Pour réduire, il faut utiliser ext4 et démonter le volume avant.

## Réduire un LV (ext4 uniquement)

```bash
umount /mnt/data
fsck.ext4 -f /dev/vg0/lvdata         # Vérification obligatoire avant réduction
resize2fs /dev/vg0/lvdata 8G         # Réduire le filesystem à 8 Go
lvreduce -L 8G /dev/vg0/lvdata       # Réduire le LV à 8 Go
mount /dev/vg0/lvdata /mnt/data
```

!!! warning "Ordre important"
    Toujours réduire le **filesystem avant** le LV — faire l'inverse corrompt les données.

## Snapshots

```bash
# Créer un snapshot
lvcreate -s -L 2G -n lvdata_snap /dev/vg0/lvdata
# -s = snapshot, la taille couvre les changements depuis la création

# Monter le snapshot (lecture seule)
mount -o ro /dev/vg0/lvdata_snap /mnt/snap

# Restaurer depuis un snapshot (LV original démonté)
umount /mnt/data
lvconvert --merge /dev/vg0/lvdata_snap
# Au prochain montage, lvdata sera restauré à l'état du snapshot

# Supprimer un snapshot
lvremove /dev/vg0/lvdata_snap
```

## Récapitulatif des commandes

| Action | PV | VG | LV |
|--------|----|----|-----|
| Créer | `pvcreate` | `vgcreate` | `lvcreate` |
| Lister | `pvs` / `pvdisplay` | `vgs` / `vgdisplay` | `lvs` / `lvdisplay` |
| Étendre | — | `vgextend` | `lvextend` |
| Réduire | — | `vgreduce` | `lvreduce` |
| Supprimer | `pvremove` | `vgremove` | `lvremove` |
