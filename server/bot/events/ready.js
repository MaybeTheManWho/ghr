const { REST, Routes } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    try {
      console.log(`Bot logged in as ${client.user.tag}`);
      
      // Set bot activity
      client.user.setActivity('support tickets', { type: 'WATCHING' });
      
      console.log('Bot is ready to handle tickets!');
    } catch (error) {
      console.error('Error in ready event:', error);
    }
  }
};