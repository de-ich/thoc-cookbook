<script lang="ts">
	import type { RecipeDetails } from '$lib/database/Recipe';
	import { Button } from '$lib/shadcn/button';
	import { updateRecipe } from '$lib/firebase/recipe';
	import { goto, invalidateAll } from '$app/navigation';
	import RecipeEdit from '$lib/components/recipe-edit';
	import { createError } from '$lib/stores/errormessagestore';

	/** @type {import('./$types').PageData} */
	export let data: any;

	let recipe: RecipeDetails = data.recipe;

	const updateRecipeInDatabase = async () => {
		const newRecipeId = await updateRecipe(recipe).catch(createError);
		invalidateAll().then(() => goto('/recipes/' + newRecipeId));
	};
</script>

<RecipeEdit bind:recipeDraft={recipe} />

<div class="mt-4">
	<Button class="submitButton" on:click={updateRecipeInDatabase}>Speichern</Button>
</div>
