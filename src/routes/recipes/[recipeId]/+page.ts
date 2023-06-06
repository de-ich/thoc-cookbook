import { error } from '@sveltejs/kit';
import type { Recipe } from '$lib/database/Recipe';
import { db } from '$lib/firebase/firebase.client';
import { doc, getDoc } from 'firebase/firestore';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {

    const recipeRef = doc(db, 'recipes', params['recipeId']);
    return getDoc(recipeRef).then((doc) => {
        return {
            recipe: doc.data() as Recipe
        };
    }).catch(() => { throw error(404, 'Not found'); });

}