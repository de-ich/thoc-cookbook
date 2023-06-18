<script lang="ts">
	import Button, { Label } from '@smui/button';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import { confirmError, errorMessageStore } from '../stores/errormessagestore';
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

<Dialog
	bind:open={showErrorDialog}
	aria-labelledby="simple-title"
	aria-describedby="simple-content"
	on:SMUIDialog:closed={confirmError}
>
	<Title id="simple-title">Error</Title>
	<Content id="simple-content">
		{errorMessage}
	</Content>
	<Actions>
		<Button>
			<Label>OK</Label>
		</Button>
	</Actions>
</Dialog>
