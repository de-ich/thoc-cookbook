<script lang="ts">
	import { fetchRecipe } from '$lib/importer/chefkoch';
	import { goto } from '$app/navigation';
	import { recipeDraftStore } from '../../../../stores/recipedraftstore';
	import { createError } from '../../../../stores/errormessagestore';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Input } from '$lib/components/ui/input';

	export let open: boolean = true;
	let recipeUrl: string | null = null;

	function importRecipe() {
		if (!recipeUrl) {
			return;
		}
		fetchRecipe(recipeUrl)
			.then((recipeDraft) => {
				recipeDraftStore.set(recipeDraft);
				goto('/addrecipe');
			})
			.catch(createError);
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Rezept von Chefkoch.de importieren</AlertDialog.Title>
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
			<AlertDialog.Action
				on:keydown={() => importRecipe()}
				on:click={() => importRecipe()}
				disabled={recipeUrl == null}>Vorschau</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
