import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiMessageSquare, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import Button from './UI/Button';
import Input from './UI/Input';
import Modal from './UI/Modal';

const SnippetsManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.medium};
  border-radius: ${({ theme }) => theme.border.radius.lg};
  overflow: hidden;
  height: 100%;
`;

const SnippetsHeader = styled.div`
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

const SnippetsList = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
  flex: 1;
`;

const Snippet = styled(motion.div)`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.dark};
  border-radius: ${({ theme }) => theme.border.radius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  overflow: hidden;
`;

const SnippetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.medium};
`;

const SnippetTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SnippetActions = styled.div`
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

const SnippetContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  white-space: pre-wrap;
  max-height: 100px;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  height: 100%;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.light};
  color: ${({ theme }) => theme.colors.text.primary};
  border: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const SnippetsManager = ({ snippets = [], onCreateSnippet, onUpdateSnippet, onDeleteSnippet }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentSnippet, setCurrentSnippet] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    content: ''
  });
  
  // Open create snippet modal
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      content: ''
    });
    setShowModal(true);
  };
  
  // Open edit snippet modal
  const handleOpenEditModal = (snippet) => {
    setModalMode('edit');
    setCurrentSnippet(snippet);
    setFormData({
      name: snippet.name,
      content: snippet.content
    });
    setShowModal(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (formData.name.trim() === '' || formData.content.trim() === '') return;
    
    if (modalMode === 'create') {
      onCreateSnippet(formData);
    } else {
      onUpdateSnippet(currentSnippet.id, formData);
    }
    
    setShowModal(false);
  };
  
  // Filter snippets by search query
  const filteredSnippets = searchQuery
    ? snippets.filter(snippet => 
        snippet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : snippets;
  
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
    <SnippetsManagerContainer>
      <SnippetsHeader>
        <HeaderTitle>Snippets Management</HeaderTitle>
        <Button 
          variant="primary" 
          size="small" 
          onClick={handleOpenCreateModal}
          icon={<FiPlus size={16} />}
        >
          Create Snippet
        </Button>
      </SnippetsHeader>
      
      <SearchContainer>
        <SearchWrapper>
          <SearchIconWrapper>
            <FiSearch size={16} />
          </SearchIconWrapper>
          <SearchInput
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchWrapper>
      </SearchContainer>
      
      <SnippetsList>
        {filteredSnippets.length > 0 ? (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredSnippets.map((snippet) => (
              <Snippet 
                key={snippet.id} 
                variants={itemVariants}
              >
                <SnippetHeader>
                  <SnippetTitle>{snippet.name}</SnippetTitle>
                  <SnippetActions>
                    <ActionButton 
                      onClick={() => handleOpenEditModal(snippet)} 
                      title="Edit Snippet"
                    >
                      <FiEdit2 size={16} />
                    </ActionButton>
                    <ActionButton 
                      onClick={() => onDeleteSnippet(snippet.id)} 
                      danger 
                      title="Delete Snippet"
                    >
                      <FiTrash2 size={16} />
                    </ActionButton>
                  </SnippetActions>
                </SnippetHeader>
                <SnippetContent>{snippet.content}</SnippetContent>
              </Snippet>
            ))}
          </motion.div>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <FiMessageSquare />
            </EmptyIcon>
            <EmptyTitle>
              {searchQuery ? 'No Snippets Found' : 'No Snippets Created'}
            </EmptyTitle>
            <EmptyMessage>
              {searchQuery 
                ? `No snippets match "${searchQuery}"`
                : "Create snippets to quickly respond to common questions."}
            </EmptyMessage>
            {!searchQuery && (
              <Button 
                variant="primary" 
                onClick={handleOpenCreateModal}
                icon={<FiPlus size={16} />}
              >
                Create First Snippet
              </Button>
            )}
          </EmptyState>
        )}
      </SnippetsList>
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'create' ? 'Create New Snippet' : 'Edit Snippet'}
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
              disabled={!formData.name.trim() || !formData.content.trim()}
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
            label="Snippet Name"
            placeholder="Enter snippet name"
            value={formData.name}
            onChange={handleInputChange}
            helperText="This will be displayed when selecting snippets"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <FormGroup>
            <label 
              htmlFor="content" 
              style={{ 
                display: 'block',
                marginBottom: '4px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#D0D0D0'
              }}
            >
              Snippet Content <span style={{ color: 'red' }}>*</span>
            </label>
            <TextArea
              id="content"
              name="content"
              placeholder="Enter the message content for this snippet"
              value={formData.content}
              onChange={handleInputChange}
              required
            />
            <div style={{ 
              fontSize: '14px',
              color: '#808080',
              marginTop: '4px'
            }}>
              This message will be inserted when using the snippet
            </div>
          </FormGroup>
        </FormGroup>
      </Modal>
    </SnippetsManagerContainer>
  );
};

export default SnippetsManager;