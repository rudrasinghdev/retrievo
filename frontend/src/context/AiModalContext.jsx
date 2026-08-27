import React, { createContext, useContext, useState } from 'react';
import SmartMatchModal from '../components/SmartMatchModal';

const AiModalContext = createContext(null);

export const AiModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openAiModal = () => setIsOpen(true);
  const closeAiModal = () => setIsOpen(false);

  return (
    <AiModalContext.Provider value={{ isOpen, openAiModal, closeAiModal }}>
      {children}
      <SmartMatchModal isOpen={isOpen} onClose={closeAiModal} />
    </AiModalContext.Provider>
  );
};

export const useAiModal = () => {
  const context = useContext(AiModalContext);
  if (!context) {
    throw new Error('useAiModal must be used within an AiModalProvider');
  }
  return context;
};
