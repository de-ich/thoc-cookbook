import type { RecipePreview } from '$lib/database/Recipe';
import { httpsCallable } from '$lib/firebase/firebase.client';

const chefkochRecipeUrlRegex = new RegExp('https://www.chefkoch.de/rezepte/([0-9]+)(/[.]*)?');

const fetchRecipeCallable = httpsCallable('fetchRecipe');

export const fetchRecipe = async (recipeIdOrUrl: string): Promise<RecipePreview> => {

    let recipeId = null;
    if (parseInt(recipeIdOrUrl)) {
        recipeId = recipeIdOrUrl;
    } else {
        const match = recipeIdOrUrl.match(chefkochRecipeUrlRegex);

        if (!match) {
            throw new Error('Unable to parse recipe ID!');
        }

        recipeId = match[1];
    }

    return fetchRecipeCallable({ recipeId: recipeId }).then(result => result.data as RecipePreview);
}