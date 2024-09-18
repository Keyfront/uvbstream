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

// Charge les fichiers de commandes
const commandFiles = fs.readdirSync('./command').filter(file => file.endsWith('.js'));

console.log('Chargement des commandes...');
for (const file of commandFiles) {
  const command = require(`./command/${file}`);
  client.commands.set(command.data.name, command);
  console.log(`Commande chargée : ${command.data.name}`); // Debugging
}

// Charge les fichiers d'événements
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

console.log('Chargement des événements...');
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  client.on(event.name, (...args) => event.execute(...args));
  console.log(`Événement chargé : ${event.name}`); // Debugging
}

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('messageCreate', message => {
  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

  console.log(`Message reçu : ${message.content}`); // Debugging

  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  console.log(`Commande traitée : ${command}`); // Debugging

  if (client.commands.has(command)) {
    try {
      client.commands.get(command).execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('There was an error executing that command!');
    }
  } else {
    message.reply('Command not found!');
  }
});

client.login(process.env.DISCORD_TOKEN);
