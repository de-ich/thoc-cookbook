<script lang="ts">
	import Autocomplete from '@smui-extra/autocomplete';
	

	export let availableKeywords: string[];
	export let selectedKeywords: string[] = [];

	$: remainingKeywords = availableKeywords.filter((keyword) => !selectedKeywords.includes(keyword));

	let selector: Autocomplete;
	let value = '';

	function handleSelection(event: CustomEvent<string>) {
		// Don't actually select the item.
		event.preventDefault();

		// You could also set value back to '' here.
		selectedKeywords.push(event.detail);
		// Make sure the chips get updated.
		selectedKeywords = selectedKeywords;

		selector.focus();
	}
</script>

<Autocomplete
    bind:this={selector}
    options={remainingKeywords}
    bind:value
    label="Nach Kategorien filtern"
    on:SMUIAutocomplete:selected={handleSelection}
    textfield$variant="outlined"
/>

