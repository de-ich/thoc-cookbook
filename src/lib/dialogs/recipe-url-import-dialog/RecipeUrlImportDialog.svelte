<script lang="ts">
	import { goto } from '$app/navigation';
	import { recipeDraftStore } from '$lib/stores/recipedraftstore';
	import { createError } from '$lib/stores/errormessagestore';
	import * as AlertDialog from '$lib/shadcn/alert-dialog';
	import { Button } from '$lib/shadcn/button';
	import type { RecipeDraft } from '$lib/database/Recipe';
	import LongRunningActionButtonText from '$lib/components/long-running-action-button-text';
	import type { Snippet } from 'svelte';

	export type Props = {
		open: boolean;
		recipeUrl: string | undefined;
		fetchRecipeCallable: (url: string) => Promise<RecipeDraft>;
		title: string;
		children: Snippet;
	};

	let {
		open = $bindable(true),
		recipeUrl = $bindable(undefined),
		fetchRecipeCallable,
		title = 'Rezept per URL importieren',
		children
	}: Props = $props();

	let fetchingRecipe: boolean = $state(false);

	const importRecipe = (recipeUrlToImport: string | undefined) => {
		// keep track of the currently active import to supported cancelable imports
		const currentImportUrl = recipeUrlToImport;

		if (!recipeUrlToImport) {
			return;
		}

		fetchingRecipe = true;

		fetchRecipeCallable(recipeUrlToImport)
			.then((recipeDraft) => {
				if (!fetchingRecipe || recipeUrlToImport !== currentImportUrl) {
					return;
				}
				recipeDraftStore.set(recipeDraft);
				goto('/addrecipe');
			})
			.catch(createError)
			.finally(() => {
				if (recipeUrlToImport === currentImportUrl) {
					// reset state in case this import was the "currently active" import
					recipeUrl = undefined;
					fetchingRecipe = false;
					open = false;
				}
			});
	};
</script>

<AlertDialog.Root
	bind:open
	onOpenChange={() => {
		recipeUrl = undefined;
		// reset fetching recipe to allow canceling potentially active imports
		fetchingRecipe = false;
	}}
>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{title}</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Description>
			{@render children()}
		</AlertDialog.Description>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Abbrechen</AlertDialog.Cancel>
			<Button
				onkeydown={() => importRecipe(recipeUrl)}
				onclick={() => importRecipe(recipeUrl)}
				disabled={recipeUrl == null || fetchingRecipe}
			>
				<LongRunningActionButtonText text="Vorschau" actionIsRunning={fetchingRecipe} /></Button
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
