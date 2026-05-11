import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerDashboard from './pages/OwnerDashboard';
import VetDashboard from './pages/VetDashboard';
import Marketplace from './pages/Marketplace';
import AIAssistant from './pages/AIAssistant';
import Community from './pages/Community';
import AdminDashboard from './pages/AdminDashboard';
import VetFinder from './pages/VetFinder';
import CheckEmail from './pages/CheckEmail';
import VerifyEmail from './pages/VerifyEmail';
import VetProfileCreate from './pages/VetProfileCreate';
import VetPending from './pages/VetPending';
import EmergencyLocator from './pages/EmergencyLocator';
import LostAndFound from './pages/LostAndFound';
import Teleclinic from './pages/Teleclinic';
import AIScanner from './pages/AIScanner';
import ChatbotWidget from './components/ChatbotWidget';
import { LanguageProvider } from './context/LanguageContext';

// Pages that use their own full-screen sidebar layout (no global Navbar/Footer)
const FULLSCREEN_ROUTES = [
  { path: '/dashboard', element: <OwnerDashboard /> },
  { path: '/vet-portal', element: <VetDashboard /> },
  { path: '/admin-dashboard', element: <AdminDashboard /> },
];

// Pages that use the global Navbar + Footer wrapper
const WRAPPED_ROUTES = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/check-email', element: <CheckEmail /> },
  { path: '/verify-email', element: <VerifyEmail /> },
  { path: '/shop', element: <Marketplace /> },
  { path: '/ai-assistant', element: <AIAssistant /> },
  { path: '/community', element: <Community /> },
  { path: '/vets', element: <VetFinder /> },
  { path: '/vet/profile/create', element: <VetProfileCreate /> },
  { path: '/vet/pending', element: <VetPending /> },
  { path: '/emergency', element: <EmergencyLocator /> },
  { path: '/lost-found', element: <LostAndFound /> },
  { path: '/telehealth', element: <Teleclinic /> },
  { path: '/ai-scanner', element: <AIScanner /> },
];

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
        <Routes>
          {/* Full-screen dashboard routes — own header & sidebar, no outer nav */}
          {FULLSCREEN_ROUTES.map(r => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}

          {/* Wrapped routes — global Navbar + Footer */}
          {WRAPPED_ROUTES.map(r => (
            <Route key={r.path} path={r.path} element={
              <div className="flex flex-col min-h-screen relative">
                <Navbar />
                <main className="flex-grow pt-16">{r.element}</main>
                <Footer />
                <ChatbotWidget />
              </div>
            } />
          ))}
        </Routes>
      </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
