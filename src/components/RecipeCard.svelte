<script lang="ts">
	import type { RecipePreview } from '$lib/database/Recipe';

	export let recipe: RecipePreview;
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
		border: 0.05rem solid var(--mdc-theme-secondary);
		border-radius: 0.5rem;
		padding: 0.5rem;

		&:hover {
			color: var(--mdc-theme-primary);
		}
	}
</style>
