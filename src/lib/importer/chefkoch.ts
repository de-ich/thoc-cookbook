import type { RecipePreview } from '$lib/database/Recipe';

const chefkochRecipeUrlRegex = new RegExp('https://www.chefkoch.de/rezepte/([0-9]+)(/[.]*)?');

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

    return await fetch('http://127.0.0.1:5001/thoc-cookbook/us-central1/fetchRecipe?recipeId=' + recipeId).then((response: Response) => response.json()).then((json: any) => json as RecipePreview);
}