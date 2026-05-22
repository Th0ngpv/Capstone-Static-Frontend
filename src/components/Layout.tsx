import { useLocation, useNavigate } from 'react-router-dom';

import Sidebar from './Sidebar';

import './Layout.css';
import LanguageSwitch from './LanguageSwitch';

import { useLanguage } from '../hooks/useLanguage';

import { translations } from '../locales/translations';

const pageTitleKeys: Record<
  string,
  keyof typeof translations.en
> = {
  '/dashboard': 'overview',
  '/portfolio': 'portfolio',
  '/goals': 'goals',
  '/cashflow': 'cashFlow',
  '/marketplace': 'marketplace',
  '/coach': 'aiCoach',
};



export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const { language } = useLanguage();

  const t = translations[language];

  const user = {
    userName: 'Bill Pham',
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="layout-body">
        <header className="layout-header">
          <h1>
            {
              t[
              pageTitleKeys[
              location.pathname
              ]
              ] ?? t.overview
            }
          </h1>
          <div className="layout-header-right">
            <LanguageSwitch />

            <button
              className="layout-avatar"
              onClick={() => navigate('/user')}
            >
              {user.userName
                .slice(0, 2)
                .toUpperCase()}
            </button>
          </div>

        </header>

        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
}