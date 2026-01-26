import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/test" element={<div className="p-8 text-center text-green-600 font-bold text-xl">React Router is Working!</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
