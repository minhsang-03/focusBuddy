import { getActivities } from '$lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const activities = await getActivities();
  return {
    activities,
  };
}
