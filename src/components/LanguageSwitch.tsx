// src/components/LanguageSwitch.tsx

import { Languages } from 'lucide-react';

import { useLanguage } from '../hooks/useLanguage';

import './LanguageSwitch.css';

export default function LanguageSwitch() {
    const {
        language,
        setLanguage,
    } = useLanguage();

    const isEnglish =
        language === 'en';

    return (
        <button
            className="language-switch"
            onClick={() =>
                setLanguage(
                    isEnglish ? 'vi' : 'en'
                )
            }
            aria-label="Switch language"
        >
            <Languages size={18} />

            <span>
                {isEnglish
                    ? 'EN'
                    : 'VI'}
            </span>
        </button>
    );
}