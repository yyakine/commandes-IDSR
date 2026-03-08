# Sauvegarde et restauration

## Sauvegarde de la configuration

=== "TFTP"

    ```text
    Router# copy running-config tftp:
    ! Address or name of remote host []? 192.168.5.12
    ! Destination filename [Router-confg]? running-config-backup.txt

    Router# copy startup-config tftp:
    ! Address or name of remote host []? 192.168.5.12
    ! Destination filename [Router-confg]? startup-config-backup.txt
    ```

=== "USB"

    ```text
    Switch# copy running-config usbflash0:
    Switch# copy startup-config usbflash0:
    ```

## Restauration de la configuration

=== "TFTP"

    ```text
    Switch# copy tftp: running-config
    ! Address or name of remote host []? 192.168.5.12
    ! Source filename []? backup-running-config.txt

    Switch# copy running-config startup-config
    ```

=== "USB"

    ```text
    Switch# copy usbflash0:/backup-running-config.txt running-config
    Switch# copy usbflash0:/backup-startup-config.txt startup-config
    ```

## Sauvegarde de l'image IOS

=== "TFTP"

    ```text
    Switch# copy flash0:/c2960-lanbase-mz.150-2.SE11.bin tftp://192.168.1.100/c2960-backup.bin
    Switch# copy flash0: tftp:
    ```

=== "USB"

    ```text
    Switch# copy flash0:/c2960-lanbase-mz.150-2.SE11.bin usbflash0:/c2960-backup.bin
    Switch# copy flash0: usbflash0:
    ```

## Restauration de l'image IOS

=== "TFTP"

    ```text
    Switch# copy tftp: flash0:
    ! Address or name of remote host []? 192.168.1.100
    ! Source filename []? c2960-backup.bin
    ! Destination filename []? c2960-lanbase-mz.150-2.SE11.bin
    ```

=== "USB"

    ```text
    Switch# copy usbflash0: flash0:
    ! Source filename []? c2960-backup.bin
    ! Destination filename []? c2960-lanbase-mz.150-2.SE11.bin
    ```

## Boot system

```text
! Configurer le boot avec fallback
Switch(config)# boot system flash0:c2960-lanbase-mz.150-2.SE11.bin
Switch(config)# boot system flash0:c2960-backup.bin
Switch(config)# boot system flash0:

! Désactiver le boot automatique (ROM Monitor au redémarrage)
Switch(config)# no boot system

! Vérification
Switch# show boot
Switch# show boot system
Switch# show version
Switch# reload
```

!!! tip "Bonnes pratiques"
    - Toujours sauvegarder la config avant toute modification majeure : `copy running-config tftp:`
    - Configurer un boot de fallback pour éviter un switch inaccessible après une mauvaise image
    - Après restauration, vérifier avec `show running-config` puis sauvegarder avec `copy run start`
