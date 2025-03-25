const { LinkDetection } = require('../config.js');
async function setlinklog({ sock, msg }) {
    const remoteJid = msg?.key?.remoteJid;
    LinkDetection.LinkLogs = remoteJid;
    await sock.sendMessage(remoteJid, { text: `Link report has been set to this chat!` });
}

async function getlinklog({sock, msg}) {
    await sock.sendMessage(msg.key.remoteJid, { text: `Link report is set to: ${LinkDetection.LinkLogs}` });
}

async function setgrouplog({ sock, msg }) {
    const remoteJid = msg?.key?.remoteJid;
    LinkDetection.GroupLogs = remoteJid;
    await sock.sendMessage(remoteJid, { text: `Group report has been set to this chat!` });
}

async function getgrouplog({sock, msg}) {
    await sock.sendMessage(msg.key.remoteJid, { text: `Group report is set to: ${LinkDetection.GroupLogs}` });
}

module.exports = {
    setlinklog,
    getlinklog,
    setgrouplog,
    getgrouplog
}