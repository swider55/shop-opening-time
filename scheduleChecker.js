const fs = require("fs");
const cron = require("node-cron");
const dotenv = require("dotenv");
dotenv.config();
const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);
const users = JSON.parse(process.env.USERS);

const OWNER_NUMBER ="+48518495816"

const ADMIN_NUMBER ="+48663270503"

cron.schedule("10 9 * * 1,2,3,4,5,6", function () {
    run();
});

cron.schedule('0 12 * * 0', () => {
    sendSms('Test sms from shop-opening-time', ADMIN_NUMBER);
});

function run() {
    const now = new Date();
    const key =
        now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear();
    log("Check jsonLog");
    if (!fs.existsSync(process.env.JSON_LOG_PATH)) {
        sendSms('UWAGA! Nie ma pliku jsonLog. Skontaktuj sie z administratorm', OWNER_NUMBER);
        return;
    }

    const jsonLog = openJSONFile(process.env.JSON_LOG_PATH);
    let userWhichNotInLog = [];

    for (const [user, value] of Object.entries(users)) {
        if (!(key in jsonLog) || !jsonLog[key].includes(user)) {
            userWhichNotInLog.push(user);
        }
    }
    if (userWhichNotInLog.length !== 0) {
        log("I will send sms");
        sendSms("UWAGA! Te sklepy nie daly znac dzisiaj o sobie: " +
            userWhichNotInLog.join(",") +
            ". Sprawdz co sie stalo", OWNER_NUMBER);
    }
}

function openJSONFile(filePath) {
  const jsonString = fs.readFileSync(filePath);
  return JSON.parse(jsonString);
}

function sendSms(message, receiveNumber) {
  client.messages
    .create({
      body:
        message,
      messagingServiceSid: process.env.MESSAGING_SERVICE_SID,
      to: receiveNumber,
    })
    .then((message) => log(message.sid))
    .catch((error) => {
      log("Can not send sms. I will try again in 5 minutes");
      log(error);
      setTimeout(function () {
        sendSms(message);
      }, 300000);
    })
    .done();
}

function log(message) {
  const now = new Date();
  const time =
    now.getDate() +
    "." +
    (now.getMonth() + 1) +
    "." +
    now.getFullYear() +
    " " +
    now.getHours() +
    ":" +
    now.getMinutes();
  console.log(time + " - " + message);
}
