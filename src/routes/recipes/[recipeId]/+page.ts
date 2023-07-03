import { getRecipeDetails } from '$lib/firebase/recipe';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {

    const recipeId = params['recipeId'];
    return getRecipeDetails(recipeId).then(recipe => {
        return {
            recipe: recipe
        };
    }).catch((e) => {
        throw error(404, e.message || 'Not found');
    });

}