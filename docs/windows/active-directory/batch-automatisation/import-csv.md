# Import-CSV (PowerShell)

`Import-CSV` est la méthode PowerShell native pour créer des objets Active Directory en masse à partir d'un fichier CSV. Contrairement à CSVDE, elle permet de **définir les mots de passe** et d'exécuter toute la logique PowerShell pendant l'import.

## Structure du fichier CSV

```csv
Name,SamAccountName,UPN,GivenName,Surname,DisplayName,Email,Title,Department,Company,Office,Path
John Doe,jdoe,jdoe@ofppt.local,John,Doe,Doe John,jdoe@ofppt.local,Developer,IT,OFPPT,Casablanca,"OU=IT,DC=ofppt,DC=local"
Jane Smith,jsmith,jsmith@ofppt.local,Jane,Smith,Smith Jane,jsmith@ofppt.local,Analyst,RH,OFPPT,Rabat,"OU=RH,DC=ofppt,DC=local"
Ali Hamdi,ahamdi,ahamdi@ofppt.local,Ali,Hamdi,Hamdi Ali,ahamdi@ofppt.local,Stagiaire,IT,OFPPT,Casablanca,"OU=IT,DC=ofppt,DC=local"
```

## Import basique

```powershell
$DefaultPassword = ConvertTo-SecureString "TempPass123!" -AsPlainText -Force

Import-Csv "C:\users.csv" | ForEach-Object {
    New-ADUser `
        -Name            $_.Name `
        -SamAccountName  $_.SamAccountName `
        -UserPrincipalName $_.UPN `
        -GivenName       $_.GivenName `
        -Surname         $_.Surname `
        -DisplayName     $_.DisplayName `
        -EmailAddress    $_.Email `
        -Title           $_.Title `
        -Department      $_.Department `
        -Company         $_.Company `
        -Office          $_.Office `
        -Path            $_.Path `
        -AccountPassword $DefaultPassword `
        -Enabled         $true `
        -ChangePasswordAtLogon $true
}
```

## Export vers CSV

```powershell
# Exporter tous les utilisateurs d'une OU vers un CSV
Get-ADUser -Filter * `
    -SearchBase "OU=IT,DC=ofppt,DC=local" `
    -Properties DisplayName, EmailAddress, Department, Title |
    Select-Object Name, SamAccountName, UserPrincipalName,
                  DisplayName, EmailAddress, Department, Title |
    Export-Csv "C:\Export_IT.csv" -NoTypeInformation -Encoding UTF8
```

!!! tip "Bonnes pratiques"
    - Toujours tester avec `-WhatIf` ou sur un environnement de test avant un import en production
    - Générer un fichier de log horodaté à chaque exécution
    - Préférer `Import-CSV` à CSVDE pour les imports qui nécessitent des mots de passe ou de la logique conditionnelle
