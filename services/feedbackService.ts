
import type { Ratings, UserVotes } from '../types';
import { fetchRatingsFromServer, submitVoteToServer } from './server';

const USER_VOTES_KEY = 'ai-photo-effects-user-votes';

/**
 * Retrieves the current user's votes from localStorage.
 * @returns {UserVotes} The user's votes or an empty object.
 */
export const getUserVotes = (): UserVotes => {
  try {
    const votesJson = localStorage.getItem(USER_VOTES_KEY);
    return votesJson ? JSON.parse(votesJson) : {};
  } catch (error) {
    console.error('Failed to parse user votes from localStorage', error);
    return {};
  }
};

/**
 * Fetches the combined ratings from the simulated server.
 * @returns {Promise<Ratings>} A promise that resolves with the ratings object.
 */
export const getRatings = async (): Promise<Ratings> => {
  return await fetchRatingsFromServer();
};

/**
 * Submits a user's vote to the server and updates localStorage.
 * @param {string} effectId The ID of the effect being rated.
 * @param {'good' | 'bad'} rating The rating given by the user.
 * @returns {Promise<Ratings[string]>} A promise that resolves with the updated ratings for the effect.
 */
export const saveVote = async (effectId: string, rating: 'good' | 'bad'): Promise<Ratings[string]> => {
  const currentUserVotes = getUserVotes();
  const previousVote = currentUserVotes[effectId];

  // Don't re-submit the same vote.
  if (previousVote === rating) {
    // We can just return the current server state since nothing will change.
    const allRatings = await getRatings();
    return allRatings[effectId] || { likes: 0, dislikes: 0 };
  }

  // Send the vote to the server.
  const updatedRatings = await submitVoteToServer(effectId, rating, previousVote);
  
  // On successful submission, update the local vote record.
  currentUserVotes[effectId] = rating;
  try {
    localStorage.setItem(USER_VOTES_KEY, JSON.stringify(currentUserVotes));
  } catch (error) {
    console.error('Failed to save user vote to localStorage', error);
    // Note: The server vote succeeded, but the local record failed to save.
    // This could lead to the user being able to vote again.
    // In a real app, this might require more robust error handling.
  }

  return updatedRatings;
};
