// import the Genkit and Google AI plugin libraries
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';
import retrieveWebpageContent from '../retrieveWebpageContent';
import { RecipeDraftSchema } from './recipeDraftSchema';

// configure a Genkit instance
const ai = genkit({
	plugins: [googleAI()],
	model: gemini15Flash // set default model
});

// a schema for a nested JSON object representing a DOM tree
const WebContentSchema: any = ai.defineSchema('WebContentSchema',
	z.lazy(() => z.union([z.string(), z.array(z.union([z.string(), z.record(z.string(), WebContentSchema)]))])
));

const RecipeDraftPromptSchema = ai.defineSchema(
	'RecipeDraftSchema',
	RecipeDraftSchema
);

const mainFlow = ai.defineFlow(
	{
		name: 'mainFlow',
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
			output: { schema: RecipeDraftPromptSchema }
		});

		if (output == null) {
			throw new Error("Response doesn't satisfy schema.");
		}

		return output;
	}
);

ai.startFlowServer({ flows: [mainFlow] });
