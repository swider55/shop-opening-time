## .env
CERT - cert SSL\
KEY - key SSL\
USERS - users which will be contact with server in format
```{"login":"password"}```\
ACCOUNT_SID - need to get from twilio.com\
AUTH_TOKEN - need to get from twilio.com\
MESSAGING_SERVICE_SID - need to get from twilio.com\
JSON_LOG_PATH - path/to/log

## SERVER
#### First type
```npm install```
#### If you dont want to buy SSL, you can create own by:
```
openssl genrsa -out key.pem 2048
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 36500 -in csr.pem -signkey key.pem -out cert.pem
```
#### To run project you can use 'node'
```
node path/to/server.js
node path/to/checker.js
```
#### or 'pm2'
```
npm install pm2 -g
pm2 start path/to/server.js
pm2 start path/to/checker.js
```
#### log for pm2 are in
```.../.pm2/logs```
#### to start automatically all process, after reboot system type
```
pm2 startup
pm2 save
```
#### to set polish time zone type:
```sudo timedatectl set-timezone Europe/Warsaw```

## WINDOWS
#### First you need run in PowerShell:
```Get-ExecutionPolicy```
#### if you get 'Restricted', need to run
```Set-ExecutionPolicy RemoteSigned```
#### next type
```schtasks /create /tn "Startup Script" /tr "powershell.exe -file C:\Scripts\MyScript.ps1" /sc onstart /ru System```
#### where 'C:\Scripts\MyScript.ps1' replace with path to 'windowsClient.ps'