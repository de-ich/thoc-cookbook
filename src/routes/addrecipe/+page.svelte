<script lang="ts">
	import { recipeDraftStore, clearRecipeDraft } from '$lib/stores/recipedraftstore';
	import { onDestroy } from 'svelte';
	import type { RecipeDraft } from '$lib/database/Recipe';
	import { Button } from "$lib/shadcn/button";	
	import { addRecipe } from '$lib/firebase/recipe';
	import { goto } from '$app/navigation';
	import RecipeEdit from '$lib/components/recipe-edit';
	import { createError } from '$lib/stores/errormessagestore';

	let recipeDraft: RecipeDraft;
	const unsubcribe = recipeDraftStore.subscribe((value) => {
		recipeDraft = value;
	});

	onDestroy(() => {
		unsubcribe();
		clearRecipeDraft();
	});

	const addRecipeToDatabase = () => {
		addRecipe(recipeDraft)
			.then((newRecipeId) => goto('/recipes/' + newRecipeId))
			.catch(createError);
	};
</script>

<RecipeEdit bind:recipeDraft />

<div class="mt-4">
	<Button class="submitButton" on:click={addRecipeToDatabase}>Speichern</Button>
</div>
