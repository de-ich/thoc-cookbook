<script lang="ts">
	import { PUBLIC_IMAGEKIT_STORAGE_URL } from '$env/static/public';
	import type { RecipePreviewWithId } from '$lib/database/Recipe';

	export let recipe: RecipePreviewWithId;
</script>

<div class="recipeCardContainer">
	<a href={'/recipes/' + recipe.id}>
		<div class="recipeCard">
			<div class="recipeImageContainer">
				{#if recipe.previewImage}
					<img
						src={PUBLIC_IMAGEKIT_STORAGE_URL + 'tr:h-80/' + recipe.previewImage}
						alt="recipePreviewImage"
						loading="lazy"
						draggable="false"
					/>
				{/if}
			</div>
			<div><span class="recipeTitle">{recipe.name}</span></div>
		</div>
	</a>
</div>

<style lang="scss">
	.recipeCardContainer {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.recipeCard {
		background-color: var(--mdc-theme-background);
		border-radius: 0.5rem;
		display: flex;
		flex-direction: row;
		gap: 1rem;
		align-items: center;
		overflow: hidden;

		&:hover {
			color: var(--mdc-theme-primary);
			background-color: var(--mdc-theme-secondary);

			img {
				transform: scale(1.1);
			}
		}

		.recipeImageContainer {
			height: 5rem;
			width: 8.89rem;
			border-radius: 0.5rem;
			background-color: var(--mdc-theme-primary);
			flex-shrink: 0;

			img {
				height: 5rem;
				width: 8.89rem;
				object-fit: cover;
				border-radius: 0.5rem;
				transition-property: transform;
				transition-duration: 0.7s;
			}
		}

		span.recipeTitle {
			font-weight: 500;
		}
	}
</style>
