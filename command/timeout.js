module.exports = {
  data: {
    name: 'pjs?timeout',
  },
  async execute(message, args) {
    if (!message.member.permissions.has('MODERATE_MEMBERS')) return message.reply('You do not have permission to timeout members.');

    const user = message.mentions.users.first();
    const reason = args.slice(1).join(' ');

    if (user && reason) {
      const member = message.guild.members.resolve(user);
      if (member) {
        await member.timeout(3600000, reason); // 1 hour timeout
        message.reply(`Successfully timed out ${user.tag} for reason: ${reason}`);
      } else {
        message.reply('That user is not in this guild.');
      }
    } else {
      message.reply('Please mention a user and provide a reason.');
    }
  },
};
