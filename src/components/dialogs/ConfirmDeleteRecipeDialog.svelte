<script lang="ts">
    import Dialog, { Actions, Content, Title } from '@smui/dialog';
    import Button, { Label } from '@smui/button';
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
		<Button>
			<Label>Abbrechen</Label>
		</Button>
		<Button on:click={() => dispatch('delete-recipe')}>
			<Label>Löschen</Label>
		</Button>
	</Actions>
</Dialog>