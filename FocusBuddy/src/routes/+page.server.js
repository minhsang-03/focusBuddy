import { getLearningMethods } from '$lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
  const { user } = await parent();
  const learningMethods = await getLearningMethods();
  return { user, learningMethods };
}
