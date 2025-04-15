import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiUsers } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import ColorPicker from '../UI/ColorPicker';

const RoleManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.medium};
  border-radius: ${({ theme }) => theme.border.radius.lg};
  overflow: hidden;
`;

const RoleManagerHeader = styled.div`
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

const RolesList = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const Role = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.dark};
  border-radius: ${({ theme }) => theme.border.radius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-left: ${({ theme, color }) => `${theme.border.width.thick} solid ${color || theme.colors.accent}`};
`;

const RoleInfo = styled.div`
  display: flex;
  align-items: center;
`;

const RoleColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: ${({ theme }) => theme.border.radius.full};
  background-color: ${({ color }) => color};
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const RoleName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const RoleActions = styled.div`
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

const FormLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${({ theme }) => theme.colors.accent};
`;

const RoleManager = ({ roles = [], onCreateRole, onUpdateRole, onDeleteRole }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentRole, setCurrentRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#4B0082', // Default indigo color
    permissions: {
      tickets: false,
      stats: false,
      snippets: false,
      siteManagement: false
    }
  });
  
  // Open create role modal
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      color: '#4B0082', // Default indigo color
      permissions: {
        tickets: false,
        stats: false,
        snippets: false,
        siteManagement: false
      }
    });
    setShowModal(true);
  };
  
  // Open edit role modal
  const handleOpenEditModal = (role) => {
    setModalMode('edit');
    setCurrentRole(role);
    setFormData({
      name: role.name,
      color: role.color,
      permissions: { ...role.permissions }
    });
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
  
  // Handle permission changes
  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [name]: checked
      }
    });
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (formData.name.trim() === '') return;
    
    if (modalMode === 'create') {
      onCreateRole(formData);
    } else {
      onUpdateRole(currentRole.id, formData);
    }
    
    setShowModal(false);
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
    <RoleManagerContainer>
      <RoleManagerHeader>
        <HeaderTitle>Roles Management</HeaderTitle>
        <Button 
          variant="primary" 
          size="small" 
          onClick={handleOpenCreateModal}
          icon={<FiPlus size={16} />}
        >
          Create Role
        </Button>
      </RoleManagerHeader>
      
      <RolesList>
        {roles.length > 0 ? (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {roles.map((role) => (
              <Role 
                key={role.id} 
                color={role.color}
                variants={itemVariants}
              >
                <RoleInfo>
                  <RoleColor color={role.color} />
                  <RoleName>{role.name}</RoleName>
                </RoleInfo>
                <RoleActions>
                  <ActionButton 
                    onClick={() => handleOpenEditModal(role)} 
                    title="Edit Role"
                  >
                    <FiEdit2 size={16} />
                  </ActionButton>
                  <ActionButton 
                    onClick={() => onDeleteRole(role.id)} 
                    danger 
                    title="Delete Role"
                  >
                    <FiTrash2 size={16} />
                  </ActionButton>
                </RoleActions>
              </Role>
            ))}
          </motion.div>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <FiUsers />
            </EmptyIcon>
            <EmptyTitle>No Roles Created</EmptyTitle>
            <EmptyMessage>
              Create roles to manage permissions for your staff members.
            </EmptyMessage>
            <Button 
              variant="primary" 
              onClick={handleOpenCreateModal}
              icon={<FiPlus size={16} />}
            >
              Create First Role
            </Button>
          </EmptyState>
        )}
      </RolesList>
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'create' ? 'Create New Role' : 'Edit Role'}
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
              {modalMode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <FormGroup>
          <Input 
            id="name"
            name="name"
            label="Role Name"
            placeholder="Enter role name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <ColorPicker
            id="color"
            label="Role Color"
            value={formData.color}
            onChange={handleColorChange}
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Permissions</FormLabel>
          <CheckboxGroup>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                name="tickets" 
                checked={formData.permissions.tickets} 
                onChange={handlePermissionChange} 
              />
              Tickets - Allow to claim, close, and interact with tickets
            </CheckboxLabel>
            
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                name="stats" 
                checked={formData.permissions.stats} 
                onChange={handlePermissionChange} 
              />
              Stats - Allow to view ticket statistics
            </CheckboxLabel>
            
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                name="snippets" 
                checked={formData.permissions.snippets} 
                onChange={handlePermissionChange} 
              />
              Snippets - Allow to create and manage snippets
            </CheckboxLabel>
            
            <CheckboxLabel> 
              <Checkbox 
                type="checkbox" 
                name="siteManagement" 
                checked={formData.permissions.siteManagement} 
                onChange={handlePermissionChange} 
              />
              Site Management - Allow to manage roles, teams, and users
            </CheckboxLabel>
          </CheckboxGroup>
        </FormGroup>
      </Modal>
    </RoleManagerContainer>
  );
};

export default RoleManager;