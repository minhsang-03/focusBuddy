import { getLearningMethods } from '$lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const learningMethods = await getLearningMethods();
  return {
    learningMethods,
  };
}
