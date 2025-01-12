<script lang="ts">
	import { recipeDraftStore, clearRecipeDraft } from '$lib/stores/recipedraftstore';
	import { onDestroy } from 'svelte';
	import type { RecipeDraft } from '$lib/database/Recipe';
	import { Button } from '$lib/shadcn/button';
	import { addRecipe } from '$lib/firebase/recipe';
	import { goto } from '$app/navigation';
	import RecipeEdit from '$lib/components/recipe-edit';
	import { createError } from '$lib/stores/errormessagestore';
	import LongRunningActionButtonText from '$lib/components/long-running-action-button-text';

	let recipeDraft: RecipeDraft;
	const unsubcribe = recipeDraftStore.subscribe((value) => {
		recipeDraft = value;
	});

	onDestroy(() => {
		unsubcribe();
		clearRecipeDraft();
	});

	let addingInProgress = false;

	const addRecipeToDatabase = () => {
		addingInProgress = true;
		addRecipe(recipeDraft)
			.then((newRecipeId) => goto('/recipes/' + newRecipeId))
			.catch(createError)
			.finally(() => {
				addingInProgress = false;
			});
	};
</script>

<RecipeEdit bind:recipeDraft />

<div class="mt-4">
	<Button class="submitButton" disabled={addingInProgress} on:click={addRecipeToDatabase}>
		<LongRunningActionButtonText text="Speichern" actionIsRunning={addingInProgress} /></Button
	>
</div>
