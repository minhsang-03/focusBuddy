import db from '$lib/db.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
    let a = await db.getMovie(params.movie_id);
    return {
        movie: a
    };
}

export const actions = {
    delete: async ({ params }) => {
        // attempt to delete the movie and then redirect to the list
        await db.deleteMovie(params.movie_id);
        throw redirect(303, '/movies');
    }
};