# WhatsApp Bot Link Log
A simple logging link when detecting message with link
---

## Features

- Separate Link and Group Link
- Control Command
- Enable/Disable Bot
---

## TODO
- [ ] Auto Join Group
- [ ] Auto Log When Join Group
- [x] Implement SQL Auth
- [x] Add owner only to specifiec commands

## MySQL Installation
See [MySQL For Baileys](https://github.com/bobslavtriev/mysql-baileys)
1. Create table in MySQL (optional)
   ```sql
      CREATE TABLE `auth` (
      `session` varchar(50) NOT NULL,
      `id` varchar(100) NOT NULL,
      `value` json DEFAULT NULL,
      UNIQUE KEY `idxunique` (`session`,`id`),
      KEY `idxsession` (`session`),
      KEY `idxid` (`id`)
   ) ENGINE=MyISAM
   ```
2. Setup your database in index.js
   ```js
   const { state, saveCreds, removeCreds } = await useMySQLAuthState({
		session: sessionName,
		host: 'localhost',
		port: 3306,
		user: 'root',
      // password: 'password',
		database: 'bot',
		table: 'auth',
   });
   ```
## Installation

1. Install Bun, Git:

   ```bash
   sudo apt install git
   curl -fsSL https://bun.sh/install | bash # for macOS, Linux, and WSL
   ```
2. Clone Repository:
   ```bash
   git clone https://github.com/mee-i/whatsapp-bot
   ```
3. Open Whatsapp-Bot-JS Folder:
   ```bash
   cd whatsapp-bot
   ```
4. Install Library Using npm
   ```bash
   bun install
   ```
5. Run Whatsapp bot
   ```bash
   bun run .
   ```
6. Scan QR Code In Terminal
