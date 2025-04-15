import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInbox, FiArchive, FiUserPlus, FiUserCheck, FiFilter, FiSearch, FiX } from 'react-icons/fi';
import TopNav from '../components/TopNav';
import TicketBanner from '../components/TicketBanner';
import { useTickets } from '../context/TicketContext';

const DashboardContainer = styled.div`
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

const DashboardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary : 'rgba(255, 255, 255, 0.05)'};
  color: ${({ active, theme }) => 
    active ? theme.colors.text.primary : theme.colors.text.secondary};
  border: 1px solid ${({ active, theme }) => 
    active ? theme.colors.accent : 'transparent'};
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-weight: ${({ active, theme }) => 
    active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ active, theme }) => 
      active ? theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FilterBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 ${({ theme }) => theme.spacing.xs};
  background-color: ${({ active, theme }) => 
    active ? theme.colors.accent : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.border.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const SearchContainer = styled.div`
  position: relative;
  margin-left: auto;
  width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md} ${theme.spacing.sm} ${theme.spacing.xl}`};
  background-color: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ focus, theme }) => 
    focus ? theme.colors.accent : 'transparent'};
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.1);
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.accent}33`};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ClearButton = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const TicketsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: ${({ theme }) => theme.border.radius.lg};
  border: 1px dashed rgba(255, 255, 255, 0.1);
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const EmptyStateIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.disabled};
  opacity: 0.6;
`;

const EmptyStateTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyStateMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
`;

const LoadingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

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

// Dashboard component
const Dashboard = () => {
  const {
    openTickets,
    closedTickets,
    unassignedTickets,
    claimedTickets,
    loading,
    fetchAllTickets
  } = useTickets();

  const [currentFilter, setCurrentFilter] = useState('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const filterOptions = [
    {
      id: 'open',
      label: 'Open Tickets',
      count: openTickets.length,
      icon: <FiInbox size={18} />
    },
    {
      id: 'claimed',
      label: 'Claimed Tickets',
      count: claimedTickets.length,
      icon: <FiUserCheck size={18} />
    },
    {
      id: 'unassigned',
      label: 'Unassigned',
      count: unassignedTickets.length,
      icon: <FiUserPlus size={18} />
    },
    {
      id: 'closed',
      label: 'Closed Tickets',
      count: closedTickets.length,
      icon: <FiArchive size={18} />
    }
  ];

  const getFilteredTickets = () => {
    let tickets = [];
    
    switch(currentFilter) {
      case 'open':
        tickets = openTickets;
        break;
      case 'closed':
        tickets = closedTickets;
        break;
      case 'unassigned':
        tickets = unassignedTickets;
        break;
      case 'claimed':
        tickets = claimedTickets;
        break;
      default:
        tickets = openTickets;
    }
    
    if (!searchQuery.trim()) return tickets;
    
    return tickets.filter(ticket => 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.opener?.username && 
        ticket.opener.username.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredTickets = getFilteredTickets();

  // Get appropriate empty state content based on filter
  const getEmptyStateContent = () => {
    if (searchQuery.trim()) {
      return {
        icon: <FiSearch />,
        title: 'No matching tickets',
        message: `No tickets match your search "${searchQuery}". Try adjusting your search terms or clear the search.`
      };
    }
    
    switch(currentFilter) {
      case 'open':
        return {
          icon: <FiInbox />,
          title: 'No open tickets',
          message: 'There are currently no open tickets in the system. Open tickets will appear here.'
        };
      case 'closed':
        return {
          icon: <FiArchive />,
          title: 'No closed tickets',
          message: 'There are currently no closed tickets in the system. Tickets that have been resolved will appear here.'
        };
      case 'unassigned':
        return {
          icon: <FiUserPlus />,
          title: 'No unassigned tickets',
          message: 'There are currently no unassigned tickets. Tickets that haven\'t been claimed by a staff member will appear here.'
        };
      case 'claimed':
        return {
          icon: <FiUserCheck />,
          title: 'No claimed tickets',
          message: 'There are currently no tickets claimed by you. Tickets that you respond to will appear here.'
        };
      default:
        return {
          icon: <FiInbox />,
          title: 'No tickets found',
          message: 'There are currently no tickets in the system.'
        };
    }
  };

  const emptyState = getEmptyStateContent();

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <DashboardContainer>
      <TopNav title="Ticket Dashboard" />
      
      <ContentContainer>
        <DashboardHeader>
          <FilterSection>
            {filterOptions.map(filter => (
              <FilterButton
                key={filter.id}
                active={currentFilter === filter.id}
                onClick={() => setCurrentFilter(filter.id)}
              >
                {filter.icon}
                {filter.label}
                {filter.count > 0 && (
                  <FilterBadge active={currentFilter === filter.id}>
                    {filter.count}
                  </FilterBadge>
                )}
              </FilterButton>
            ))}
            
            <SearchContainer>
              <SearchIcon>
                <FiSearch size={16} />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
                focus={searchFocus}
              />
              {searchQuery && (
                <ClearButton onClick={() => setSearchQuery('')}>
                  <FiX size={16} />
                </ClearButton>
              )}
            </SearchContainer>
          </FilterSection>
        </DashboardHeader>
        
        {loading ? (
          <LoadingContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSkeleton height="120px" />
            <LoadingSkeleton height="120px" />
            <LoadingSkeleton height="120px" />
          </LoadingContainer>
        ) : (
          <AnimatePresence mode="wait">
            {filteredTickets.length > 0 ? (
              <TicketsContainer
                key="tickets-list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                {filteredTickets.map(ticket => (
                  <TicketBanner key={ticket.id} ticket={ticket} />
                ))}
              </TicketsContainer>
            ) : (
              <EmptyState
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <EmptyStateIcon>
                  {emptyState.icon}
                </EmptyStateIcon>
                <EmptyStateTitle>{emptyState.title}</EmptyStateTitle>
                <EmptyStateMessage>{emptyState.message}</EmptyStateMessage>
              </EmptyState>
            )}
          </AnimatePresence>
        )}
      </ContentContainer>
    </DashboardContainer>
  );
};

export default Dashboard;