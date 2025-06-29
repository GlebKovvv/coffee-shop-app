# pack.ps1 — собирает дампы файлов с маркерами начала/конца каждого файла
# Запускать из корня проекта:  .\pack.ps1

function Append-File {
    param(
        [string]$InputPath,
        [string]$OutputPath
    )

    # вычисляем относительный путь к файлу
    $base = (Get-Location).Path + '\'
    $rel  = $InputPath.Replace($base, '')

    # маркер начала
    "----- Begin $rel -----" | Add-Content -Path $OutputPath -Encoding UTF8

    # содержимое файла
    Get-Content -Path $InputPath -Encoding UTF8 | Add-Content -Path $OutputPath -Encoding UTF8

    # маркер конца и пустая строка
    "----- End   $rel -----`r`n" | Add-Content -Path $OutputPath -Encoding UTF8
}

# 1) src/routes → routes_dump.txt
$routesOut = "routes_dump.txt"
if (Test-Path $routesOut) { Remove-Item $routesOut }
Get-ChildItem -Path ".\src\routes" -Filter "*.js" -Recurse |
  Sort-Object FullName |
  ForEach-Object { Append-File $_.FullName $routesOut }

# 2) src/controllers → controllers_dump.txt
$ctrlOut = "controllers_dump.txt"
if (Test-Path $ctrlOut) { Remove-Item $ctrlOut }
Get-ChildItem -Path ".\src\controllers" -Filter "*.js" -Recurse |
  Sort-Object FullName |
  ForEach-Object { Append-File $_.FullName $ctrlOut }

# 3) public/**/*.{js,css,html} → public_dump.txt
$pubOut = "public_dump.txt"
if (Test-Path $pubOut) { Remove-Item $pubOut }
Get-ChildItem -Path ".\public" -Include "*.js","*.css","*.html" -Recurse |
  Sort-Object FullName |
  ForEach-Object { Append-File $_.FullName $pubOut }

# 4) src/models → models_dump.txt
$modelsOut = "models_dump.txt"
if (Test-Path $modelsOut) { Remove-Item $modelsOut }
Get-ChildItem -Path ".\src\models" -Filter "*.js" -Recurse |
  Sort-Object FullName |
  ForEach-Object { Append-File $_.FullName $modelsOut }

Write-Host "✅ Dumps created: routes_dump.txt, controllers_dump.txt, public_dump.txt, models_dump.txt"
