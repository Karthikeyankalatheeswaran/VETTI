import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gameLogsAPI } from '../services/api';

const MyLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, statusFilter, searchQuery]);

  const fetchLogs = async () => {
    try {
      const response = await gameLogsAPI.getAll();
      setLogs(response.data);
    } catch (err) {
      setError('Failed to fetch your game logs');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...logs];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(log => 
        log.gameName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;

    try {
      await gameLogsAPI.delete(id);
      setLogs(logs.filter(log => log._id !== id));
    } catch (err) {
      setError('Failed to delete game log');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'playing': 'status-playing',
      'completed': 'status-completed',
      'dropped': 'status-dropped',
      'plan-to-play': 'status-plan'
    };
    return classes[status] || '';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'playing': 'Playing',
      'completed': 'Completed',
      'dropped': 'Dropped',
      'plan-to-play': 'Plan to Play'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your logs...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="my-logs-header">
        <h1>My Game Logs</h1>
        <p className="subtitle">Track and manage your gaming journey</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search your games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="playing">Currently Playing</option>
          <option value="completed">Completed</option>
          <option value="dropped">Dropped</option>
          <option value="plan-to-play">Plan to Play</option>
        </select>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="no-results">
          <p>
            {logs.length === 0 
              ? "You haven't logged any games yet. Start exploring!" 
              : "No games match your filters."}
          </p>
          {logs.length === 0 && (
            <Link to="/" className="btn btn-primary">
              Discover Games
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="stats-summary">
            <div className="stat-card">
              <h3>{logs.length}</h3>
              <p>Total Games</p>
            </div>
            <div className="stat-card">
              <h3>{logs.filter(l => l.status === 'completed').length}</h3>
              <p>Completed</p>
            </div>
            <div className="stat-card">
              <h3>{logs.filter(l => l.status === 'playing').length}</h3>
              <p>Playing</p>
            </div>
            <div className="stat-card">
              <h3>{Math.round(logs.reduce((acc, l) => acc + l.rating, 0) / logs.length * 10) / 10}</h3>
              <p>Avg Rating</p>
            </div>
          </div>

          <div className="logs-list">
            {filteredLogs.map(log => (
              <div key={log._id} className="log-card">
                <div className="log-card-image">
                  <img src={log.gameImage || '/placeholder-game.jpg'} alt={log.gameName} />
                </div>
                <div className="log-card-content">
                  <div className="log-card-header">
                    <h3>{log.gameName}</h3>
                    <span className={`status-badge ${getStatusBadgeClass(log.status)}`}>
                      {getStatusLabel(log.status)}
                    </span>
                  </div>
                  
                  <div className="log-card-rating">
                    <span className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < log.rating ? 'star-filled' : 'star-empty'}>
                          ⭐
                        </span>
                      ))}
                    </span>
                    <span className="rating-number">{log.rating}/5</span>
                  </div>

                  {log.hoursPlayed > 0 && (
                    <p className="log-hours">⏱️ {log.hoursPlayed} hours played</p>
                  )}

                  {log.review && (
                    <p className="log-review">{log.review}</p>
                  )}

                  <div className="log-card-footer">
                    <small>Last updated: {new Date(log.updatedAt).toLocaleDateString()}</small>
                    <div className="log-actions">
                      <Link to={`/game/${log.gameId}`} className="btn-link">
                        View Game
                      </Link>
                      <button 
                        onClick={() => handleDelete(log._id)} 
                        className="btn-danger-small"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyLogs;
