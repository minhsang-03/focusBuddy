import { getUser } from '$lib/db.js';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
  const userId = cookies.get('userId');
  if (!userId) return { user: null };

  try {
    const user = await getUser(userId);
    return { user };
  } catch (err) {
    return { user: null };
  }
}
