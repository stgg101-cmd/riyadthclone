
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ExperiencePage from './pages/ExperiencePage';
import DiscoverPage from './pages/DiscoverPage';
import CareersPage from './pages/CareersPage';
import SfeerPage from './pages/SfeerPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/sfeer" element={<SfeerPage />} />
          </Routes>
        </main>
        <Footer />
        <ChatBot />
      </div>
    </Router>
  );
};

export default App;
