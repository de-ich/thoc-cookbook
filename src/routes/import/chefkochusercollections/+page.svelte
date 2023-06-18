<script lang="ts">
	import { goto } from '$app/navigation';
	import type { RecipePreview } from '$lib/database/Recipe';
	import { addRecipe } from '$lib/firebase/recipe';
	import { fetchRecipesFromAllUserCollections } from '$lib/importer/chefkoch';
	import Button, { Label } from '@smui/button';
	import Dialog, { Actions, Content, Title } from '@smui/dialog';
	import Textfield from '@smui/textfield';

	let chefkochCookie: string = '';
	let recipes: RecipePreview[] = [];

	let showDialog = false;

	let fetchRecipes = () => {
		log += 'Fetching recipes...';
		fetchRecipesFromAllUserCollections(chefkochCookie)
			.then((fetchedRrecipes) => {
				log += '\nDone. Fetched ' + fetchedRrecipes.length + ' recipes.';
				recipes = [...fetchedRrecipes];
			})
			.then(() => (showDialog = true))
			.catch((error) => console.error('an error occurred: ', error));
	};

	let log: string = '';

	let addedRecipes = 0;
	let showResultDialog = addedRecipes != 0;

	let importRecipes = () => {
		log += '\nImporting Recipes';
		Promise.allSettled(
			recipes.map((recipe) =>
				addRecipe(recipe).then((recipeId) => {
					log += 'Imported recipe with id' + recipeId;
					return recipeId;
				})
			)
		)
			.then((recipeIds) => {
				addedRecipes = recipeIds.length;
				log += '\nDone! ' + addedRecipes + ' reipes imported';
			})
			.catch((error) => console.log(error));
	};
</script>

<Textfield
	id="recipeTitle"
	variant="outlined"
	type="text"
	bind:value={chefkochCookie}
	label="Chefkoch Cookie"
	style="min-width: 25rem;"
	required
/>

<Button class="submitButton" on:click={fetchRecipes} variant="unelevated">Importieren</Button>

<Textfield
	style="width: 100%;min-height: 20rem;"
	helperLine$style="width: 100%;"
	textarea
	required
	bind:value={log}
/>

<Dialog bind:open={showDialog} aria-labelledby="simple-title" aria-describedby="simple-content">
	<Title id="simple-title">{recipes.length} Rezepte von Chefkoch.de importieren?</Title>
	<Content id="simple-content">
		{recipes.length} Rezepte gefunden! Importieren?
	</Content>
	<Actions>
		<Button>
			<Label>Abbrechen</Label>
		</Button>
		<Button on:click={importRecipes}>
			<Label>Importieren</Label>
		</Button>
	</Actions>
</Dialog>

<Dialog
	bind:open={showResultDialog}
	aria-labelledby="simple-title"
	aria-describedby="simple-content"
>
	<Title id="simple-title">Erfolg</Title>
	<Content id="simple-content">
		{addedRecipes} Rezepte importiert!
	</Content>
	<Actions>
		<Button on:click={() => goto('/recipes')}>
			<Label>Ok</Label>
		</Button>
	</Actions>
</Dialog>
