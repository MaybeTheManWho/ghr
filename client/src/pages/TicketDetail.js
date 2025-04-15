import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiUser, FiUsers, FiTag, FiAlertCircle, 
  FiCheck, FiSend, FiMoreVertical, FiX, FiSlash,
  FiMessageSquare, FiClock, FiChevronDown, FiCheckCircle
} from 'react-icons/fi';
import Button from '../components/UI/Button';
import Dropdown from '../components/UI/Dropdown';
import TopNav from '../components/TopNav';
import { useTickets } from '../context/TicketContext';

// Styled Components
const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
  overflow-y: auto;
  background: linear-gradient(
    160deg,
    ${({ theme }) => theme.colors.background.dark} 0%,
    ${({ theme }) => `${theme.colors.primary}10`} 100%
  );
`;

const BackButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TicketHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: ${({ theme }) => theme.border.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const TitleSection = styled.div`
  flex: 1;
`;

const TicketTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TicketID = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const TicketMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StatusTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'open':
        return `${theme.colors.status.success}22`; // 13% opacity
      case 'closed':
        return `${theme.colors.status.error}22`;
      default:
        return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case 'open':
        return theme.colors.status.success;
      case 'closed':
        return theme.colors.status.error;
      default:
        return theme.colors.text.secondary;
    }
  }};
  border-radius: ${({ theme }) => theme.border.radius.full};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const PriorityTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ priority, theme }) => {
    switch (priority) {
      case 'urgent':
        return `${theme.colors.priority.urgent}22`; // 13% opacity
      case 'medium':
        return `${theme.colors.priority.medium}22`;
      case 'low':
        return `${theme.colors.priority.low}22`;
      default:
        return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${({ priority, theme }) => {
    switch (priority) {
      case 'urgent':
        return theme.colors.priority.urgent;
      case 'medium':
        return theme.colors.priority.medium;
      case 'low':
        return theme.colors.priority.low;
      default:
        return theme.colors.text.secondary;
    }
  }};
  border-radius: ${({ theme }) => theme.border.radius.full};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const TagsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ color, theme }) => color || 'rgba(255, 255, 255, 0.1)'};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.border.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const TicketDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const DetailLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const DetailValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Unassigned = styled.span`
  color: ${({ theme }) => theme.colors.text.disabled};
  font-style: italic;
`;

const ColorBadge = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ color }) => color || 'rgba(255, 255, 255, 0.2)'};
`;

const Avatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.border.radius.full};
  background-color: ${({ color, theme }) => color || theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const TicketBodyContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ConversationSection = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: ${({ theme }) => theme.border.radius.lg};
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ConversationHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ConversationTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const MessageCount = styled.span`
  background-color: rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.border.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ConversationMessages = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  min-height: 300px;
  max-height: 600px;
`;

const MessageGroup = styled(motion.div)`
  display: flex;
  flex-direction: column;
  max-width: 85%;
  
  ${({ isStaff }) => isStaff && `
    align-self: flex-end;
  `}
  
  ${({ isSystem }) => isSystem && `
    align-self: center;
    max-width: 90%;
  `}
`;

const MessageAuthor = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  ${({ isStaff, theme }) => isStaff && `
    color: ${theme.colors.accent};
    justify-content: flex-end;
  `}
  
  ${({ isUser, theme }) => isUser && `
    color: ${theme.colors.text.primary};
  `}
  
  ${({ isSystem, theme }) => isSystem && `
    color: ${theme.colors.text.secondary};
    justify-content: center;
  `}
`;

const MessageContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.border.radius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  line-height: 1.6;
  
  ${({ isStaff, theme }) => isStaff && `
    background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primary}dd);
    color: ${theme.colors.text.primary};
    border-top-right-radius: ${theme.border.radius.sm};
  `}
  
  ${({ isUser, theme }) => isUser && `
    background-color: rgba(255, 255, 255, 0.05);
    color: ${theme.colors.text.primary};
    border-top-left-radius: ${theme.border.radius.sm};
  `}
  
  ${({ isSystem, theme }) => isSystem && `
    background-color: rgba(255, 255, 255, 0.03);
    color: ${theme.colors.text.secondary};
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
    font-style: italic;
  `}
`;

const MessageTime = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.disabled};
  margin-top: ${({ theme }) => theme.spacing.xs};
  
  ${({ isStaff }) => isStaff && `
    text-align: right;
  `}
  
  ${({ isSystem }) => isSystem && `
    text-align: center;
  `}
`;

const ChatInputContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
`;

const SnippetsButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.border.radius.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  svg {
    transition: transform 0.2s ease;
  }
  
  ${({ isOpen }) => isOpen && `
    svg {
      transform: rotate(180deg);
    }
  `}
`;

const ChatInputWrapper = styled.div`
  position: relative;
`;

const ChatTextarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  resize: none;
  min-height: 100px;
  max-height: 200px;
  overflow-y: auto;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    background-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.accent}33`};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const SendButton = styled.button`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.text.primary};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.highlight};
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
    transform: none;
  }
`;

const SnippetsMenu = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.background.medium};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.border.radius.md};
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
  max-height: 250px;
  overflow-y: auto;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  z-index: 10;
`;

const SnippetItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const SnippetName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const SnippetPreview = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ManagementSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ManagementCard = styled.div`
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: ${({ theme }) => theme.border.radius.lg};
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
`;

const DropdownLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

// Format timestamp for display
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Format date for display
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get initials from name
const getInitials = (name) => {
  if (!name) return '?';
  
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// TicketDetail Component
const TicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { 
    activeTicket,
    fetchTicket,
    sendMessage,
    assignStaff,
    assignTeam,
    addTag,
    setPriority,
    closeTicket,
    loading 
  } = useTickets();
  
  const [message, setMessage] = useState('');
  const [showSnippets, setShowSnippets] = useState(false);
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // Mock data for now
  const staff = [
    { id: '1', username: 'John Doe', role: { color: '#4B0082' } },
    { id: '2', username: 'Jane Smith', role: { color: '#2196F3' } },
    { id: '3', username: 'Alex Johnson', role: { color: '#4CAF50' } },
  ];
  
  const teams = [
    { id: '1', name: 'Support Team', color: '#4B0082' },
    { id: '2', name: 'Technical Team', color: '#2196F3' },
  ];
  
  const tags = [
    { id: '1', name: 'Bug', color: '#F44336' },
    { id: '2', name: 'Feature Request', color: '#4CAF50' },
    { id: '3', name: 'Question', color: '#2196F3' },
  ];
  
  const snippets = [
    { id: '1', name: 'Greeting', content: 'Hello! Thank you for contacting support. How can I help you today?' },
    { id: '2', name: 'Closing', content: 'Is there anything else I can help you with? If not, I\'ll close this ticket. Feel free to create a new one if you have more questions in the future.' },
    { id: '3', name: 'Bug Report', content: 'I understand you\'re experiencing an issue. Could you please provide the following information:\n\n1. Steps to reproduce\n2. Expected behavior\n3. Actual behavior\n4. Screenshots (if applicable)\n\nThis will help us investigate the problem more effectively.' },
  ];

  // Fetch ticket when component mounts
  useEffect(() => {
    if (ticketId) {
      fetchTicket(ticketId);
    }
  }, [ticketId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTicket?.messages]);

  // Handle clicking outside snippets menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatInputRef.current && !chatInputRef.current.contains(event.target)) {
        setShowSnippets(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim() && activeTicket) {
      sendMessage(activeTicket.id, message.trim());
      setMessage('');
    }
  };

  // Handle selecting a snippet
  const handleSnippetSelect = (snippet) => {
    setMessage(snippet.content);
    setShowSnippets(false);
    
    // Focus the textarea after snippet selection
    if (chatInputRef.current) {
      chatInputRef.current.querySelector('textarea').focus();
    }
  };

  // Handle key press in textarea
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle going back to dashboard
  const handleBack = () => {
    navigate('/dashboard');
  };

  // Render loading state
  if (loading) {
    return (
      <DetailContainer>
        <TopNav title="Ticket Details" />
        <ContentContainer>
          <BackButton
            variant="outline"
            size="small"
            onClick={handleBack}
            icon={<FiArrowLeft size={16} />}
          >
            Back to Dashboard
          </BackButton>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <LoadingSkeleton height="150px" />
            <LoadingSkeleton height="400px" />
          </div>
        </ContentContainer>
      </DetailContainer>
    );
  }

  // Render if ticket not found
  if (!activeTicket) {
    return (
      <DetailContainer>
        <TopNav title="Ticket Details" />
        <ContentContainer>
          <BackButton
            variant="outline"
            size="small"
            onClick={handleBack}
            icon={<FiArrowLeft size={16} />}
          >
            Back to Dashboard
          </BackButton>
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            marginTop: '20px'
          }}>
            <h2>Ticket Not Found</h2>
            <p>The ticket you're looking for doesn't exist or has been deleted.</p>
          </div>
        </ContentContainer>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <TopNav title="Ticket Details" />
      <ContentContainer>
        <BackButton
          variant="outline"
          size="small"
          onClick={handleBack}
          icon={<FiArrowLeft size={16} />}
        >
          Back to Dashboard
        </BackButton>
        
        <TicketHeaderContainer>
          <HeaderRow>
            <TitleSection>
              <TicketTitle>
                {activeTicket.title}
                <TicketID>#{activeTicket.id}</TicketID>
              </TicketTitle>
              <TicketMeta>
                <MetaItem>
                  <FiUser size={16} />
                  Opened by {activeTicket.opener?.username || 'Unknown'}
                </MetaItem>
                <MetaItem>
                  <FiClock size={16} />
                  {formatDate(activeTicket.createdAt)}
                </MetaItem>
                <StatusTag status={activeTicket.status}>
                  {activeTicket.status === 'open' ? (
                    <>
                      <FiMessageSquare size={16} /> Open
                    </>
                  ) : (
                    <>
                      <FiCheckCircle size={16} /> Closed
                    </>
                  )}
                </StatusTag>
                <PriorityTag priority={activeTicket.priority}>
                  {activeTicket.priority === 'urgent' && <FiAlertCircle size={16} />}
                  {activeTicket.priority === 'medium' && <FiAlertCircle size={16} />}
                  {activeTicket.priority === 'low' && <FiCheckCircle size={16} />}
                  {activeTicket.priority?.charAt(0).toUpperCase() + activeTicket.priority?.slice(1) || 'Normal'} Priority
                </PriorityTag>
              </TicketMeta>
              
              {activeTicket.tags && activeTicket.tags.length > 0 && (
                <TagsContainer>
                  {activeTicket.tags.map(tag => (
                    <Tag key={tag.id} color={tag.color}>
                      <FiTag size={14} />
                      {tag.name}
                    </Tag>
                  ))}
                </TagsContainer>
              )}
            </TitleSection>
            
            <ActionButtons>
              {activeTicket.status === 'open' ? (
                <Button
                  variant="danger"
                  size="small"
                  icon={<FiX size={16} />}
                  onClick={() => closeTicket(activeTicket.id)}
                >
                  Close Ticket
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="small"
                  disabled
                  icon={<FiCheck size={16} />}
                >
                  Closed
                </Button>
              )}
              <Button
                variant="outline"
                size="small"
                icon={<FiMoreVertical size={16} />}
              >
                More
              </Button>
            </ActionButtons>
          </HeaderRow>
          
          <TicketDetails>
            <DetailGroup>
              <DetailLabel>
                <FiUser size={16} />
                Assigned Staff
              </DetailLabel>
              <DetailValue>
                {activeTicket.assignedStaff ? (
                  <>
                    <Avatar color={activeTicket.assignedStaff.role?.color}>
                      {getInitials(activeTicket.assignedStaff.username)}
                    </Avatar>
                    {activeTicket.assignedStaff.username}
                  </>
                ) : (
                  <Unassigned>Unassigned</Unassigned>
                )}
              </DetailValue>
            </DetailGroup>
            
            <DetailGroup>
              <DetailLabel>
                <FiUsers size={16} />
                Assigned Team
              </DetailLabel>
              <DetailValue>
                {activeTicket.assignedTeam ? (
                  <>
                    <ColorBadge color={activeTicket.assignedTeam.color} />
                    {activeTicket.assignedTeam.name}
                  </>
                ) : (
                  <Unassigned>No team assigned</Unassigned>
                )}
              </DetailValue>
            </DetailGroup>
            
            <DetailGroup>
              <DetailLabel>
                <FiMessageSquare size={16} />
                Messages
              </DetailLabel>
              <DetailValue>
                {activeTicket.messages?.length || 0} messages
              </DetailValue>
            </DetailGroup>
            
            {activeTicket.closedAt && (
              <DetailGroup>
                <DetailLabel>
                  <FiCheck size={16} />
                  Closed At
                </DetailLabel>
                <DetailValue>
                  {formatDate(activeTicket.closedAt)}
                </DetailValue>
              </DetailGroup>
            )}
          </TicketDetails>
        </TicketHeaderContainer>
        
        <TicketBodyContainer>
          <ConversationSection>
            <ConversationHeader>
              <ConversationTitle>
                <FiMessageSquare size={20} />
                Conversation
                <MessageCount>{activeTicket.messages?.length || 0}</MessageCount>
              </ConversationTitle>
            </ConversationHeader>
            
            <ConversationMessages>
              {activeTicket.messages && activeTicket.messages.map((msg, index) => (
                <MessageGroup 
                  key={msg.id || index}
                  isStaff={msg.type === 'staff'}
                  isUser={msg.type === 'user'}
                  isSystem={msg.type === 'system'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MessageAuthor 
                    isStaff={msg.type === 'staff'} 
                    isUser={msg.type === 'user'} 
                    isSystem={msg.type === 'system'}
                  >
                    {msg.type === 'staff' && (
                      <Avatar>
                        {getInitials(msg.username || 'Staff')}
                      </Avatar>
                    )}
                    {msg.type === 'staff' ? msg.username || 'Staff' : 
                     msg.type === 'user' ? activeTicket.opener?.username || msg.username || 'User' : 
                     'System'}
                  </MessageAuthor>
                  
                  <MessageContent 
                    isStaff={msg.type === 'staff'} 
                    isUser={msg.type === 'user'} 
                    isSystem={msg.type === 'system'}
                  >
                    {msg.content}
                  </MessageContent>
                  
                  <MessageTime 
                    isStaff={msg.type === 'staff'} 
                    isUser={msg.type === 'user'} 
                    isSystem={msg.type === 'system'}
                  >
                    {formatTime(msg.timestamp)}
                  </MessageTime>
                </MessageGroup>
              ))}
              <div ref={messagesEndRef} />
            </ConversationMessages>
            
            {activeTicket.status === 'open' && (
              <ChatInputContainer>
                <SnippetsButton 
                  onClick={() => setShowSnippets(!showSnippets)}
                  isOpen={showSnippets}
                >
                  <FiSlash size={16} />
                  Use a snippet
                  <FiChevronDown size={16} />
                </SnippetsButton>
                
                <ChatInputWrapper ref={chatInputRef}>
                  <AnimatePresence>
                    {showSnippets && (
                      <SnippetsMenu
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {snippets.map(snippet => (
                          <SnippetItem 
                            key={snippet.id}
                            onClick={() => handleSnippetSelect(snippet)}
                          >
                            <SnippetName>{snippet.name}</SnippetName>
                            <SnippetPreview>{snippet.content}</SnippetPreview>
                          </SnippetItem>
                        ))}
                      </SnippetsMenu>
                    )}
                  </AnimatePresence>
                  
                  <ChatTextarea
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  
                  <SendButton
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    title="Send message"
                  >
                    <FiSend size={18} />
                  </SendButton>
                </ChatInputWrapper>
              </ChatInputContainer>
            )}
          </ConversationSection>
          
          <ManagementSection>
            <ManagementCard>
              <CardHeader>
                <CardTitle>
                  <FiUser size={18} />
                  Assign Staff
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DropdownLabel>
                  <FiUser size={14} />
                  Select Staff Member
                </DropdownLabel>
                <Dropdown
                  options={staff.map(s => ({ value: s.id, label: s.username }))}
                  value={activeTicket.assignedStaff?.id || ''}
                  onChange={(staffId) => assignStaff(activeTicket.id, staffId)}
                  placeholder="Select a staff member"
                />
              </CardContent>
            </ManagementCard>
            
            <ManagementCard>
              <CardHeader>
                <CardTitle>
                  <FiUsers size={18} />
                  Assign Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DropdownLabel>
                  <FiUsers size={14} />
                  Select Team
                </DropdownLabel>
                <Dropdown
                  options={teams.map(t => ({ value: t.id, label: t.name }))}
                  value={activeTicket.assignedTeam?.id || ''}
                  onChange={(teamId) => assignTeam(activeTicket.id, teamId)}
                  placeholder="Select a team"
                />
              </CardContent>
            </ManagementCard>
            
            <ManagementCard>
              <CardHeader>
                <CardTitle>
                  <FiTag size={18} />
                  Add Tag
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DropdownLabel>
                  <FiTag size={14} />
                  Select Tag
                </DropdownLabel>
                <Dropdown
                  options={tags.map(t => ({ value: t.id, label: t.name }))}
                  onChange={(tagId) => addTag(activeTicket.id, tagId)}
                  placeholder="Add a tag"
                />
                {activeTicket.tags && activeTicket.tags.length > 0 && (
                  <TagsContainer>
                    {activeTicket.tags.map(tag => (
                      <Tag key={tag.id} color={tag.color}>
                        <FiTag size={12} />
                        {tag.name}
                      </Tag>
                    ))}
                  </TagsContainer>
                )}
              </CardContent>
            </ManagementCard>
            
            <ManagementCard>
              <CardHeader>
                <CardTitle>
                  <FiAlertCircle size={18} />
                  Set Priority
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DropdownLabel>
                  <FiAlertCircle size={14} />
                  Select Priority
                </DropdownLabel>
                <Dropdown
                  options={[
                    { value: 'low', label: 'Low Priority' },
                    { value: 'medium', label: 'Medium Priority' },
                    { value: 'urgent', label: 'Urgent Priority' }
                  ]}
                  value={activeTicket.priority || 'low'}
                  onChange={(priority) => setPriority(activeTicket.id, priority)}
                  placeholder="Select priority"
                />
              </CardContent>
            </ManagementCard>
          </ManagementSection>
        </TicketBodyContainer>
      </ContentContainer>
    </DetailContainer>
  );
};

// Loading skeleton component
const LoadingSkeleton = styled(motion.div)`
  width: 100%;
  height: ${props => props.height || '120px'};
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03) 25%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0.03) 75%
  );
  background-size: 200% 100%;
  border-radius: ${({ theme }) => theme.border.radius.lg};
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export default TicketDetail;