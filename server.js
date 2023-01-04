const https = require("https");
const auth = require("basic-auth");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const options = {
  key: process.env.KEY,
  cert: process.env.CERT,
};
const users = JSON.parse(process.env.USERS);
const now = new Date();
log('Start server');
const server = https.createServer(options, (req, res) => {
  const credentials = auth(req);
  log('New connect from ' + req.connection.remoteAddress + ' with credential ' + JSON.stringify(credentials));
  if (
    !credentials ||
    !isLoginAndPasswordProper(credentials.name, credentials.pass)
  ) {
    log('Wrong credentials');
    res.statusCode = 401;
    res.setHeader("WWW-Authenticate", 'Basic realm="save"');
    res.end("Access denied");
  } else {
    createFileIfNotExists(process.env.JSON_LOG_PATH);
    let jsonLog = openJSONFile(process.env.JSON_LOG_PATH);

    const key =
      now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear();
    if (key in jsonLog) {
      jsonLog[key].push(credentials.name);
    } else {
      jsonLog[key] = [credentials.name];
    }
    saveJSONtoFile(jsonLog, process.env.JSON_LOG_PATH);
    log('Saved to jsonLog');
    res.writeHead(200);
    res.end("Saved");
  }
});
server.listen(443);

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

function isLoginAndPasswordProper(login, password) {
  return login in users && users[login] === password;
}

function log(message) {
    const now = new Date();
    const time = now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear() + ' ' + now.getHours() + ':' + now.getMinutes();
    console.log(time + ' - ' +message);
}