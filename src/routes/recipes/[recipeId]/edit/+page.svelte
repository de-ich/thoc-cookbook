<script lang="ts">
	import type { RecipeDetails, RecipeDraft } from '$lib/database/Recipe';
	import { Button } from '$lib/shadcn/button';
	import { updateRecipe } from '$lib/firebase/recipe';
	import { goto, invalidateAll } from '$app/navigation';
	import RecipeEdit from '$lib/components/recipe-edit';
	import { createError } from '$lib/stores/errormessagestore';
	import LongRunningActionButtonText from '$lib/components/long-running-action-button-text';
	
	interface Props {
		/** @type {import('./$types').PageData} */
		data: any;
	}

	let { data }: Props = $props();

	let recipe: RecipeDetails = $state(data.recipe);
	let modifiedRecipe = $state(recipe);

	let editInProgress = $state(false);

	const updateRecipeInDatabase = async () => {
		editInProgress = true;

		const newRecipeId = await updateRecipe(modifiedRecipe).catch(createError);

		invalidateAll()
			.then(() => goto('/recipes/' + newRecipeId))
			.finally(() => {
				editInProgress = false;
			});
	};

	const recipeDraftModifiedCallback = (recipeDraft: RecipeDraft) => {
		modifiedRecipe = {...recipe, ...recipeDraft };
	};
</script>

<RecipeEdit recipeDraft={recipe} recipeDraftModifiedCallback={recipeDraftModifiedCallback} />

<div class="mt-4">
	<Button class="submitButton" disabled={editInProgress} onclick={updateRecipeInDatabase}>
		<LongRunningActionButtonText text="Speichern" actionIsRunning={editInProgress} />
	</Button>
</div>
