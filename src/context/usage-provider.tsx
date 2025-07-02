
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

const USAGE_STORAGE_KEY = 'urt-prep-pro-usage';
const DAILY_REQUEST_LIMIT = 50;

type UsageData = {
    requests: number;
    tokens: number;
    date: string; // YYYY-MM-DD
};

type UsageContextType = {
    requests: number;
    tokens: number;
    limit: number;
    addUsage: (usage: { requests: number; tokens: number }) => void;
};

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export function UsageProvider({ children }: { children: ReactNode }) {
    const [usage, setUsage] = useState<Omit<UsageData, 'date'>>({ requests: 0, tokens: 0 });

    const getTodaysDateString = () => new Date().toISOString().split('T')[0];

    useEffect(() => {
    const storedUsage = localStorage.getItem(USAGE_STORAGE_KEY);
    const today = getTodaysDateString();

    if (storedUsage) {
        try {
        const parsedUsage: UsageData = JSON.parse(storedUsage);
        if (parsedUsage.date === today) {
            setUsage({ requests: parsedUsage.requests, tokens: parsedUsage.tokens });
        } else {
            // It's a new day, reset usage
            localStorage.removeItem(USAGE_STORAGE_KEY);
        }
        } catch (e) {
        console.error("Failed to parse usage data", e);
        localStorage.removeItem(USAGE_STORAGE_KEY);
        }
    }
    }, []);
    
    const addUsage = useCallback((newUsage: { requests: number; tokens: number }) => {
    setUsage(currentUsage => {
        const today = getTodaysDateString();
        const updatedUsage: UsageData = {
            requests: currentUsage.requests + newUsage.requests,
            tokens: currentUsage.tokens + newUsage.tokens,
            date: today,
        };
        localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(updatedUsage));
        return { requests: updatedUsage.requests, tokens: updatedUsage.tokens };
    });
    }, []);

    return (
    <UsageContext.Provider value={{ ...usage, limit: DAILY_REQUEST_LIMIT, addUsage }}>
        {children}
    </UsageContext.Provider>
    );
}

export function useUsage() {
    const context = useContext(UsageContext);
    if (context === undefined) {
    throw new Error('useUsage must be used within a UsageProvider');
    }
    return context;
}
