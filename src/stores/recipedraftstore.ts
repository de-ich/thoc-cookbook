import { derived, writable } from 'svelte/store';
import { getEmptyRecipeDraft, type RecipeDraft } from '$lib/database/Recipe';




export const recipeDraftStore = writable<RecipeDraft>(getEmptyRecipeDraft());

export const transformedRecipeDraftStore = (inTransformer?: any, outTransformer?: any) => {
    const identity = (x: any) => x;
    const transformIn = inTransformer ?? identity;
    const transformOut = outTransformer ?? identity;

    const { subscribe } = derived(recipeDraftStore, $recipeDraftStore => transformIn($recipeDraftStore));
    const set = (value: any) => recipeDraftStore.set(transformOut(value));

    return { subscribe, set };
};

export const clearRecipeDraft = () => {
    recipeDraftStore.set(getEmptyRecipeDraft());
}