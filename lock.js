const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: {
    name: 'pjs?lock',
  },
  async execute(message) {
    const channel = message.channel;
    if (channel.permissionsFor(message.guild.roles.everyone).has(PermissionFlagsBits.SendMessages)) {
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
      message.reply('Channel has been locked!');
    } else {
      message.reply('Channel is already locked.');
    }
  },
};
