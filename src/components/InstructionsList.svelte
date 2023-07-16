<script lang="ts">
	import type { RecipeDetails } from '$lib/database/Recipe';
	import Checkbox from '@smui/checkbox';

	export let recipe: RecipeDetails;
	export let allowCheckItems = false;

	const handleSelection = (event: CustomEvent, i: number) => {
		const checked = (event.target as HTMLInputElement)?.checked;
		const instructionItem = document.querySelector('#instruction-' + i);

		if (!instructionItem) {
			return;
		}

		if (checked) {
			instructionItem.classList.add('disabled');
		} else {
			instructionItem.classList.remove('disabled');
		}
	};
</script>

<div class="instructionsList">
	<h5>Zubereitung:</h5>
	{#each recipe.instructions as instruction, i}
		<div class="instructionContainer">
			{#if allowCheckItems}
				<Checkbox on:click={(event) => handleSelection(event, i)} />
			{/if}
			<span id={'instruction-' + i}>
				{instruction}
			</span>
		</div>
	{/each}
</div>

<style lang="scss">
	.instructionsList {
		width: 100%;
		display: flex;
		flex-direction: column;

		:global(.disabled) {
			color: var(--mdc-theme-text-secondary-on-background);
		}
	}

	h5 {
		margin-bottom: 0.5rem;
	}

	.instructionContainer {
		margin-bottom: 0.5rem;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
