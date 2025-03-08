<script lang="ts">
	import * as AlertDialog from '$lib/shadcn/alert-dialog';
	import { confirmError, errorMessageStore } from '$lib/stores/errormessagestore';

	let showErrorDialog = $derived($errorMessageStore != null && $errorMessageStore.length > 0);
</script>

<AlertDialog.Root open={showErrorDialog}>
	<AlertDialog.Content escapeKeydownBehavior="ignore">
		<AlertDialog.Header>
			<AlertDialog.Title>Error</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Description>
			{$errorMessageStore}
		</AlertDialog.Description>
		<AlertDialog.Footer>
			<AlertDialog.Action onkeydown={confirmError} onclick={confirmError}>OK</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
