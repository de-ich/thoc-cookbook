<script lang="ts">
	import { recipeDraftStore, clearRecipeDraft } from '../../stores/recipedraftstore';
	import { onDestroy } from 'svelte';
	import type { RecipeDraft } from '$lib/database/Recipe';
	import Button from '@smui/button';
	import { addRecipe } from '$lib/firebase/recipe';
	import { goto } from '$app/navigation';
	import RecipeEdit from '../../components/RecipeEdit.svelte';
	import { createError } from '../../stores/errormessagestore';

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

<RecipeEdit bind:recipeDraft={recipeDraft} />

<div class="submitButtonContainer">
	<Button class="submitButton" on:click={addRecipeToDatabase} variant="unelevated">Speichern</Button
	>
</div>

<style lang="scss">
	.submitButtonContainer {
		margin-top: 1rem;
	}
</style>
