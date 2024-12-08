<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/shadcn/button';
	import type { RecipeDraft } from '$lib/database/Recipe';
	import { addRecipe } from '$lib/firebase/recipe';
	import { fetchRecipesFromAllUserCollections } from '$lib/importer/chefkoch';
	import { createError } from '$lib/stores/errormessagestore';
	import * as AlertDialog from '$lib/shadcn/alert-dialog';
	import { Input } from '$lib/shadcn/input';
	import { Textarea } from '$lib/shadcn/textarea';

	let chefkochCookie: string = '';
	let recipes: RecipeDraft[] = [];

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
			.catch(createError);
	};
</script>

<Input
	inputId="chefkochCookie"
	type="text"
	min="0"
	bind:value={chefkochCookie}
	label="Chefkoch Cookie"
	placeholder="Chefkoch Cookie"
	required
/>

<Button class="submitButton" on:click={fetchRecipes}>Importieren</Button>

<Textarea class="min-h-80" inputId="log" bind:value={log} />

<AlertDialog.Root bind:open={showDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{recipes.length} Rezepte von Chefkoch.de importieren?</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Description>
			{recipes.length} Rezepte gefunden! Importieren?
		</AlertDialog.Description>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Abbrechen</AlertDialog.Cancel>
			<AlertDialog.Action on:keydown={importRecipes} on:click={importRecipes}
				>Importieren</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={showResultDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{recipes.length} Rezepte von Chefkoch.de importieren?</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Description>
			{addedRecipes} Rezepte importiert!
		</AlertDialog.Description>
		<AlertDialog.Footer>
			<AlertDialog.Action on:keydown={() => goto('/recipes')} on:click={() => goto('/recipes')}
				>OK</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
