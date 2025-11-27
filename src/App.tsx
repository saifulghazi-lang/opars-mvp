import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ProposalCreate } from './pages/ProposalCreate';
import { ProposalDetail } from './pages/ProposalDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/proposals/new" element={<ProposalCreate />} />
            <Route path="/proposals/:id" element={<ProposalDetail />} />
            <Route path="/settings" element={<div className="p-4">Settings Placeholder</div>} />
            <Route path="/proposals" element={<div className="p-4">Proposals List Placeholder</div>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
