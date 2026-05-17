import { NavLink } from 'react-router-dom';

import {
  LayoutDashboard,
  BriefcaseBusiness,
  Target,
  Wallet,
  Store,
  Sparkles,
} from 'lucide-react';

import './Sidebar.css';

const navItems = [
  {
    label: 'Tổng quan',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Danh mục',
    href: '/portfolio',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Mục tiêu',
    href: '/goals',
    icon: Target,
  },
  {
    label: 'Dòng tiền',
    href: '/cashflow',
    icon: Wallet,
  },
  {
    label: 'Marketplace',
    href: '/marketplace',
    icon: Store,
  },
  {
    label: 'AI Coach',
    href: '/coach',
    icon: Sparkles,
  },
] as const;

export default function Sidebar() {
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
              AI Wealth Platform
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
                {item.label}
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
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}