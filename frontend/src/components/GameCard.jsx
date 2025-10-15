import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#10b981';
    if (rating >= 4.0) return '#3b82f6';
    if (rating >= 3.0) return '#f59e0b';
    return '#6b7280';
  };

  return (
    <div className="game-card">
      <div className="game-card-image-container">
        <img 
          src={game.background_image || '/placeholder-game.jpg'} 
          alt={game.name}
          className="game-card-image"
        />
        <div className="game-card-rating" style={{ backgroundColor: getRatingColor(game.rating) }}>
          ⭐ {game.rating || 'N/A'}
        </div>
      </div>
      <div className="game-card-content">
        <h3 className="game-card-title">{game.name}</h3>
        <p className="game-card-release">
          Released: {game.released || 'TBA'}
        </p>
        <div className="game-card-platforms">
          {game.platforms?.slice(0, 3).map((p, idx) => (
            <span key={idx} className="platform-tag">
              {p.platform.name}
            </span>
          ))}
        </div>
        <Link to={`/game/${game.id}`} className="game-card-button">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default GameCard;
