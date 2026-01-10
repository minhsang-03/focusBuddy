import { getActivities, deleteActivity, getTags, getLearningMethods } from '$lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
  const parentData = await parent();
  const user = parentData.user;
  const allActivities = await getActivities();
  const allTags = await getTags();
  const allMethods = await getLearningMethods();

  let activities = allActivities.filter(a => a.userId === user?._id);

  activities = activities.map(function (a) {
    return {
      ...a,
      tags: Array.isArray(a.tags)
        ? a.tags.map(function (tagId) {
            const found = allTags.find(function (t) { return t._id === tagId; });
            return found || { _id: String(tagId), name: String(tagId) };
          })
        : []
    };
  });

  return {
    activities,
    user,
    learningMethods: allMethods
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  deleteActivity: async ({ request }) => {
    const data = await request.formData();
    const id = data.get('id')?.toString();
    if (id) await deleteActivity(id);
    return { success: true };
  },
};
