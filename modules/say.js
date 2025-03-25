
async function say({sock, msg}, msg1) {
    await sock.sendMessage(msg.key.remoteJid, { text: msg1 });
}


async function say2({sock, msg}, msg1, msg2) {
    await sock.sendMessage(msg.key.remoteJid, { text: `msg 1: ${msg1}, msg 2: ${msg2}` });
}

module.exports = {
    say,
    say2
}