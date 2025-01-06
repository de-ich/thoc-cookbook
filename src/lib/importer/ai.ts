import type { RecipeDraft } from '$lib/database/Recipe';
import { httpsCallable } from '$lib/firebase/firebase.client';

const aiRetrieveCallable = httpsCallable('aiRetrieve');

export const fetchRecipe = async (recipeUrl: string): Promise<RecipeDraft> => {

	return aiRetrieveCallable({ recipeUrl: recipeUrl }).then((result) => result.data as RecipeDraft);
};
