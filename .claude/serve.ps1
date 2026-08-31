param([int]$Port = 3000, [string]$Root = ".")

$ErrorActionPreference = "Stop"
$root = (Resolve-Path $Root).Path

$mime = @{
  ".html"="text/html; charset=utf-8"; ".htm"="text/html; charset=utf-8";
  ".css"="text/css; charset=utf-8"; ".js"="text/javascript; charset=utf-8";
  ".mjs"="text/javascript; charset=utf-8"; ".json"="application/json; charset=utf-8";
  ".svg"="image/svg+xml"; ".png"="image/png"; ".jpg"="image/jpeg"; ".jpeg"="image/jpeg";
  ".gif"="image/gif"; ".ico"="image/x-icon"; ".webp"="image/webp";
  ".woff"="font/woff"; ".woff2"="font/woff2"; ".ttf"="font/ttf";
  ".txt"="text/plain; charset=utf-8"; ".map"="application/json; charset=utf-8";
  ".webmanifest"="application/manifest+json"; ".xml"="application/xml; charset=utf-8"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()
Write-Host "Static server on http://localhost:$Port/  (root: $root)"

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    $res.Headers["Cache-Control"] = "no-cache"

    $rel = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart('/')
    if ($rel -eq "" -or $rel.EndsWith("/")) { $rel = $rel + "index.html" }
    $path = Join-Path $root $rel
    if (Test-Path $path -PathType Container) { $path = Join-Path $path "index.html" }

    if (Test-Path $path -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($path).ToLowerInvariant()
      if ($mime.ContainsKey($ext)) { $res.ContentType = $mime[$ext] }
      $bytes = [System.IO.File]::ReadAllBytes($path)
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $res.StatusCode = 404
      $nf = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: /$rel")
      $res.OutputStream.Write($nf, 0, $nf.Length)
    }
    $res.OutputStream.Close()
  } catch {
    try { $ctx.Response.Abort() } catch {}
  }
}
