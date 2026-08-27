import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AiModalProvider } from './context/AiModalContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import PostItemPage from './pages/PostItemPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AiModalProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
          <main style={{ flexGrow: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/items/:id" element={<ItemDetailsPage />} />

              {/* Protected Routes (Authentication Required) */}
              <Route
                path="/post-item"
                element={
                  <ProtectedRoute>
                    <PostItemPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback 404 Route */}
              <Route
                path="*"
                element={
                  <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary)' }}>404</h1>
                    <h2 style={{ marginBottom: '1.5rem' }}>Page Not Found</h2>
                    <a href="/" className="btn btn-primary">Return Home</a>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
        </AiModalProvider>
      </Router>
    </AuthProvider>
  );
};

export default App;
