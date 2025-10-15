// User types
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Game types
export interface Game {
  id: number;
  name: string;
  slug: string;
  background_image: string;
  released: string;
  rating: number;
  rating_top: number;
  ratings_count: number;
  metacritic: number;
  platforms: string[];
  genres: string[];
  short_screenshots: Array<{ id: number; image: string }>;
}

export interface GameDetail extends Game {
  description: string;
  description_raw: string;
  background_image_additional: string;
  website: string;
  tba: boolean;
  ratings: Array<{
    id: number;
    title: string;
    count: number;
    percent: number;
  }>;
  added: number;
  added_by_status: {
    yet: number;
    owned: number;
    beaten: number;
    toplay: number;
    dropped: number;
    playing: number;
  };
  metacritic_platforms: Array<{
    metascore: number;
    url: string;
    platform: {
      platform: number;
      name: string;
      slug: string;
    };
  }>;
  playtime: number;
  screenshots_count: number;
  movies_count: number;
  creators_count: number;
  achievements_count: number;
  parent_achievements_count: number;
  reddit_url: string;
  reddit_name: string;
  reddit_description: string;
  reddit_logo: string;
  reddit_count: number;
  twitch_count: number;
  youtube_count: number;
  reviews_count: number;
  saturated_color: string;
  dominant_color: string;
  platforms: Array<{
    platform: string;
    released_at: string;
    requirements: {
      minimum: string;
      recommended: string;
    };
  }>;
  parent_platforms: string[];
  genres: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  stores: Array<{
    id: number;
    store: string;
    url: string;
  }>;
  developers: string[];
  publishers: string[];
  esrb_rating: string | null;
  clip: string | null;
  tags: string[];
}

export interface GamesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
}

// Game Log types
export type GameStatus = 'playing' | 'completed' | 'dropped' | 'plan-to-play';

export interface GameLog {
  _id: string;
  user: string | User;
  gameId: number;
  gameName: string;
  gameImage: string;
  gameReleaseDate: string;
  rating: number;
  status: GameStatus;
  review: string;
  hoursPlayed: number;
  dateStarted: string | null;
  dateCompleted: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GameLogInput {
  gameId: number;
  gameName: string;
  gameImage?: string;
  gameReleaseDate?: string;
  rating: number;
  status: GameStatus;
  review?: string;
  hoursPlayed?: number;
  dateStarted?: string | null;
  dateCompleted?: string | null;
}

export interface GameLogsResponse {
  gameLogs: GameLog[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GameLogStats {
  totalGames: number;
  totalHours: number;
  averageRating: number;
  statusCounts: {
    playing: number;
    completed: number;
    dropped: number;
    'plan-to-play': number;
  };
}

// API Error type
export interface ApiError {
  message: string;
  error?: any;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}