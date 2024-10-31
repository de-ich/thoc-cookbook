<script lang="ts">
	import Dialog, { Actions, Content, Title } from '@smui/dialog';
	import { Button } from "$lib/components/ui/button";	
	import { createEventDispatcher } from 'svelte';

	export let showConfirmDeleteDialog = false;
	export let recipeName: string;

	const dispatch = createEventDispatcher();
</script>

<Dialog
	bind:open={showConfirmDeleteDialog}
	aria-labelledby="simple-title"
	aria-describedby="simple-content"
>
	<Title id="simple-title">Rezept löschen</Title>
	<Content id="simple-content">
		Rezept {recipeName} wirklich löschen?
	</Content>
	<Actions>
		<Button on:click={() => showConfirmDeleteDialog = false}>Abbrechen</Button>
		<Button on:click={() => dispatch('delete-recipe')}>Löschen</Button>
	</Actions>
</Dialog>
