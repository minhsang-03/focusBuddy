import { redirect } from '@sveltejs/kit';
import { getLearningMethods } from '$lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
  // Redirect to timer page
  throw redirect(302, '/timer');
}
