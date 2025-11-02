import { HttpsError, onCall } from 'firebase-functions/https';
import { defineSecret } from 'firebase-functions/params';
import { onInit } from 'firebase-functions/v2/core';
import { extractRecipe, extractRecipeFromImage } from './genkit/aiRetriever';
import { RecipeDraft } from './database/Recipe';
import { RecipeDraftSchema as GenkitRecipeDraftSchema} from './genkit/aiRetriever';
import { z } from 'genkit';

// Load the Google GenAI API key from the Firebase environment
const googleGenAiApiKey = defineSecret('GOOGLE_GENAI_API_KEY');

let googleGenAiApiKeyValue;

// see https://firebase.google.com/docs/functions/config-env?gen=2nd
onInit(() => {
    googleGenAiApiKeyValue = googleGenAiApiKey.value();
    process.env.GOOGLE_GENAI_API_KEY = googleGenAiApiKeyValue;
});

export const aiRetrieve = onCall({ maxInstances: 1 }, async (request) => {
  	const recipeUrl = request.data.recipeUrl as string;
  
	const recipeUrlIsDataImageUrl = recipeUrl.startsWith('data:image/');

  	try {
    	const extractedRecipe = recipeUrlIsDataImageUrl
			? await extractRecipeFromImage(recipeUrl)
			: await extractRecipe(recipeUrl);
      	const partialRecipe = convertToPartialRecipe(extractedRecipe);

		if (!recipeUrlIsDataImageUrl) {
			partialRecipe.sourceUrl = recipeUrl;
		}
		return partialRecipe;

	} catch (error) {
		throw new HttpsError(
			'internal',
			(error as Error)?.message ||
				`Unable to parse recipe information from ${recipeUrlIsDataImageUrl ? 'image' : 'URL'}! AI did not return valid recipe data.`,
		);
	}
});

type GenkitRecipeDraft = z.infer<typeof GenkitRecipeDraftSchema>;

const convertToPartialRecipe = (extractedRecipe: GenkitRecipeDraft): RecipeDraft => {
	if (!extractedRecipe.name) {
		throw new Error('Unable to parse recipe name from extracted recipe!');
	}

	const recipe: RecipeDraft = {
		images: extractedRecipe.recipeImage ? [extractedRecipe.recipeImage] : [],
		ingredients: extractedRecipe.ingredients
			.filter((i) => i !== undefined)
			.map((ingredient) => ({
				quantity: ingredient.quantity || null,
				quantity2: ingredient.quantity2 || null,
				unitOfMeasure: ingredient.unitOfMeasure || null,
				unitOfMeasureID: null,
				description: ingredient.description,
				isGroupHeader: false
			})),
		name: extractedRecipe.name,
		instructions: extractedRecipe.instructions,
		sourceUrl: null,
		sourceId: null,
		prepTime: extractedRecipe.preparationTime || null,
		cookTime: extractedRecipe.cookingTime || null,
		restingTime: extractedRecipe.restingTime || null,
		totalTime: extractedRecipe.totalTime || null,
		recipeYield: extractedRecipe.recipeYield ? parseInt(extractedRecipe.recipeYield) : null,
		recipeYieldType: extractedRecipe.recipeYieldType,
		keywords: [],
		comment: null
	};

	return recipe;
};
