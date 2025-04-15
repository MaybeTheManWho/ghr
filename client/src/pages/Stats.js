import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import StatsView from '../components/StatsView';
import TopNav from '../components/TopNav';
import api from '../utils/api';

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
`;

const StatsContent = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
`;

const Stats = () => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    monthlyCloses: 0,
    monthlyClosesChange: 0,
    avgResponseTime: '00:00',
    ticketsPerStaff: 0,
    colors: {
      total: '#2196F3',
      monthly: '#4CAF50',
      response: '#FF9800',
      perStaff: '#9C27B0'
    }
  });
  
  const [staffStats, setStaffStats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch stats data on initial render
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // In a real app, fetch from API
        // const statsData = await api.get('/stats');
        // const staffStatsData = await api.get('/stats/staff');
        
        // Mock data for demo purposes
        setTimeout(() => {
          setStats({
            totalTickets: 127,
            monthlyCloses: 43,
            monthlyClosesChange: 12,
            avgResponseTime: '14:32',
            ticketsPerStaff: 18,
            colors: {
              total: '#2196F3',
              monthly: '#4CAF50',
              response: '#FF9800',
              perStaff: '#9C27B0'
            }
          });
          
          setStaffStats([
            {
              id: '1',
              username: 'John Doe',
              monthlyCloses: 18,
              lifetimeCloses: 56,
              avgResponseTime: '12:45',
              satisfactionRate: 98
            },
            {
              id: '2',
              username: 'Jane Smith',
              monthlyCloses: 15,
              lifetimeCloses: 42,
              avgResponseTime: '15:20',
              satisfactionRate: 95
            },
            {
              id: '3',
              username: 'Alex Johnson',
              monthlyCloses: 10,
              lifetimeCloses: 29,
              avgResponseTime: '17:10',
              satisfactionRate: 92
            }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <StatsContainer>
      <TopNav title="Staff Statistics" />
      
      <ContentContainer>
        <StatsContent
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatsView 
            stats={stats}
            staffStats={staffStats}
          />
        </StatsContent>
      </ContentContainer>
    </StatsContainer>
  );
};

export default Stats;