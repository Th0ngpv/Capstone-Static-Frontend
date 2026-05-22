import { useLocation, useNavigate } from 'react-router-dom';

import Sidebar from './Sidebar';

import './Layout.css';
import LanguageSwitch from './LanguageSwitch';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Tổng quan',
  '/portfolio': 'Danh mục đầu tư',
  '/goals': 'Mục tiêu tài chính',
  '/cashflow': 'Dòng tiền',
  '/marketplace': 'Marketplace',
  '/coach': 'AI Coach',
  '/user': 'Tài khoản',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = {
    userName: 'Bill Pham',
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="layout-body">
        <header className="layout-header">
          <h1>
            {pageTitles[location.pathname] ??
              'Dashboard'}
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