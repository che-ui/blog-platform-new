# 捕获git push的完整输出
Write-Host "正在执行git push命令..."
$output = & git push origin master --verbose 2>&1
Write-Host "命令输出:"
$output
Write-Host "命令退出码: $LASTEXITCODE"
