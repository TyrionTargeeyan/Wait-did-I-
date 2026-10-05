$port = 5050
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
} catch {
    Write-Host "Failed to start listener on port ${port}: $_"
    exit 1
}

Write-Host "IRON FORGE Server running at http://localhost:$port"
Write-Host "Serving files from: $PSScriptRoot"
Write-Host "Press Ctrl+C to stop the server."

$mimeTypes = @{
    '.html'  = 'text/html; charset=UTF-8'
    '.htm'   = 'text/html; charset=UTF-8'
    '.css'   = 'text/css; charset=UTF-8'
    '.js'    = 'application/javascript; charset=UTF-8'
    '.json'  = 'application/json; charset=UTF-8'
    '.png'   = 'image/png'
    '.jpg'   = 'image/jpeg'
    '.jpeg'  = 'image/jpeg'
    '.svg'   = 'image/svg+xml'
    '.ico'   = 'image/x-icon'
    '.webp'  = 'image/webp'
    '.woff'  = 'font/woff'
    '.woff2' = 'font/woff2'
    '.ttf'   = 'font/ttf'
}

$baseDir = $PSScriptRoot
if (-not $baseDir) { $baseDir = (Get-Location).Path }

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath)
        if ($urlPath -eq '/' -or [string]::IsNullOrEmpty($urlPath)) {
            $urlPath = '/index.html'
        }

        $relPath = $urlPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $filePath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($baseDir, $relPath))

        if (-not $filePath.StartsWith($baseDir, [System.StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path $filePath -PathType Leaf)) {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.OutputStream.Close()
            continue
        }

        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }

        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $response.StatusCode = 200
        $response.ContentType = $contentType
        $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
        $response.OutputStream.Close()
    } catch {
        # Prevent server termination on client disconnect
    }
}
