import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
  // Redirect to timer page
  throw redirect(302, '/timer');
}
