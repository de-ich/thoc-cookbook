import type { FieldValue } from "firebase/firestore";
import type { Ingredient } from "parse-ingredient";

export interface RecipePreview {
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

export const getEmptyRecipePreview = (): RecipePreview => {
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

export interface Recipe extends RecipePreview {
    id: string;
    addedBy: string;
    addedTimestamp: FieldValue;

}
