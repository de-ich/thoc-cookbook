import { browser } from '$app/environment';
import { getRecipeDetails } from '$lib/firebase/recipe';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {

    if (!browser) {
        return {
            recipe: undefined
        }
    }
    const recipeId = params.recipeId;
    const recipeDetails = getRecipeDetails(recipeId).then(recipe => {
        return {
            recipe: recipe
        };
    }).catch((e) => {
        throw error(404, e.message || 'Not found');
    });

    return recipeDetails;
}