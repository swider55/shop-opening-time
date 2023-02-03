This program registers connection from clients and later, on schedule time in scheduleChecker.js, checks if every client gave know about self. If not, scheduleChecker.js sends SMS

## ON SERVER SIDE

Copy all files, and type\
```npm install```

create .env file with
```
CERT - cert SSL. Can create own, more info below
KEY - key SSL. Can create own, more info below
USERS - users which will contact with server in format {"login":"password"}
ACCOUNT_SID - need to get from twilio.com
AUTH_TOKEN - need to get from twilio.com
MESSAGING_SERVICE_SID - need to get from twilio.com
JSON_LOG_PATH - path/to/log
```
If you dont want to buy SSL, you can create own by:
```
openssl genrsa -out key.pem 2048
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 36500 -in csr.pem -signkey key.pem -out cert.pem
```
to set time zone type (for Poland):\
```sudo timedatectl set-timezone Europe/Warsaw```

To run project you can use 'node'
```
node path/to/server.js
node path/to/checker.js
```
or 'pm2'
```
npm install pm2 -g
pm2 start path/to/server.js
pm2 start path/to/checker.js
```
logs for pm2 are in\
```.../.pm2/logs```\
to start automatically all process, after reboot system type
```
pm2 startup
pm2 save
```

## CLIENT SIDE (WITH WINDOWS)
In windowsClient.go, change\
```req.SetBasicAuth("username", "password")```\
next type\
```GOOS=windows GOARCH=amd64 go build -o bin/windowsClient.exe windowsClient.go```\
in order to create .exe file for Windows. After that, send created file to computer with Windows\
On machine with Windows press 'Windows logo key  + R', and type\
```shell:startup```\
Past created earlier file to opened folder\