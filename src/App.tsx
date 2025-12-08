import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LessonViewer } from './pages/LessonViewer';
import { Admin } from './pages/Admin';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LessonViewer />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
