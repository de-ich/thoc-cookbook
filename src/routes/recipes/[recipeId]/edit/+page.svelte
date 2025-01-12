<script lang="ts">
	import type { RecipeDetails } from '$lib/database/Recipe';
	import { Button } from '$lib/shadcn/button';
	import { updateRecipe } from '$lib/firebase/recipe';
	import { goto, invalidateAll } from '$app/navigation';
	import RecipeEdit from '$lib/components/recipe-edit';
	import { createError } from '$lib/stores/errormessagestore';
	import LongRunningActionButtonText from '$lib/components/long-running-action-button-text';
	import { clsx } from 'clsx';

	/** @type {import('./$types').PageData} */
	export let data: any;

	let recipe: RecipeDetails = data.recipe;

	let editInProgress = false;

	const updateRecipeInDatabase = async () => {
		editInProgress = true;

		const newRecipeId = await updateRecipe(recipe).catch(createError);

		invalidateAll()
			.then(() => goto('/recipes/' + newRecipeId))
			.finally(() => {
				editInProgress = false;
			});
	};
</script>

<RecipeEdit bind:recipeDraft={recipe} />

<div class="mt-4">
	<Button class="submitButton" disabled={editInProgress} on:click={updateRecipeInDatabase}>
		<LongRunningActionButtonText text="Speichern" actionIsRunning={editInProgress} />
	</Button>
</div>
