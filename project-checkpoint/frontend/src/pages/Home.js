import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gamesAPI } from '../services/api';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadGames();
  }, [currentPage]);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await gamesAPI.getPopularGames(currentPage, 20);
      setGames(response.data.games);
      setTotalPages(Math.ceil(response.data.count / 20));
    } catch (error) {
      console.error('Error loading games:', error);
      setError('Failed to load games. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      setError(null);
      setSearchQuery(query);
      
      if (query.trim()) {
        const response = await gamesAPI.searchGames(query, 1, 20);
        setGames(response.data.games);
        setTotalPages(Math.ceil(response.data.count / 20));
        setCurrentPage(1);
      } else {
        loadGames();
      }
    } catch (error) {
      console.error('Error searching games:', error);
      setError('Failed to search games. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to Project Checkpoint</h1>
        <p>Discover, log, and track your gaming journey</p>
      </div>

      <SearchBar onSearch={handleSearch} />

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading games...</div>
      ) : (
        <>
          <div className="games-section">
            <h2>
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Games'}
            </h2>
            
            {games.length === 0 ? (
              <div className="text-center">
                <p>No games found. Try a different search term.</p>
              </div>
            ) : (
              <div className="games-grid">
                {games.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-secondary"
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;