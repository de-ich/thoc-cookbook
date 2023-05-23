<script lang="ts">
	import type { Recipe } from '$lib/database/Recipe';
	/** @type {import('./$types').PageData} */
	export let data: any;

	let recipe: Recipe = data.recipe;
</script>

<h1>{recipe.name}</h1>
