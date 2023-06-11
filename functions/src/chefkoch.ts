import { HttpsError, onCall } from "firebase-functions/v2/https";
import { Ingredient, parseIngredient } from "parse-ingredient";
import { RecipePreview } from "./database/Recipe";

const chefkochApiBaseUrl = 'https://api.chefkoch.de/v2/';
const chefkochApiRecipeBaseUrl = chefkochApiBaseUrl + 'recipes/';

export const fetchRecipe = onCall(async (request) => {

    const recipeId = request.data.recipeId as string;
    return internalFetchRecipe(recipeId);
});

const internalFetchRecipe = async (recipeId: string, chefkochCookie?: string) => {

    const headers: HeadersInit = chefkochCookie ? { "Cookie": chefkochCookie } : {}

    const response = await fetch(chefkochApiRecipeBaseUrl + recipeId, {
        headers: headers
    });

    if (!response.ok) {
        throw new HttpsError("not-found", `Unable to retrieve recipe with ID ${recipeId} from chefkoch.de! The following error occurred: ${response.statusText}`);
    }

    try {
        const chefkochRecipe = await response.json();
        return convertToPartialRecipe(chefkochRecipe);

    } catch (error) {
        throw new HttpsError("internal", (error as Error)?.message || 'Unable to parse recipe information from response from chefkoch.de!');
    }
}

const convertToPartialRecipe = (chefkochRecipe: any): RecipePreview => {
    const recipe: any = {};

    if (!chefkochRecipe.title) {
        throw new Error('Unable to parse recipe name from chefkoch recipe!');
    }
    recipe.name = chefkochRecipe.title;
    recipe.sourceUrl = chefkochRecipe.siteUrl.replaceAll('\\/', '/');
    recipe.sourceId = chefkochRecipe.id || chefkochRecipe.sourceId;
    recipe.prepTime = chefkochRecipe.preparationTime;
    recipe.restingTime = chefkochRecipe.restingTime;
    recipe.cookTime = chefkochRecipe.cookingTime;
    recipe.totalTime = chefkochRecipe.totalTime;
    recipe.recipeYield = chefkochRecipe.servings;

    const ingredients: Ingredient[] = []
    for (const ingredientGroup of chefkochRecipe.ingredientGroups) {
        for (const chefkochIngredient of ingredientGroup.ingredients) {
            let ingredientString;
            try {
                ingredientString = [chefkochIngredient.amount || '', chefkochIngredient.unit || '', chefkochIngredient.name].join(' ');
                const ingredient = parseIngredient(ingredientString);
                ingredients.push(...ingredient);
            } catch (err) {
                throw new Error('Unable to parse ingredient from chefoch recipe (ingredient string was "' + ingredientString + '"!');
            }
        }
    }
    recipe.ingredients = ingredients;

    recipe.instructions = chefkochRecipe.instructions.split("\n\n");

    recipe.comments = [];
    recipe.keywords = [];
    recipe.images = [];

    const imageUrl = chefkochRecipe.previewImageUrlTemplate ? chefkochRecipe.previewImageUrlTemplate.replaceAll('\\/', '/').replace('<format>', 'crop-960x540') : undefined;
    recipe.images.push(imageUrl);

    return recipe;
}

export const fetchRecipesFromAllUserCollections = onCall(async (request) => {

    const chefkochCookie = request.data.chefkochCookie as string;

    if (!chefkochCookie) {
        throw new HttpsError("invalid-argument", 'No chefkoch cookie was passed in the request');
    }

    const fetchedRecipes: RecipePreview[] = [];

    const headers = {
        "Cookie": chefkochCookie
    };

    try {

        console.log("=== Retrieving User ID ===");
        const getUserUrl = 'https://www.chefkoch.de/benutzer/me';
        const getUserFromReponse = async (response: Response) => response.json().then(json => json.id);
        const userId = await fetch(getUserUrl, {
            headers: headers
        }).then(getUserFromReponse);
        console.log("UserID: ", userId);

        console.log("=== Retrieving User Collections ===");
        const getUserCollectionsUrl = 'https://api.chefkoch.de/v2/cookbooks/user-' + userId + '/collections?offset=0&limit=100';
        const getUserCollectionsFromResponse = async (response: Response) => response.json().then(json => json.results.map((result: any) => result.id));
        const userCollections = await fetch(getUserCollectionsUrl, {
            headers: headers
        }).then(getUserCollectionsFromResponse);
        console.log("User Collections: ", userCollections);

        for (const collectionId of userCollections) {
            const getCollectionNameAndRecipesCountUrl = 'https://api.chefkoch.de/v2/cookbooks/user-' + userId + '/recipes?categoryId=' + collectionId + '&offset=0&limit=0';
            const getCollectionNameAndRecipesCount = async (response: Response) => response.json().then(json => {
                return { count: json.count, name: json.category.name };
            });
            const collectionNameAndRecipesCount: any = await fetch(getCollectionNameAndRecipesCountUrl, {
                headers: headers
            }).then(getCollectionNameAndRecipesCount);
            console.log("=== Retrieving " + collectionNameAndRecipesCount.count + " Recipes from Collection " + collectionNameAndRecipesCount.name);

            const getCollectionRecipesUrl = 'https://api.chefkoch.de/v2/cookbooks/user-' + userId + '/recipes?categoryId=' + collectionId + '&offset=0&limit=' + collectionNameAndRecipesCount.count;
            const getCollectionRecipes = async (response: Response) => response.json().then(json => json.results);
            const recipes = await fetch(getCollectionRecipesUrl, {
                headers: headers
            }).then(getCollectionRecipes);

            for (const recipe of recipes) {
                const recipeId = recipe.recipe.id || recipe.recipe.sourceId;
                const recipeNote = recipe.note;

                const recipePreview = await internalFetchRecipe(recipeId, chefkochCookie).catch(error => {
                    throw Error('An error occurred while trying to import recipe with ID ' + recipeId + ' (' + JSON.stringify(recipe.recipe) + ')');
                });
                fetchedRecipes.push({ ...recipePreview, comment: recipeNote })
            }
        }

    } catch (error) {
        throw new HttpsError("internal", (error as Error)?.message || 'An error occurred while trying to request information from chefkoch.de!');
    }

    console.log("=== Finishing");
    console.log("Retrieved a total of " + fetchedRecipes.length + " recipes.");

    return fetchedRecipes;
});