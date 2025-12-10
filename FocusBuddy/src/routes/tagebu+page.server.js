import { getJournalEntries, createJournalEntry } from '$lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const entries = await getJournalEntries();
  return { entries };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const mood = formData.get('mood');

    if (!title || !content) {
      return { success: false, error: 'Titel und Inhalt sind erforderlich' };
    }

    try {
      await createJournalEntry({ title, content, mood });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Fehler beim Speichern des Eintrags' };
    }
  }
};
