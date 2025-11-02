import 'dotenv/config';

console.log('Starting AI Retriever Test');

if (!process.env.GOOGLE_GENAI_API_KEY) {
	console.error('GOOGLE_GENAI_API_KEY environment variable is not set.');
	process.exit(1);
}

const recipeUrl = process.argv[2];

if (!recipeUrl) {
	console.error('Please provide a recipe URL as a command line argument.');
	process.exit(1);
}

console.log(`Extracting recipe from URL: ${recipeUrl}`);

import { extractRecipe } from '../src/genkit/aiRetriever';
extractRecipe(recipeUrl)
	.then((recipe) => {
		console.log('Extracted Recipe:');
		console.log(JSON.stringify(recipe, null, 2));
	})
	.catch((error) => {
		console.error('Error extracting recipe:', error);
	});
