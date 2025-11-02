import 'dotenv/config';
import { readFile } from 'node:fs/promises';

console.log('Starting AI Retriever Test');

if (!process.env.GOOGLE_GENAI_API_KEY) {
	console.error('GOOGLE_GENAI_API_KEY environment variable is not set.');
	process.exit(1);
}

const recipeImagePath = process.argv[2];

if (!recipeImagePath) {
	console.error('Please provide a local recipe image path as a command line argument.');
	process.exit(1);
}

console.log(`Extracting recipe from file: ${recipeImagePath}`);

const imageFormat = recipeImagePath.endsWith('.png')
	? 'png'
	: recipeImagePath.endsWith('jpg') || recipeImagePath.endsWith('jpeg')
		? 'jpeg'
		: null;
		
if (!imageFormat) {
	console.error('Only .png, .jpg and .jpeg image formats are supported.');
	process.exit(1);
};

import { extractRecipeFromImage } from '../src/genkit/aiRetriever';

readFile(recipeImagePath)
	.then((imageData) => imageData.toString('base64'))
	.then((base64EncodedImageData) =>
		extractRecipeFromImage(`data:image/jpeg;base64,${base64EncodedImageData}`)
	)
	.then((recipe) => {
		console.log('Extracted Recipe:');
		console.log(JSON.stringify(recipe, null, 2));
	})
	.catch((error) => {
		console.error('Error extracting recipe:', error);
	});
