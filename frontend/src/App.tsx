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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ask" element={<AskQuestion />} />
              <Route path="/question/:id" element={<Question />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;