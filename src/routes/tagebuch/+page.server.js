import { getJournalEntries, createJournalEntry } from '$lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
  const parentData = await parent();
  const user = parentData.user;
  const allEntries = await getJournalEntries();
  const entries = allEntries.filter(e => e.userId === user?._id);
  return { entries, user };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, parent }) => {
    const parentData = await parent();
    const user = parentData.user;
    const formData = await request.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const mood = formData.get('mood');

    if (!title || !content) {
      return { success: false, error: 'Titel und Inhalt sind erforderlich' };
    }

    try {
      await createJournalEntry({ title, content, mood, userId: user?._id });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Fehler beim Speichern des Eintrags' };
    }
  }
};
