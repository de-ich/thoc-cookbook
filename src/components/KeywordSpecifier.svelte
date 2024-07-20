<script lang="ts">
	import Autocomplete from '@smui-extra/autocomplete';
	import { Text } from '@smui/list';
	import { tick } from 'svelte';

	export let availableKeywords: string[];
	export let selectedKeywords: string[] = [];

	$: remainingKeywords = availableKeywords.filter((keyword) => !selectedKeywords.includes(keyword));

	let selector: Autocomplete;
	let value = '';
	let text = '';

	const handleSelection = async (event: CustomEvent<string>) => {
		// Don't actually select the item.
		event.preventDefault();

		await addKeyword(event.detail);
	};

	const addKeyword = async (keyword: string) => {
		if ((keyword || '').length > 0 && !selectedKeywords.includes(keyword)) {
			selectedKeywords.push(keyword);
			// Make sure everything relying on the keywords gets updated
			selectedKeywords = selectedKeywords;
		}

		value = '';
		text = '';

		// make sure the selection menu stays open after adding the element
		await tick();
		selector.focus();
	};
</script>

<div class="autocompleteContainer">
	<Autocomplete
		bind:this={selector}
		options={remainingKeywords}
		bind:value
		bind:text
		label="Label/Kategorie hinzufügen"
		on:SMUIAutocomplete:selected={handleSelection}
		textfield$variant="outlined"
		style="width: 100%;"
		noMatchesActionDisabled={false}
		on:SMUIAutocomplete:noMatchesAction={() => {
			addKeyword(text);
		}}
	>
		<div slot="no-matches">
			<Text>Neues Label anlegen...</Text>
		</div>
	</Autocomplete>
</div>

<style lang="scss">
	.autocompleteContainer {
		flex-basis: 20%;
		flex-shrink: 0;

		@media (max-width: 1024px) {
			flex-basis: 100%;
		}

		:global(label) {
			width: 100%;
		}
	}
</style>
