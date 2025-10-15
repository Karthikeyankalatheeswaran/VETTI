import React from 'react';
import { Link } from 'react-router-dom';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString();
  };

  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="rating-star filled">★</span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="rating-star filled">☆</span>
        );
      } else {
        stars.push(
          <span key={i} className="rating-star empty">☆</span>
        );
      }
    }

    return <div className="rating-stars">{stars}</div>;
  };

  return (
    <div className="game-card fade-in">
      <Link to={`/game/${game.id}`}>
        <div className="relative">
          <img
            src={game.background_image || '/placeholder-game.jpg'}
            alt={game.name}
            className="game-card-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-game.jpg';
            }}
          />
          {game.metacritic && (
            <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
              {game.metacritic}
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
            {game.name}
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            {renderRating(game.rating)}
            <span className="text-sm text-gray-600">
              ({game.ratings_count} reviews)
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            Released: {formatDate(game.released)}
          </p>
          
          {game.genres && game.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {game.genres.slice(0, 3).map((genre, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {genre}
                </span>
              ))}
              {game.genres.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{game.genres.length - 3} more
                </span>
              )}
            </div>
          )}
          
          {game.platforms && game.platforms.length > 0 && (
            <div className="text-xs text-gray-500">
              Platforms: {game.platforms.slice(0, 2).join(', ')}
              {game.platforms.length > 2 && ` +${game.platforms.length - 2} more`}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default GameCard;