import { getActivities, deleteActivity } from '$lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
  const parentData = await parent();
  const user = /** @type {any} */ (parentData).user;
  // getActivities returns object[]; tags will be populated below
  const allActivities = await getActivities();
  // getTags returns object[]; will be normalized below
  const allTags = await import('$lib/db.js').then(mod => mod.getTags());

  // Filter activities by current user's ID
  let activities = allActivities.filter(a => /** @type {{ userId?: string }} */ (a).userId === user?._id);

  // Populate tags with full tag objects
  activities = activities.map(
    /**
     * @param {{ tags?: (string|object)[] }} a
     */
    function (a) {
      return {
        ...a,
        tags: Array.isArray(a.tags)
          ? a.tags.map(
              /**
               * @param {string|object} tagId
               */
              function (tagId) {
                // allTags is array of {_id, name}
                const found = allTags.find(
                  /** @param {{ _id?: string }} t */
                  function (t) { return t._id === tagId; }
                );
                return found || { _id: String(tagId), name: String(tagId) };
              }
            )
          : []
      };
    }
  );

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
