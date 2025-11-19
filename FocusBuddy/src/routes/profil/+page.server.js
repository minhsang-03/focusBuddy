import db from '$lib/db.js';
export async function load() {

    let a = await db.getMovies();
    return {
        movies: a
    };
}