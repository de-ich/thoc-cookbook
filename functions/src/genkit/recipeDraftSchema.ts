import { z } from 'zod';
import { RecipeYieldType } from '../database/Recipe';

// Define the zod schema for RecipeYieldType
const RecipeYieldTypeSchema = z.nativeEnum(RecipeYieldType);

// Define the zod schema for Ingredient
const IngredientSchema = z.object({
	quantity: z.number().nullish(),
	quantity2: z.number().nullish(),
	unitOfMeasure: z.string().nullish(),
	description: z.string()
});

// Define the zod schema for RecipeDraft
export const RecipeDraftSchema = z.object({
	recipeImage: z.string().nullish(),
	ingredients: z.array(IngredientSchema),
	name: z.string(),
	instructions: z.array(z.string()),
	preparationTime: z.number().nullish(),
	cookingTime: z.number().nullish(),
	restingTime: z.number().nullish(),
	totalTime: z.number().nullish(),
	recipeYield: z.string(),
	recipeYieldType: RecipeYieldTypeSchema
});
