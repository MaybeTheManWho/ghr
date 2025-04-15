const { EmbedBuilder } = require('discord.js');

/**
 * Create a standard success embed
 * @param {string} title - The title of the embed
 * @param {string} description - The description of the embed
 * @returns {EmbedBuilder} - The created embed
 */
function createSuccessEmbed(title, description) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor('#4CAF50') // Green color
    .setTimestamp();
}

/**
 * Create a standard error embed
 * @param {string} title - The title of the embed
 * @param {string} description - The description of the embed
 * @returns {EmbedBuilder} - The created embed
 */
function createErrorEmbed(title, description) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor('#F44336') // Red color
    .setTimestamp();
}

/**
 * Create a standard info embed
 * @param {string} title - The title of the embed
 * @param {string} description - The description of the embed
 * @returns {EmbedBuilder} - The created embed
 */
function createInfoEmbed(title, description) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor('#2196F3') // Blue color
    .setTimestamp();
}

/**
 * Create a standard warning embed
 * @param {string} title - The title of the embed
 * @param {string} description - The description of the embed
 * @returns {EmbedBuilder} - The created embed
 */
function createWarningEmbed(title, description) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor('#FF9800') // Orange color
    .setTimestamp();
}

/**
 * Create a ticket embed
 * @param {Object} ticket - The ticket object
 * @param {Object} client - Discord client
 * @returns {EmbedBuilder} - The created embed
 */
function createTicketEmbed(ticket, client) {
  const embed = new EmbedBuilder()
    .setTitle(`Ticket #${ticket.id}`)
    .setDescription(`**Status:** ${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}`)
    .setColor(ticket.status === 'open' ? '#2196F3' : '#F44336')
    .addFields(
      { name: 'Created By', value: ticket.username, inline: true },
      { name: 'Created At', value: `<t:${Math.floor(ticket.createdAt.getTime() / 1000)}:F>`, inline: true }
    )
    .setFooter({
      text: 'Sword Ticket System',
      iconURL: client.user.displayAvatarURL()
    })
    .setTimestamp();
  
  if (ticket.assignedStaffUsername) {
    embed.addFields({ name: 'Assigned To', value: ticket.assignedStaffUsername, inline: true });
  }
  
  if (ticket.assignedTeamName) {
    embed.addFields({ name: 'Assigned Team', value: ticket.assignedTeamName, inline: true });
  }
  
  if (ticket.status === 'closed' && ticket.closedAt) {
    embed.addFields(
      { name: 'Closed At', value: `<t:${Math.floor(ticket.closedAt.getTime() / 1000)}:F>`, inline: true },
      { name: 'Closed By', value: ticket.closedByUsername || 'Unknown', inline: true }
    );
  }
  
  return embed;
}

/**
 * Create a staff response embed
 * @param {Object} message - The message object
 * @param {Object} author - The author of the message
 * @param {Object} client - Discord client
 * @returns {EmbedBuilder} - The created embed
 */
function createStaffResponseEmbed(message, author, client) {
  return new EmbedBuilder()
    .setAuthor({
      name: author.username,
      iconURL: author.displayAvatarURL()
    })
    .setDescription(message.content)
    .setColor('#2196F3')
    .setFooter({
      text: `Staff Response • ${formatTimestamp(new Date())}`,
      iconURL: client.user.displayAvatarURL()
    });
}

/**
 * Format timestamp for embed footers
 * @param {Date} date - The date to format
 * @returns {string} - The formatted timestamp
 */
function formatTimestamp(date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

module.exports = {
  createSuccessEmbed,
  createErrorEmbed,
  createInfoEmbed,
  createWarningEmbed,
  createTicketEmbed,
  createStaffResponseEmbed,
  formatTimestamp
};