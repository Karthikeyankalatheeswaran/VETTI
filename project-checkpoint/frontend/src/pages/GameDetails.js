import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { gamesAPI, gameLogsAPI } from '../services/api';
import GameLogForm from '../components/GameLogForm';

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [game, setGame] = useState(null);
  const [gameLog, setGameLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogForm, setShowLogForm] = useState(false);

  useEffect(() => {
    loadGameDetails();
    if (user) {
      loadUserGameLog();
    }
  }, [id, user]);

  const loadGameDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await gamesAPI.getGameDetails(id);
      setGame(response.data);
    } catch (error) {
      console.error('Error loading game details:', error);
      setError('Failed to load game details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadUserGameLog = async () => {
    try {
      const response = await gameLogsAPI.getGameLog(id);
      setGameLog(response.data);
    } catch (error) {
      // Game not logged by user, this is normal
      setGameLog(null);
    }
  };

  const handleLogSuccess = (newGameLog) => {
    setGameLog(newGameLog);
    setShowLogForm(false);
  };

  const handleUpdateSuccess = (updatedGameLog) => {
    setGameLog(updatedGameLog);
    setShowLogForm(false);
  };

  const handleDeleteSuccess = () => {
    setGameLog(null);
    setShowLogForm(false);
  };

  if (loading) {
    return <div className="loading">Loading game details...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-error">
        {error}
        <button onClick={() => navigate('/')} className="btn btn-primary mt-20">
          Back to Home
        </button>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="alert alert-error">
        Game not found.
        <button onClick={() => navigate('/')} className="btn btn-primary mt-20">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="game-details">
      <button onClick={() => navigate('/')} className="btn btn-secondary mb-20">
        ← Back to Home
      </button>

      <div className="game-details-header">
        {game.background_image && (
          <img
            src={game.background_image}
            alt={game.name}
            className="game-details-image"
          />
        )}
        
        <div className="game-details-info">
          <h1 className="game-details-title">{game.name}</h1>
          
          <div className="game-details-meta">
            {game.released && (
              <p><strong>Released:</strong> {new Date(game.released).toLocaleDateString()}</p>
            )}
            
            {game.rating && (
              <p><strong>Rating:</strong> {game.rating.toFixed(1)}/5</p>
            )}
            
            {game.metacritic && (
              <p><strong>Metacritic:</strong> {game.metacritic}/100</p>
            )}
            
            {game.genres && game.genres.length > 0 && (
              <p><strong>Genres:</strong> {game.genres.join(', ')}</p>
            )}
            
            {game.developers && game.developers.length > 0 && (
              <p><strong>Developers:</strong> {game.developers.join(', ')}</p>
            )}
            
            {game.publishers && game.publishers.length > 0 && (
              <p><strong>Publishers:</strong> {game.publishers.join(', ')}</p>
            )}
            
            {game.platforms && game.platforms.length > 0 && (
              <p><strong>Platforms:</strong> {game.platforms.join(', ')}</p>
            )}
          </div>
        </div>
      </div>

      {game.description && (
        <div className="game-description-section">
          <h2>Description</h2>
          <div 
            className="game-description-content"
            dangerouslySetInnerHTML={{ __html: game.description }}
          />
        </div>
      )}

      {game.website && (
        <div className="game-website">
          <a 
            href={game.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Visit Official Website
          </a>
        </div>
      )}

      {/* Game Logging Section */}
      {user ? (
        <div className="game-logging-section">
          <h2>Your Game Log</h2>
          
          {gameLog ? (
            <div className="existing-game-log">
              <div className="card">
                <div className="card-body">
                  <div className="game-log-info">
                    <p><strong>Status:</strong> 
                      <span className={`status-badge status-${gameLog.status}`}>
                        {gameLog.status}
                      </span>
                    </p>
                    <p><strong>Your Rating:</strong> {gameLog.rating}/5</p>
                    <p><strong>Date Logged:</strong> {new Date(gameLog.dateLogged).toLocaleDateString()}</p>
                    {gameLog.review && (
                      <p><strong>Review:</strong> {gameLog.review}</p>
                    )}
                  </div>
                  
                  <div className="game-log-actions">
                    <button
                      onClick={() => setShowLogForm(true)}
                      className="btn btn-primary"
                    >
                      Update Log
                    </button>
                    <button
                      onClick={handleDeleteGameLog}
                      className="btn btn-danger"
                    >
                      Delete Log
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-game-log">
              <p>You haven't logged this game yet.</p>
              <button
                onClick={() => setShowLogForm(true)}
                className="btn btn-primary"
              >
                Log This Game
              </button>
            </div>
          )}

          {showLogForm && (
            <GameLogForm
              game={game}
              gameLog={gameLog}
              onSuccess={gameLog ? handleUpdateSuccess : handleLogSuccess}
              onCancel={() => setShowLogForm(false)}
            />
          )}
        </div>
      ) : (
        <div className="login-prompt">
          <p>Please log in to track this game in your collection.</p>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );

  async function handleDeleteGameLog() {
    if (window.confirm('Are you sure you want to delete this game log?')) {
      try {
        await gameLogsAPI.deleteGameLog(gameLog._id);
        handleDeleteSuccess();
      } catch (error) {
        console.error('Error deleting game log:', error);
        alert('Failed to delete game log. Please try again.');
      }
    }
  }
};

export default GameDetails;