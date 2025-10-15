import React, { useState, useEffect, useCallback } from 'react';
import { Game, GamesResponse } from '../types';
import { gamesAPI } from '../services/api';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const Home: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = 20;

  const fetchGames = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      setError('');

      const response: GamesResponse = await gamesAPI.getGames({
        page,
        search,
        page_size: pageSize
      });

      setGames(response.results);
      setTotalCount(response.count);
      setTotalPages(Math.ceil(response.count / pageSize));
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch games');
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames(1, searchQuery);
  }, [fetchGames, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    fetchGames(page, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchGames, searchQuery]);

  if (loading && games.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="loading-spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎮 Discover Amazing Games
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Explore thousands of games and keep track of your gaming journey
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for games..."
            initialValue={searchQuery}
          />
        </div>
      </div>

      {/* Results Info */}
      {!loading && (
        <div className="mb-6 text-center text-gray-600">
          {searchQuery ? (
            <p>
              Found {totalCount.toLocaleString()} games matching "{searchQuery}"
            </p>
          ) : (
            <p>
              Showing {totalCount.toLocaleString()} games
            </p>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error mb-6">
          {error}
          <button
            onClick={() => fetchGames(currentPage, searchQuery)}
            className="ml-4 btn-primary"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Games Grid */}
      {games.length > 0 ? (
        <>
          <div className="games-grid mb-8">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : !loading && !error && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No games found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? `No games match your search for "${searchQuery}"`
              : "No games available at the moment"
            }
          </p>
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="btn-primary"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Loading overlay for pagination */}
      {loading && games.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="loading-spinner w-6 h-6"></div>
            <span>Loading games...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;