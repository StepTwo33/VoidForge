# Publish design/ui-pass onto dev and deploy it on the .50 box.
# From the repo root in PowerShell:
#   .\scripts\ship.ps1
#
# Windows' `bash` is WSL and does not have the GitHub credentials this repo uses.
# Git Bash does.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$gitBash = "C:\Program Files\Git\bin\bash.exe"
if (-not (Test-Path $gitBash)) {
  Write-Error "Git Bash not found at $gitBash. Install Git for Windows, then run this again."
}

& $gitBash "scripts/deploy.sh" "ship"
exit $LASTEXITCODE
