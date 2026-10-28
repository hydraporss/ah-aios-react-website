param([switch]$KeepServices)
$ErrorActionPreference = 'Stop'

$frontendRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$backendRoot = (Resolve-Path (Join-Path $frontendRoot '..\hermes-foundation')).Path
$python = Join-Path $backendRoot '.venv\Scripts\python.exe'
$node = 'C:\Users\PORONG\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$tempRoot = Join-Path $frontendRoot ".acceptance-run-$PID"
$apiProcess = $null
$webProcess = $null
$browserProcess = $null
$keepRunning = $false

function Get-FreeLoopbackPort {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
    $listener.Start()
    $port = $listener.LocalEndpoint.Port
    $listener.Stop()
    return $port
}

function Wait-ForHttp($url, $processId) {
    $until = (Get-Date).AddSeconds(30)
    while ((Get-Date) -lt $until) {
        if (-not (Get-Process -Id $processId -ErrorAction SilentlyContinue)) { throw "Server process $processId exited before $url became ready." }
        try {
            $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) { return }
        } catch {}
        Start-Sleep -Milliseconds 250
    }
    throw "Timed out waiting for $url."
}

try {
    New-Item -ItemType Directory -Path $tempRoot | Out-Null
    $sqlitePath = Join-Path $tempRoot 'acceptance.sqlite3'
    $backupPath = Join-Path $tempRoot 'backups'
    $apiPort = Get-FreeLoopbackPort
    $webPort = Get-FreeLoopbackPort
    $env:DJANGO_SECRET_KEY = 'acceptance-only-secret-do-not-deploy'
    $env:DJANGO_DEBUG = 'true'
    $env:DJANGO_ALLOWED_HOSTS = '127.0.0.1,localhost,testserver'
    $env:WORLDFORGE_SQLITE_PATH = $sqlitePath
    $env:WORLDFORGE_BACKUP_DIR = $backupPath
    $env:WORLDFORGE_API_PROXY = "http://127.0.0.1:$apiPort"

    Push-Location $backendRoot
    try {
        & $python manage.py migrate --noinput
        $seed = @'
from django.contrib.auth import get_user_model
from hermes.core.models import World, WorldMembership
U=get_user_model()
creator=U.objects.create_user('creator','creator@example.test','creator-pass')
reviewer=U.objects.create_user('reviewer','reviewer@example.test','reviewer-pass')
authority=U.objects.create_user('authority','authority@example.test','authority-pass')
ops=U.objects.create_superuser('ops','ops@example.test','ops-pass')
world=World.objects.create(title='Acceptance World',creation_prompt='',premise='Seeded for browser acceptance.',canon_state='draft')
WorldMembership.objects.create(world=world,user=creator,role=WorldMembership.Role.CREATOR)
WorldMembership.objects.create(world=world,user=reviewer,role=WorldMembership.Role.REVIEWER)
WorldMembership.objects.create(world=world,user=authority,role=WorldMembership.Role.CANON_AUTHORITY)
'@
        & $python manage.py shell -c $seed
    } finally { Pop-Location }

    $apiOut = Join-Path $tempRoot 'django.out.log'
    $apiErr = Join-Path $tempRoot 'django.err.log'
    $apiProcess = Start-Process -FilePath $python -ArgumentList @('manage.py','runserver',"127.0.0.1:$apiPort",'--noreload') -WorkingDirectory $backendRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput $apiOut -RedirectStandardError $apiErr
    $webOut = Join-Path $tempRoot 'vite.out.log'
    $webErr = Join-Path $tempRoot 'vite.err.log'
    $viteCli = Join-Path $frontendRoot 'node_modules\vite\bin\vite.js'
    $webProcess = Start-Process -FilePath $node -ArgumentList @($viteCli,'--host','127.0.0.1','--port',"$webPort",'--strictPort','--configLoader','runner') -WorkingDirectory $frontendRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput $webOut -RedirectStandardError $webErr
    Wait-ForHttp "http://127.0.0.1:$apiPort/healthz" $apiProcess.Id
    Wait-ForHttp "http://127.0.0.1:$webPort/" $webProcess.Id
    if ($KeepServices) {
        $keepRunning = $true
        Write-Output "Acceptance servers ready: URL=http://127.0.0.1:$webPort; API=http://127.0.0.1:$apiPort; DATA=$tempRoot; API_PID=$($apiProcess.Id); WEB_PID=$($webProcess.Id)"
    } else {
        $browserPort = Get-FreeLoopbackPort
        $browserPath = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
        $browserProfile = Join-Path $tempRoot 'edge-profile'
        $browserOut = Join-Path $tempRoot 'edge.out.log'
        $browserErr = Join-Path $tempRoot 'edge.err.log'
        $browserProcess = Start-Process -FilePath $browserPath -ArgumentList @('--headless=new',"--remote-debugging-port=$browserPort",'--remote-allow-origins=*',"--user-data-dir=$browserProfile",'--no-first-run','about:blank') -WindowStyle Hidden -PassThru -RedirectStandardOutput $browserOut -RedirectStandardError $browserErr
        Wait-ForHttp "http://127.0.0.1:$browserPort/json/version" $browserProcess.Id
        $env:WORLDFORGE_E2E_BASE_URL = "http://127.0.0.1:$webPort"
        $env:WORLDFORGE_E2E_TEMP_DIR = $tempRoot
        $env:WORLDFORGE_CDP_URL = "http://127.0.0.1:$browserPort"
        Push-Location $frontendRoot
        try { & $node 'tests\e2e-governance.mjs'; if ($LASTEXITCODE -ne 0) { throw "Browser acceptance failed with exit code $LASTEXITCODE." } }
        finally { Pop-Location }
    }
} finally {
    if (-not $keepRunning) {
        foreach ($process in @($browserProcess, $webProcess, $apiProcess)) {
            if ($process -and (Get-Process -Id $process.Id -ErrorAction SilentlyContinue)) {
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
            }
        }
        if (Test-Path -LiteralPath $tempRoot) {
            $resolvedTemp = [System.IO.Path]::GetFullPath($tempRoot)
            $allowedPrefix = [System.IO.Path]::GetFullPath($frontendRoot) + [System.IO.Path]::DirectorySeparatorChar
            if (-not $resolvedTemp.StartsWith($allowedPrefix, [System.StringComparison]::OrdinalIgnoreCase)) { throw "Refusing cleanup outside the acceptance workspace: $resolvedTemp" }
            Remove-Item -LiteralPath $resolvedTemp -Recurse -Force
        }
    }
}
