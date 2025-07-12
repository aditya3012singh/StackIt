import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Home from './pages/Home';
import AskQuestion from './pages/AskQuestion';
import Question from './pages/Question';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import OAuthCallback from './pages/OAuthCallback'; // 👈 ADD THIS
 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login isOpen={false} onClose={function (): void {
          throw new Error('Function not implemented.');
        } } />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/ask" element={<AskQuestion />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/chat" element={<Chat />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/question/:id" element={<Question />} />
      </Routes>
    </Router>
  );
}

export default App;