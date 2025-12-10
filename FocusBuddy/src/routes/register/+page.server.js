import { getUsers, getUser, createUser } from '$lib/db.js';
import { redirect, fail } from '@sveltejs/kit';
import { randomBytes, scryptSync } from 'crypto';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const name = (form.get('name') || '').toString().trim();
    const email = (form.get('email') || '').toString().trim().toLowerCase();
    const password = (form.get('password') || '').toString();
    const confirm = (form.get('confirmPassword') || '').toString();

    if (!name || !email || !password || !confirm) {
      return fail(400, { error: 'Alle Felder sind erforderlich' });
    }

    if (password !== confirm) {
      return fail(400, { error: 'Passwörter stimmen nicht überein' });
    }

    // check if email already exists
    const users = await getUsers();
    const existing = users.find((u) => (u.email || '').toLowerCase() === email);
    if (existing) {
      return fail(400, { error: 'E-Mail ist bereits registriert' });
    }

    // hash password with salt using scrypt
    const salt = randomBytes(16).toString('hex');
    const key = scryptSync(password, salt, 64);
    const hash = Buffer.from(key).toString('hex');
    const stored = `${salt}:${hash}`;

    // create user
    const id = await createUser({ username: name, email, passwordHash: stored });
    const user = await getUser(id);

    if (!user) return fail(500, { error: 'Konnte Nutzer nicht anlegen' });

    cookies.set('userId', user._id, { path: '/', httpOnly: true });

    throw redirect(302, '/profil');
  }
};