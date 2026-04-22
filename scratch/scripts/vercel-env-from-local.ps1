# Push production secrets from your machine to the linked Vercel project.
#
# From monorepo root (folder that contains `scratch/`):
#   powershell -ExecutionPolicy Bypass -File scratch\scripts\vercel-env-from-local.ps1
#
# From inside `scratch/` (your case):
#   powershell -ExecutionPolicy Bypass -File scripts\vercel-env-from-local.ps1
#
# Requires: Vercel CLI (`npx vercel login`) and this app linked (`.vercel` in `scratch/`).

$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

function Add-VercelEnv {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string]$Value,
    [switch]$Sensitive
  )
  if ([string]::IsNullOrWhiteSpace($Value)) {
    Write-Host "Skipping $Name (empty)." -ForegroundColor Yellow
    return
  }
  $args = @("env", "add", $Name, "production", "--value", $Value, "--yes", "--force")
  if ($Sensitive) { $args += "--sensitive" } else { $args += "--no-sensitive" }
  & npx vercel @args
  if ($LASTEXITCODE -ne 0) { throw "vercel env add $Name failed" }
}

Write-Host "=== Vercel production secrets ===" -ForegroundColor Cyan
Write-Host "Paste values when prompted. Leave blank to skip a variable.`n"

$db = Read-Host "DATABASE_URL (Supabase pooled postgres URI)"
$clerkPk = Read-Host "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
$clerk = Read-Host "CLERK_SECRET_KEY"
$stripe = Read-Host "STRIPE_SECRET_KEY"
$whsec = Read-Host "STRIPE_WEBHOOK_SECRET"
$post = Read-Host "POST_PURCHASE_WEBHOOK_URL (optional)"

Add-VercelEnv -Name "DATABASE_URL" -Value $db -Sensitive
Add-VercelEnv -Name "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" -Value $clerkPk
Add-VercelEnv -Name "CLERK_SECRET_KEY" -Value $clerk -Sensitive
Add-VercelEnv -Name "STRIPE_SECRET_KEY" -Value $stripe -Sensitive
Add-VercelEnv -Name "STRIPE_WEBHOOK_SECRET" -Value $whsec -Sensitive
Add-VercelEnv -Name "POST_PURCHASE_WEBHOOK_URL" -Value $post

Write-Host "`nDone. Redeploy:  npx vercel deploy --prod --yes" -ForegroundColor Green
Write-Host "Then open:  https://<your-production-domain>/api/ready" -ForegroundColor Green
