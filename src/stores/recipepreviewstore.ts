import { derived, writable } from 'svelte/store';
import { getEmptyRecipePreview, type RecipePreview } from '$lib/database/Recipe';




export const recipePreviewStore = writable<RecipePreview>(getEmptyRecipePreview());

export const transformedRecipePreviewStore = (inTransformer?: any, outTransformer?: any) => {
    const identity = (x: any) => x;
    const transformIn = inTransformer ?? identity;
    const transformOut = outTransformer ?? identity;

    const { subscribe } = derived(recipePreviewStore, $recipePreviewStore => transformIn($recipePreviewStore));
    const set = (value: any) => recipePreviewStore.set(transformOut(value));

    return { subscribe, set };
};

export const clearRecipePreview = () => {
    recipePreviewStore.set(getEmptyRecipePreview());
}