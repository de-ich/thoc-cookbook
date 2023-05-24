<script lang="ts">
	import type { Recipe } from '$lib/database/Recipe';

	export let recipe: Recipe;
</script>

<div class="recipeCardContainer">
	<a href={'/recipes/' + recipe.id}>
		<div class="recipeCard">
			{recipe.name}
		</div>
	</a>
</div>

<style lang="scss">
	.recipeCardContainer {
		width: 100%;
	}

	.recipeCard {
		background-color: var(--mdc-theme-background);
        border: .2rem solid var(--mdc-theme-primary);
        border-radius: .5rem;
        padding: .5rem;

		&:hover {
			border-color: var(--mdc-theme-secondary);
		}
	}
</style>
