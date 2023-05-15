const fs = require("fs");

function openJSONFile(filePath) {
  const jsonString = fs.readFileSync(filePath);
  return JSON.parse(jsonString);
}

function saveJSONtoFile(jsonObject, filePath) {
  const jsonString = JSON.stringify(jsonObject);
  fs.writeFileSync(filePath, jsonString);
}

function createFileIfNotExists(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
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

module.exports = { openJSONFile, saveJSONtoFile, createFileIfNotExists, log };
