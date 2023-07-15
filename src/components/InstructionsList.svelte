<script lang="ts">
	import type { RecipeDetails } from '$lib/database/Recipe';

	export let recipe: RecipeDetails;
</script>

<div class="instructionsList">
	<h5>Zubereitung:</h5>
	{#each recipe.instructions as instruction}
		<div class="instructionContainer">
			{instruction}
		</div>
	{/each}
</div>

<style lang="scss">
	.instructionsList {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

    h5 {
        margin-bottom: 0.5rem;
    }

	.instructionContainer {
		margin-bottom: 0.5rem;
	}
</style>
