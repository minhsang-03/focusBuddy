import { redirect } from '@sveltejs/kit';
import { getUser, getUserByEmail } from '$lib/db.js';
import { createHash } from 'crypto';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
  const parentData = await parent();
  const user = parentData.user;

  // If already logged in, redirect to timer
  if (user) {
    redirect(302, '/timer');
  }

  return {};
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    if (!email || !password) {
      return { success: false, error: 'Email und Passwort sind erforderlich' };
    }

    try {
      // Find user by email
      const user = await getUserByEmail(email);

      if (!user) {
        return { success: false, error: 'Email oder Passwort ist falsch' };
      }

      // Get the stored password hash
      const storedPassword = /** @type {any} */ (user).password || '';

      if (!storedPassword) {
        return { success: false, error: 'Email oder Passwort ist falsch' };
      }

      // Parse salt and hash from stored format "salt:hash"
      const [salt, hash] = storedPassword.split(':');

      if (!salt || !hash) {
        return { success: false, error: 'Email oder Passwort ist falsch' };
      }

      // Hash the provided password with the stored salt
      const crypto = await import('crypto');
      const hashedPassword = crypto.scryptSync(password, salt, 32).toString('hex');

      // Compare hashes
      if (hash !== hashedPassword) {
        return { success: false, error: 'Email oder Passwort ist falsch' };
      }

      // Set cookie and redirect
      cookies.set('userId', String(/** @type {any} */ (user)._id), {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      redirect(302, '/timer');
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Ein Fehler ist aufgetreten' };
    }
  }
};
