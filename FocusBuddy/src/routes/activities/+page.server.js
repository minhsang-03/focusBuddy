import { getActivities, deleteActivity } from '$lib/db.js';

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

/** @type {import('./$types').Actions} */
export const actions = {
  deleteActivity: async ({ request }) => {
    const data = await request.formData();
    const id = data.get('id');
    if (typeof id === 'string' && id) {
      await deleteActivity(id);
    } else if (id && typeof id === 'object' && 'toString' in id) {
      await deleteActivity(id.toString());
    }
    return { success: true };
  },
};
