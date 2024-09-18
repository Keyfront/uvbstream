module.exports = {
  data: {
    name: 'unban',
  },
  async execute(message, args) {
    if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply('You do not have permission to unban members.');

    const userId = args[0];
    if (userId) {
      try {
        await message.guild.bans.remove(userId);
        message.reply(`Successfully unbanned user with ID ${userId}`);
      } catch (error) {
        message.reply('Failed to unban user.');
      }
    } else {
      message.reply('Please provide a user ID.');
    }
  },
};
