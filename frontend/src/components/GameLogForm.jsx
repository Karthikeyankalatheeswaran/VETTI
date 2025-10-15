import { useState } from 'react';

const GameLogForm = ({ initialData, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    rating: initialData?.rating || 3,
    status: initialData?.status || 'playing',
    review: initialData?.review || '',
    hoursPlayed: initialData?.hoursPlayed || 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' || name === 'hoursPlayed' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="game-log-form">
      <div className="form-group">
        <label htmlFor="rating">
          Rating: {formData.rating} / 5
          <div className="star-display">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < formData.rating ? 'star-filled' : 'star-empty'}>
                ⭐
              </span>
            ))}
          </div>
        </label>
        <input
          type="range"
          id="rating"
          name="rating"
          min="1"
          max="5"
          value={formData.rating}
          onChange={handleChange}
          className="rating-slider"
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="form-select"
        >
          <option value="plan-to-play">Plan to Play</option>
          <option value="playing">Currently Playing</option>
          <option value="completed">Completed</option>
          <option value="dropped">Dropped</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="hoursPlayed">Hours Played</label>
        <input
          type="number"
          id="hoursPlayed"
          name="hoursPlayed"
          min="0"
          value={formData.hoursPlayed}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="review">Review (Optional)</label>
        <textarea
          id="review"
          name="review"
          value={formData.review}
          onChange={handleChange}
          placeholder="Share your thoughts about this game..."
          maxLength="1000"
          rows="4"
          className="form-textarea"
        />
        <small className="char-count">{formData.review.length}/1000</small>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Update Log' : 'Save Log'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default GameLogForm;
