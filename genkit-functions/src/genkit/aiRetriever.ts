// import the Genkit and Google AI plugin libraries
import { googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';
import retrieveWebpageContent from './retrieveWebpageContent';
import { RecipeYieldType } from '../database/Recipe';

// configure a Genkit instance
const ai = genkit({
	plugins: [googleAI()],
	model: googleAI.model('gemini-2.5-flash-lite') // set default model
});

// The genkit schema for a nested JSON object representing a DOM tree
const WebContentSchema: any = ai.defineSchema(
	'WebContentSchema',
	z.lazy(() =>
		z.union([z.string(), z.array(z.union([z.string(), z.record(z.string(), WebContentSchema)]))])
	)
);

// Define the zod schema for RecipeYieldType
const RecipeYieldTypeSchema = z.nativeEnum(RecipeYieldType);

// Define the zod schema for Ingredient
const IngredientSchema = z.object({
	quantity: z.number().nullish(),
	quantity2: z.number().nullish(),
	unitOfMeasure: z.string().nullish(),
	description: z.string()
});

// The genkit schema for a recipe draft
export const RecipeDraftSchema = ai.defineSchema(
	'RecipeDraftSchema',
	z.object({
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
	})
);

export const extractRecipe = ai.defineFlow(
	{
		name: 'extractRecipe',
		inputSchema: z.string(),
		outputSchema: RecipeDraftSchema
	},
	async (url: string) => {
		const content = await retrieveWebpageContent(url);
		const parsedContent = WebContentSchema.parse(content);
		const { output } = await ai.generate({
			prompt: `Take the following content: ${JSON.stringify(parsedContent)}. It should contain a recipe consisting of at least a recipe title/name, required ingredients and instructions.
					Besides the recipe name, the list of ingredients and instructions, extract the following information, if available: 
					Preparation time, cooking/baking time, resting time, total time, a URL pointing to an image for the recipe as well as information about the recipe yield/servings. 
					The recipe yield might be either given in servings or in the size of a baking dish, e.g. a baking dish with a diameter of 20cm.
					If no indication af a baking dish is given, assume 'servings' as yield type.
					If no indication of the recipe yield is given, set the field to 1.
					Represent all extracted times as single number representing the time in minutes rounded to zero decimals. If a range of times is given, use the mean value. Leave out any information that is not available in the given data.
					For the ingredients, use the following structure: An ingredient is usually represented by a quantity, an optional unit (of measure) and a description. 
					Sometimes, a second quantity is given to represent a range. If no range is given, the second quantity should not be set.`,
			output: { schema: RecipeDraftSchema }
		});

		if (output == null) {
			throw new Error("Response doesn't satisfy schema.");
		}

		return output;
	}
);
