import type { RecipeDraft } from '$lib/database/Recipe';
import { httpsCallable } from '$lib/firebase/firebase.client';
import { checkRecipeWithSourceIdDoesNotYetExist } from '$lib/firebase/recipe';

const chefkochRecipeUrlRegex = new RegExp('https://www.chefkoch.de/rezepte/([0-9]+)(/[.]*)?');

const fetchRecipeCallable = httpsCallable('fetchRecipe');

export const fetchRecipe = async (recipeIdOrUrl: string): Promise<RecipeDraft> => {

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

    const alreadyExists = await checkRecipeWithSourceIdDoesNotYetExist(recipeId);

    if (alreadyExists) {
        throw new Error(`Chefkoch recipe with id ${recipeId} already exists in the database!`);
    }

    return fetchRecipeCallable({ recipeId: recipeId }).then(result => result.data as RecipeDraft);
}

const fetchRecipesFromAllUserCollectionsCallable = httpsCallable('fetchRecipesFromAllUserCollections');

export const fetchRecipesFromAllUserCollections = async (chefkochCookie: string): Promise<RecipeDraft[]> => {
    return fetchRecipesFromAllUserCollectionsCallable({ chefkochCookie: chefkochCookie }).then(result => result.data as RecipeDraft[]);
}