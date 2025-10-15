import { useState, useEffect } from 'react';
import { rawgAPI } from '../services/rawgApi';
import GameCard from '../components/GameCard';

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchGames();
  }, [page]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        page_size: 20,
        ordering: '-rating'
      };
      
      const response = await rawgAPI.getGames(params);
      setGames(prev => page === 1 ? response.data.results : [...prev, ...response.data.results]);
      setHasMore(!!response.data.next);
      setError('');
    } catch (err) {
      setError('Failed to fetch games. Please check your RAWG API key.');
      console.error('Error fetching games:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setPage(1);
      fetchGames();
      return;
    }

    try {
      setLoading(true);
      const response = await rawgAPI.searchGames(searchQuery, { page_size: 20 });
      setGames(response.data.results);
      setHasMore(false);
      setError('');
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Error searching games:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="container">
      <div className="home-header">
        <h1>Discover Games</h1>
        <p className="subtitle">Browse and log your favorite video games</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          🔍 Search
        </button>
        {searchQuery && (
          <button 
            type="button" 
            onClick={() => {
              setSearchQuery('');
              setPage(1);
              fetchGames();
            }}
            className="btn-secondary"
          >
            Clear
          </button>
        )}
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="games-grid">
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading games...</p>
        </div>
      )}

      {!loading && games.length === 0 && (
        <div className="no-results">
          <p>No games found. Try a different search.</p>
        </div>
      )}

      {!loading && hasMore && !searchQuery && (
        <div className="load-more-container">
          <button onClick={loadMore} className="btn btn-secondary">
            Load More Games
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
