const https = require('https');
const http = require('http');
const auth = require('basic-auth');
const fs = require('fs');
const { users } = require('./users.js');

const filePath = './json'
const options = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
};





const server = https.createServer(options, (req, res) => {
    const credentials = auth(req);
    if (!credentials || ifLoginAndPasswordProper(credentials.name, credentials.pass)) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="save"');
        res.end('Access denied');
    } else {
        const now = new Date();
        createFileIfNotExists(filePath);
        let json = openJSONFile(filePath);

        const key = now.getDate() +'.'+ (now.getMonth() + 1) +'.'+ now.getFullYear();
        if (key in json) {
            json[key].push({login : now.getHours() +':'+now.getMinutes()});
        } else {
            json[key] = [{login : now.getHours() +':'+now.getMinutes()}];
        }
        saveJSONtoFile(json, filePath);
        res.writeHead(200);
        res.end('Saved');
    }
});
server.listen(8000);

function createFileIfNotExists(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({}));
    }
}

function openJSONFile(filePath) {
    const jsonString = fs.readFileSync(filePath);
    return JSON.parse(jsonString);
}

function saveJSONtoFile(jsonObject, filePath) {
    const jsonString = JSON.stringify(jsonObject);
    fs.writeFileSync(filePath, jsonString);
}

function ifLoginAndPasswordProper(login, password) {
    return login in users && users[login] === password;
}

