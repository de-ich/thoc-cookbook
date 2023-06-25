import type { FieldValue } from "firebase/firestore";
import type { Ingredient } from "parse-ingredient";

export interface RecipeMetaData {
    id: string;
    addedBy: string;
    addedTimestamp: FieldValue;
}

export interface RecipePreview extends RecipeMetaData {
    name: string;
    previewImage: string | null;
    keywords: string[];
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

export interface RecipeDetails extends RecipeDraft, RecipeMetaData {
}
