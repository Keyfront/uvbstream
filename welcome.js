module.exports = {
  name: 'guildMemberAdd', // Nom de l'événement
  execute(member) {
    // Recherche des salons contenant les mots "general" ou "chat"
    const welcomeChannel = member.guild.channels.cache.find(ch => 
      ch.name.toLowerCase().includes('general') || 
      ch.name.toLowerCase().includes('▏💬・chat')
    );

    if (welcomeChannel) {
      welcomeChannel.send(`Welcome to the server, ${member}!`);
    }
  },
};
