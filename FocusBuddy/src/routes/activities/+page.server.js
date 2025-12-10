import { getActivities } from '$lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
  const parentData = await parent();
  const user = /** @type {any} */ (parentData).user;
  const allActivities = await getActivities();
  
  // Filter activities by current user's ID
  const activities = allActivities.filter(a => /** @type {any} */ (a).userId === user?._id);
  
  return {
    activities,
    user
  };
}
