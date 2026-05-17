import { NavLink } from 'react-router-dom';

import './Sidebar.css';

const navItems = [
  {
    label: 'Tổng quan',
    href: '/dashboard',
  },
  {
    label: 'Danh mục',
    href: '/portfolio',
  },
  {
    label: 'Mục tiêu',
    href: '/goals',
  },
  {
    label: 'Dòng tiền',
    href: '/cashflow',
  },
  {
    label: 'Marketplace',
    href: '/marketplace',
  },
  {
    label: 'AI Coach',
    href: '/coach',
  },
] as const;

export default function Sidebar() {
  return (
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
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}