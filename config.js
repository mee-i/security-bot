const Config = {
  BotName: "MeeI Security Bot",
  Owner: process.env.OWNER_PHONE_NUMBER,
  Admin: [],
  CurrentNumber: process.env.CURRENT_PHONE_NUMBER,

  ReadMessage: true,
};

const LinkDetection = {
  exception: ["tiktok.com", "youtube.com"],
  urlRegex: /(https?:\/\/[^\s]+)/g,
  LinkLogs: `${Config.Owner}@whatsapp.net`, // Set a link log using /setlinklog
  GroupLogs: `${Config.Owner}@whatsapp.net`, // Set a group log using /setgrouplog
}

const FunctionCommand = {};
const AutoFunction = {};
const FunctionDetails = {};
const MenuList = {};

module.exports = {
  Config,
  FunctionCommand,
  AutoFunction,
  FunctionDetails,
  MenuList,
  LinkDetection
};
