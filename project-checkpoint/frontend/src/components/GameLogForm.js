import React, { useState, useEffect } from 'react';
import { gameLogsAPI } from '../services/api';

const GameLogForm = ({ game, gameLog, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    status: 'playing',
    review: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (gameLog) {
      setFormData({
        rating: gameLog.rating,
        status: gameLog.status,
        review: gameLog.review || ''
      });
    }
  }, [gameLog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const gameLogData = {
        gameId: game.id,
        gameName: game.name,
        gameImage: game.background_image,
        rating: parseInt(formData.rating),
        status: formData.status,
        review: formData.review.trim()
      };

      let response;
      if (gameLog) {
        // Update existing log
        response = await gameLogsAPI.updateGameLog(gameLog._id, gameLogData);
      } else {
        // Create new log
        response = await gameLogsAPI.createGameLog(gameLogData);
      }

      onSuccess(response.data.gameLog);
    } catch (error) {
      console.error('Error saving game log:', error);
      setError(error.response?.data?.message || 'Failed to save game log. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-log-form">
      <div className="card">
        <div className="card-header">
          <h3>{gameLog ? 'Update Game Log' : 'Log This Game'}</h3>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="rating">Rating (1-5 stars)</label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value={1}>1 Star - Poor</option>
                <option value={2}>2 Stars - Fair</option>
                <option value={3}>3 Stars - Good</option>
                <option value={4}>4 Stars - Very Good</option>
                <option value={5}>5 Stars - Excellent</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="playing">Currently Playing</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="review">Review (Optional)</label>
              <textarea
                id="review"
                name="review"
                value={formData.review}
                onChange={handleChange}
                className="form-control"
                rows="4"
                placeholder="Share your thoughts about this game..."
                maxLength="1000"
              />
              <small className="text-muted">
                {formData.review.length}/1000 characters
              </small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : (gameLog ? 'Update Log' : 'Log Game')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GameLogForm;