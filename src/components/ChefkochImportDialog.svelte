<script lang="ts">
	import { fetchRecipe } from '$lib/importer/chefkoch';
	import Button, { Label } from '@smui/button';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Textfield from '@smui/textfield';
	import { goto } from '$app/navigation';
	import { recipePreviewStore } from '../stores/recipepreviewstore';
	import { createError } from '../stores/errormessagestore';

	export let open: boolean = true;
	let recipeUrl: string | null = null;

	function importRecipe() {
		if (!recipeUrl) {
			return;
		}
		fetchRecipe(recipeUrl)
			.then((recipePreview) => {
				recipePreviewStore.set(recipePreview);
				goto('/addrecipe');
			})
			.catch(createError);
	}
</script>

<Dialog bind:open aria-labelledby="simple-title" aria-describedby="simple-content">
	<Title id="simple-title">Rezept von Chefkoch.de importieren</Title>
	<Content id="simple-content">
		<Textfield type="url" bind:value={recipeUrl} label="Rezept-URL" style="min-width: 25em;" />
	</Content>
	<Actions>
		<Button>
			<Label>Abbrechen</Label>
		</Button>
		<Button on:click={() => importRecipe()} disabled={recipeUrl == null}>
			<Label>Vorschau</Label>
		</Button>
	</Actions>
</Dialog>
