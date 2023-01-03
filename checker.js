const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);
const users = JSON.parse(process.env.USERS);
const now = new Date();
const key =
  now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear();
const jsonLog = openJSONFile(process.env.JSON_LOG_PATH);

let userWhichNotInLog = [];

for (const [user, value] of Object.entries(users)) {
  if (!jsonLog[key].includes(user)) {
    userWhichNotInLog.push(user);
  }
}

if (userWhichNotInLog.length !== 0) {
  sendSms(userWhichNotInLog.join(","));
}

function openJSONFile(filePath) {
  const jsonString = fs.readFileSync(filePath);
  return JSON.parse(jsonString);
}

function sendSms(message) {
  //todo:: sprobowac wywołać bład i zobaczyć, czy pokaze sie w logach i czy znów spróbuje wysłać
  client.messages
    .create({
      body:
        "UWAGA! Te sklepy nie daly znac dzisiaj o sobie: " +
        message +
        ". Sprawdz co się stalo",
      messagingServiceSid: process.env.MESSAGING_SERVICE_SID,
      to: "+48663270503",
    })
    .then((message) => console.log(message.sid))
    .done();
}
