import { redirect } from '@sveltejs/kit';
import { getUserByEmail } from '$lib/db.js';
import { scryptSync } from 'crypto';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
  const parentData = await parent();
  const user = parentData.user;

  if (user) {
    throw redirect(302, '/timer');
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

    let user;
    
    try {
      user = await getUserByEmail(email);
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Ein Fehler ist aufgetreten' };
    }

    if (!user) {
      return { success: false, error: 'Email oder Passwort ist falsch' };
    }

    const storedPassword = user.passwordHash || '';

    if (!storedPassword) {
      return { success: false, error: 'Email oder Passwort ist falsch' };
    }

    const [salt, hash] = storedPassword.split(':');

    if (!salt || !hash) {
      return { success: false, error: 'Email oder Passwort ist falsch' };
    }

    const key = scryptSync(password, salt, 64);
    const hashedPassword = Buffer.from(key).toString('hex');

    if (hash !== hashedPassword) {
      return { success: false, error: 'Email oder Passwort ist falsch' };
    }

    cookies.set('userId', String(user._id), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    throw redirect(302, '/timer?login=success');
  }
};
