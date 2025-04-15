import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiUsers, FiUserPlus, FiUserMinus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import ColorPicker from '../UI/ColorPicker';
import Dropdown from '../UI/Dropdown';

const TeamManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.medium};
  border-radius: ${({ theme }) => theme.border.radius.lg};
  overflow: hidden;
`;

const TeamManagerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.dark};
`;

const HeaderTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const TeamsList = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const Team = styled(motion.div)`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.dark};
  border-radius: ${({ theme }) => theme.border.radius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  overflow: hidden;
  border-left: ${({ theme, color }) => `${theme.border.width.thick} solid ${color || theme.colors.accent}`};
`;

const TeamHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
`;

const TeamInfo = styled.div`
  display: flex;
  align-items: center;
`;

const TeamColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: ${({ theme }) => theme.border.radius.full};
  background-color: ${({ color }) => color};
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const TeamName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TeamActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.border.radius.full};
  background-color: ${({ theme }) => theme.colors.background.light};
  color: ${({ theme }) => theme.colors.text.secondary};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  
  &:hover {
    background-color: ${({ theme, danger }) => danger ? theme.colors.status.error : theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const TeamMembers = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
`;

const MembersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const MembersTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MemberCount = styled.span`
  background-color: ${({ theme }) => theme.colors.background.light};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.border.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

const MembersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.light};
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const MemberAvatar = styled.div`
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.border.radius.full};
  background-color: ${({ color, theme }) => color || theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const MemberName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const RemoveMemberButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: ${({ theme }) => theme.border.radius.full};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.status.error};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.disabled};
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EmptyMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyMembers = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const MemberSelection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const MemberSelectionTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

// Get user initials
const getUserInitials = (name) => {
  if (!name) return '?';
  
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const TeamManager = ({ teams = [], staff = [], onCreateTeam, onUpdateTeam, onDeleteTeam, onAddMember, onRemoveMember }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', or 'addMember'
  const [currentTeam, setCurrentTeam] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    color: '#4B0082', // Default indigo color
  });
  
  // Open create team modal
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      color: '#4B0082', // Default indigo color
    });
    setShowModal(true);
  };
  
  // Open edit team modal
  const handleOpenEditModal = (team) => {
    setModalMode('edit');
    setCurrentTeam(team);
    setFormData({
      name: team.name,
      color: team.color,
    });
    setShowModal(true);
  };
  
  // Open add member modal
  const handleOpenAddMemberModal = (team) => {
    setModalMode('addMember');
    setCurrentTeam(team);
    setSelectedStaff('');
    setShowModal(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle color change
  const handleColorChange = (color) => {
    setFormData({ ...formData, color });
  };
  
  // Handle staff selection
  const handleStaffSelect = (staffId) => {
    setSelectedStaff(staffId);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (modalMode === 'addMember' && selectedStaff) {
      onAddMember(currentTeam.id, selectedStaff);
      setShowModal(false);
      return;
    }
    
    if (formData.name.trim() === '') return;
    
    if (modalMode === 'create') {
      onCreateTeam(formData);
    } else if (modalMode === 'edit') {
      onUpdateTeam(currentTeam.id, formData);
    }
    
    setShowModal(false);
  };
  
  // Filter staff not already in the team
  const getAvailableStaff = (team) => {
    if (!team) return staff;
    
    const teamMemberIds = team.members.map(member => member.id);
    return staff.filter(s => !teamMemberIds.includes(s.id));
  };
  
  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 } 
    }
  };
  
  return (
    <TeamManagerContainer>
      <TeamManagerHeader>
        <HeaderTitle>Teams Management</HeaderTitle>
        <Button 
          variant="primary" 
          size="small" 
          onClick={handleOpenCreateModal}
          icon={<FiPlus size={16} />}
        >
          Create Team
        </Button>
      </TeamManagerHeader>
      
      <TeamsList>
        {teams.length > 0 ? (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {teams.map((team) => (
              <Team 
                key={team.id} 
                color={team.color}
                variants={itemVariants}
              >
                <TeamHeader>
                  <TeamInfo>
                    <TeamColor color={team.color} />
                    <TeamName>{team.name}</TeamName>
                  </TeamInfo>
                  <TeamActions>
                    <ActionButton 
                      onClick={() => handleOpenAddMemberModal(team)} 
                      title="Add Member"
                    >
                      <FiUserPlus size={16} />
                    </ActionButton>
                    <ActionButton 
                      onClick={() => handleOpenEditModal(team)} 
                      title="Edit Team"
                    >
                      <FiEdit2 size={16} />
                    </ActionButton>
                    <ActionButton 
                      onClick={() => onDeleteTeam(team.id)} 
                      danger 
                      title="Delete Team"
                    >
                      <FiTrash2 size={16} />
                    </ActionButton>
                  </TeamActions>
                </TeamHeader>
                
                <TeamMembers>
                  <MembersHeader>
                    <MembersTitle>
                      Team Members
                      <MemberCount>{team.members.length}</MemberCount>
                    </MembersTitle>
                  </MembersHeader>
                  
                  {team.members.length > 0 ? (
                    <MembersList>
                      {team.members.map((member) => (
                        <MemberItem key={member.id}>
                          <MemberAvatar color={team.color}>
                            {getUserInitials(member.username)}
                          </MemberAvatar>
                          <MemberName>{member.username}</MemberName>
                          <RemoveMemberButton
                            onClick={() => onRemoveMember(team.id, member.id)}
                            title="Remove Member"
                          >
                            <FiX size={14} />
                          </RemoveMemberButton>
                        </MemberItem>
                      ))}
                    </MembersList>
                  ) : (
                    <EmptyMembers>
                      No members in this team.
                      <Button 
                        variant="outline" 
                        size="small" 
                        onClick={() => handleOpenAddMemberModal(team)}
                        icon={<FiUserPlus size={14} />}
                        style={{ marginTop: '8px' }}
                      >
                        Add Member
                      </Button>
                    </EmptyMembers>
                  )}
                </TeamMembers>
              </Team>
            ))}
          </motion.div>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <FiUsers />
            </EmptyIcon>
            <EmptyTitle>No Teams Created</EmptyTitle>
            <EmptyMessage>
              Create teams to organize your staff members and assign tickets by team.
            </EmptyMessage>
            <Button 
              variant="primary" 
              onClick={handleOpenCreateModal}
              icon={<FiPlus size={16} />}
            >
              Create First Team
            </Button>
          </EmptyState>
        )}
      </TeamsList>
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalMode === 'create' 
            ? 'Create New Team' 
            : modalMode === 'edit' 
              ? 'Edit Team' 
              : `Add Member to ${currentTeam?.name}`
        }
        footerContent={
          <>
            <Button 
              variant="outline" 
              onClick={() => setShowModal(false)}
              icon={<FiX size={16} />}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              icon={<FiCheck size={16} />}
              disabled={modalMode === 'addMember' && !selectedStaff}
            >
              {modalMode === 'create' 
                ? 'Create Team' 
                : modalMode === 'edit' 
                  ? 'Save Changes' 
                  : 'Add Member'}
            </Button>
          </>
        }
      >
        {(modalMode === 'create' || modalMode === 'edit') && (
          <>
            <FormGroup>
              <Input 
                id="name"
                name="name"
                label="Team Name"
                placeholder="Enter team name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <ColorPicker
                id="color"
                label="Team Color"
                value={formData.color}
                onChange={handleColorChange}
              />
            </FormGroup>
          </>
        )}
        
        {modalMode === 'addMember' && (
          <MemberSelection>
            <MemberSelectionTitle>Select Staff Member</MemberSelectionTitle>
            <Dropdown
              options={getAvailableStaff(currentTeam).map(s => ({ 
                value: s.id, 
                label: s.username 
              }))}
              value={selectedStaff}
              onChange={handleStaffSelect}
              placeholder="Select a staff member"
              emptyMessage="No available staff members"
            />
          </MemberSelection>
        )}
      </Modal>
    </TeamManagerContainer>
  );
};

export default TeamManager;