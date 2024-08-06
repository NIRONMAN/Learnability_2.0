import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SuggestionsContextType {
    currentSuggestions: any;
    setCurrentSuggestions: (suggestions: any) => void;
    showHint: boolean;
    setShowHint: (show: boolean) => void;
}

const SuggestionsContext = createContext<SuggestionsContextType | undefined>(undefined);

export const SuggestionsProvider = ({ children }: { children: ReactNode }) => {
    const [currentSuggestions, setCurrentSuggestions] = useState<any>(null);
    const [showHint, setShowHint] = useState<boolean>(false);

    return (
        <SuggestionsContext.Provider value={{ currentSuggestions, setCurrentSuggestions, showHint, setShowHint }}>
            {children}
        </SuggestionsContext.Provider>
    );
};

export const useSuggestions = (): SuggestionsContextType => {
    const context = useContext(SuggestionsContext);
    if (!context) {
        throw new Error('useSuggestions must be used within a SuggestionsProvider');
    }
    return context;
};
