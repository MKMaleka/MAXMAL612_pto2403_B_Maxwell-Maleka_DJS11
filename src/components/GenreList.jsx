import React from 'react';


function GenreList({ genreIds }) {
  const genreMap = {
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

  return (
    <p>
      Genres: {genreIds.map((id) => genreMap[id]).join(', ')}
    </p>
  );
}

export default GenreList;