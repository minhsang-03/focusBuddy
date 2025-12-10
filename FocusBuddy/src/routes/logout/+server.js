import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET({ cookies }) {
  cookies.delete('userId', { path: '/' });
  throw redirect(302, '/');
}
