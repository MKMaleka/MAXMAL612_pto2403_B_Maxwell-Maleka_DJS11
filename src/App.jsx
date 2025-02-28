import React from 'react';
import './index.css';
import ShowsPage from './pages/ShowsPage';
import ShowDetailsPage from './pages/ShowDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<ShowsPage />} />
          <Route path="/show/:id" element={<ShowDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;