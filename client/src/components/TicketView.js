import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { FiMessageSquare } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiX, FiChevronDown, FiAlertCircle, FiCheckCircle, FiSlash, FiTag, FiUsers, FiUser } from 'react-icons/fi';
import Button from './UI/Button';
import Dropdown from './UI/Dropdown';

const TicketViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.medium};
  border-radius: ${({ theme }) => theme.border.radius.lg};
  overflow: hidden;
  height: 100%;
`;

const TicketHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.dark};
`;

const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TicketTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
`;

const TicketID = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-left: ${({ theme }) => theme.spacing.sm};
`;

const TicketMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const TicketMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TicketBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ChatSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  border-right: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.dark};
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 80%;
  
  ${({ isStaff }) => isStaff && css`
    align-self: flex-end;
  `}
`;

const MessageAuthor = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  ${({ isStaff, theme }) => isStaff && css`
    text-align: right;
    color: ${theme.colors.accent};
  `}
  
  ${({ isUser, theme }) => isUser && css`
    color: ${theme.colors.text.primary};
  `}
  
  ${({ isSystem, theme }) => isSystem && css`
    color: ${theme.colors.text.secondary};
  `}
`;

const MessageContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  
  ${({ isStaff, theme }) => isStaff && css`
    background-color: ${theme.colors.primary};
    color: ${theme.colors.text.primary};
    border-top-right-radius: ${theme.border.radius.sm};
  `}
  
  ${({ isUser, theme }) => isUser && css`
    background-color: ${theme.colors.background.light};
    color: ${theme.colors.text.primary};
    border-top-left-radius: ${theme.border.radius.sm};
  `}
  
  ${({ isSystem, theme }) => isSystem && css`
    background-color: ${theme.colors.background.dark};
    color: ${theme.colors.text.secondary};
    border: ${theme.border.width.thin} solid ${theme.colors.border.medium};
    text-align: center;
    font-style: italic;
  `}
`;

const MessageTime = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.disabled};
  margin-top: ${({ theme }) => theme.spacing.xs};
  
  ${({ isStaff }) => isStaff && css`
    text-align: right;
  `}
`;

const ChatInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md};
  border-top: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.dark};
`;

const ChatInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
`;

const ChatTextarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  padding-right: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.background.light};
  color: ${({ theme }) => theme.colors.text.primary};
  border: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  resize: none;
  min-height: 80px;
  max-height: 200px;
  overflow-y: auto;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
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
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.border.radius.full};
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.text.primary};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.background.light};
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;

const SnippetsButton = styled.button`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  border: none;
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.light};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const SnippetsMenu = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.background.medium};
  border: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.border.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
`;

const SnippetItem = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transition.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.light};
  }
`;

const SnippetName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SnippetPreview = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InfoSection = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.lg};
  border-left: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.dark};
`;

const InfoSectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InfoItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InfoItemLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StaffAvatarGroup = styled.div`
  display: flex;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const StaffAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.border.radius.full};
  background-color: ${({ color, theme }) => color || theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-right: ${({ theme }) => theme.spacing.xs};
  border: 2px solid ${({ theme }) => theme.colors.background.medium};
  margin-left: -8px;
  
  &:first-child {
    margin-left: 0;
  }
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.border.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background-color: ${({ color, theme }) => color || theme.colors.background.light};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PriorityIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-top: ${({ theme }) => theme.spacing.xs};
  
  ${({ priority, theme }) => {
    switch (priority) {
      case 'urgent':
        return css`
          background-color: ${theme.colors.priority.urgent}33;
          color: ${theme.colors.priority.urgent};
        `;
      case 'medium':
        return css`
          background-color: ${theme.colors.priority.medium}33;
          color: ${theme.colors.priority.medium};
        `;
      case 'low':
        return css`
          background-color: ${theme.colors.priority.low}33;
          color: ${theme.colors.priority.low};
        `;
      default:
        return css`
          background-color: ${theme.colors.background.light};
          color: ${theme.colors.text.secondary};
        `;
    }
  }}
`;

const TicketView = ({
  ticket,
  onSendMessage,
  onAssignStaff,
  onAssignTeam,
  onAddTag,
  onChangePriority,
  onCloseTicket,
  snippets = [],
  staff = [],
  teams = [],
  tags = [],
  user = {},
}) => {
  const [message, setMessage] = useState('');
  const [showSnippets, setShowSnippets] = useState(false);
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Format date to time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get user initials
  const getUserInitials = (name) => {
    if (!name) return '?';
    
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticket?.messages]);
  
  // Handle send message
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };
  
  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle snippet select
  const handleSnippetSelect = (snippet) => {
    setMessage(snippet.content);
    setShowSnippets(false);
    
    // Focus the input
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  };
  
  // Handle outside click for snippets menu
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
  
  if (!ticket) {
    return (
      <TicketViewContainer>
        <div style={{ 
          display: 'flex', 
          flex: 1, 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#808080',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div>
            <FiMessageSquare size={48} style={{ marginBottom: '16px' }} />
            <h3>Select a ticket to view</h3>
            <p>Choose a ticket from the list to view its details and reply.</p>
          </div>
        </div>
      </TicketViewContainer>
    );
  }
  
  return (
    <TicketViewContainer>
      <TicketHeader>
        <TicketInfo>
          <TicketTitle>
            {ticket.title}
            <TicketID>#{ticket.id}</TicketID>
          </TicketTitle>
          <TicketMeta>
            <TicketMetaItem>
              Opened by {ticket.opener.username}
            </TicketMetaItem>
            <TicketMetaItem>
              {formatDate(ticket.createdAt)}
            </TicketMetaItem>
          </TicketMeta>
        </TicketInfo>
        
        <HeaderActions>
          <Button 
            variant="danger" 
            size="small"
            icon={<FiX size={16} />}
            onClick={onCloseTicket}
          >
            Close Ticket
          </Button>
        </HeaderActions>
      </TicketHeader>
      
      <TicketBody>
        <ChatSection>
          <ChatMessages>
            {ticket.messages.map((msg, index) => (
              <MessageGroup 
                key={index} 
                isStaff={msg.type === 'staff'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MessageAuthor 
                  isStaff={msg.type === 'staff'} 
                  isUser={msg.type === 'user'} 
                  isSystem={msg.type === 'system'}
                >
                  {msg.type === 'staff' ? msg.author : msg.type === 'user' ? ticket.opener.username : 'System'}
                </MessageAuthor>
                
                <MessageContent 
                  isStaff={msg.type === 'staff'} 
                  isUser={msg.type === 'user'} 
                  isSystem={msg.type === 'system'}
                >
                  {msg.content}
                </MessageContent>
                
                <MessageTime isStaff={msg.type === 'staff'}>
                  {formatTime(msg.timestamp)}
                </MessageTime>
              </MessageGroup>
            ))}
            <div ref={messagesEndRef} />
          </ChatMessages>
          
          <ChatInputContainer>
            <SnippetsButton 
              onClick={() => setShowSnippets(!showSnippets)} 
              role="button"
              aria-label="Show snippets"
            >
              <FiSlash size={16} style={{ marginRight: '4px' }} /> Use a snippet
              <FiChevronDown 
                size={16} 
                style={{ 
                  marginLeft: '4px',
                  transform: showSnippets ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }} 
              />
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
                    {snippets.length > 0 ? (
                      snippets.map((snippet) => (
                        <SnippetItem 
                          key={snippet.id} 
                          onClick={() => handleSnippetSelect(snippet)}
                        >
                          <SnippetName>{snippet.name}</SnippetName>
                          <SnippetPreview>{snippet.content}</SnippetPreview>
                        </SnippetItem>
                      ))
                    ) : (
                      <SnippetItem>No snippets available</SnippetItem>
                    )}
                  </SnippetsMenu>
                )}
              </AnimatePresence>
              
              <ChatTextarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                ref={chatInputRef}
              />
              
              <SendButton 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                aria-label="Send message"
              >
                <FiSend size={16} />
              </SendButton>
            </ChatInputWrapper>
          </ChatInputContainer>
        </ChatSection>
        
        <InfoSection>
          <InfoSectionTitle>Ticket Information</InfoSectionTitle>
          
          <InfoItem>
            <InfoItemLabel>
              <FiUser size={16} /> Assigned Staff Member
            </InfoItemLabel>
            <Dropdown
              options={staff.map(s => ({ value: s.id, label: s.username }))}
              value={ticket.assignedStaff?.id}
              onChange={onAssignStaff}
              placeholder="Assign staff member"
            />
          </InfoItem>
          
          <InfoItem>
            <InfoItemLabel>
              <FiUsers size={16} /> Assigned Team
            </InfoItemLabel>
            <Dropdown
              options={teams.map(t => ({ value: t.id, label: t.name }))}
              value={ticket.assignedTeam?.id}
              onChange={onAssignTeam}
              placeholder="Assign team"
            />
          </InfoItem>
          
          <InfoItem>
            <InfoItemLabel>
              <FiTag size={16} /> Tags
            </InfoItemLabel>
            <Dropdown
              options={tags.map(t => ({ value: t.id, label: t.name }))}
              onChange={onAddTag}
              placeholder="Add tag"
            />
            {ticket.tags && ticket.tags.length > 0 && (
              <TagsList>
                {ticket.tags.map(tag => (
                  <Tag key={tag.id} color={tag.color}>
                    {tag.name}
                  </Tag>
                ))}
              </TagsList>
            )}
          </InfoItem>
          
          <InfoItem>
            <InfoItemLabel>
              <FiAlertCircle size={16} /> Priority
            </InfoItemLabel>
            <Dropdown
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'urgent', label: 'Urgent' }
              ]}
              value={ticket.priority || 'low'}
              onChange={onChangePriority}
            />
            <PriorityIndicator priority={ticket.priority || 'low'}>
              {ticket.priority === 'urgent' && <FiAlertCircle size={16} />}
              {ticket.priority === 'medium' && <FiAlertCircle size={16} />}
              {ticket.priority === 'low' && <FiCheckCircle size={16} />}
              {ticket.priority ? ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1) : 'Low'} Priority
            </PriorityIndicator>
          </InfoItem>
          
          {ticket.assignedTeam && (
            <InfoItem>
              <InfoItemLabel>Team Members</InfoItemLabel>
              <StaffAvatarGroup>
                {ticket.assignedTeam.members && ticket.assignedTeam.members.map((member, index) => (
                  <StaffAvatar
                    key={member.id}
                    color={ticket.assignedTeam.color}
                    title={member.username}
                  >
                    {getUserInitials(member.username)}
                  </StaffAvatar>
                ))}
              </StaffAvatarGroup>
            </InfoItem>
          )}
        </InfoSection>
      </TicketBody>
    </TicketViewContainer>
  );
};

export default TicketView;