import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BudgetProvider } from './context/BudgetContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard      from './pages/Dashboard';
import Transactions   from './pages/Transactions';
import Reports        from './pages/Reports';
import Settings       from './pages/Settings';
import Login          from './pages/Login';
import Register       from './pages/Register';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BudgetProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/"                element={<Dashboard />}      />
                    <Route path="/transactions"    element={<Transactions />}   />
                    <Route path="/reports"         element={<Reports />}        />
                    <Route path="/settings"        element={<Settings />}       />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </BudgetProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
