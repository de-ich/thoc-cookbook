<script lang="ts">
	import type { Recipe } from '$lib/database/Recipe';
	/** @type {import('./$types').PageData} */
	export let data: any;

	let recipe: Recipe = data.recipe;
</script>

<h3>{recipe.name}</h3>

{#if (recipe.images || []).length > 0}
	<div class="imagesContainer">
		<img src={recipe.images[0]} alt="recipeImage" />
	</div>
{/if}

<h5>Zutaten:</h5>
<ul>
	{#each recipe.ingredients as ingredient}
		<li>
			{ingredient.count || ''}{ingredient.unit || ''}{ingredient.count || ingredient.unit
				? ' '
				: ''}{ingredient.name}
		</li>
	{/each}
</ul>

<div class="instructionsContainer">
	<h5>Zubereitung:</h5>
	{#each recipe.instructions as instruction}
		<div class="instructionContainer">
			{instruction}
		</div>
	{/each}
</div>

<style lang="scss">
	img {
		max-height: 10rem;
		border-radius: 0.5rem;
	}

	h5 {
		margin-top: 2rem;
		margin-bottom: 0.5rem;
	}

	ul {
		list-style-position: inside;
	}

	.imagesContainer {
		margin-top: 1rem;
	}

	.instructionsContainer {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}
</style>