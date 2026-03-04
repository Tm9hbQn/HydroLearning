import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Dashboard } from './pages/Dashboard';
import BackMuscleGuide from './pages/BackMuscleGuide';

function App() {
  console.log('HydroLearning App Initialized (v2)');
  return (
    <Router>
      <Routes>
        {/* Back Muscle Guide — standalone page (own header/nav) */}
        <Route path="/" element={<BackMuscleGuide />} />

        {/* Legacy routes keep existing Layout wrapper */}
        <Route element={<Layout><Dashboard /></Layout>}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/test" element={<div className="p-8 text-center text-green-600 font-bold text-xl">React Router is Working!</div>} />
      </Routes>
    </Router>
  );
}

export default App;
