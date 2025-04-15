const { EmbedBuilder } = require('discord.js');
const Ticket = require('../../models/Ticket');
const User = require('../../models/User');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    try {
      // Ignore bot messages
      if (message.author.bot) return;
      
      // Check if message is in a ticket thread
      if (message.channel.isThread()) {
        await handleTicketMessage(message, client);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }
};

// Handle ticket message
async function handleTicketMessage(message, client) {
  try {
    // Check if message is in a ticket thread
    const ticket = await Ticket.findOne({
      channelId: message.channel.id,
      status: 'open'
    });
    
    if (!ticket) return;
    
    // Determine message type (staff vs user)
    const isStaff = await isStaffMember(message.author.id);
    const messageType = isStaff ? 'staff' : 'user';
    
    // Add message to ticket
    ticket.messages.push({
      id: message.id,
      content: message.content,
      userId: message.author.id,
      username: message.author.username,
      timestamp: message.createdAt,
      type: messageType
    });
    
    // Update lastMessage for preview
    ticket.lastMessage = message.content;
    
    // Track when staff first responded if this is a staff message
    if (isStaff && !ticket.firstResponseTime && ticket.userId !== message.author.id) {
      const now = new Date();
      const responseTime = now - ticket.createdAt;
      ticket.firstResponseTime = responseTime;
      
      // Increment staff response stats
      const staffMember = await User.findOne({ discordId: message.author.id });
      if (staffMember) {
        // Update response count
        ticket.responseCount = (ticket.responseCount || 0) + 1;
      }
    }
    
    // Check if message is from a staff member for assignment
    if (isStaff && !ticket.assignedStaff && ticket.userId !== message.author.id) {
      // Find staff member in database
      const staffMember = await User.findOne({ discordId: message.author.id });
      
      if (staffMember) {
        // Assign ticket to staff member
        ticket.assignedStaff = staffMember.id;
        ticket.assignedStaffUsername = message.author.username;
        
        // Notify in thread
        const assignEmbed = new EmbedBuilder()
          .setTitle('Ticket Assigned')
          .setDescription(`This ticket has been assigned to ${message.author.username}.`)
          .setColor('#4CAF50')
          .setTimestamp();
        
        await message.channel.send({ embeds: [assignEmbed] });
        
        // Add system message to ticket
        ticket.messages.push({
          id: `assign-${Date.now()}`,
          content: `This ticket has been assigned to ${message.author.username}.`,
          userId: client.user.id,
          username: 'System',
          timestamp: new Date(),
          type: 'system'
        });
      }
    }
    
    await ticket.save();
    
    // Format message with embeds for staff members
    if (isStaff && ticket.userId !== message.author.id) {
      // Delete the original message
      try {
        await message.delete();
      } catch (error) {
        console.error('Error deleting message:', error);
      }
      
      // Send an embed with the staff member's message
      const staffEmbed = new EmbedBuilder()
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.displayAvatarURL()
        })
        .setDescription(message.content)
        .setColor('#2196F3')
        .setFooter({
          text: `Staff Response • ${formatTime(new Date())}`,
          iconURL: client.user.displayAvatarURL()
        });
        
      await message.channel.send({ embeds: [staffEmbed] });
    }
  } catch (error) {
    console.error('Error handling ticket message:', error);
  }
}

// Check if user is a staff member
async function isStaffMember(userId) {
  try {
    const staffMember = await User.findOne({ discordId: userId });
    return !!staffMember;
  } catch (error) {
    console.error('Error checking staff member:', error);
    return false;
  }
}

// Format time
function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}