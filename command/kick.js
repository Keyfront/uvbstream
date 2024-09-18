module.exports = {
  data: {
    name: 'pjs?kick',
  },
  async execute(message, args) {
    if (!message.member.permissions.has('KICK_MEMBERS')) return message.reply('You do not have permission to kick members.');

    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.members.resolve(user);
      if (member) {
        await member.kick();
        message.reply(`Successfully kicked ${user.tag}`);
      } else {
        message.reply('That user is not in this guild.');
      }
    } else {
      message.reply('Please mention a user.');
    }
  },
};
