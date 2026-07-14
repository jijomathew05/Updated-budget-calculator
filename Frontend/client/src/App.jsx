import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BudgetProvider } from './context/BudgetContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard      from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import History        from './pages/History';
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
                    <Route path="/add-transaction" element={<AddTransaction />} />
                    <Route path="/history"         element={<History />}        />
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
