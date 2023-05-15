const https = require("https");
const auth = require("basic-auth");
const dotenv = require("dotenv");
const helpers = require("./helpers");
dotenv.config();
const options = {
  key: process.env.KEY,
  cert: process.env.CERT,
};
const users = JSON.parse(process.env.USERS);

helpers.log("Start server");
const server = https.createServer(options, (req, res) => {
  const credentials = auth(req);
  const now = new Date();
  helpers.log(
    "New connect from " +
      req.connection.remoteAddress +
      " with credential " +
      JSON.stringify(credentials)
  );
  if (
    !credentials ||
    !isLoginAndPasswordProper(credentials.name, credentials.pass)
  ) {
    helpers.log("Wrong credentials");
    res.statusCode = 401;
    res.setHeader("WWW-Authenticate", 'Basic realm="save"');
    res.end("Access denied");
  } else {
    helpers.createFileIfNotExists(process.env.JSON_LOG_PATH);
    let jsonLog = openJSONFile(process.env.JSON_LOG_PATH);

    const key =
      now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear();
    if (key in jsonLog) {
      jsonLog[key].push(credentials.name);
    } else {
      jsonLog[key] = [credentials.name];
    }
    helpers.saveJSONtoFile(jsonLog, process.env.JSON_LOG_PATH);
    helpers.log("Saved to jsonLog");
    res.writeHead(200);
    res.end("Saved");
  }
});
server.listen(443);

function isLoginAndPasswordProper(login, password) {
  return login in users && users[login] === password;
}
