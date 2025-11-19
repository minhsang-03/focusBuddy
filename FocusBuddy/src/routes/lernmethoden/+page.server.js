import db from '$lib/db.js';
export async function load() {

    let a = await db.getLearnCards();
    return {
        learnCards: a
    };
}