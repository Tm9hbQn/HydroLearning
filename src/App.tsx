import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Dashboard } from './pages/Dashboard';
import HomePage from './pages/HomePage';

const BackMuscleGuide = React.lazy(() => import('./pages/BackMuscleGuide'));

function App() {
  return (
    <Router>
      <Routes>
        {/* Shared layout with persistent header/nav */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<Dashboard />} />
        </Route>

        {/* Back Muscle Guide — standalone page (own header/nav/CSS) */}
        <Route
          path="/back-anatomy"
          element={
            <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">טוען...</div>}>
              <BackMuscleGuide />
            </React.Suspense>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
