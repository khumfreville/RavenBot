const Discord = require('discord.js');
const WOKCommands = require('wokcommands');
require('dotenv').config();
const db = require('./util/db');

const client = new Discord.Client({
    partials: ['MESSAGE', 'REACTION'],
});

client.on('ready', async () => {
  // rebuild commands
  /*
    const commands = await client.api.applications(client.user.id).commands.get();
    for (var i = 0; i < commands.length; i++) {
      console.log('Clearing ' + commands[i].name + 'command.');
      client.api.applications(client.user.id).commands(commands[i].id).delete();
    }
  */

  await db();

  new WOKCommands(client, { 
    commandsDir: './commands',
    showWarnings: false,
  });

  console.log('RavenBot is ready!');
});

client.login(process.env.BOT_TOKEN);