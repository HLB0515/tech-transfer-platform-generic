#!/bin/zsh
cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  osascript -e 'display dialog "未检测到 Node.js。请先安装 Node.js 20 或以上版本：https://nodejs.org/" buttons {"知道了"} default button 1'
  exit 1
fi

PORT_PID=$(lsof -ti tcp:3000 | head -n 1)
if [ -z "$PORT_PID" ]; then
  nohup node server.js > /tmp/tech-transfer-platform-demo.log 2>&1 &
  sleep 1
fi

open "http://127.0.0.1:3000/"
