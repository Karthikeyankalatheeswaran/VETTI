import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gameLogsAPI } from '../services/api';

const GameLog = () => {
  const [gameLogs, setGameLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadGameLogs();
  }, [statusFilter, currentPage]);

  const loadGameLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await gameLogsAPI.getGameLogs(statusFilter, currentPage, 10);
      setGameLogs(response.data.gameLogs);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error loading game logs:', error);
      setError('Failed to load your game collection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleDeleteGameLog = async (logId) => {
    if (window.confirm('Are you sure you want to delete this game log?')) {
      try {
        await gameLogsAPI.deleteGameLog(logId);
        loadGameLogs(); // Reload the list
      } catch (error) {
        console.error('Error deleting game log:', error);
        alert('Failed to delete game log. Please try again.');
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<span key={i} className="star">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">★</span>);
      }
    }
    return stars;
  };

  const getStatusCounts = () => {
    const counts = { playing: 0, completed: 0, dropped: 0 };
    gameLogs.forEach(log => {
      counts[log.status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="game-log">
      <div className="page-header">
        <h1>My Game Collection</h1>
        <p>Track and manage your gaming journey</p>
      </div>

      {/* Stats */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{total}</h3>
            <p>Total Games</p>
          </div>
          <div className="stat-card">
            <h3>{statusCounts.playing}</h3>
            <p>Currently Playing</p>
          </div>
          <div className="stat-card">
            <h3>{statusCounts.completed}</h3>
            <p>Completed</p>
          </div>
          <div className="stat-card">
            <h3>{statusCounts.dropped}</h3>
            <p>Dropped</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-buttons">
          <button
            onClick={() => handleStatusFilter('')}
            className={`filter-btn ${statusFilter === '' ? 'active' : ''}`}
          >
            All Games
          </button>
          <button
            onClick={() => handleStatusFilter('playing')}
            className={`filter-btn ${statusFilter === 'playing' ? 'active' : ''}`}
          >
            Playing
          </button>
          <button
            onClick={() => handleStatusFilter('completed')}
            className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
          >
            Completed
          </button>
          <button
            onClick={() => handleStatusFilter('dropped')}
            className={`filter-btn ${statusFilter === 'dropped' ? 'active' : ''}`}
          >
            Dropped
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading your game collection...</div>
      ) : (
        <>
          {gameLogs.length === 0 ? (
            <div className="empty-state">
              <h3>No games in your collection yet</h3>
              <p>Start by searching for games and logging them to your collection.</p>
              <Link to="/" className="btn btn-primary">
                Discover Games
              </Link>
            </div>
          ) : (
            <div className="game-logs-list">
              {gameLogs.map(log => (
                <div key={log._id} className="game-log-item">
                  <div className="game-log-card">
                    {log.gameImage && (
                      <img
                        src={log.gameImage}
                        alt={log.gameName}
                        className="game-log-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    
                    <div className="game-log-content">
                      <div className="game-log-header">
                        <h3 className="game-log-title">
                          <Link to={`/game/${log.gameId}`}>
                            {log.gameName}
                          </Link>
                        </h3>
                        
                        <div className="game-log-actions">
                          <Link
                            to={`/game/${log.gameId}`}
                            className="btn btn-primary btn-sm"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => handleDeleteGameLog(log._id)}
                            className="btn btn-danger btn-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="game-log-details">
                        <div className="game-log-meta">
                          <span className={`status-badge status-${log.status}`}>
                            {log.status}
                          </span>
                          
                          <div className="rating">
                            <div className="stars">
                              {renderStars(log.rating)}
                            </div>
                            <span>({log.rating}/5)</span>
                          </div>
                          
                          <span className="date-logged">
                            Logged: {new Date(log.dateLogged).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {log.review && (
                          <div className="game-log-review">
                            <strong>Review:</strong>
                            <p>{log.review}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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

export default GameLog;