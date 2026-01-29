$ErrorActionPreference = "Stop"

Write-Host "=========================================="
Write-Host "   zVote Protocol Deployment (Windows)    "
Write-Host "=========================================="

# Check for Leo
if (-not (Get-Command "leo" -ErrorAction SilentlyContinue)) {
    Write-Error "Error: 'leo' command is not found. Please install Leo (Aleo SDK)."
    exit 1
}

# Change to contract directory
$ContractPath = "..\contracts\zvote_protocol"
if (-not (Test-Path $ContractPath)) {
    # Try existing path relative to script
    $ContractPath = "contracts\zvote_protocol" 
    if (-not (Test-Path $ContractPath)) {
         # absolute path fallback
         $ContractPath = "c:\Users\Brijesh yadav\Zvote aliyo\Zvote protocol project\contracts\zvote_protocol"
    }
}

if (-not (Test-Path $ContractPath)) {
    Write-Error "Error: Contract directory not found!"
    exit 1
}

Push-Location $ContractPath

Write-Host "Deploying zvote_protocol_v15.aleo to Aleo Testnet..."
Write-Host "---------------------------------------------------"
Write-Host "NOTE: You may need to provide your Private Key if not in .env"
Write-Host "---------------------------------------------------"

try {
    # Try deploying to testnetbeta first (newer)
    leo deploy zvote_protocol_v15.aleo --network testnetbeta
} catch {
    Write-Warning "Deployment to testnetbeta failed. Trying testnet (Testnet 3)..."
    try {
        leo deploy zvote_protocol_v15.aleo --network testnet
    } catch {
        Write-Error "Deployment failed on both networks."
        exit 1
    }
}

Write-Host "=========================================="
Write-Host "   DEPLOYMENT SUCCESSFUL!                 "
Write-Host "=========================================="
Write-Host "You can now run the app and vote."
Start-Sleep -Seconds 5
