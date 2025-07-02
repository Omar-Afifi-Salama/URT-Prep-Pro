"use client";

// This file is no longer used and is replaced by the GenkitProvider.
// It is kept to avoid breaking the build process if referenced somewhere,
// but it provides no functionality.

import { createContext, useContext, ReactNode } from 'react';

type ApiKeyContextType = {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  isApiKeySet: boolean;
  isDialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
};

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const value: ApiKeyContextType = {
    apiKey: null,
    setApiKey: () => {},
    isApiKeySet: false,
    isDialogOpen: false,
    setDialogOpen: () => {},
  };
  return (
    <ApiKeyContext.Provider value={value}>
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
