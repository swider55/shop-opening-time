const fs = require("fs");
const cron = require("node-cron");
const dotenv = require("dotenv");
const helpers = require("./helpers")
dotenv.config();
const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);
const users = JSON.parse(process.env.USERS);

const SCHEDULE_WITHOUT_SUNDAY_AT_9_10_AM = "10 9 * * 1,2,3,4,5,6";
const EVERY_SUNDAY_AT_12_AM = "0 12 * * 0";

cron.schedule(SCHEDULE_WITHOUT_SUNDAY_AT_9_10_AM, function () {
    run();
});

cron.schedule(EVERY_SUNDAY_AT_12_AM, () => {
    sendSms('Test sms from shop-opening-time', process.env.ADMIN_NUMBER);
});

function run() {
    const now = new Date();
    const key =
        now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear();
    helpers.log("Check jsonLog");
    if (!fs.existsSync(process.env.JSON_LOG_PATH)) {
        sendSms('UWAGA! Nie ma pliku jsonLog. Skontaktuj sie z administratorem', process.env.BOSS_NUMBER);
        return;
    }

    const jsonLog = helpers.openJSONFile(process.env.JSON_LOG_PATH);
    let userWhichNotInLog = [];

    for (const [user, value] of Object.entries(users)) {
        if (!(key in jsonLog) || !jsonLog[key].includes(user)) {
            userWhichNotInLog.push(user);
        }
    }
    if (userWhichNotInLog.length !== 0) {
        helpers.log("I will send sms");
        sendSms("UWAGA! Te sklepy nie daly znac dzisiaj o sobie: " +
            userWhichNotInLog.join(",") +
            ". Sprawdz co sie stalo", process.env.BOSS_NUMBER);
    }
}


function sendSms(message, receiveNumber) {
  client.messages
    .create({
      body:
        message,
      messagingServiceSid: process.env.MESSAGING_SERVICE_SID,
      to: receiveNumber,
    })
    .then((message) => helpers.log(message.sid))
    .catch((error) => {
      helpers.log("Can not send sms. I will try again in 5 minutes");
      helpers.log(error);
      setTimeout(function () {
        sendSms(message);
      }, 300000);
    })
    .done();
}

