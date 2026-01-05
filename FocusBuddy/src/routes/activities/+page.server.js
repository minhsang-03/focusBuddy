import { getActivities, deleteActivity } from '$lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
  const parentData = await parent();
  const user = /** @type {any} */ (parentData).user;
  const allActivities = await getActivities();
  const allTags = await import('$lib/db.js').then(mod => mod.getTags());

  // Filter activities by current user's ID
  let activities = allActivities.filter(a => /** @type {any} */ (a).userId === user?._id);

  // Populate tags with full tag objects
  activities = activities.map(a => ({
    ...a,
    tags: Array.isArray(a.tags)
      ? a.tags.map(tagId => allTags.find(t => t._id === tagId) || { _id: tagId, name: tagId })
      : []
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
