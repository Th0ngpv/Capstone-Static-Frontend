import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/dashboard/DashboardPage';
import UserPage from './pages/user/UserPage';
import LoginPage from './pages/login/LoginPage';
import GoalsPage from './pages/goals/GoalsPage';
import CashflowPage from './pages/cashflow/CashflowPage';
import PortfolioPage from './pages/portfolio/PortfolioPage';
import MarketPlacePage from './pages/marketplace/MarketPlacePage';
import CoachPage from './pages/coach/CoachPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/success" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
      <Route path="/cashflow" element={<Layout><CashflowPage /></Layout>} />
      <Route path="/goals" element={<Layout><GoalsPage /></Layout>} />
      <Route path="/portfolio" element={<Layout><PortfolioPage /></Layout>} />
      <Route path="/marketplace" element={<Layout><MarketPlacePage /></Layout>} />
      <Route path="/coach" element={<Layout><CoachPage /></Layout>} />
      <Route path="/user" element={<Layout><UserPage /></Layout>} />
    </Routes>
  );
}

export default App;
