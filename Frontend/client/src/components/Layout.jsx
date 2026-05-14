import Sidebar from './Sidebar';
import { useBudget } from '../context/BudgetContext';

const Layout = ({ children }) => {
  const { error, setError } = useBudget();

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        {error && (
          <div className="error-banner" onClick={() => setError(null)}>
            ⚠ {error} <span className="error-close">✕</span>
          </div>
        )}
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
