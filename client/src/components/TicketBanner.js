import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiClock, FiUser, FiMessageSquare, FiAlertCircle, 
  FiCheckCircle, FiChevronRight, FiTag, FiUsers
} from 'react-icons/fi';

const BannerContainer = styled(motion.div)`
  background: linear-gradient(145deg, 
    ${({ theme }) => theme.colors.background.medium},
    ${({ theme, priority }) => {
      const alpha = '10'; // 10% opacity
      switch (priority) {
        case 'urgent': return `${theme.colors.priority.urgent}${alpha}`;
        case 'medium': return `${theme.colors.priority.medium}${alpha}`;
        case 'low': return `${theme.colors.priority.low}${alpha}`;
        default: return theme.colors.background.dark;
      }
    }}
  );
  border-radius: ${({ theme }) => theme.border.radius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6px;
    background-color: ${({ priority, theme }) => {
      switch (priority) {
        case 'urgent': return theme.colors.priority.urgent;
        case 'medium': return theme.colors.priority.medium;
        case 'low': return theme.colors.priority.low;
        default: return theme.colors.accent;
      }
    }};
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const BannerContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr) minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TicketTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  display: flex;
  align-items: center;
`;

const TicketID = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-left: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const TicketMeta = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const PriorityTag = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.border.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  background-color: ${({ priority, theme }) => {
    switch (priority) {
      case 'urgent': return `${theme.colors.priority.urgent}33`; // 20% opacity
      case 'medium': return `${theme.colors.priority.medium}33`;
      case 'low': return `${theme.colors.priority.low}33`;
      default: return theme.colors.background.light;
    }
  }};
  color: ${({ priority, theme }) => {
    switch (priority) {
      case 'urgent': return theme.colors.priority.urgent;
      case 'medium': return theme.colors.priority.medium;
      case 'low': return theme.colors.priority.low;
      default: return theme.colors.text.secondary;
    }
  }};
`;

const TicketSnippet = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const TagsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.border.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background-color: ${({ color, theme }) => color || theme.colors.background.light};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const AssignmentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatusInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.border.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  width: fit-content;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'open':
        return `
          background-color: ${theme.colors.status.success}22;
          color: ${theme.colors.status.success};
        `;
      case 'closed':
        return `
          background-color: ${theme.colors.status.error}22;
          color: ${theme.colors.status.error};
        `;
      default:
        return `
          background-color: ${theme.colors.background.light};
          color: ${theme.colors.text.secondary};
        `;
    }
  }}
`;

const AssignmentGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const AssignmentGroupHeading = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const AssignmentValue = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
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

const Unassigned = styled.span`
  color: ${({ theme }) => theme.colors.text.disabled};
  font-style: italic;
`;

const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  
  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const ViewButton = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.accent};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  transition: all 0.2s ease;
  
  svg {
    transition: transform 0.2s ease;
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.highlight};
    
    svg {
      transform: translateX(4px);
    }
  }
`;

const MessageCount = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

// Get time ago string
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
};

// Format date
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

const TicketBanner = ({ ticket }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/tickets/${ticket.id}`);
  };
  
  return (
    <BannerContainer 
      priority={ticket.priority}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <BannerContent>
        <TicketInfo>
          <TicketTitle>
            {ticket.title}
            <TicketID>#{ticket.id}</TicketID>
          </TicketTitle>
          
          <TicketMeta>
            <MetaItem>
              <FiUser size={14} />
              {ticket.opener?.username || 'Unknown User'}
            </MetaItem>
            <MetaItem>
              <FiClock size={14} />
              Opened {getTimeAgo(ticket.createdAt)}
            </MetaItem>
            <PriorityTag priority={ticket.priority}>
              {ticket.priority === 'urgent' && <FiAlertCircle size={14} />}
              {ticket.priority === 'medium' && <FiAlertCircle size={14} />}
              {ticket.priority === 'low' && <FiCheckCircle size={14} />}
              {ticket.priority?.charAt(0).toUpperCase() + ticket.priority?.slice(1) || 'Normal'} Priority
            </PriorityTag>
          </TicketMeta>
          
          <TicketSnippet>
            {ticket.lastMessage || 'No messages yet'}
          </TicketSnippet>
          
          {ticket.tags && ticket.tags.length > 0 && (
            <TagsContainer>
              {ticket.tags.map(tag => (
                <Tag key={tag.id} color={tag.color}>
                  <FiTag size={12} style={{ marginRight: '4px' }} />
                  {tag.name}
                </Tag>
              ))}
            </TagsContainer>
          )}
        </TicketInfo>
        
        <AssignmentInfo>
          <StatusInfo status={ticket.status}>
            {ticket.status === 'open' ? (
              <>
                <FiMessageSquare size={14} />
                Open
              </>
            ) : (
              <>
                <FiCheckCircle size={14} />
                Closed
              </>
            )}
          </StatusInfo>
          
          <AssignmentGroup>
            <AssignmentGroupHeading>
              <FiUser size={14} />
              Assigned Staff
            </AssignmentGroupHeading>
            <AssignmentValue>
              {ticket.assignedStaff ? (
                <>
                  <Avatar color={ticket.assignedStaff.role?.color}>
                    {getInitials(ticket.assignedStaff.username)}
                  </Avatar>
                  {ticket.assignedStaff.username}
                </>
              ) : (
                <Unassigned>Unassigned</Unassigned>
              )}
            </AssignmentValue>
          </AssignmentGroup>
          
          <AssignmentGroup>
            <AssignmentGroupHeading>
              <FiUsers size={14} />
              Assigned Team
            </AssignmentGroupHeading>
            <AssignmentValue>
              {ticket.assignedTeam ? (
                <>
                  <span style={{ 
                    display: 'inline-block', 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: ticket.assignedTeam.color,
                    marginRight: '4px'
                  }} />
                  {ticket.assignedTeam.name}
                </>
              ) : (
                <Unassigned>No team assigned</Unassigned>
              )}
            </AssignmentValue>
          </AssignmentGroup>
        </AssignmentInfo>
        
        <ActionArea>
          <MessageCount>
            <FiMessageSquare size={18} />
            {ticket.messages?.length || 0} messages
          </MessageCount>
          <ViewButton>
            View Details
            <FiChevronRight size={18} />
          </ViewButton>
        </ActionArea>
      </BannerContent>
    </BannerContainer>
  );
};

export default TicketBanner;