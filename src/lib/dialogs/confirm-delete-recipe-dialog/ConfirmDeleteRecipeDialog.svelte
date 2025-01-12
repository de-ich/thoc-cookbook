<script lang="ts">
	import { goto } from '$app/navigation';
	import * as AlertDialog from '$lib/shadcn/alert-dialog';
	import { Button } from '$lib/shadcn/button';
	import LongRunningActionButtonText from '$lib/components/long-running-action-button-text';
	import type { RecipeDetails } from '$lib/database/Recipe';
	import { deleteRecipe } from '$lib/firebase/recipe';
	import { createError } from '$lib/stores/errormessagestore';

	export let open = false;
	export let recipe: RecipeDetails;

	let deletingRecipe: boolean = false;

	const deleteRecipeFromDatabase = () => {
		deletingRecipe = true;

		deleteRecipe(recipe.id)
			.then(() => goto('/recipes/'))
			.catch(createError)
			.finally(() => {
				deletingRecipe = false;
				open = false;
			});
	};
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Rezept löschen</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Description>
			Rezept <span class="font-bold">{recipe.name}</span> wirklich löschen?
		</AlertDialog.Description>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Abbrechen</AlertDialog.Cancel>
			<Button on:keydown={deleteRecipeFromDatabase} on:click={deleteRecipeFromDatabase}>
				<LongRunningActionButtonText text="Löschen" actionIsRunning={deletingRecipe} /></Button
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
