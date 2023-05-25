<script lang="ts">
	import type { Recipe } from '$lib/database/Recipe';
	/** @type {import('./$types').PageData} */
	export let data: any;

	let recipe: Recipe = data.recipe;
</script>

<h3>{recipe.name}</h3>

<img src={recipe.image} alt="recipeImage" />

<br />
<h5>Zutaten:</h5>
<ul>
	{#each recipe.ingredients as ingredient}
		<li>{ingredient.count || ''}{ingredient.unit || ''}{ingredient.count || ingredient.unit ? ' ' : ''}{ingredient.name}</li>
	{/each}
</ul>

<br />
<h5>Zubereitung:</h5>
{recipe.instructions}

<style lang="scss">
	img {
		max-height: 10rem;
	}
</style>