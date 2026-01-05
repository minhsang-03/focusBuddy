import { getActivity, updateActivity, getTags } from '$lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const activity = await getActivity(params.activity_id);
  const tags = await getTags();
  return { activity, tags };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, params }) => {
    const data = await request.formData();
    const title = data.get('title')?.toString() || '';
    const description = data.get('description')?.toString() || '';
    const method = data.get('method')?.toString() || '';
    const durationSeconds = parseInt(data.get('durationSeconds')?.toString() || '0');
    const startTime = data.get('startTime')?.toString();
    const endTime = data.get('endTime')?.toString();
    const tags = data.getAll('tags').map(id => id.toString());
    try {
      await updateActivity({
        _id: params.activity_id,
        title,
        description,
        method,
        durationSeconds,
        startTime,
        endTime,
        tags
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Fehler beim Speichern' };
    }
  }
};
