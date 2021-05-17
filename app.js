const Discord = require('discord.js');
const WOKCommands = require('wokcommands');
require('dotenv').config();
const db = require('./util/db');

const client = new Discord.Client({
    partials: ['MESSAGE', 'REACTION'],
});

client.on('ready', async () => {
  await db();

  const cmds =client().commands.get();
  console.log(cmds);

  new WOKCommands(client, { 
    commandsDir: './commands',
    showWarnings: false,
  });

  console.log('RavenBot is ready!');
});

client.login(process.env.BOT_TOKEN);