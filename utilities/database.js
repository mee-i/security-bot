const fs = require("fs");

const ReadConfig = async () => {
  const config = fs.readFileSync("./config.json");
  return JSON.parse(config);
};

module.exports = {
  Config: {
    ReadConfig,
    Modify: async (key, value) => {
      const data = await ReadConfig();
      data[key] = value;
      fs.writeFileSync("./config.json", JSON.stringify(data, null, 2));
    }
  },
};