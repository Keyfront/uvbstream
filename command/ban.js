module.exports = {
  data: {
    name: 'pjs?ban',
  },
  async execute(message, args) {
    if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply('You do not have permission to ban members.');

    const user = message.mentions.users.first();
    const reason = args.slice(1).join(' ');

    if (user && reason) {
      const member = message.guild.members.resolve(user);
      if (member) {
        await member.ban({ reason });
        message.reply(`Successfully banned ${user.tag} for reason: ${reason}`);
      } else {
        message.reply('That user is not in this guild.');
      }
    } else {
      message.reply('Please mention a user and provide a reason.');
    }
  },
};
