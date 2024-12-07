import type { RecipePreviewWithId } from '$lib/database/Recipe';
import Root from './RecipeCard.svelte';
import type { HTMLBaseAttributes } from 'svelte/elements';

type RecipeCardProps = HTMLBaseAttributes & {
	recipe: RecipePreviewWithId;
};

export { Root, Root as RecipeCard, type RecipeCardProps, type RecipeCardProps as Props };

export default Root;
