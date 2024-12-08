<script lang="ts">
	import * as AlertDialog from '$lib/shadcn/alert-dialog';
	import { confirmError, errorMessageStore } from '$lib/stores/errormessagestore';
	import { onDestroy } from 'svelte';

	let errorMessage: string | null = null;
	const unsubscribeErrorMesssageStore = errorMessageStore.subscribe((newErrorMessage) => {
		errorMessage = newErrorMessage;
	});
	$: showErrorDialog = errorMessage != null && errorMessage.length > 0;

	onDestroy(() => {
		unsubscribeErrorMesssageStore();
	});
</script>

<AlertDialog.Root closeOnEscape={false} open={showErrorDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Error</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Description>
			{errorMessage}
		</AlertDialog.Description>
		<AlertDialog.Footer>
			<AlertDialog.Action on:keydown={confirmError} on:click={confirmError}>OK</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
