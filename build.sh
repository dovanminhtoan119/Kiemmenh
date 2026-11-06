#!/bin/sh
# Tạo index.html (GitHub Pages) từ app.part.html, gắn mã phiên bản để trình duyệt luôn tải bản mới.
V=$(date -u +%Y%m%d%H%M)
TMP=$(mktemp)
sed -E -e "s#(src|href)=\"((js|css)/[^\"]+)\"#\1=\"\2?v=$V\"#g" -e "s#__VERSION__#$V#" app.part.html > "$TMP"
{
  printf '<!doctype html>\n<html lang="vi">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n'
  cat "$TMP"
  printf '</body>\n</html>\n'
} > index.html
rm -f "$TMP"
echo "$V"
