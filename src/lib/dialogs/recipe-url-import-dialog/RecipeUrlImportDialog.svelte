<script lang="ts">
	import { goto } from '$app/navigation';
	import { recipeDraftStore } from '$lib/stores/recipedraftstore';
	import { createError } from '$lib/stores/errormessagestore';
	import * as AlertDialog from '$lib/shadcn/alert-dialog';
	import { Input } from '$lib/shadcn/input';
	import { Button } from '$lib/shadcn/button';
	import type { RecipeDraft } from '$lib/database/Recipe';
	import LongRunningActionButtonText from '$lib/components/long-running-action-button-text';

	export type Props = {
		open: boolean;
		fetchRecipeCallable: (url: string) => Promise<RecipeDraft>;
		title: string;
	};

	let {
		open = $bindable(true),
		fetchRecipeCallable,
		title = 'Rezept per URL importieren'
	}: Props = $props();

	let recipeUrl: string | null = $state(null);

	let fetchingRecipe: boolean = $state(false);

	const importRecipe = (recipeUrlToImport: string | null) => {
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
					recipeUrl = null;
					fetchingRecipe = false;
					open = false;
				}
			});
	};
</script>

<AlertDialog.Root
	bind:open
	onOpenChange={() => {
		// reset fetching recipe to allow canceling potentially active imports
		fetchingRecipe = false;
	}}
>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{title}</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Description>
			<Input
				inputId="recipeUrl"
				type="url"
				min="0"
				bind:value={recipeUrl}
				label="Rezept-URL"
				placeholder="Rezept-URL"
				required
			/>
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
