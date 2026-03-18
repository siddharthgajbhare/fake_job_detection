# Check if Docker is running
$dockerRunning = Get-Process docker -ErrorAction SilentlyContinue
if ($dockerRunning) {
    Write-Host "Docker is running." -ForegroundColor Green
    docker-compose up --build
} else {
    Write-Host "Docker is NOT running. Please start Docker Desktop." -ForegroundColor Red
    Write-Host "Alternatively, you can run the backend and frontend locally, but you will need a running MongoDB instance." -ForegroundColor Yellow
}
