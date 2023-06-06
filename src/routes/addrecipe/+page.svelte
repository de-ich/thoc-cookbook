<script lang="ts">
	import { recipePreviewStore, clearRecipePreview } from '../../stores/recipepreviewstore';
	import { onDestroy } from 'svelte';
	import type { RecipePreview } from '$lib/database/Recipe';
	import Button from '@smui/button';
	import { addRecipe } from '$lib/firebase/addrecipe';
	import { goto } from '$app/navigation';
	import RecipeEdit from '../../components/RecipeEdit.svelte';

	let recipePreview: RecipePreview;
	const unsubcribe = recipePreviewStore.subscribe((value) => {
		recipePreview = value;
		console.log(value);
	});

	onDestroy(() => {
		unsubcribe();
		clearRecipePreview();
	});

	const addRecipeToDatabase = () => {
		addRecipe(recipePreview)
			.then((newRecipeId) => goto('/recipes/' + newRecipeId))
			.catch((error: any) => console.log(error));
	};
</script>

<RecipeEdit bind:recipePreview />

<Button class="submitButton" on:click={addRecipeToDatabase} variant="unelevated">Speichern</Button>
