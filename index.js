const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({ 
  intents: [ 
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMembers 
  ] 
});
client.commands = new Collection();

// Change le chemin d'accès aux fichiers de commandes
const commandFiles = fs.readdirSync('/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('messageCreate', message => {
  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (client.commands.has(command)) {
    try {
      client.commands.get(command).execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('There was an error executing that command!');
    }
  }
});

client.on('guildMemberAdd', member => {
  // Recherche des salons contenant les mots "general" ou "chat"
  const welcomeChannel = member.guild.channels.cache.find(ch => 
    ch.name.toLowerCase().includes('general') || 
    ch.name.toLowerCase().includes('chat')
  );

  if (welcomeChannel) {
    welcomeChannel.send(`Welcome to the server, ${member}!`);
  }
});

client.login(process.env.DISCORD_TOKEN);
