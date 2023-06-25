import { getRecipeDetails } from '$lib/firebase/recipe';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {

    const recipeId = params['recipeId'];
    return getRecipeDetails(recipeId).then(recipe => {
        return {
            recipe: recipe
        };
    }).catch((error) => {
        throw error(404, error.message || 'Not found');
    });

}