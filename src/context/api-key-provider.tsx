"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

const API_KEY_STORAGE_KEY = 'urt-prep-pro-api-key';

type ApiKeyContextType = {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  isApiKeySet: boolean;
  isDialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
};

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
        setApiKeyState(storedKey);
        setIsApiKeySet(true);
    } else {
        setIsApiKeySet(false);
    }
  }, []);

  const setApiKey = useCallback((key: string | null) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
      setIsApiKeySet(true);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      setIsApiKeySet(false);
    }
  }, []);

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, isApiKeySet, isDialogOpen, setDialogOpen }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
}
