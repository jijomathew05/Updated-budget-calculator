import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/',                 label: 'Dashboard',    icon: '📊' },
  { to: '/add-transaction',  label: 'Add Entry',    icon: '➕' },
  { to: '/history',          label: 'History',      icon: '📜' },
  { to: '/reports',          label: 'Reports',      icon: '📈' },
  { to: '/settings',         label: 'Settings',     icon: '⚙️' },
];

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar__logo">
      <span className="sidebar__logo-icon">💰</span>
      <span className="sidebar__logo-text">Budgety</span>
    </div>

    <nav className="sidebar__nav">
      {NAV_ITEMS.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
          }
        >
          <span className="sidebar__link-icon">{icon}</span>
          <span className="sidebar__link-label">{label}</span>
        </NavLink>
      ))}
    </nav>

    <div className="sidebar__footer">
      <p>Budget Calculator</p>
      <p className="sidebar__version">v2.0</p>
    </div>
  </aside>
);

export default Sidebar;
