import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star">☆</span>);
      } else {
        stars.push(<span key={i} className="star empty">★</span>);
      }
    }

    return stars;
  };

  return (
    <div className="card game-card">
      {game.background_image && (
        <img
          src={game.background_image}
          alt={game.name}
          className="game-image"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}
      
      <div className="game-info">
        <h3 className="game-title">{game.name}</h3>
        
        {game.short_description && (
          <p className="game-description">
            {game.short_description.length > 150
              ? `${game.short_description.substring(0, 150)}...`
              : game.short_description
            }
          </p>
        )}
        
        <div className="game-meta">
          <div className="game-details">
            {game.released && (
              <span>Released: {new Date(game.released).getFullYear()}</span>
            )}
          </div>
          
          {game.rating && (
            <div className="rating">
              <div className="stars">
                {renderStars(game.rating)}
              </div>
              <span>({game.rating.toFixed(1)})</span>
            </div>
          )}
        </div>
        
        <div className="card-footer">
          <Link to={`/game/${game.id}`} className="btn btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameCard;