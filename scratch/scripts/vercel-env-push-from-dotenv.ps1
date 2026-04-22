# Push Vercel Production env vars from a dotenv file (no prompts).
# Uses `.env.production` if it exists, otherwise `.env`.
# Skips empty values, skips local SQLite DATABASE_URL, skips comments.
#
# Create `scratch/.env.production` with your Supabase + Clerk + Stripe values, then:
#   powershell -ExecutionPolicy Bypass -File scripts\vercel-env-push-from-dotenv.ps1

$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

$source = if (Test-Path ".env.production") { ".env.production" } elseif (Test-Path ".env") { ".env" } else {
  throw "No .env.production or .env found in scratch/"
}

function Add-VercelEnv {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string]$Value,
    [switch]$Sensitive
  )
  if ([string]::IsNullOrWhiteSpace($Value)) { return $false }
  $args = @("env", "add", $Name, "production", "--value", $Value, "--yes", "--force")
  if ($Sensitive) { $args += "--sensitive" } else { $args += "--no-sensitive" }
  Write-Host "Pushing $Name ..." -ForegroundColor Cyan
  & npx vercel @args
  if ($LASTEXITCODE -ne 0) { throw "vercel env add $Name failed" }
  return $true
}

$lines = Get-Content $source -ErrorAction Stop
$map = @{}
foreach ($line in $lines) {
  $t = $line.Trim()
  if ($t.Length -eq 0 -or $t.StartsWith("#")) { continue }
  if ($t -notmatch '^\s*([^#=]+)=(.*)$') { continue }
  $k = $matches[1].Trim()
  $v = $matches[2].Trim()
  if (($v.StartsWith('"') -and $v.EndsWith('"')) -or ($v.StartsWith("'") -and $v.EndsWith("'"))) {
    $v = $v.Substring(1, $v.Length - 2)
  }
  $map[$k] = $v
}

Write-Host "Source file: $source" -ForegroundColor Green
$pushed = 0

if ($map.ContainsKey("DATABASE_URL")) {
  $db = $map["DATABASE_URL"]
  if ($db -match '^(postgres|postgresql)://') {
    if (Add-VercelEnv -Name "DATABASE_URL" -Value $db -Sensitive) { $pushed++ }
  } else {
    Write-Host "Skipping DATABASE_URL (not Postgres; put Supabase pooled URI in .env.production)." -ForegroundColor Yellow
  }
}

$publicKeys = @(
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_SIGN_UP_URL",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
)
foreach ($k in $publicKeys) {
  if ($map.ContainsKey($k) -and $map[$k]) {
    if ($k -eq "NEXT_PUBLIC_APP_URL" -and $map[$k] -match "localhost") {
      Write-Host "Skipping NEXT_PUBLIC_APP_URL (localhost; keep Vercel production URL)." -ForegroundColor Yellow
      continue
    }
    if (Add-VercelEnv -Name $k -Value $map[$k]) { $pushed++ }
  }
}

$secretKeys = @(
  "CLERK_SECRET_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "POST_PURCHASE_WEBHOOK_URL"
)
foreach ($k in $secretKeys) {
  if ($map.ContainsKey($k) -and $map[$k]) {
    if ($k -eq "POST_PURCHASE_WEBHOOK_URL") {
      if (Add-VercelEnv -Name $k -Value $map[$k]) { $pushed++ }
    } else {
      if (Add-VercelEnv -Name $k -Value $map[$k] -Sensitive) { $pushed++ }
    }
  }
}

Write-Host "`nPushed $pushed variable(s). If zero, fill scratch/.env.production then re-run." -ForegroundColor $(if ($pushed -gt 0) { "Green" } else { "Yellow" })
Write-Host "Redeploy: npx vercel deploy --prod --yes" -ForegroundColor Cyan
