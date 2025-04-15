import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const TicketContext = createContext();

export const useTickets = () => {
  return useContext(TicketContext);
};

export const TicketProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [openTickets, setOpenTickets] = useState([]);
  const [closedTickets, setClosedTickets] = useState([]);
  const [unassignedTickets, setUnassignedTickets] = useState([]);
  const [claimedTickets, setClaimedTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Example tickets data for development
  const exampleTickets = [
    {
      id: "TKT-1234",
      title: "Cannot access account settings",
      channelId: "123456789012345678",
      userId: "987654321098765432",
      username: "JohnDoe",
      status: "open",
      priority: "medium",
      assignedStaff: {
        id: "staff-123",
        username: "Support Team",
        avatar: null
      },
      assignedTeam: {
        id: "team-456",
        name: "Technical Support",
        color: "#4f8eff"
      },
      tags: [
        { id: "tag-1", name: "Account Issue", color: "#FF9800" },
        { id: "tag-2", name: "Priority", color: "#F44336" }
      ],
      messages: [
        {
          id: "msg-1",
          content: "Hello, I can't access my account settings page. It keeps giving me an error when I click on the settings tab.",
          userId: "987654321098765432",
          username: "JohnDoe",
          timestamp: new Date(Date.now() - 3600000 * 5),
          type: "user"
        },
        {
          id: "msg-2",
          content: "Hi John, I'm sorry to hear you're having trouble. Could you please tell me what error message you're seeing?",
          userId: "staff-123",
          username: "Support Team",
          timestamp: new Date(Date.now() - 3600000 * 4),
          type: "staff"
        },
        {
          id: "msg-3",
          content: "It says 'Error 403: Access Denied' when I try to open the page.",
          userId: "987654321098765432",
          username: "JohnDoe",
          timestamp: new Date(Date.now() - 3600000 * 3),
          type: "user"
        },
        {
          id: "msg-4",
          content: "Thanks for the information. It looks like there might be a permissions issue with your account. Let me check this for you.",
          userId: "staff-123",
          username: "Support Team",
          timestamp: new Date(Date.now() - 3600000 * 2),
          type: "staff"
        },
        {
          id: "msg-5",
          content: "I've checked your account and found that there was a permission setting that wasn't correctly applied. I've fixed this now, could you please try accessing your settings again and let me know if it works?",
          userId: "staff-123",
          username: "Support Team",
          timestamp: new Date(Date.now() - 3600000),
          type: "staff"
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 5),
      firstResponseTime: 3600000,
      totalResponseTime: 3600000 * 2,
      responseCount: 3,
      opener: {
        username: "JohnDoe",
        id: "987654321098765432"
      },
      lastMessage: "I've checked your account and found that there was a permission setting that wasn't correctly applied."
    },
    {
      id: "TKT-5678",
      title: "Payment not processing",
      channelId: "123456789012345679",
      userId: "987654321098765433",
      username: "JaneSmith",
      status: "open",
      priority: "urgent",
      assignedStaff: null,
      assignedTeam: null,
      tags: [
        { id: "tag-3", name: "Payment", color: "#9C27B0" }
      ],
      messages: [
        {
          id: "msg-6",
          content: "I tried to make a payment but it keeps failing with error code P-2034.",
          userId: "987654321098765433",
          username: "JaneSmith",
          timestamp: new Date(Date.now() - 1800000),
          type: "user"
        }
      ],
      createdAt: new Date(Date.now() - 1800000),
      firstResponseTime: null,
      totalResponseTime: 0,
      responseCount: 0,
      opener: {
        username: "JaneSmith",
        id: "987654321098765433"
      },
      lastMessage: "I tried to make a payment but it keeps failing with error code P-2034."
    },
    {
      id: "TKT-9012",
      title: "Need to restore deleted files",
      channelId: "123456789012345680",
      userId: "987654321098765434",
      username: "MikeJohnson",
      status: "closed",
      priority: "low",
      assignedStaff: {
        id: "staff-456",
        username: "Technical Team",
        avatar: null
      },
      assignedTeam: {
        id: "team-789",
        name: "Data Recovery",
        color: "#4CAF50"
      },
      tags: [
        { id: "tag-4", name: "Data Recovery", color: "#2196F3" },
        { id: "tag-5", name: "Resolved", color: "#4CAF50" }
      ],
      messages: [
        {
          id: "msg-7",
          content: "I accidentally deleted some important files. Can you help me recover them?",
          userId: "987654321098765434",
          username: "MikeJohnson",
          timestamp: new Date(Date.now() - 86400000),
          type: "user"
        },
        {
          id: "msg-8",
          content: "Hello Mike, I'd be happy to help with this. Can you tell me when you deleted these files and which folder they were in?",
          userId: "staff-456",
          username: "Technical Team",
          timestamp: new Date(Date.now() - 84600000),
          type: "staff"
        },
        {
          id: "msg-9",
          content: "They were deleted yesterday from my Documents folder. They were spreadsheets with Q3 financial data.",
          userId: "987654321098765434",
          username: "MikeJohnson",
          timestamp: new Date(Date.now() - 82800000),
          type: "user"
        },
        {
          id: "msg-10",
          content: "Great, I've restored those files from our backup system. They should now be in a folder called 'Restored Files' in your Documents. Please let me know if you can access them.",
          userId: "staff-456",
          username: "Technical Team",
          timestamp: new Date(Date.now() - 79200000),
          type: "staff"
        },
        {
          id: "msg-11",
          content: "I found them, thank you so much for your help!",
          userId: "987654321098765434",
          username: "MikeJohnson",
          timestamp: new Date(Date.now() - 72000000),
          type: "user"
        },
        {
          id: "msg-12",
          content: "This ticket has been closed by Technical Team.",
          userId: "system",
          username: "System",
          timestamp: new Date(Date.now() - 70000000),
          type: "system"
        }
      ],
      createdAt: new Date(Date.now() - 86400000),
      closedAt: new Date(Date.now() - 70000000),
      firstResponseTime: 1800000,
      totalResponseTime: 7200000,
      responseCount: 2,
      opener: {
        username: "MikeJohnson",
        id: "987654321098765434"
      },
      lastMessage: "This ticket has been closed by Technical Team."
    },
    {
      id: "TKT-3456",
      title: "Need help with 2FA setup",
      channelId: "123456789012345681",
      userId: "987654321098765435",
      username: "EmilyChen",
      status: "open",
      priority: "medium",
      assignedStaff: {
        id: "staff-123",
        username: "Support Team",
        avatar: null
      },
      assignedTeam: null,
      tags: [
        { id: "tag-6", name: "Security", color: "#673AB7" }
      ],
      messages: [
        {
          id: "msg-13",
          content: "I'm trying to set up 2FA but I'm getting confused with the app. Can someone walk me through it?",
          userId: "987654321098765435",
          username: "EmilyChen",
          timestamp: new Date(Date.now() - 10800000),
          type: "user"
        },
        {
          id: "msg-14",
          content: "Hi Emily, I'd be happy to help you set up 2FA. Are you using Google Authenticator or another app?",
          userId: "staff-123",
          username: "Support Team",
          timestamp: new Date(Date.now() - 9000000),
          type: "staff"
        }
      ],
      createdAt: new Date(Date.now() - 10800000),
      firstResponseTime: 1800000,
      totalResponseTime: 1800000,
      responseCount: 1,
      opener: {
        username: "EmilyChen",
        id: "987654321098765435"
      },
      lastMessage: "Hi Emily, I'd be happy to help you set up 2FA. Are you using Google Authenticator or another app?"
    }
  ];

  useEffect(() => {
    if (currentUser) {
      fetchAllTickets();
    } else {
      // In development mode, set mock tickets data
      const mockTickets = exampleTickets;
      setTickets(mockTickets);
      
      // Categorize mock tickets
      const open = mockTickets.filter(ticket => ticket.status === 'open');
      const closed = mockTickets.filter(ticket => ticket.status === 'closed');
      const unassigned = mockTickets.filter(ticket => ticket.status === 'open' && !ticket.assignedStaff);
      const claimed = mockTickets.filter(ticket => 
        ticket.status === 'open' && ticket.assignedStaff
      );
      
      setOpenTickets(open);
      setClosedTickets(closed);
      setUnassignedTickets(unassigned);
      setClaimedTickets(claimed);
      
      // Set first ticket as active for preview
      if (open.length > 0) {
        setActiveTicket(open[0]);
      }
    }
  }, [currentUser]);

  const fetchAllTickets = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const fetchedTickets = await api.get('/tickets');
      setTickets(fetchedTickets);
      categorizeTickets(fetchedTickets);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setError('Failed to fetch tickets. Please try again.');
      
      // In case of error, use mock data
      const mockTickets = exampleTickets;
      setTickets(mockTickets);
      categorizeTickets(mockTickets);
    } finally {
      setLoading(false);
    }
  };

  const categorizeTickets = (tickets) => {
    const open = tickets.filter(ticket => ticket.status === 'open');
    const closed = tickets.filter(ticket => ticket.status === 'closed');
    const unassigned = tickets.filter(ticket => ticket.status === 'open' && !ticket.assignedStaff);
    const claimed = tickets.filter(
      ticket => ticket.status === 'open' && 
        ticket.assignedStaff && 
        (currentUser ? ticket.assignedStaff.id === currentUser.id : true)
    );

    setOpenTickets(open);
    setClosedTickets(closed);
    setUnassignedTickets(unassigned);
    setClaimedTickets(claimed);
  };

  const fetchTicket = async (ticketId) => {
    try {
      setLoading(true);
      
      // In development mode, find ticket from mock data
      if (!currentUser) {
        const ticket = exampleTickets.find(t => t.id === ticketId);
        if (ticket) {
          setActiveTicket(ticket);
          return ticket;
        }
        return null;
      }
      
      const fetchedTicket = await api.get(`/tickets/${ticketId}`);
      setActiveTicket(fetchedTicket);
      return fetchedTicket;
    } catch (err) {
      console.error(`Failed to fetch ticket ${ticketId}:`, err);
      setError('Failed to fetch ticket details. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (ticketId, message) => {
    try {
      setLoading(true);
      
      // In development mode, simulate sending a message
      if (!currentUser) {
        const now = new Date();
        const updatedTickets = tickets.map(ticket => {
          if (ticket.id === ticketId) {
            const updatedTicket = {
              ...ticket,
              messages: [
                ...ticket.messages,
                {
                  id: `msg-${Math.floor(Math.random() * 1000)}`,
                  content: message,
                  userId: "staff-123",
                  username: "Support Team",
                  timestamp: now,
                  type: "staff"
                }
              ],
              lastMessage: message,
              assignedStaff: ticket.assignedStaff || {
                id: "staff-123",
                username: "Support Team",
                avatar: null
              }
            };
            setActiveTicket(updatedTicket);
            return updatedTicket;
          }
          return ticket;
        });
        
        setTickets(updatedTickets);
        categorizeTickets(updatedTickets);
        
        return activeTicket;
      }
      
      const updatedTicket = await api.post(`/tickets/${ticketId}/messages`, { content: message });
      setActiveTicket(updatedTicket);
      await fetchAllTickets();
      return updatedTicket;
    } catch (err) {
      console.error(`Failed to send message in ticket ${ticketId}:`, err);
      setError('Failed to send message. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const assignStaff = async (ticketId, staffId) => {
    try {
      setLoading(true);
      
      // In development mode, simulate assigning staff
      if (!currentUser) {
        const staff = [
          { id: '1', username: 'John Doe', role: { color: '#4B0082' } },
          { id: '2', username: 'Jane Smith', role: { color: '#2196F3' } },
          { id: '3', username: 'Alex Johnson', role: { color: '#4CAF50' } },
        ];
        
        const selectedStaff = staff.find(s => s.id === staffId);
        
        if (!selectedStaff) {
          setLoading(false);
          return activeTicket;
        }
        
        const updatedTickets = tickets.map(ticket => {
          if (ticket.id === ticketId) {
            const updatedTicket = {
              ...ticket,
              assignedStaff: {
                id: selectedStaff.id,
                username: selectedStaff.username,
                avatar: null
              }
            };
            setActiveTicket(updatedTicket);
            return updatedTicket;
          }
          return ticket;
        });
        
        setTickets(updatedTickets);
        categorizeTickets(updatedTickets);
        
        return activeTicket;
      }
      
      const updatedTicket = await api.put(`/tickets/${ticketId}/assign`, { staffId });
      setActiveTicket(updatedTicket);
      await fetchAllTickets();
      return updatedTicket;
    } catch (err) {
      console.error(`Failed to assign staff to ticket ${ticketId}:`, err);
      setError('Failed to assign staff. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const assignTeam = async (ticketId, teamId) => {
    try {
      setLoading(true);
      
      // In development mode, simulate assigning team
      if (!currentUser) {
        const teams = [
          { id: '1', name: 'Support Team', color: '#4B0082' },
          { id: '2', name: 'Technical Team', color: '#2196F3' },
        ];
        
        const selectedTeam = teams.find(t => t.id === teamId);
        
        if (!selectedTeam) {
          setLoading(false);
          return activeTicket;
        }
        
        const updatedTickets = tickets.map(ticket => {
          if (ticket.id === ticketId) {
            const updatedTicket = {
              ...ticket,
              assignedTeam: {
                id: selectedTeam.id,
                name: selectedTeam.name,
                color: selectedTeam.color
              }
            };
            setActiveTicket(updatedTicket);
            return updatedTicket;
          }
          return ticket;
        });
        
        setTickets(updatedTickets);
        categorizeTickets(updatedTickets);
        
        return activeTicket;
      }
      
      const updatedTicket = await api.put(`/tickets/${ticketId}/team`, { teamId });
      setActiveTicket(updatedTicket);
      await fetchAllTickets();
      return updatedTicket;
    } catch (err) {
      console.error(`Failed to assign team to ticket ${ticketId}:`, err);
      setError('Failed to assign team. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addTag = async (ticketId, tagId) => {
    try {
      setLoading(true);
      
      // In development mode, simulate adding a tag
      if (!currentUser) {
        const tags = [
          { id: '1', name: 'Bug', color: '#F44336' },
          { id: '2', name: 'Feature Request', color: '#4CAF50' },
          { id: '3', name: 'Question', color: '#2196F3' },
        ];
        
        const selectedTag = tags.find(t => t.id === tagId);
        
        if (!selectedTag) {
          setLoading(false);
          return activeTicket;
        }
        
        const updatedTickets = tickets.map(ticket => {
          if (ticket.id === ticketId) {
            // Check if tag already exists
            const tagExists = ticket.tags && ticket.tags.some(t => t.id === tagId);
            
            if (tagExists) {
              return ticket;
            }
            
            const updatedTicket = {
              ...ticket,
              tags: [
                ...(ticket.tags || []),
                {
                  id: selectedTag.id,
                  name: selectedTag.name,
                  color: selectedTag.color
                }
              ]
            };
            setActiveTicket(updatedTicket);
            return updatedTicket;
          }
          return ticket;
        });
        
        setTickets(updatedTickets);
        categorizeTickets(updatedTickets);
        
        return activeTicket;
      }
      
      const updatedTicket = await api.put(`/tickets/${ticketId}/tags`, { tagId });
      setActiveTicket(updatedTicket);
      await fetchAllTickets();
      return updatedTicket;
    } catch (err) {
      console.error(`Failed to add tag to ticket ${ticketId}:`, err);
      setError('Failed to add tag. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const setPriority = async (ticketId, priority) => {
    try {
      setLoading(true);
      
      // In development mode, simulate setting priority
      if (!currentUser) {
        const updatedTickets = tickets.map(ticket => {
          if (ticket.id === ticketId) {
            const updatedTicket = {
              ...ticket,
              priority
            };
            setActiveTicket(updatedTicket);
            return updatedTicket;
          }
          return ticket;
        });
        
        setTickets(updatedTickets);
        categorizeTickets(updatedTickets);
        
        return activeTicket;
      }
      
      const updatedTicket = await api.put(`/tickets/${ticketId}/priority`, { priority });
      setActiveTicket(updatedTicket);
      await fetchAllTickets();
      return updatedTicket;
    } catch (err) {
      console.error(`Failed to set priority for ticket ${ticketId}:`, err);
      setError('Failed to set priority. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const closeTicket = async (ticketId) => {
    try {
      setLoading(true);
      
      // In development mode, simulate closing a ticket
      if (!currentUser) {
        const now = new Date();
        const updatedTickets = tickets.map(ticket => {
          if (ticket.id === ticketId) {
            const updatedTicket = {
              ...ticket,
              status: 'closed',
              closedAt: now,
              messages: [
                ...ticket.messages,
                {
                  id: `msg-${Math.floor(Math.random() * 1000)}`,
                  content: "This ticket has been closed by Support Team.",
                  userId: "system",
                  username: "System",
                  timestamp: now,
                  type: "system"
                }
              ],
              lastMessage: "This ticket has been closed by Support Team."
            };
            setActiveTicket(updatedTicket);
            return updatedTicket;
          }
          return ticket;
        });
        
        setTickets(updatedTickets);
        categorizeTickets(updatedTickets);
        
        return activeTicket;
      }
      
      const updatedTicket = await api.put(`/tickets/${ticketId}/close`);
      setActiveTicket(updatedTicket);
      await fetchAllTickets();
      return updatedTicket;
    } catch (err) {
      console.error(`Failed to close ticket ${ticketId}:`, err);
      setError('Failed to close ticket. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    tickets,
    openTickets,
    closedTickets,
    unassignedTickets,
    claimedTickets,
    activeTicket,
    loading,
    error,
    fetchAllTickets,
    fetchTicket,
    sendMessage,
    assignStaff,
    assignTeam,
    addTag,
    setPriority,
    closeTicket,
    setActiveTicket
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};

export default TicketContext;