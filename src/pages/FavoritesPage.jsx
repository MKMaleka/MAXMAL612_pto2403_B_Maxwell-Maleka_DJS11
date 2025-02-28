import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [sortOption, setSortOption] = useState('title-asc');

  useEffect(() => {
    const fetchFavorites = () => {
      let allFavorites = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('favorites-')) {
          const showFavorites = JSON.parse(localStorage.getItem(key));
          if (showFavorites) {
            allFavorites = allFavorites.concat(showFavorites);
          }
        }
      }
      setFavorites(allFavorites);
    };

    fetchFavorites();

    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('favorites-')) {
        fetchFavorites();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const removeFromFavorites = (episodeId, seasonId, showId) => {
    let updatedFavorites = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('favorites-')) {
        let showFavorites = JSON.parse(localStorage.getItem(key)) || [];
        showFavorites = showFavorites.filter(
          (fav) => !(fav.episodeId === episodeId && fav.seasonId === seasonId && fav.showId === showId)
        );
        localStorage.setItem(key, JSON.stringify(showFavorites));
        updatedFavorites = updatedFavorites.concat(showFavorites);
      }
    }
    setFavorites(updatedFavorites);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedFavorites = [...favorites].sort((a, b) => {
    if (sortOption === 'title-asc') {
      return a.showName.toLowerCase().localeCompare(b.showName.toLowerCase());
    } else if (sortOption === 'title-desc') {
      return b.showName.toLowerCase().localeCompare(a.showName.toLowerCase());
    } else if (sortOption === 'updated-desc') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    } else if (sortOption === 'updated-asc') {
      return new Date(a.timestamp) - new Date(b.timestamp);
    }
    return 0;
  });

  return (
    <div className="favorites-page">
      <div className="show-topic">
        <h1>Podcast Favorites</h1>
      </div>
      <Link to="/" className="back-link">
        Back to Shows
      </Link>
      <h2>Favorites</h2>
      <div>
        <select value={sortOption} onChange={handleSortChange}>
          <option value="title-asc">Sort by Title (A-Z)</option>
          <option value="title-desc">Sort by Title (Z-A)</option>
          <option value="updated-desc">Sort by Recently Updated</option>
          <option value="updated-asc">Sort by Oldest Updated</option>
        </select>
      </div>
      {sortedFavorites.length === 0 ? (
        <p>No favorite episodes yet.</p>
      ) : (
        <ul className="favorites-list">
          {sortedFavorites.map((fav, index) => (
            <li key={fav.episodeId || `fav-${index}`}>
              <p>
                <strong>{fav.episodeTitle}</strong>
                <br />
                Show: {fav.showName}
                <br />
                Season: {fav.seasonNumber}
                <br />
                Episode: {fav.episodeNumber}
              </p>
              <p>Added: {new Date(fav.timestamp).toLocaleString()}</p>
              <button
                onClick={() => removeFromFavorites(fav.episodeId, fav.seasonId, fav.showId)}
                className="remove-favorite-button"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FavoritesPage;