import type { FieldValue } from "firebase/firestore";
import type { Ingredient } from "parse-ingredient";

export interface RecipePreviews extends Map<string, RecipePreview> { }

export interface RecipePreview {
    name: string;
    previewImage: string | null;
    keywords: string[];
}

export interface RecipePreviewWithId extends RecipePreview {
    id: string
}

export interface RecipeDraft {
    images: (string | File)[];
    ingredients: Ingredient[];
    name: string;
    instructions: string[];
    sourceUrl: string | null;
    sourceId: string | number | null;
    prepTime: number | null;
    cookTime: number | null;
    restingTime: number | null;
    totalTime: number | null;
    recipeYield: number | null;
    recipeYieldType: RecipeYieldType;
    keywords: string[];
    comment: string | null;
}

export enum RecipeYieldType {
    Serving = "Portionen",
    BakingDish = "Backform"
}

export const getEmptyRecipeDraft = (): RecipeDraft => {
    return {
        images: [],
        ingredients: [],
        name: '',
        instructions: [],
        sourceUrl: null,
        sourceId: null,
        prepTime: null,
        cookTime: null,
        restingTime: null,
        totalTime: null,
        recipeYield: null,
        recipeYieldType: RecipeYieldType.Serving,
        keywords: [],
        comment: null
    };
}

export interface RecipeDetails extends RecipeDraft {
    id: string;
    addedBy: string;
    addedTimestamp: FieldValue;
}

export type RecipeSortFunction = (recipe1: RecipePreviewWithId, recipe2: RecipePreviewWithId) => number;