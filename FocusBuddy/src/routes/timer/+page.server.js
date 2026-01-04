import { getLearningMethods, getTags, createActivity } from '$lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const learningMethods = await getLearningMethods();
  const tags = await getTags();
  return {
    learningMethods,
    tags,
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  saveActivity: async ({ request, cookies }) => {
    const userId = cookies.get('userId');
    if (!userId) {
      return { success: false, error: 'Nicht eingeloggt' };
    }

    const data = await request.formData();
    const title = data.get('title')?.toString() || '';
    const description = data.get('description')?.toString() || '';
    // Tags werden direkt als 'tags' Feld übergeben
    const tags = data.getAll('tags').map(id => id.toString()).filter(id => id.length === 24);
    const method = data.get('method')?.toString() || '';
    const durationSeconds = parseInt(data.get('durationSeconds')?.toString() || '0');
    const startTime = data.get('startTime')?.toString();
    const endTime = data.get('endTime')?.toString();

    try {
      await createActivity({
        title,
        description,
        tags,
        method,
        durationSeconds,
        startTime,
        endTime,
        userId,
      });
      return { success: true };
    } catch (error) {
      console.error('Fehler beim Speichern der Activity:', error);
      return { success: false, error: 'Fehler beim Speichern' };
    }
  },
};
