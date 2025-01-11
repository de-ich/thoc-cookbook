<script lang="ts">
	import { goto } from '$app/navigation';
	import { recipeDraftStore } from '$lib/stores/recipedraftstore';
	import { createError } from '$lib/stores/errormessagestore';
	import * as AlertDialog from '$lib/shadcn/alert-dialog';
	import { Input } from '$lib/shadcn/input';
	import { Button } from '$lib/shadcn/button';
	import { LoaderCircle } from 'lucide-svelte';
	import { clsx } from 'clsx';
	import type { RecipeDraft } from '$lib/database/Recipe';

	export let open: boolean = true;
	export let fetchRecipeCallable: (url: string) => Promise<RecipeDraft>;
	export let title: string = 'Rezept per URL importieren';

	let recipeUrl: string | null = null;

	let fetchingRecipe: boolean = false;

	function importRecipe(recipeUrlToImport: string | null) {
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
	}
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
				on:keydown={() => importRecipe(recipeUrl)}
				on:click={() => importRecipe(recipeUrl)}
				disabled={recipeUrl == null || fetchingRecipe}
			>
				<span class={clsx(fetchingRecipe && 'invisible')}>Vorschau</span><LoaderCircle
					class={clsx('absolute h-4 w-4 animate-spin', !fetchingRecipe && 'invisible')}
				/></Button
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
