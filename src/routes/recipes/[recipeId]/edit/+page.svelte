<script lang="ts">
	import type { Recipe } from '$lib/database/Recipe';
	import Button from '@smui/button';
	import { updateRecipe } from '$lib/firebase/recipe';
	import { goto } from '$app/navigation';
	import RecipeEdit from '../../../../components/RecipeEdit.svelte';

	/** @type {import('./$types').PageData} */
	export let data: any;

	let recipe: Recipe = data.recipe;

	const updateRecipeInDatabase = () => {
		updateRecipe(recipe)
			.then((newRecipeId) => goto('/recipes/' + newRecipeId))
			.catch((error: any) => console.log(error));
	};
</script>

<RecipeEdit bind:recipePreview={recipe} />

<Button class="submitButton" on:click={updateRecipeInDatabase} variant="unelevated"
	>Speichern</Button
>
