import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { Toaster } from 'sonner';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ProposalCreate } from './pages/ProposalCreate';
import { ProposalDetail } from './pages/ProposalDetail';
import { Login } from './pages/Login';

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/proposals/new" element={<ProposalCreate />} />
            <Route path="/proposals/:id" element={<ProposalDetail />} />
            <Route path="/settings" element={<div className="p-4">Settings Placeholder</div>} />
            <Route path="/proposals" element={<div className="p-4">Proposals List Placeholder</div>} />
          </Route>
        </Routes>
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{
            className: 'md:!bottom-4 md:!right-4 !top-4 md:!top-auto',
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
