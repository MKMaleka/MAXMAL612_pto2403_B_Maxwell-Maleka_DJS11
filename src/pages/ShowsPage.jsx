import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GenreList from '../components/GenreList';
import Fuse from 'fuse.js'; // Import Fuse.js

function ShowsPage() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('alphabetical-asc');
  const [genreFilter, setGenreFilter] = useState('all');
  const [titleFilter, setTitleFilter] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Add searchResults state

  const genres = {
    1: 'Personal Growth',
    2: 'Investigative Journalism',
    3: 'History',
    4: 'Comedy',
    5: 'Entertainment',
    6: 'Business',
    7: 'Fiction',
    8: 'News',
    9: 'Kids and Family',
  };

  useEffect(() => {
    fetch('https://podcast-api.netlify.app')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setShows(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (titleFilter.trim() === '') {
      setSearchResults(shows);
      return;
    }

    const fuse = new Fuse(shows, {
      keys: ['title', 'description'],
      includeScore: true,
      threshold: 0.3,
    });

    const results = fuse.search(titleFilter).map((result) => result.item);
    setSearchResults(results);
  }, [titleFilter, shows]);

  const filteredShows = searchResults.filter((show) =>
    genreFilter === 'all' ? true : show.genres.includes(parseInt(genreFilter))
  );

  const sortedShows = [...filteredShows].sort((a, b) => {
    if (sortOption === 'alphabetical-asc') {
      return a.title.localeCompare(b.title);
    } else if (sortOption === 'alphabetical-desc') {
      return b.title.localeCompare(a.title);
    } else if (sortOption === 'updated-newest') {
      return new Date(b.updated) - new Date(a.updated);
    } else if (sortOption === 'updated-oldest') {
      return new Date(a.updated) - new Date(b.updated);
    }
    return 0;
  });

  if (loading) {
    return <p>Loading shows...</p>;
  }

  if (error) {
    return <p>Error loading shows: {error}</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="show-topic">
        <h1>Podcast App</h1>
      </div>
      <h2>Shows</h2>
      <div>
        <input
          type="text"
          placeholder="Search shows..." // Changed placeholder
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
        />
        <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
          <option value="all">All Genres</option>
          {Object.entries(genres).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="alphabetical-asc">Alphabetical (A-Z)</option>
          <option value="alphabetical-desc">Alphabetical (Z-A)</option>
          <option value="updated-newest">Newly Updated</option>
          <option value="updated-oldest">Oldest Updated</option>
        </select>
      </div>
      {sortedShows.map((show) => (
        <div key={show.id}>
          <Link to={`/show/${show.id}`}>
            <h3>{show.title}</h3>
            <img src={show.image} alt={show.title} style={{ maxWidth: '200px' }} />
            <p>Seasons: {show.seasons}</p>
          </Link>
          <p>Description: {show.description}</p>
          <p>Last Updated: {formatDate(show.updated)}</p>
          <GenreList genreIds={show.genres} />
        </div>
      ))}
    </div>
  );
}

export default ShowsPage;