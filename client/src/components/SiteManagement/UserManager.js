import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiUsers, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import Dropdown from '../UI/Dropdown';

const UserManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.medium};
  border-radius: ${({ theme }) => theme.border.radius.lg};
  overflow: hidden;
`;

const UserManagerHeader = styled.div`
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

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.dark};
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 300px;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-left: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.background.light};
  color: ${({ theme }) => theme.colors.text.primary};
  border: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const UserList = styled.div`
  max-height: 500px;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};
`;

const User = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.dark};
  border-radius: ${({ theme }) => theme.border.radius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.border.radius.full};
  background-color: ${({ color, theme }) => color || theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-right: ${({ theme }) => theme.spacing.md};
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const UserDiscordId = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const UserRole = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ color, theme }) => color || theme.colors.background.light};
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-left: ${({ theme }) => theme.spacing.md};
`;

const UserActions = styled.div`
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

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SpinnerIcon = styled.div`
  font-size: 32px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.accent};
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Get user initials
const getUserInitials = (name) => {
  if (!name) return '?';
  
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const UserManager = ({ 
  users = [], 
  roles = [], 
  isLoading = false,
  onAddUser, 
  onUpdateUser, 
  onDeleteUser,
  onRefreshDiscordUsers
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    discordId: '',
    roleId: ''
  });
  
  // Open add user modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({
      discordId: '',
      roleId: ''
    });
    setShowModal(true);
  };
  
  // Open edit user modal
  const handleOpenEditModal = (user) => {
    setModalMode('edit');
    setCurrentUser(user);
    setFormData({
      discordId: user.discordId,
      roleId: user.role?.id || ''
    });
    setShowModal(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle role selection
  const handleRoleSelect = (roleId) => {
    setFormData({ ...formData, roleId });
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (formData.discordId.trim() === '') return;
    
    if (modalMode === 'add') {
      onAddUser({
        discordId: formData.discordId,
        roleId: formData.roleId
      });
    } else {
      onUpdateUser(currentUser.id, {
        roleId: formData.roleId
      });
    }
    
    setShowModal(false);
  };
  
  // Filter users by search query
  const filteredUsers = searchQuery
    ? users.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.discordId.includes(searchQuery)
      )
    : users;
  
  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2 } 
    }
  };
  
  return (
    <UserManagerContainer>
      <UserManagerHeader>
        <HeaderTitle>Staff Management</HeaderTitle>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            variant="outline" 
            size="small" 
            onClick={onRefreshDiscordUsers}
            icon={<FiRefreshCw size={16} />}
            title="Refresh Discord Users"
          >
            Sync Discord
          </Button>
          <Button 
            variant="primary" 
            size="small" 
            onClick={handleOpenAddModal}
            icon={<FiPlus size={16} />}
          >
            Add Staff
          </Button>
        </div>
      </UserManagerHeader>
      
      <SearchContainer>
        <SearchWrapper>
          <SearchIconWrapper>
            <FiSearch size={16} />
          </SearchIconWrapper>
          <SearchInput
            type="text"
            placeholder="Search staff by name or Discord ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchWrapper>
      </SearchContainer>
      
      {isLoading ? (
        <LoadingState>
          <SpinnerIcon>
            <FiRefreshCw />
          </SpinnerIcon>
          <div>Loading staff members...</div>
        </LoadingState>
      ) : (
        <UserList>
          {filteredUsers.length > 0 ? (
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredUsers.map((user) => (
                <User 
                  key={user.id} 
                  variants={itemVariants}
                >
                  <UserInfo>
                    <UserAvatar color={user.role?.color}>
                      {getUserInitials(user.username)}
                    </UserAvatar>
                    <UserDetails>
                      <UserName>{user.username}</UserName>
                      <UserDiscordId>ID: {user.discordId}</UserDiscordId>
                    </UserDetails>
                    {user.role && (
                      <UserRole color={user.role.color}>
                        {user.role.name}
                      </UserRole>
                    )}
                  </UserInfo>
                  <UserActions>
                    <ActionButton 
                      onClick={() => handleOpenEditModal(user)} 
                      title="Edit User"
                    >
                      <FiEdit2 size={16} />
                    </ActionButton>
                    <ActionButton 
                      onClick={() => onDeleteUser(user.id)} 
                      danger 
                      title="Remove User"
                    >
                      <FiTrash2 size={16} />
                    </ActionButton>
                  </UserActions>
                </User>
              ))}
            </motion.div>
          ) : (
            <EmptyState>
              <EmptyIcon>
                <FiUsers />
              </EmptyIcon>
              <EmptyTitle>No Staff Members Found</EmptyTitle>
              <EmptyMessage>
                {searchQuery 
                  ? `No staff members match "${searchQuery}"`
                  : "Add staff members to manage your ticket system."}
              </EmptyMessage>
              {!searchQuery && (
                <Button 
                  variant="primary" 
                  onClick={handleOpenAddModal}
                  icon={<FiPlus size={16} />}
                >
                  Add First Staff Member
                </Button>
              )}
            </EmptyState>
          )}
        </UserList>
      )}
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'add' ? 'Add Staff Member' : 'Edit Staff Member'}
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
            >
              {modalMode === 'add' ? 'Add Staff' : 'Save Changes'}
            </Button>
          </>
        }
      >
        {modalMode === 'add' && (
          <FormGroup>
            <Input 
              id="discordId"
              name="discordId"
              label="Discord ID"
              placeholder="Enter Discord user ID"
              value={formData.discordId}
              onChange={handleInputChange}
              helperText="Enter the Discord user ID of the staff member"
              required
            />
          </FormGroup>
        )}
        
        <FormGroup>
          <Dropdown
            id="roleId"
            label="Assign Role"
            options={roles.map(role => ({ value: role.id, label: role.name }))}
            value={formData.roleId}
            onChange={handleRoleSelect}
            placeholder="Select a role"
          />
        </FormGroup>
      </Modal>
    </UserManagerContainer>
  );
};

export default UserManager;