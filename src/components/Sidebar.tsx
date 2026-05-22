import { NavLink } from 'react-router-dom';

import {
  LayoutDashboard,
  BriefcaseBusiness,
  Target,
  Wallet,
  Store,
  Sparkles,
} from 'lucide-react';

import { useLanguage } from '../hooks/useLanguage';

import { translations } from '../locales/translations';

import './Sidebar.css';

const navItems = [
  {
    key: 'overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    key: 'portfolio',
    href: '/portfolio',
    icon: BriefcaseBusiness,
  },
  {
    key: 'goals',
    href: '/goals',
    icon: Target,
  },
  {
    key: 'cashFlow',
    href: '/cashflow',
    icon: Wallet,
  },
  {
    key: 'marketplace',
    href: '/marketplace',
    icon: Store,
  },
  {
    key: 'aiCoach',
    href: '/coach',
    icon: Sparkles,
  },
] as const;

export default function Sidebar() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            W
          </div>

          <div className="logo-text">
            <strong>WealthOS</strong>

            <span>
              {t.appSubtitle}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                isActive ? 'active' : ''
              }
            >
              <item.icon size={18} />

              <span>
                {
                  t[
                  item.key as keyof typeof t
                  ]
                }
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              isActive ? 'mobile-active' : ''
            }
          >
            <item.icon size={22} />

            <span>
              {
                t[
                item.key as keyof typeof t
                ]
              }
            </span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}