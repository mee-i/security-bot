const fs = require("fs");

module.exports = {
  init: () => {
    const DbFile = "./database/link-data.json";
    if (!fs.existsSync(DbFile))
      fs.writeFileSync(DbFile, JSON.stringify({LinkList: [], GroupList: []}), "utf-8");
  }
}