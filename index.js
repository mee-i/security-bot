import { sleep } from "bun";

const {
  DisconnectReason,
  useMultiFileAuthState,
  single
} = require("baileys");
const makeWASocket = require("baileys").default;

const WAEvents = require("./core/events.js");
const store = require("./core/memory-store.js");

const colors = require("./utilities/colors.js");
const Terminal = require("./utilities/terminal.js");

const figlet = require("figlet");
const { LoadMenu } = require("./load-menu.js");
const NodeCache = require( "node-cache" );


store.readFromFile("./baileys_store.json");

setInterval(() => {
  store.writeToFile("./baileys_store.json");
}, 10_000);
const groupCache = new NodeCache({stdTTL: 5 * 60, useClones: false})

async function WhatsappEvent() {
  await LoadMenu();
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const sock = makeWASocket({
    // can provide additional config here
    printQRInTerminal: true,
		// shouldSyncHistoryMessage: false,
    syncFullHistory: true,
    auth: state,
    cachedGroupMetadata: async (jid) => {
      if (groupCache.has(jid)) {
        return groupCache.get(jid);
      }
      const groupMetadata = await sock.groupMetadata(jid);
      console.log("Getting metadata, sleeping for 1s");
      await sleep(1000);
      groupCache.set(jid, groupMetadata);
      return groupMetadata;
    },
    keepAliveIntervalMs: 60_000,

    // getMessage: async (key) => await getMessageFromStore(key)
    getMessage: async (message) => await store.loadMessage(message.remoteJid, message.id),
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
