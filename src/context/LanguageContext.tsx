// src/context/LanguageContext.tsx

// React hooks for context and state management
import {
    createContext,
    useEffect,
    useState,
} from 'react';

// Import ReactNode type
import type { ReactNode } from 'react';

// Supported language options
type Language = 'en' | 'vi';

// Context data structure
type LanguageContextType = {

    // Current selected language
    language: Language;

    // Function to change language
    setLanguage: (
        lang: Language
    ) => void;
};

// Create language context
const LanguageContext =
    createContext<
        LanguageContextType | undefined
    >(undefined);

// Global language provider
export function LanguageProvider({

    // Child components
    children,

}: {
    children: ReactNode;
}) {

    // Store selected language
    const [language, setLanguage] =
        useState<Language>(() => {

            // Get saved language
            const savedLanguage =
                localStorage.getItem(
                    'language'
                ) as Language | null;

            // Default to English
            return (
                savedLanguage || 'en'
            );
        });

    // Save language changes
    useEffect(() => {

        localStorage.setItem(
            'language',
            language
        );

    }, [language]);

    // Provide language state
    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
            }}
        >

            {/* Render app content */}
            {children}

        </LanguageContext.Provider>
    );
}

// Export language context
export { LanguageContext };