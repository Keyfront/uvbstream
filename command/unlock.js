module.exports = {
  data: {
    name: 'unlock',
  },
  async execute(message) {
    const channel = message.channel;
    await channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: null });
    message.reply('Channel has been unlocked!');
  },
};
