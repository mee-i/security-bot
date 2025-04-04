const { LinkDetection } = require('../config.js');
const { LinkDB } = require('../utilities/database.js');
module.exports = {
    detect_link: async ({sock, msg, text, isGroup}) => {
        const urlRegex = /\b((\w+):\/\/[^\s]+|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/\S*)?)\b/g;
        const links = text.match(urlRegex);
        const realRemoteJid = isGroup ? msg?.key?.participant : msg?.key?.remoteJid;
        const groupMetadata = isGroup ? await sock.groupMetadata(msg.key.remoteJid) : null;
        const groupName = isGroup ? groupMetadata.subject : null;
        let GroupList = await LinkDB.Get("GroupList") || [];
        let LinkList = await LinkDB.Get("LinkList") || [];
        if (links) {
            for (const link of links) {
                if (link.includes('chat.whatsapp.com')) {
                    if (GroupList.includes(link)) {
                        continue;
                    }
                    GroupList.push(link);
                    await LinkDB.Set("GroupList", GroupList);
                    await sock.sendMessage(`${LinkDetection.GroupLogs}`, { 
                        text: `[${isGroup ? msg.key.remoteJid : "PC"}][${groupName}][${realRemoteJid}][${msg?.pushName}]\n📢 Group link detected! ⚠️\n*${link}*` 
                    });
                } else if (!LinkDetection.exception.some(domain => link.includes(domain))) {
                    if (LinkList.includes(link)) {
                        continue;
                    }
                    LinkList.push(link);
                    await LinkDB.Set("LinkList", LinkList);
                    await sock.sendMessage(`${LinkDetection.LinkLogs}`, { 
                        text: `[${isGroup ? msg.key.remoteJid : "PC"}][${groupName}][${realRemoteJid}][${msg?.pushName}]\n📢 Link detected! ⚠️\n*${link}*` 
                    });
                }
            }
        }
    }
}