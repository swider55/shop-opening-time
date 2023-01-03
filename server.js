const https = require("https");
const auth = require("basic-auth");
const fs = require("fs");
const filePath = "./jsonLog";
const dotenv = require("dotenv");
dotenv.config();
const options = {
  key: process.env.KEY,
  cert: process.env.CERT,
};
const users = JSON.parse(process.env.USERS);

const server = https.createServer(options, (req, res) => {
  const credentials = auth(req);
  if (
    !credentials ||
    !isLoginAndPasswordProper(credentials.name, credentials.pass)
  ) {
    res.statusCode = 401;
    res.setHeader("WWW-Authenticate", 'Basic realm="save"');
    res.end("Access denied");
  } else {
    //todo:: sprawdzic co sie stanie jak bedzie probowal stworzyc plik tam gdzie nie moze z powodu uprawnien,
    // albo w ogole sprobowac wyjebac jakos działanie pliku
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
