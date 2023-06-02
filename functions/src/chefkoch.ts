import { onRequest } from "firebase-functions/v1/https";
import { Request, Response } from "firebase-functions"

const chefkochApiBaseUrl = 'https://api.chefkoch.de/v2/';
const chefkochApiRecipeBaseUrl = chefkochApiBaseUrl + 'recipes/';

export const fetchRecipe = onRequest(async (req, res) => {

    allowCors(req, res);

    const recipeId = req.query.recipeId as string;
    const response = await fetch(chefkochApiRecipeBaseUrl + recipeId);

    if (!response.ok) {
        res.statusCode = response.status;
        res.send(`Unable to retrieve recipe with ID ${recipeId} from chefkoch.de! The following error occurred: ${response.statusText}`);
        return;
    }

    try {
        const chefkochRecipe = await response.json();
        console.log(chefkochRecipe);
        res.json(convertToPartialRecipe(chefkochRecipe));

    } catch (error) {
        res.statusCode = 500;
        res.send((error as Error)?.message || 'Unable to parse recipe information from response from chefkoch.de!');
    }
});

function allowCors(req: Request, res: Response) {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
        return;
    }
}


const convertToPartialRecipe = (chefkochRecipe: any): any => {
    const recipe: any = {};

    if (!chefkochRecipe.title) {
        throw new Error('Unable to parse recipe name from chefkoch recipe!');
    }
    recipe.name = chefkochRecipe.title;
    recipe.sourceUrl = chefkochRecipe.siteUrl.replaceAll('\\/', '/');
    recipe.sourceId = chefkochRecipe.id;
    recipe.prepTime = chefkochRecipe.preparationTime;
    recipe.restingTime = chefkochRecipe.restingTime;
    recipe.cookTime = chefkochRecipe.cookingTime;
    recipe.totalTime = chefkochRecipe.totalTime;
    recipe.recipeYield = chefkochRecipe.servings;

    const ingredients: any[] = []
    for (const ingredientGroup of chefkochRecipe.ingredientGroups) {
        for (const chefkochIngredient of ingredientGroup.ingredients) {
            const ingredient: any = {
                name: chefkochIngredient.name,
                count: chefkochIngredient.amount,
                unit: chefkochIngredient.unit
            };
            ingredients.push(ingredient);
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