<script lang="ts">
	import { recipeDraftStore, clearRecipeDraft } from '$lib/stores/recipedraftstore';
	import { onDestroy } from 'svelte';
	import { Button } from '$lib/shadcn/button';
	import { addRecipe } from '$lib/firebase/recipe';
	import { goto } from '$app/navigation';
	import RecipeEdit from '$lib/components/recipe-edit';
	import { createError } from '$lib/stores/errormessagestore';
	import LongRunningActionButtonText from '$lib/components/long-running-action-button-text';
	import type { RecipeDraft } from '$lib/database/Recipe';

	onDestroy(() => {
		clearRecipeDraft();
	});

	let addingInProgress = $state(false);

	const addRecipeToDatabase = () => {
		addingInProgress = true;
		addRecipe($recipeDraftStore)
			.then((newRecipeId) => goto('/recipes/' + newRecipeId))
			.catch(createError)
			.finally(() => {
				addingInProgress = false;
			});
	};

	const recipeDraftModifiedCallback = (recipeDraft: RecipeDraft) => {
		recipeDraftStore.set(recipeDraft);
	};
</script>

<RecipeEdit recipeDraft={$recipeDraftStore} recipeDraftModifiedCallback={recipeDraftModifiedCallback} />

<div class="mt-4">
	<Button class="submitButton" disabled={addingInProgress} onclick={addRecipeToDatabase}>
		<LongRunningActionButtonText text="Speichern" actionIsRunning={addingInProgress} /></Button
	>
</div>
