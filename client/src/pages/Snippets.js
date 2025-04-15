import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import TopNav from '../components/TopNav';
import SnippetsManager from '../components/SnippetsManager';
import api from '../utils/api';
import { generateId } from '../utils/helpers';

const SnippetsContainer = styled.div`
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

const SnippetsContent = styled(motion.div)`
  height: 100%;
`;

const Snippets = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch snippets on initial render
  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setLoading(true);
        
        // In a real app, fetch from API
        // const snippetsData = await api.get('/snippets');
        
        // Mock data for demo purposes
        setTimeout(() => {
          setSnippets([
            {
              id: '1',
              name: 'Greeting',
              content: 'Hello! Thank you for contacting support. How can I help you today?'
            },
            {
              id: '2',
              name: 'Closing',
              content: 'Is there anything else I can help you with? If not, I\'ll close this ticket. Feel free to create a new one if you have more questions in the future.'
            },
            {
              id: '3',
              name: 'Bug Report',
              content: 'I understand you\'re experiencing an issue. Could you please provide the following information:\n\n1. Steps to reproduce\n2. Expected behavior\n3. Actual behavior\n4. Screenshots (if applicable)\n\nThis will help us investigate the problem more effectively.'
            },
            {
              id: '4',
              name: 'Feature Request',
              content: "Thank you for your feature suggestion! We appreciate your feedback and will pass it along to our development team for consideration. We're always looking for ways to improve our service based on user input."
            }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch snippets:', error);
        setLoading(false);
      }
    };
    
    fetchSnippets();
  }, []);
  
  // Create snippet
  const handleCreateSnippet = (snippetData) => {
    const newSnippet = {
      id: generateId(),
      ...snippetData
    };
    
    setSnippets([...snippets, newSnippet]);
    
    // In a real app, save to API
    // api.post('/snippets', snippetData);
  };
  
  // Update snippet
  const handleUpdateSnippet = (snippetId, snippetData) => {
    const updatedSnippets = snippets.map(snippet => 
      snippet.id === snippetId ? { ...snippet, ...snippetData } : snippet
    );
    
    setSnippets(updatedSnippets);
    
    // In a real app, save to API
    // api.put(`/snippets/${snippetId}`, snippetData);
  };
  
  // Delete snippet
  const handleDeleteSnippet = (snippetId) => {
    const updatedSnippets = snippets.filter(snippet => snippet.id !== snippetId);
    setSnippets(updatedSnippets);
    
    // In a real app, delete from API
    // api.delete(`/snippets/${snippetId}`);
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
    <SnippetsContainer>
      <TopNav title="Snippets Management" />
      
      <ContentContainer>
        <SnippetsContent
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          <SnippetsManager 
            snippets={snippets}
            onCreateSnippet={handleCreateSnippet}
            onUpdateSnippet={handleUpdateSnippet}
            onDeleteSnippet={handleDeleteSnippet}
          />
        </SnippetsContent>
      </ContentContainer>
    </SnippetsContainer>
  );
};

export default Snippets;