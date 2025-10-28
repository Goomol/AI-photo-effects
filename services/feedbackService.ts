
import type { Ratings } from '../types';

const RATINGS_KEY = 'ai-photo-effects-ratings';

/**
 * Retrieves all ratings from localStorage.
 * @returns {Ratings} The ratings object or an empty object if none found.
 */
export const getRatings = (): Ratings => {
  try {
    const ratingsJson = localStorage.getItem(RATINGS_KEY);
    return ratingsJson ? JSON.parse(ratingsJson) : {};
  } catch (error) {
    console.error('Failed to parse ratings from localStorage', error);
    return {};
  }
};

/**
 * Saves a rating for a specific effect and persists it to localStorage.
 * @param {string} effectId The ID of the effect being rated.
 * @param {'good' | 'bad'} rating The rating given by the user.
 * @returns {Ratings} The updated ratings object.
 */
export const saveRating = (effectId: string, rating: 'good' | 'bad'): Ratings => {
  const currentRatings = getRatings();

  // Initialize the effect rating if it doesn't exist
  if (!currentRatings[effectId]) {
    currentRatings[effectId] = { likes: 0, dislikes: 0 };
  }

  if (rating === 'good') {
    currentRatings[effectId].likes += 1;
  } else {
    currentRatings[effectId].dislikes += 1;
  }

  try {
    localStorage.setItem(RATINGS_KEY, JSON.stringify(currentRatings));
  } catch (error) {
    console.error('Failed to save ratings to localStorage', error);
  }
  
  return currentRatings;
};
