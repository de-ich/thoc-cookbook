<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	export let showConfirmDeleteDialog = false;
	export let recipeName: string;

	const dispatch = createEventDispatcher();
</script>

<AlertDialog.Root bind:open={showConfirmDeleteDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Rezept löschen</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Description>
			Rezept <span class="font-bold">{recipeName}</span> wirklich löschen?
		</AlertDialog.Description>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Abbrechen</AlertDialog.Cancel>
			<AlertDialog.Action
				on:keydown={() => dispatch('delete-recipe')}
				on:click={() => dispatch('delete-recipe')}>Löschen</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
