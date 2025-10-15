import React, { useState, useEffect } from 'react';
import { GameDetail, GameLog, GameLogInput, GameStatus } from '../types';

interface GameLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: GameDetail;
  existingLog?: GameLog | null;
  onSubmit: (logData: GameLogInput) => Promise<void>;
  onUpdate?: (logId: string, logData: Partial<GameLogInput>) => Promise<void>;
  onDelete?: (logId: string) => Promise<void>;
}

const GameLogModal: React.FC<GameLogModalProps> = ({
  isOpen,
  onClose,
  game,
  existingLog,
  onSubmit,
  onUpdate,
  onDelete
}) => {
  const [formData, setFormData] = useState<GameLogInput>({
    gameId: game.id,
    gameName: game.name,
    gameImage: game.background_image || '',
    gameReleaseDate: game.released || '',
    rating: 5,
    status: 'plan-to-play',
    review: '',
    hoursPlayed: 0,
    dateStarted: null,
    dateCompleted: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingLog) {
      setFormData({
        gameId: existingLog.gameId,
        gameName: existingLog.gameName,
        gameImage: existingLog.gameImage,
        gameReleaseDate: existingLog.gameReleaseDate,
        rating: existingLog.rating,
        status: existingLog.status,
        review: existingLog.review || '',
        hoursPlayed: existingLog.hoursPlayed || 0,
        dateStarted: existingLog.dateStarted ? existingLog.dateStarted.split('T')[0] : null,
        dateCompleted: existingLog.dateCompleted ? existingLog.dateCompleted.split('T')[0] : null
      });
    } else {
      setFormData({
        gameId: game.id,
        gameName: game.name,
        gameImage: game.background_image || '',
        gameReleaseDate: game.released || '',
        rating: 5,
        status: 'plan-to-play',
        review: '',
        hoursPlayed: 0,
        dateStarted: null,
        dateCompleted: null
      });
    }
  }, [game, existingLog]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' || name === 'hoursPlayed' 
        ? Number(value) 
        : value === '' && (name === 'dateStarted' || name === 'dateCompleted')
        ? null
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (existingLog && onUpdate) {
        await onUpdate(existingLog._id, formData);
      } else {
        await onSubmit(formData);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save game log');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingLog || !onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this game log?')) {
      setLoading(true);
      try {
        await onDelete(existingLog._id);
        onClose();
      } catch (err: any) {
        setError(err.message || 'Failed to delete game log');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
            className={`text-2xl ${
              star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {formData.rating}/5
        </span>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {existingLog ? 'Update Game Log' : 'Log Game'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Game Info */}
        <div className="flex items-center space-x-4 mb-6 p-3 bg-gray-50 rounded-lg">
          <img
            src={game.background_image || '/placeholder-game.jpg'}
            alt={game.name}
            className="w-16 h-16 object-cover rounded"
          />
          <div>
            <h3 className="font-semibold">{game.name}</h3>
            <p className="text-sm text-gray-600">
              Released: {game.released || 'TBA'}
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="form-label">Rating</label>
            {renderStars()}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="plan-to-play">Plan to Play</option>
              <option value="playing">Currently Playing</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>

          {/* Hours Played */}
          <div>
            <label htmlFor="hoursPlayed" className="form-label">
              Hours Played
            </label>
            <input
              type="number"
              id="hoursPlayed"
              name="hoursPlayed"
              value={formData.hoursPlayed}
              onChange={handleChange}
              min="0"
              step="0.5"
              className="form-input"
            />
          </div>

          {/* Date Started */}
          <div>
            <label htmlFor="dateStarted" className="form-label">
              Date Started
            </label>
            <input
              type="date"
              id="dateStarted"
              name="dateStarted"
              value={formData.dateStarted || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Date Completed */}
          <div>
            <label htmlFor="dateCompleted" className="form-label">
              Date Completed
            </label>
            <input
              type="date"
              id="dateCompleted"
              name="dateCompleted"
              value={formData.dateCompleted || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Review */}
          <div>
            <label htmlFor="review" className="form-label">
              Review (Optional)
            </label>
            <textarea
              id="review"
              name="review"
              value={formData.review}
              onChange={handleChange}
              rows={4}
              maxLength={1000}
              className="form-input resize-none"
              placeholder="Share your thoughts about this game..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.review.length}/1000 characters
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <div>
              {existingLog && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="btn-danger"
                >
                  Delete Log
                </button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner w-4 h-4 mr-2"></div>
                    {existingLog ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  existingLog ? 'Update Log' : 'Save Log'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameLogModal;