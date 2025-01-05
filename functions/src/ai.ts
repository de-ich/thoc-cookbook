import { HttpsError, onCall } from 'firebase-functions/https';
import { defineSecret } from 'firebase-functions/params';
import { onInit } from 'firebase-functions/v2/core';
import { extractRecipe } from './genkit/aiRetriever';
import { RecipeDraft } from './database/Recipe';

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
  
  try {
      const extractedRecipe = await extractRecipe(recipeUrl);
      const partialRecipe = convertToPartialRecipe(extractedRecipe);
      partialRecipe.sourceUrl = recipeUrl;
      return partialRecipe;

  } catch (error) {
      throw new HttpsError(
          'internal',
          (error as Error)?.message ||
          'Unable to parse recipe information from response from chefkoch.de!'
      );
  }
});

const convertToPartialRecipe = (extractedRecipe: any): RecipeDraft => {
	if (!extractedRecipe.name) {
		throw new Error('Unable to parse recipe name from extracted recipe!');
	}
  
	const recipe: any = extractedRecipe;

	return recipe;
};
