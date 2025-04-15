import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUsers, FiUserPlus, FiTag } from 'react-icons/fi';
import TopNav from '../components/TopNav';
import RoleManager from '../components/SiteManagement/RoleManager';
import TeamManager from '../components/SiteManagement/TeamManager';
import UserManager from '../components/SiteManagement/UserManager';
import api from '../utils/api';
import { generateId } from '../utils/helpers';

const SiteManagementContainer = styled.div`
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

const TabContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.background.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  border: none;
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ active, theme }) => 
    active ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  
  &:hover {
    background-color: ${({ active, theme }) => 
      active ? theme.colors.primary : theme.colors.background.light};
  }
`;

const TabIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabContent = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.background.dark};
  border-radius: ${({ theme }) => theme.border.radius.lg};
  overflow: hidden;
`;

const SiteManagement = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch management data on initial render
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real app, fetch from API
        // const rolesData = await api.get('/roles');
        // const teamsData = await api.get('/teams');
        // const usersData = await api.get('/users');
        
        // Mock data for demo purposes
        setTimeout(() => {
          setRoles([
            {
              id: '1',
              name: 'Administrator',
              color: '#FF0000',
              permissions: {
                tickets: true,
                stats: true,
                snippets: true,
                siteManagement: true
              }
            },
            {
              id: '2',
              name: 'Moderator',
              color: '#2196F3',
              permissions: {
                tickets: true,
                stats: true,
                snippets: true,
                siteManagement: false
              }
            },
            {
              id: '3',
              name: 'Support Staff',
              color: '#4CAF50',
              permissions: {
                tickets: true,
                stats: false,
                snippets: true,
                siteManagement: false
              }
            }
          ]);
          
          setTeams([
            {
              id: '1',
              name: 'Support Team',
              color: '#2196F3',
              members: [
                { id: '1', username: 'John Doe' },
                { id: '2', username: 'Jane Smith' }
              ]
            },
            {
              id: '2',
              name: 'Technical Team',
              color: '#9C27B0',
              members: [
                { id: '3', username: 'Alex Johnson' }
              ]
            }
          ]);
          
          setUsers([
            {
              id: '1',
              username: 'John Doe',
              discordId: '123456789012345678',
              role: {
                id: '1',
                name: 'Administrator',
                color: '#FF0000'
              }
            },
            {
              id: '2',
              username: 'Jane Smith',
              discordId: '234567890123456789',
              role: {
                id: '2',
                name: 'Moderator',
                color: '#2196F3'
              }
            },
            {
              id: '3',
              username: 'Alex Johnson',
              discordId: '345678901234567890',
              role: {
                id: '3',
                name: 'Support Staff',
                color: '#4CAF50'
              }
            }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch management data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Roles CRUD
  const handleCreateRole = (roleData) => {
    const newRole = {
      id: generateId(),
      ...roleData
    };
    
    setRoles([...roles, newRole]);
    
    // In a real app, save to API
    // api.post('/roles', roleData);
  };
  
  const handleUpdateRole = (roleId, roleData) => {
    const updatedRoles = roles.map(role => 
      role.id === roleId ? { ...role, ...roleData } : role
    );
    
    setRoles(updatedRoles);
    
    // In a real app, save to API
    // api.put(`/roles/${roleId}`, roleData);
  };
  
  const handleDeleteRole = (roleId) => {
    const updatedRoles = roles.filter(role => role.id !== roleId);
    setRoles(updatedRoles);
    
    // In a real app, delete from API
    // api.delete(`/roles/${roleId}`);
  };
  
  // Teams CRUD
  const handleCreateTeam = (teamData) => {
    const newTeam = {
      id: generateId(),
      members: [],
      ...teamData
    };
    
    setTeams([...teams, newTeam]);
    
    // In a real app, save to API
    // api.post('/teams', teamData);
  };
  
  const handleUpdateTeam = (teamId, teamData) => {
    const updatedTeams = teams.map(team => 
      team.id === teamId ? { ...team, ...teamData } : team
    );
    
    setTeams(updatedTeams);
    
    // In a real app, save to API
    // api.put(`/teams/${teamId}`, teamData);
  };
  
  const handleDeleteTeam = (teamId) => {
    const updatedTeams = teams.filter(team => team.id !== teamId);
    setTeams(updatedTeams);
    
    // In a real app, delete from API
    // api.delete(`/teams/${teamId}`);
  };
  
  const handleAddMember = (teamId, userId) => {
    const user = users.find(u => u.id === userId);
    
    if (!user) return;
    
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: [...team.members, user]
        };
      }
      return team;
    });
    
    setTeams(updatedTeams);
    
    // In a real app, save to API
    // api.post(`/teams/${teamId}/members`, { userId });
  };
  
  const handleRemoveMember = (teamId, userId) => {
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: team.members.filter(member => member.id !== userId)
        };
      }
      return team;
    });
    
    setTeams(updatedTeams);
    
    // In a real app, delete from API
    // api.delete(`/teams/${teamId}/members/${userId}`);
  };
  
  // Users CRUD
  const handleAddUser = (userData) => {
    const role = userData.roleId ? roles.find(r => r.id === userData.roleId) : null;
    
    const newUser = {
      id: generateId(),
      username: `User ${users.length + 1}`, // In a real app, this would come from Discord
      discordId: userData.discordId,
      role: role
    };
    
    setUsers([...users, newUser]);
    
    // In a real app, save to API
    // api.post('/users', userData);
  };
  
  const handleUpdateUser = (userId, userData) => {
    const role = userData.roleId ? roles.find(r => r.id === userData.roleId) : null;
    
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          role: role
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    // In a real app, save to API
    // api.put(`/users/${userId}`, userData);
  };
  
  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    
    // In a real app, delete from API
    // api.delete(`/users/${userId}`);
  };
  
  const handleRefreshDiscordUsers = () => {
    // In a real app, fetch latest users from Discord
    // api.get('/users/sync-discord');
    console.log('Refreshing Discord users...');
  };
  
  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 } 
    }
  };
  
  return (
    <SiteManagementContainer>
      <TopNav title="Site Management" />
      
      <ContentContainer>
        <TabContainer>
          <TabButton
            active={activeTab === 'roles'}
            onClick={() => setActiveTab('roles')}
          >
            <TabIcon>
              <FiTag size={18} />
            </TabIcon>
            Roles
          </TabButton>
          
          <TabButton
            active={activeTab === 'teams'}
            onClick={() => setActiveTab('teams')}
          >
            <TabIcon>
              <FiUsers size={18} />
            </TabIcon>
            Teams
          </TabButton>
          
          <TabButton
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
          >
            <TabIcon>
              <FiUserPlus size={18} />
            </TabIcon>
            Staff
          </TabButton>
        </TabContainer>
        
        <TabContent
          key={activeTab}
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          {activeTab === 'roles' && (
            <RoleManager
              roles={roles}
              onCreateRole={handleCreateRole}
              onUpdateRole={handleUpdateRole}
              onDeleteRole={handleDeleteRole}
            />
          )}
          
          {activeTab === 'teams' && (
            <TeamManager
              teams={teams}
              staff={users}
              onCreateTeam={handleCreateTeam}
              onUpdateTeam={handleUpdateTeam}
              onDeleteTeam={handleDeleteTeam}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
            />
          )}
          
          {activeTab === 'users' && (
            <UserManager
              users={users}
              roles={roles}
              isLoading={loading}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onRefreshDiscordUsers={handleRefreshDiscordUsers}
            />
          )}
        </TabContent>
      </ContentContainer>
    </SiteManagementContainer>
  );
};

export default SiteManagement;