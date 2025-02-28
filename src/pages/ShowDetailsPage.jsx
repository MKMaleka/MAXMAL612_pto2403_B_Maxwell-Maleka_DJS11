import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";

function ShowDetailsPage() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [audioSource, setAudioSource] = useState(null);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem(`favorites-${id}`)) || []
  );

  useEffect(() => {
    fetch(`https://podcast-api.netlify.app/id/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setShow(data);
        if (data.seasons && data.seasons.length > 0) {
          setSelectedSeason(data.seasons[0]);
        }
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`favorites-${id}`, JSON.stringify(favorites));
  }, [favorites, id]);

  if (loading) {
    return <p>Loading show details...</p>;
  }

  if (!show) {
    return <p>Show not found.</p>;
  }

  const handleEpisodeClick = (episode) => {
    setAudioSource(episode.file);
  };

  const handleSeasonChange = (season) => {
    setSelectedSeason(season);
  };

  const addToFavorites = (episode, season, show) => {
    if (
      favorites.some(
        (fav) =>
          fav.episodeId === episode.id &&
          fav.seasonId === season.id &&
          fav.showId === show.id
      )
    ) {
      return;
    }

    const newFavorite = {
      episodeId: episode.id,
      episodeTitle: episode.title,
      episodeNumber: episode.episode,
      seasonId: season.id,
      seasonNumber: show.seasons.indexOf(season) + 1,
      showId: show.id,
      showName: show.title,
      timestamp: new Date().toISOString(),
    };
    setFavorites((prevFavorites) => [...prevFavorites, newFavorite]);
  };

  const removeFromFavorites = (episodeId, seasonId, showId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter(
        (fav) =>
          !(
            fav.episodeId === episodeId &&
            fav.seasonId === seasonId &&
            fav.showId === showId
          )
      )
    );
  };

  const isFavorite = (episodeId, seasonId, showId) => {
    return favorites.some(
      (fav) =>
        fav.episodeId === episodeId &&
        fav.seasonId === seasonId &&
        fav.showId === showId
    );
  };

  return (
    <div className="show-details-page">
      <Link to="/" className="back-link">
        Back to Shows
      </Link>
      <h2 className="show-title">{show.title}</h2>
      <div className="season-buttons">
        {show.seasons.map((season, index) => (
          <button
            key={season.id !== undefined ? `season-${season.id}` : `season-index-${index}`}
            onClick={() => handleSeasonChange(season)}
            className={`season-button ${
              selectedSeason === season ? "selected" : ""
            }`}
          >
            Season {index + 1}
          </button>
        ))}
      </div>
      {selectedSeason && (
        <div className="season-details">
          <h3 className="season-number">
            Season {show.seasons.indexOf(selectedSeason) + 1}
          </h3>
          <img
            src={selectedSeason.image}
            alt={`Season ${show.seasons.indexOf(selectedSeason) + 1}`}
            className="season-image"
          />
          <p className="season-episodes">
            Episodes: {selectedSeason.episodes.length}
          </p>
          {selectedSeason.episodes.map((episode) => (
            <div key={episode.id !== undefined ? `episode-${episode.id}` : `episode-index-${selectedSeason.id}-${episode.episode}`} className="episode-item">
              <p className="episode-title">
                Episode {episode.episode}: {episode.title}
              </p>
              <button
                onClick={() =>
                  isFavorite(episode.id, selectedSeason.id, show.id)
                    ? removeFromFavorites(episode.id, selectedSeason.id, show.id)
                    : addToFavorites(episode, selectedSeason, show)
                }
              >
                {isFavorite(episode.id, selectedSeason.id, show.id)
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </button>
              <button onClick={() => handleEpisodeClick(episode)}>Play</button>
            </div>
          ))}
        </div>
      )}
      <AudioPlayer src={audioSource} />
    </div>
  );
}

export default ShowDetailsPage;