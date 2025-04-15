const Ticket = require('../../models/Ticket');
const User = require('../../models/User');
const { EmbedBuilder } = require('discord.js');

/**
 * Generate a unique ticket ID
 * @returns {string} Unique ticket ID
 */
async function generateTicketId() {
  // Generate a random 4-digit number
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const ticketId = `TKT-${randomNum}`;
  
  // Check if the ID already exists
  const existingTicket = await Ticket.findOne({ id: ticketId });
  
  // If it exists, generate a new one recursively
  if (existingTicket) {
    return generateTicketId();
  }
  
  return ticketId;
}

/**
 * Create a new ticket
 * @param {string} channelId - Thread channel ID
 * @param {string} userId - Discord user ID
 * @param {string} username - Discord username
 * @param {string} title - Ticket title
 * @returns {Promise<Object>} Created ticket
 */
async function createTicket(channelId, userId, username, title = null) {
  try {
    // Generate ticket ID
    const ticketId = await generateTicketId();
    
    // Create ticket object
    const ticket = new Ticket({
      id: ticketId,
      channelId,
      userId,
      username,
      title: title || `Support for ${username}`,
      status: 'open',
      createdAt: new Date(),
      priority: 'low',
      opener: {
        username,
        id: userId
      }
    });
    
    // Save ticket to database
    await ticket.save();
    
    return ticket;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
}

/**
 * Get ticket by channel ID
 * @param {string} channelId - Thread channel ID
 * @returns {Promise<Object>} Ticket object
 */
async function getTicketByChannelId(channelId) {
  try {
    return await Ticket.findOne({ channelId });
  } catch (error) {
    console.error('Error getting ticket:', error);
    throw error;
  }
}

/**
 * Get tickets by user ID
 * @param {string} userId - Discord user ID
 * @returns {Promise<Array>} Array of ticket objects
 */
async function getTicketsByUserId(userId) {
  try {
    return await Ticket.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error getting user tickets:', error);
    throw error;
  }
}

/**
 * Get open tickets assigned to staff
 * @param {string} staffId - Staff member ID
 * @returns {Promise<Array>} Array of ticket objects
 */
async function getStaffTickets(staffId) {
  try {
    return await Ticket.find({ 
      assignedStaff: staffId,
      status: 'open'
    }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error getting staff tickets:', error);
    throw error;
  }
}

/**
 * Close a ticket
 * @param {string} channelId - Thread channel ID
 * @param {string} closedBy - Discord user ID of who closed the ticket
 * @param {string} closedByUsername - Username of who closed the ticket
 * @param {string} reason - Reason for closing
 * @returns {Promise<Object>} Updated ticket
 */
async function closeTicket(channelId, closedBy, closedByUsername, reason = null) {
  try {
    const ticket = await Ticket.findOne({ channelId });
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    ticket.status = 'closed';
    ticket.closedAt = new Date();
    ticket.closedBy = closedBy;
    ticket.closedByUsername = closedByUsername;
    
    if (reason) {
      ticket.closeReason = reason;
    }
    
    await ticket.save();
    
    // If ticket was assigned to a staff member, update their stats
    if (ticket.assignedStaff) {
      const staffMember = await User.findById(ticket.assignedStaff);
      
      if (staffMember) {
        // Increment monthly closes
        staffMember.stats.monthlyCloses += 1;
        staffMember.stats.lifetimeCloses += 1;
        
        await staffMember.save();
      }
    }
    
    return ticket;
  } catch (error) {
    console.error('Error closing ticket:', error);
    throw error;
  }
}

/**
 * Assign ticket to staff member
 * @param {string} ticketId - Ticket ID
 * @param {string} staffId - Staff user ID
 * @param {string} staffUsername - Staff username
 * @returns {Promise<Object>} Updated ticket
 */
async function assignTicketToStaff(ticketId, staffId, staffUsername) {
  try {
    const ticket = await Ticket.findOne({ id: ticketId });
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    // Find staff member in database
    const staffMember = await User.findOne({ discordId: staffId });
    
    if (!staffMember) {
      throw new Error('Staff member not found in database');
    }
    
    ticket.assignedStaff = staffMember._id;
    ticket.assignedStaffUsername = staffUsername;
    
    await ticket.save();
    
    return ticket;
  } catch (error) {
    console.error('Error assigning ticket to staff:', error);
    throw error;
  }
}

/**
 * Add message to ticket
 * @param {string} channelId - Thread channel ID
 * @param {string} messageId - Discord message ID
 * @param {string} content - Message content
 * @param {string} userId - Discord user ID
 * @param {string} username - Discord username
 * @param {string} type - Message type (user, staff, system)
 * @returns {Promise<Object>} Updated ticket
 */
async function addMessageToTicket(channelId, messageId, content, userId, username, type = 'user') {
  try {
    const ticket = await Ticket.findOne({ channelId });
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    // Add message to ticket
    ticket.messages.push({
      id: messageId,
      content,
      userId,
      username,
      timestamp: new Date(),
      type
    });
    
    // Update lastMessage for preview
    ticket.lastMessage = content;
    
    await ticket.save();
    
    return ticket;
  } catch (error) {
    console.error('Error adding message to ticket:', error);
    throw error;
  }
}

/**
 * Get ticket notification embed
 * @param {Object} ticket - Ticket object
 * @param {string} type - Notification type (new, assigned, closed)
 * @returns {EmbedBuilder} Discord embed
 */
function getTicketNotificationEmbed(ticket, type) {
  let embed = new EmbedBuilder()
    .setTimestamp();
  
  switch (type) {
    case 'new':
      embed
        .setTitle('New Support Ticket')
        .setDescription(`A new ticket has been opened by ${ticket.username}.\nTicket ID: ${ticket.id}`)
        .setColor('#2196F3');
      break;
    case 'assigned':
      embed
        .setTitle('Ticket Assigned')
        .setDescription(`Ticket #${ticket.id} has been assigned to ${ticket.assignedStaffUsername}.`)
        .setColor('#4CAF50');
      break;
    case 'closed':
      embed
        .setTitle('Ticket Closed')
        .setDescription(`Ticket #${ticket.id} has been closed by ${ticket.closedByUsername || 'Unknown'}.`)
        .setColor('#F44336');
      break;
    default:
      embed
        .setTitle('Ticket Update')
        .setDescription(`Ticket #${ticket.id} has been updated.`)
        .setColor('#2196F3');
  }
  
  return embed;
}

module.exports = {
  generateTicketId,
  createTicket,
  getTicketByChannelId,
  getTicketsByUserId,
  getStaffTickets,
  closeTicket,
  assignTicketToStaff,
  addMessageToTicket,
  getTicketNotificationEmbed
};