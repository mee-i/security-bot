const fs = require("fs");

const ReadConfig = async () => {
  const config = fs.readFileSync("./config.json");
  return JSON.parse(config);
};

const WriteConfig = async (data) => {
  fs.writeFileSync("./config.json", JSON.stringify(data, null, 2));
}

const ReadLinkDB = async () => {
  const config = fs.readFileSync("./database/link-data.json");
  return JSON.parse(config);
};

const WriteLinkDB = async (data) => {
  fs.writeFileSync("./database/link-data.json", JSON.stringify(data, null, 2));
}

module.exports = {
  LinkDB: {
    ReadLinkDB,
    Set: async (key, value) => {
      const data = await ReadLinkDB();
      data[key] = value;
      WriteLinkDB(data);
    },
    Delete: async (key) => {
      const data = await ReadLinkDB();
      delete data[key];
      WriteLinkDB(data);
    },
    Get: async (key) => {
      const data = await ReadLinkDB();
      return data[key];
    }
  },
  Config: {
    ReadConfig,
    Set: async (key, value) => {
      const data = await ReadConfig();
      data[key] = value;
      WriteConfig(data);
    },
    Delete: async (key) => {
      const data = await ReadConfig();
      delete data[key];
      WriteConfig(data);
    },
    Get: async (key) => {
      const data = await ReadConfig();
      return data[key];
    }
  },
};