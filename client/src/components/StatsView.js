import React from 'react';
import styled from 'styled-components';
import { FiMessageSquare, FiCheckSquare, FiPieChart, FiUser, FiClock, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StatsSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatsCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.background.medium};
  border-radius: ${({ theme }) => theme.border.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
`;

const StatsCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatsCardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const StatsCardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.border.radius.md};
  background-color: ${({ color, theme }) => color || theme.colors.primary}22;
  color: ${({ color, theme }) => color || theme.colors.primary};
`;

const StatsCardValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatsCardMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const PercentageChange = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ increase, theme }) => 
    increase ? theme.colors.status.success : theme.colors.status.error};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const StatsChartCard = styled(StatsCard)`
  grid-column: span 2;
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const StatsChartTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ChartContainer = styled.div`
  height: 250px;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const TabsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Tab = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.background.light};
  color: ${({ active, theme }) => 
    active ? theme.colors.text.primary : theme.colors.text.secondary};
  border: none;
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ active, theme }) => 
    active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  
  &:hover {
    background-color: ${({ active, theme }) => 
      active ? theme.colors.primary : theme.colors.background.medium};
  }
`;

const StatsTable = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.medium};
  border-radius: ${({ theme }) => theme.border.radius.lg};
  overflow: hidden;
`;

const StatsTableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.dark};
`;

const StatsTableTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  border-bottom: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.dark};
`;

const TableHeadCell = styled.th`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.dark};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.light};
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background.light};
  border-radius: ${({ theme }) => theme.border.radius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
`;

const StatsView = ({ stats, staffStats }) => {
  const [timeRange, setTimeRange] = React.useState('month');
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut" 
      } 
    })
  };
  
  return (
    <StatsContainer>
      <StatsSummary>
        <StatsCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <StatsCardHeader>
            <StatsCardTitle>Total Tickets</StatsCardTitle>
            <StatsCardIcon color={stats.colors.total}>
              <FiMessageSquare size={20} />
            </StatsCardIcon>
          </StatsCardHeader>
          <StatsCardValue>{stats.totalTickets}</StatsCardValue>
          <StatsCardMeta>
            Lifetime tickets processed
          </StatsCardMeta>
        </StatsCard>
        
        <StatsCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <StatsCardHeader>
            <StatsCardTitle>Monthly Closes</StatsCardTitle>
            <StatsCardIcon color={stats.colors.monthly}>
              <FiCheckSquare size={20} />
            </StatsCardIcon>
          </StatsCardHeader>
          <StatsCardValue>{stats.monthlyCloses}</StatsCardValue>
          <StatsCardMeta>
            Tickets closed this month
            {stats.monthlyClosesChange !== 0 && (
              <PercentageChange increase={stats.monthlyClosesChange > 0}>
                <FiTrendingUp size={14} />
                {stats.monthlyClosesChange > 0 ? '+' : ''}{stats.monthlyClosesChange}%
              </PercentageChange>
            )}
          </StatsCardMeta>
        </StatsCard>
        
        <StatsCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <StatsCardHeader>
            <StatsCardTitle>Average Response Time</StatsCardTitle>
            <StatsCardIcon color={stats.colors.response}>
              <FiClock size={20} />
            </StatsCardIcon>
          </StatsCardHeader>
          <StatsCardValue>{stats.avgResponseTime}</StatsCardValue>
          <StatsCardMeta>
            Average first response time
          </StatsCardMeta>
        </StatsCard>
        
        <StatsCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <StatsCardHeader>
            <StatsCardTitle>Tickets Per Staff</StatsCardTitle>
            <StatsCardIcon color={stats.colors.perStaff}>
              <FiUser size={20} />
            </StatsCardIcon>
          </StatsCardHeader>
          <StatsCardValue>{stats.ticketsPerStaff}</StatsCardValue>
          <StatsCardMeta>
            Average tickets per staff member
          </StatsCardMeta>
        </StatsCard>
        
        <StatsChartCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          <StatsChartTitle>Ticket Activity</StatsChartTitle>
          
          <TabsContainer>
            <Tab 
              active={timeRange === 'week'} 
              onClick={() => setTimeRange('week')}
            >
              Last 7 Days
            </Tab>
            <Tab 
              active={timeRange === 'month'} 
              onClick={() => setTimeRange('month')}
            >
              Last 30 Days
            </Tab>
            <Tab 
              active={timeRange === 'year'} 
              onClick={() => setTimeRange('year')}
            >
              Last 12 Months
            </Tab>
          </TabsContainer>
          
          <ChartContainer>
            <ChartPlaceholder>
              [Line chart showing opened vs closed tickets over time]
            </ChartPlaceholder>
          </ChartContainer>
        </StatsChartCard>
      </StatsSummary>
      
      <StatsTable>
        <StatsTableHeader>
          <StatsTableTitle>Staff Performance</StatsTableTitle>
        </StatsTableHeader>
        
        <TableWrapper>
          <Table>
            <TableHead>
              <tr>
                <TableHeadCell>Staff Member</TableHeadCell>
                <TableHeadCell>Monthly Closes</TableHeadCell>
                <TableHeadCell>Lifetime Closes</TableHeadCell>
                <TableHeadCell>Average Response Time</TableHeadCell>
                <TableHeadCell>Satisfaction Rate</TableHeadCell>
              </tr>
            </TableHead>
            <TableBody>
              {staffStats.map((staff, index) => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.username}</TableCell>
                  <TableCell>{staff.monthlyCloses}</TableCell>
                  <TableCell>{staff.lifetimeCloses}</TableCell>
                  <TableCell>{staff.avgResponseTime}</TableCell>
                  <TableCell>{staff.satisfactionRate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      </StatsTable>
    </StatsContainer>
  );
};

export default StatsView;