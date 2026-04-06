import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Dialog from '../components/ui/Dialog';

const DialogContext = createContext();

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

export const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null);
  const resolverRef = useRef(null);

  const showAlert = useCallback((message, title = 'Notification', type = 'info') => {
    return new Promise((resolve) => {
      setDialog({ message, title, type, isConfirm: false });
      resolverRef.current = resolve;
    });
  }, []);

  const showConfirm = useCallback((message, title = 'Confirmation', type = 'warning') => {
    return new Promise((resolve) => {
      setDialog({ message, title, type, isConfirm: true });
      resolverRef.current = resolve;
    });
  }, []);

  const handleClose = useCallback((result) => {
    setDialog(null);
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  }, []);

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {dialog && createPortal(
        <Dialog
          {...dialog}
          onClose={() => handleClose(false)}
          onConfirm={() => handleClose(true)}
        />,
        document.body
      )}
    </DialogContext.Provider>
  );
};
