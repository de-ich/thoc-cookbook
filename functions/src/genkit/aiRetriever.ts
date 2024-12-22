// import the Genkit and Google AI plugin libraries
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';
import * as cheerio from 'cheerio';
import retrieveWebpageContent from './retrieveWebpageContent';
import { RecipeDraftSchema } from './recipeDraftSchema';

// configure a Genkit instance
const ai = genkit({
	plugins: [googleAI()],
	model: gemini15Flash // set default model
});

const webLoaderOutputSchema: any = z.lazy(() =>
	z.union([z.string(), z.array(z.union([z.string(), z.record(z.string(), webLoaderOutputSchema)]))])
);

const webLoader = ai.defineTool(
	{
		name: 'webLoader',
		description:
			'When a URL is received, it accesses the URL, retrieves the main content, filters out unnecessary elements and returns the body as JSON object.',
		inputSchema: z.object({ url: z.string() }),
		outputSchema: webLoaderOutputSchema
	},
	async ({ url }) => {
		const content = await retrieveWebpageContent(url);
		if (content === null) {
			throw new Error('Failed to retrieve content');
		}
		
		const parsedContent = webLoaderOutputSchema.parse(content);
		return parsedContent;
	}
);

const mainFlow = ai.defineFlow(
	{
		name: 'mainFlow',
		inputSchema: z.string(),
		//outputSchema: RecipeDraftSchema
	},
	async (input) => {
		const { text } = await ai.generate({
			prompt: 
				`Fetch the main content of the URL ${input} as JSON.
				The main content should contain a recipe consisting of at least a recipe title, required ingredients and instructions.
				Retrieve the recipe title, the list of required ingredients as well as the instructions from the JSON object. Format the output as JSON.`,
			tools: [webLoader],
			/*config: {
				temperature: 1.2,
				topP: 0.9
			},*/
			//output: {schema: RecipeDraftSchema}
		});
		return text;
	}
);

ai.startFlowServer({ flows: [mainFlow] });

// (async () => {
// 	// make a generation request
// 	const { text } = await ai.generate('Hello, Gemini!');
// 	console.log(text);
// })();
