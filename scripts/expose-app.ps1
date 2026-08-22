<#
.SYNOPSIS
    Exposes the Mediverse platform (Frontend on port 3000, Backend on port 8085) to the public internet.
.DESCRIPTION
    Provides options to use Cloudflare Quick Tunnels, Localtunnel, Ngrok, or Local Area Network (Wi-Fi) sharing.
#>

param(
    [ValidateSet("devtunnel", "cloudflare", "localtunnel", "ngrok", "lan", "menu")]
    [string]$Provider = "menu",
    [int]$Port = 3000
)

function Show-Banner {
    Clear-Host
    Write-Host "=============================================================" -ForegroundColor Cyan
    Write-Host "       🌐 MEDIVERSE — EXPOSE APPLICATION TO INTERNET 🌐     " -ForegroundColor White -BackgroundColor DarkBlue
    Write-Host "=============================================================" -ForegroundColor Cyan
    Write-Host "Target Service: Frontend UI @ http://localhost:$Port" -ForegroundColor Green
    Write-Host "Target Backend: Spring Boot API @ http://localhost:8085" -ForegroundColor Green
    Write-Host "-------------------------------------------------------------"
}

function Start-Devtunnel {
    Write-Host "`n🚀 Starting Microsoft Dev Tunnel on port $Port (Public Anonymous Access)..." -ForegroundColor Green
    Write-Host "Generating persistent HTTPS URL via devtunnel..." -ForegroundColor Gray
    devtunnel host -p $Port --allow-anonymous
}

function Start-CloudflareTunnel {
    Write-Host "`n🚀 Starting Cloudflare Quick Tunnel (Free HTTPS + WebSockets)..." -ForegroundColor Yellow
    Write-Host "Generating instant public SSL URL..." -ForegroundColor Gray
    npx --yes cloudflared tunnel --url "http://localhost:$Port"
}

function Start-Localtunnel {
    Write-Host "`n🚀 Starting Localtunnel on port $Port..." -ForegroundColor Yellow
    npx localtunnel --port $Port
}

function Start-Ngrok {
    Write-Host "`n🚀 Starting Ngrok on port $Port..." -ForegroundColor Yellow
    Write-Host "Web Request Inspector will be available at http://localhost:4040" -ForegroundColor Gray
    npx @ngrok/ngrok http $Port
}

function Show-LANIP {
    Write-Host "`n📱 Local Network (Wi-Fi) Access:" -ForegroundColor Green
    Write-Host "Make sure your mobile phone or laptop is connected to the same Wi-Fi network.`n" -ForegroundColor Gray

    $ips = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254*" }
    foreach ($ip in $ips) {
        Write-Host "  🔗 http://$($ip.IPAddress):$Port  ($($ip.InterfaceAlias))" -ForegroundColor Cyan
    }
    Write-Host ""
    Read-Host "Press Enter to return to menu..."
    Show-Menu
}

function Show-Menu {
    Show-Banner
    Write-Host "Select a Tunnel / Devtool Provider:`n" -ForegroundColor White
    Write-Host "  [1] Microsoft Dev Tunnels (devtunnel) (Recommended — Official Microsoft Tunnel, Public Access)" -ForegroundColor Green
    Write-Host "  [2] Cloudflare Quick Tunnel (Free HTTPS, WebSockets, No signup)" -ForegroundColor Cyan
    Write-Host "  [3] Localtunnel (Instant zero-install public URL via npx)" -ForegroundColor Blue
    Write-Host "  [4] Ngrok (With web inspector @ http://localhost:4040)" -ForegroundColor Magenta
    Write-Host "  [5] Local Network / Wi-Fi Sharing (Open on phone on same Wi-Fi)" -ForegroundColor Yellow
    Write-Host "  [6] Exit`n" -ForegroundColor Gray

    $choice = Read-Host "Enter choice [1-6] (default 1)"
    switch ($choice.Trim()) {
        "1" { Start-Devtunnel }
        "2" { Start-CloudflareTunnel }
        "3" { Start-Localtunnel }
        "4" { Start-Ngrok }
        "5" { Show-LANIP }
        "6" { Write-Host "Exiting."; exit }
        default { Start-Devtunnel }
    }
}

switch ($Provider) {
    "devtunnel"   { Start-Devtunnel }
    "cloudflare"  { Start-CloudflareTunnel }
    "localtunnel" { Start-Localtunnel }
    "ngrok"       { Start-Ngrok }
    "lan"         { Show-LANIP }
    default       { Show-Menu }
}
