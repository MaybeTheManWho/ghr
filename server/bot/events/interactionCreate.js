const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
  } = require('discord.js');
  const Ticket = require('../../models/Ticket');
  const User = require('../../models/User');
  
  module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
      try {
        // Handle slash commands
        if (interaction.isCommand()) {
          const { commandName } = interaction;
          
          if (commandName === 'ticket') {
            await createTicketMessage(interaction);
          } else if (commandName === 'close') {
            await closeTicket(interaction);
          }
        }
        
        // Handle button interactions
        if (interaction.isButton()) {
          const { customId } = interaction;
          
          if (customId === 'create_ticket') {
            await createTicketThread(interaction);
          } else if (customId === 'close_ticket') {
            await closeTicket(interaction);
          }
        }
      } catch (error) {
        console.error('Error handling interaction:', error);
        
        // Reply with error message if interaction hasn't been acknowledged
        if (interaction.deferred || interaction.replied) {
          await interaction.followUp({
            content: 'An error occurred while processing your request.',
            ephemeral: true
          });
        } else {
          await interaction.reply({
            content: 'An error occurred while processing your request.',
            ephemeral: true
          });
        }
      }
    }
  };
  
  // Create ticket message in support channel
  async function createTicketMessage(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
      
      // Get support channel
      const supportChannel = interaction.client.channels.cache.get(process.env.SUPPORT_CHANNEL_ID);
      
      if (!supportChannel) {
        return interaction.followUp({
          content: 'Support channel not found. Please check your configuration.',
          ephemeral: true
        });
      }
      
      // Create embed
      const embed = new EmbedBuilder()
        .setTitle('Support Ticket')
        .setDescription('Need help? Create a ticket and our staff team will assist you as soon as possible.')
        .setColor('#2196F3')
        .setFooter({ text: 'Click the button below to create a ticket' })
        .setTimestamp();
      
      // Create button
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('create_ticket')
            .setLabel('Open Ticket')
            .setStyle(ButtonStyle.Primary)
        );
      
      // Send message
      await supportChannel.send({
        embeds: [embed],
        components: [row]
      });
      
      await interaction.followUp({
        content: 'Ticket message created successfully.',
        ephemeral: true
      });
    } catch (error) {
      console.error('Error creating ticket message:', error);
      await interaction.followUp({
        content: 'An error occurred while creating the ticket message.',
        ephemeral: true
      });
    }
  }
  
  // Create ticket thread
  async function createTicketThread(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
      
      // Get member who clicked the button
      const member = interaction.member;
      
      // Check if member already has an open ticket
      const existingTicket = await Ticket.findOne({
        userId: member.id,
        status: 'open'
      });
      
      if (existingTicket) {
        return interaction.followUp({
          content: `You already have an open ticket. Please use <#${existingTicket.channelId}> instead.`,
          ephemeral: true
        });
      }
      
      // Create thread
      const thread = await interaction.channel.threads.create({
        name: `ticket-${member.user.username}`,
        autoArchiveDuration: 1440, // 24 hours
        reason: `Support ticket for ${member.user.tag}`
      });
      
      // Send initial message in thread
      const welcomeEmbed = new EmbedBuilder()
        .setTitle('New Support Ticket')
        .setDescription(`Welcome ${member}, please describe your issue as much as possible while a staff member joins your ticket and helps you. Keep in mind that pinging one or multiple staffs can result in a punishment.`)
        .setColor('#2196F3')
        .setTimestamp();
      
      await thread.send({
        content: `${member}`,
        embeds: [welcomeEmbed]
      });
      
      // Create ticket in database
      const ticket = new Ticket({
        id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        channelId: thread.id,
        userId: member.id,
        username: member.user.username,
        status: 'open',
        createdAt: new Date(),
        title: `Support for ${member.user.username}`,
        opener: {
          username: member.user.username,
          id: member.id
        },
        messages: [{
          id: 'welcome-msg',
          content: welcomeEmbed.data.description,
          userId: interaction.client.user.id,
          username: interaction.client.user.username,
          timestamp: new Date(),
          type: 'system'
        }],
        priority: 'low'
      });
      
      await ticket.save();
      
      await interaction.followUp({
        content: `Your ticket has been created: ${thread}`,
        ephemeral: true
      });
      
      // Send notification to staff channel
      const staffChannel = interaction.client.channels.cache.get(process.env.STAFF_CHANNEL_ID);
      
      if (staffChannel) {
        const notificationEmbed = new EmbedBuilder()
          .setTitle('New Support Ticket')
          .setDescription(`A new ticket has been opened by ${member.user.tag}.\nTicket ID: ${ticket.id}`)
          .setColor('#2196F3')
          .addFields(
            { name: 'Ticket Channel', value: `<#${thread.id}>`, inline: true }
          )
          .setTimestamp();
        
        await staffChannel.send({ embeds: [notificationEmbed] });
      }
    } catch (error) {
      console.error('Error creating ticket thread:', error);
      await interaction.followUp({
        content: 'An error occurred while creating your ticket.',
        ephemeral: true
      });
    }
  }
  
  // Close ticket
  async function closeTicket(interaction) {
    try {
      await interaction.deferReply();
      
      // Check if the channel is a ticket thread
      const ticket = await Ticket.findOne({
        channelId: interaction.channelId,
        status: 'open'
      });
      
      if (!ticket) {
        return interaction.followUp({
          content: 'This command can only be used in an open ticket thread.',
          ephemeral: true
        });
      }
      
      // Close ticket in database
      ticket.status = 'closed';
      ticket.closedAt = new Date();
      
      if (interaction.user.id !== ticket.userId) {
        ticket.closedBy = interaction.user.id;
        ticket.closedByUsername = interaction.user.username;
      }
      
      // Add closure message to ticket
      ticket.messages.push({
        id: `close-${Date.now()}`,
        content: `This ticket has been closed by ${interaction.user.username}.`,
        userId: interaction.client.user.id,
        username: 'System',
        timestamp: new Date(),
        type: 'system'
      });
      
      await ticket.save();
      
      // Send close message
      const closeEmbed = new EmbedBuilder()
        .setTitle('Ticket Closed')
        .setDescription(`This ticket has been closed by ${interaction.user.username}.`)
        .setColor('#F44336')
        .setTimestamp();
      
      await interaction.followUp({ embeds: [closeEmbed] });
      
      // Close and lock the thread after 10 seconds
      setTimeout(async () => {
        try {
          const thread = await interaction.client.channels.fetch(interaction.channelId);
          if (thread && thread.isThread()) {
            await thread.setLocked(true);
            await thread.setArchived(true);
          }
        } catch (error) {
          console.error('Error closing thread:', error);
        }
      }, 10000);
      
      // Notify staff channel
      const staffChannel = interaction.client.channels.cache.get(process.env.STAFF_CHANNEL_ID);
      if (staffChannel) {
        const notificationEmbed = new EmbedBuilder()
          .setTitle('Ticket Closed')
          .setDescription(`Ticket #${ticket.id} has been closed by ${interaction.user.username}.`)
          .setColor('#F44336')
          .addFields(
            { name: 'Opened By', value: ticket.username, inline: true },
            { name: 'Duration', value: calculateDuration(ticket.createdAt, new Date()), inline: true }
          )
          .setTimestamp();
          
        await staffChannel.send({ embeds: [notificationEmbed] });
      }
    } catch (error) {
      console.error('Error closing ticket:', error);
      await interaction.followUp({
        content: 'An error occurred while closing the ticket.',
        ephemeral: true
      });
    }
  }
  
  // Calculate duration between two dates
  function calculateDuration(startDate, endDate) {
    const diff = endDate - startDate;
    
    // Convert to seconds
    const seconds = Math.floor(diff / 1000);
    
    // Convert to minutes
    const minutes = Math.floor(seconds / 60);
    
    // Convert to hours
    const hours = Math.floor(minutes / 60);
    
    // Convert to days
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else {
      return `${minutes}m`;
    }
  }