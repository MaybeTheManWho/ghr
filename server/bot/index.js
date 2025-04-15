const { Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Ticket = require('../models/Ticket');
const User = require('../models/User');

// Create Discord client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions
  ]
});

// Initialize bot
module.exports = function initBot() {
  // Bot ready event
  client.on('ready', async () => {
    console.log(`Bot logged in as ${client.user.tag}`);
    
    try {
      // Register slash commands
      await registerCommands();
      console.log('Slash commands registered');
    } catch (error) {
      console.error('Error registering slash commands:', error);
    }
  });
  
  // Interaction create event (for slash commands and buttons)
  client.on('interactionCreate', async (interaction) => {
    try {
      // Handle slash commands
      if (interaction.isCommand()) {
        await handleCommands(interaction);
      }
      
      // Handle button interactions
      if (interaction.isButton()) {
        await handleButtons(interaction);
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
  });
  
  // Message create event (for ticket threads)
  client.on('messageCreate', async (message) => {
    try {
      // Ignore bot messages
      if (message.author.bot) return;
      
      // Check if message is in a ticket thread
      if (message.channel.isThread()) {
        await handleTicketMessage(message);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });
  
  // Thread create event
  client.on('threadCreate', async (thread) => {
    try {
      // Check if thread was created from a ticket message
      if (thread.parentId === process.env.SUPPORT_CHANNEL_ID) {
        await handleNewTicket(thread);
      }
    } catch (error) {
      console.error('Error handling thread creation:', error);
    }
  });
  
  // Login to Discord
  client.login(process.env.DISCORD_BOT_TOKEN);
  
  return client;
};

// Register slash commands
async function registerCommands() {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  
  if (!guild) {
    throw new Error('Guild not found');
  }
  
  const commands = [
    {
      name: 'ticket',
      description: 'Create a ticket message in the support channel',
      options: [],
      defaultMemberPermissions: PermissionFlagsBits.ManageGuild
    },
    {
      name: 'close',
      description: 'Close the current ticket',
      options: [],
      defaultMemberPermissions: null
    }
  ];
  
  await guild.commands.set(commands);
}

// Handle slash commands
async function handleCommands(interaction) {
  const { commandName } = interaction;
  
  if (commandName === 'ticket') {
    await createTicketMessage(interaction);
  } else if (commandName === 'close') {
    await closeTicket(interaction);
  }
}

// Handle button interactions
async function handleButtons(interaction) {
  const { customId } = interaction;
  
  if (customId === 'create_ticket') {
    await createTicketThread(interaction);
  } else if (customId === 'close_ticket') {
    await closeTicket(interaction);
  }
}

// Create ticket message in support channel
async function createTicketMessage(interaction) {
  try {
    await interaction.deferReply({ ephemeral: true });
    
    // Get support channel
    const supportChannel = client.channels.cache.get(process.env.SUPPORT_CHANNEL_ID);
    
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
      createdAt: new Date()
    });
    
    await ticket.save();
    
    await interaction.followUp({
      content: `Your ticket has been created: ${thread}`,
      ephemeral: true
    });
  } catch (error) {
    console.error('Error creating ticket thread:', error);
    await interaction.followUp({
      content: 'An error occurred while creating your ticket.',
      ephemeral: true
    });
  }
}

// Handle new ticket creation
async function handleNewTicket(thread) {
  try {
    // Get thread starter
    const threadMember = await thread.fetchOwner();
    const member = await thread.guild.members.fetch(threadMember.id);
    
    // Create ticket in database if it doesn't exist
    let ticket = await Ticket.findOne({ channelId: thread.id });
    
    if (!ticket) {
      ticket = new Ticket({
        id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        channelId: thread.id,
        userId: member.id,
        username: member.user.username,
        status: 'open',
        createdAt: new Date()
      });
      
      await ticket.save();
    }
    
    // Send notification to staff channel
    const staffChannel = client.channels.cache.get(process.env.STAFF_CHANNEL_ID);
    
    if (staffChannel) {
      const notificationEmbed = new EmbedBuilder()
        .setTitle('New Support Ticket')
        .setDescription(`A new ticket has been opened by ${member.user.tag}.\nTicket ID: ${ticket.id}`)
        .setColor('#2196F3')
        .setTimestamp();
      
      await staffChannel.send({ embeds: [notificationEmbed] });
    }
  } catch (error) {
    console.error('Error handling new ticket:', error);
  }
}

// Handle ticket message
async function handleTicketMessage(message) {
  try {
    // Check if message is in a ticket thread
    const ticket = await Ticket.findOne({
      channelId: message.channel.id,
      status: 'open'
    });
    
    if (!ticket) return;
    
    // Add message to ticket
    ticket.messages.push({
      id: message.id,
      content: message.content,
      userId: message.author.id,
      username: message.author.username,
      timestamp: message.createdAt
    });
    
    await ticket.save();
    
    // Check if message is from a staff member
    const staffMember = await User.findOne({ discordId: message.author.id });
    
    if (staffMember && !ticket.assignedStaff) {
      // Assign ticket to staff member
      ticket.assignedStaff = staffMember.id;
      await ticket.save();
      
      // Notify in thread
      const assignEmbed = new EmbedBuilder()
        .setTitle('Ticket Assigned')
        .setDescription(`This ticket has been assigned to ${message.author.username}.`)
        .setColor('#4CAF50')
        .setTimestamp();
      
      await message.channel.send({ embeds: [assignEmbed] });
    }
  } catch (error) {
    console.error('Error handling ticket message:', error);
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
        content: 'This command can only be used in a ticket thread.',
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
        const thread = await client.channels.fetch(interaction.channelId);
        if (thread && thread.isThread()) {
          await thread.setLocked(true);
          await thread.setArchived(true);
        }
      } catch (error) {
        console.error('Error closing thread:', error);
      }
    }, 10000);
  } catch (error) {
    console.error('Error closing ticket:', error);
    await interaction.followUp({
      content: 'An error occurred while closing the ticket.',
      ephemeral: true
    });
  }
}