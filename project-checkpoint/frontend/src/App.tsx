import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GameDetail from './pages/GameDetail';
import MyGames from './pages/MyGames';
import Stats from './pages/Stats';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/game/:id" element={<GameDetail />} />
              <Route 
                path="/my-games" 
                element={
                  <ProtectedRoute>
                    <MyGames />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/stats" 
                element={
                  <ProtectedRoute>
                    <Stats />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;