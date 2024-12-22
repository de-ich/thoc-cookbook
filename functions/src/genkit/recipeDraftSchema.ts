import { z } from 'zod';
import { RecipeYieldType } from '../database/Recipe';

// Define the zod schema for RecipeYieldType
const RecipeYieldTypeSchema = z.nativeEnum(RecipeYieldType);

// Define the zod schema for Ingredient (assuming a basic structure, adjust as needed)
const IngredientSchema = z.object({
	// Add the fields of the Ingredient type here
	name: z.string(),
	quantity: z.string().optional(),
	unit: z.string().optional()
});

// Define the zod schema for RecipeDraft
export const RecipeDraftSchema = z.object({
	images: z.array(z.string()),
	ingredients: z.array(IngredientSchema),
	name: z.string(),
	instructions: z.array(z.string()),
	sourceUrl: z.string().nullable(),
	sourceId: z.union([z.string(), z.number()]).nullable(),
	prepTime: z.number().nullable(),
	cookTime: z.number().nullable(),
	restingTime: z.number().nullable(),
	totalTime: z.number().nullable(),
	recipeYield: z.number().nullable(),
	recipeYieldType: RecipeYieldTypeSchema,
	keywords: z.array(z.string()),
	comment: z.string().nullable()
});
