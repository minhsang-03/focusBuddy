import { getActivities, deleteActivity } from '$lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
  const parentData = await parent();
  const user = /** @type {any} */ (parentData).user;
  const allActivities = await getActivities();

  // Filter activities by current user's ID
  let activities = allActivities.filter(a => /** @type {any} */ (a).userId === user?._id);

  // Ensure tags are string array (not ObjectId)
  activities = activities.map(a => ({
    ...a,
    tags: Array.isArray(a.tags) ? a.tags.map(tag => typeof tag === 'string' ? tag : tag?.toString()) : []
  }));

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
