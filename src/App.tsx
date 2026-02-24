import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Triage from './pages/Triage';
import Pharmacy from './pages/Pharmacy';
import Booking from './pages/Booking';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/triage" element={<Triage />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/profile" element={<div className="p-8 text-center text-slate-500">Perfil do Usuário (Em breve)</div>} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}
