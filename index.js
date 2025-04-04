
const {
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} = require("baileys");
const makeWASocket = require("baileys").default;
const figlet = require("figlet");
const { useMySQLAuthState } = require("mysql-baileys");
const NodeCache = require( "node-cache" );
const pino = require('pino')


const WAEvents = require("./core/events.js");
const store = require("./core/memory-store.js");
const colors = require("./utilities/colors.js");
const Terminal = require("./utilities/terminal.js");
const { LoadMenu } = require("./load-menu.js");

store.readFromFile("./baileys_store.json");

setInterval(() => {
  store.writeToFile("./baileys_store.json");
}, 10_000);
const logger = pino(pino.destination('./log'))

async function WhatsappEvent(sessionName = "session") {
  await LoadMenu();
  // const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
	const { error, version } = await fetchLatestBaileysVersion();

  const groupCache = new NodeCache({stdTTL: 3 * 60, useClones: false})

	if (error){
		console.log(`Session: ${sessionName} | No connection, check your internet.`)
		return startSock(sessionName)
	}

	const { state, saveCreds, removeCreds } = await useMySQLAuthState({
		session: sessionName,
		host: 'localhost',
		port: 3306,
		user: 'root',
    // password: 'password',
		database: 'bot',
		table: 'auth',
  });

  const sock = makeWASocket({
    printQRInTerminal: true,
		// shouldSyncHistoryMessage: false,
    syncFullHistory: false,
    auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, logger),
		},
		version: version,
		defaultQueryTimeoutMs: undefined,
    cachedGroupMetadata: async (jid) => groupCache.get(jid),
    // keepAliveIntervalMs: 1000,

    // getMessage: async (key) => await getMessageFromStore(key)
    getMessage: async (key) => await store.loadMessage(key.remoteJid, key.id)
  });

  sock.ev.on('groups.update', async ([event]) => {
    const metadata = await sock.groupMetadata(event.id)
    groupCache.set(event.id, metadata)
  })

  sock.ev.on('group-participants.update', async (event) => {
      const metadata = await sock.groupMetadata(event.id)
      groupCache.set(event.id, metadata)
  })

  store.bind(sock.ev);

  sock.ev.on("chats.set", () => {
    console.log("got chats", store.chats.all());
  });

  sock.ev.on('contacts.upsert', () => {
    console.log('got contacts', Object.values(store.contacts))
  })

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update || {};
    if (qr) {
      console.log(qr);
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log("Reconnecting...");
        await WhatsappEvent(); // Ensure to wait for reconnection
      }
    }
  });

  sock.ev.on("messages.upsert", async (m) => {
    try {
      await WAEvents.MessageEventsHandler(m, sock);
    } catch (e) {
      Terminal.ErrorLog(e);
    }
  });

  sock.ev.on("message.update", (message) => {
    console.log("Received message:", message?.toString());
  });

  sock.ev.on("creds.update", saveCreds);
}

figlet("Security-Bot", (err, data) => {
  if (err) {
    console.error("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(colors.FgGreen + data + colors.Reset);
});

await WhatsappEvent();
