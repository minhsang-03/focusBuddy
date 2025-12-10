import { getUser, createUser, updateUser, deleteUser } from '$lib/db.js';
import { redirect, fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
  // Get current user ID from cookie (set by login/register)
  const userId = cookies.get('userId');
  
  if (!userId) {
    // Redirect to login if not authenticated
    throw redirect(302, '/login');
  }

  const user = await getUser(userId);

  // If user doesn't exist, redirect to login
  if (!user) {
    throw redirect(302, '/login');
  }

  return { user };
}

/** @type {import('./$types').Actions} */
export const actions = {
  updateProfile: async ({ request, cookies }) => {
    const userId = cookies.get('userId');
    if (!userId) return fail(401, { error: 'Not authenticated' });

    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');

    if (!name || !email) {
      return fail(400, { error: 'Name and email are required' });
    }

    try {
      await updateUser({
        _id: userId,
        name,
        email
      });

      return { success: true };
    } catch (error) {
      return fail(500, { error: 'Failed to update profile' });
    }
  },

  changePassword: async ({ request, cookies }) => {
    const userId = cookies.get('userId');
    if (!userId) return fail(401, { error: 'Not authenticated' });

    const formData = await request.formData();
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (!currentPassword || !newPassword || !confirmPassword) {
      return fail(400, { error: 'All password fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return fail(400, { error: 'New passwords do not match' });
    }

    // TODO: Implement password verification and hashing
    // For now, just validate that new password is different
    if (currentPassword === newPassword) {
      return fail(400, { error: 'New password must be different from current password' });
    }

    try {
      // TODO: Hash password before storing
      await updateUser({
        _id: userId,
        password: newPassword
      });

      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      return fail(500, { error: 'Failed to change password' });
    }
  },

  deleteAccount: async ({ cookies }) => {
    const userId = cookies.get('userId');
    if (!userId) return fail(401, { error: 'Not authenticated' });

    try {
      await deleteUser(userId);
      cookies.delete('userId', { path: '/' });
      throw redirect(302, '/');
    } catch (error) {
      return fail(500, { error: 'Failed to delete account' });
    }
  }
};
