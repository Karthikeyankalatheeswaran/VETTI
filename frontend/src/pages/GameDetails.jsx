import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { rawgAPI } from '../services/rawgApi';
import { gameLogsAPI } from '../services/api';
import GameLogForm from '../components/GameLogForm';

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [existingLog, setExistingLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showLogForm, setShowLogForm] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    fetchGameDetails();
    if (isLoggedIn) {
      checkExistingLog();
    }
  }, [id]);

  const fetchGameDetails = async () => {
    try {
      const response = await rawgAPI.getGameDetails(id);
      setGame(response.data);
    } catch (err) {
      setError('Failed to load game details');
      console.error('Error fetching game details:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingLog = async () => {
    try {
      const response = await gameLogsAPI.getByGameId(id);
      setExistingLog(response.data);
      setShowLogForm(true);
    } catch (err) {
      // No existing log found
      setExistingLog(null);
    }
  };

  const handleLogSubmit = async (formData) => {
    if (!isLoggedIn) {
      setError('Please login to log games');
      navigate('/login');
      return;
    }

    try {
      const logData = {
        ...formData,
        gameId: game.id,
        gameName: game.name,
        gameImage: game.background_image
      };

      if (existingLog) {
        await gameLogsAPI.update(existingLog._id, formData);
        setMessage('Game log updated successfully!');
      } else {
        await gameLogsAPI.create(logData);
        setMessage('Game logged successfully!');
      }
      
      checkExistingLog();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save game log');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteLog = async () => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;

    try {
      await gameLogsAPI.delete(existingLog._id);
      setExistingLog(null);
      setShowLogForm(false);
      setMessage('Game log deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete game log');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading game details...</p>
      </div>
    );
  }

  if (!game) {
    return <div className="error-message">Game not found</div>;
  }

  return (
    <div className="container">
      <div className="game-details">
        <div className="game-details-header">
          <img 
            src={game.background_image} 
            alt={game.name}
            className="game-details-image"
          />
          <div className="game-details-overlay">
            <h1>{game.name}</h1>
            <div className="game-meta">
              <span className="rating-badge">⭐ {game.rating}/5</span>
              <span>Released: {game.released || 'TBA'}</span>
              <span>Playtime: {game.playtime}h</span>
            </div>
          </div>
        </div>

        <div className="game-details-content">
          <div className="game-info">
            <h2>About</h2>
            <div 
              className="game-description"
              dangerouslySetInnerHTML={{ __html: game.description_raw || game.description }}
            />

            <div className="game-stats">
              <div className="stat-item">
                <h3>Platforms</h3>
                <div className="platforms-list">
                  {game.platforms?.map((p, idx) => (
                    <span key={idx} className="platform-tag">{p.platform.name}</span>
                  ))}
                </div>
              </div>

              <div className="stat-item">
                <h3>Genres</h3>
                <div className="genres-list">
                  {game.genres?.map((g, idx) => (
                    <span key={idx} className="genre-tag">{g.name}</span>
                  ))}
                </div>
              </div>

              {game.developers?.length > 0 && (
                <div className="stat-item">
                  <h3>Developers</h3>
                  <p>{game.developers.map(d => d.name).join(', ')}</p>
                </div>
              )}

              {game.publishers?.length > 0 && (
                <div className="stat-item">
                  <h3>Publishers</h3>
                  <p>{game.publishers.map(p => p.name).join(', ')}</p>
                </div>
              )}
            </div>
          </div>

          <div className="game-log-section">
            <h2>
              {existingLog ? 'Your Log' : 'Log This Game'}
            </h2>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            {!isLoggedIn ? (
              <div className="auth-prompt">
                <p>Please login to log this game</p>
                <button onClick={() => navigate('/login')} className="btn btn-primary">
                  Login
                </button>
              </div>
            ) : (
              <>
                {!showLogForm && !existingLog && (
                  <button 
                    onClick={() => setShowLogForm(true)} 
                    className="btn btn-primary btn-large"
                  >
                    📝 Log This Game
                  </button>
                )}

                {showLogForm && (
                  <>
                    <GameLogForm
                      initialData={existingLog}
                      onSubmit={handleLogSubmit}
                      onCancel={existingLog ? null : () => setShowLogForm(false)}
                      isEditing={!!existingLog}
                    />
                    {existingLog && (
                      <button 
                        onClick={handleDeleteLog} 
                        className="btn btn-danger"
                        style={{ marginTop: '1rem' }}
                      >
                        🗑️ Delete Log
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
