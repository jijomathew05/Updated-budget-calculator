import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BudgetProvider } from './context/BudgetContext';
import Layout from './components/Layout';
import Dashboard    from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports      from './pages/Reports';
import Settings     from './pages/Settings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <BudgetProvider>
        <Layout>
          <Routes>
            <Route path="/"             element={<Dashboard />}    />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/reports"      element={<Reports />}      />
            <Route path="/settings"     element={<Settings />}     />
          </Routes>
        </Layout>
      </BudgetProvider>
    </BrowserRouter>
  );
}

export default App;
