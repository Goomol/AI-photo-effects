
import type { Ratings } from '../types';
import { BASE_RATINGS } from '../constants';

// --- Server-Side Simulation ---

// In-memory "database" initialized with base ratings.
// A deep copy is made to prevent mutations of the constant.
let ratings: Ratings = JSON.parse(JSON.stringify(BASE_RATINGS));

// Simulate network latency.
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulates fetching all ratings from the server.
 * @returns {Promise<Ratings>} A promise that resolves with all ratings.
 */
export const fetchRatingsFromServer = async (): Promise<Ratings> => {
  await simulateDelay(500); // Simulate 0.5 second network delay
  // Return a deep copy to prevent client-side mutations from affecting the "database".
  return JSON.parse(JSON.stringify(ratings));
};

/**
 * Simulates submitting a vote to the server.
 * Handles transactional updates if a user changes their vote.
 * @param {string} effectId The ID of the effect being voted on.
 * @param {'good' | 'bad'} newVote The new vote from the user.
 * @param {'good' | 'bad' | undefined} previousVote The user's previous vote, if any.
 * @returns {Promise<Ratings[string]>} A promise that resolves with the updated ratings for the specific effect.
 */
export const submitVoteToServer = async (
  effectId: string,
  newVote: 'good' | 'bad',
  previousVote?: 'good' | 'bad'
): Promise<Ratings[string]> => {
  await simulateDelay(750); // Simulate a slightly longer delay for a POST request.

  if (!ratings[effectId]) {
    ratings[effectId] = { likes: 0, dislikes: 0 };
  }

  // Transactional update: If the user is changing their vote, undo the previous one.
  if (previousVote) {
    if (previousVote === 'good') {
      ratings[effectId].likes = Math.max(0, ratings[effectId].likes - 1);
    } else {
      ratings[effectId].dislikes = Math.max(0, ratings[effectId].dislikes - 1);
    }
  }

  // Apply the new vote.
  if (newVote === 'good') {
    ratings[effectId].likes += 1;
  } else {
    ratings[effectId].dislikes += 1;
  }

  // Return the updated ratings for just this effect.
  return { ...ratings[effectId] };
};
