import { derived, writable, type Writable } from 'svelte/store';
import type { RecipePreview } from '$lib/database/Recipe';


const getEmptyRecipePreview = () => {
    return {
        images: [],
        ingredients: [],
        name: '',
        instructions: [],
        sourceUrl: undefined,
        prepTime: undefined,
        cookTime: undefined,
        restingTime: undefined,
        totalTime: undefined,
        recipeYield: undefined,
        keywords: [],
        comment: undefined
    };
}

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